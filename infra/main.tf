terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

resource "aws_dynamodb_table" "customer" {
  name         = var.table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "pk"
  range_key    = "sk"

  attribute {
    name = "pk"
    type = "S"
  }

  attribute {
    name = "sk"
    type = "S"
  }

  attribute {
    name = "gsi1pk"
    type = "S"
  }

  global_secondary_index {
    name               = "gsi1"
    hash_key           = "gsi1pk"
    projection_type    = "ALL"
  }
}

resource "aws_iam_role" "lambda" {
  name = "customer-api-lambda"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "basic" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "handlers" {
  for_each = {
    create = "createProfile"
    update = "updateProfile"
    patch  = "patchProfile"
    delete = "removeProfile"
    get    = "getProfile"
    search = "searchByEmail"
    op     = "getOperationStatus"
  }

  function_name = each.value
  filename      = "../dist/${each.value}.js"
  source_code_hash = filebase64sha256("../dist/${each.value}.js")
  handler       = "${each.value}.handler"
  runtime       = "nodejs20.x"
  role          = aws_iam_role.lambda.arn
  architectures = ["arm64"]
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.customer.name
    }
  }
}

resource "aws_apigatewayv2_api" "api" {
  name          = "customer-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "stage" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "lambda" {
  for_each = aws_lambda_function.handlers
  api_id           = aws_apigatewayv2_api.api.id
  integration_type = "AWS_PROXY"
  integration_uri  = each.value.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "routes" {
  for_each = {
    post   = { method = "POST",   path = "/v1/customers",          lambda = "create" }
    put    = { method = "PUT",    path = "/v1/customers/{id}",    lambda = "update" }
    patch  = { method = "PATCH",  path = "/v1/customers/{id}",    lambda = "patch" }
    delete = { method = "DELETE", path = "/v1/customers/{id}",    lambda = "delete" }
    get    = { method = "GET",    path = "/v1/customers/{id}",    lambda = "get" }
    search = { method = "GET",    path = "/v1/customers",         lambda = "search" }
    op     = { method = "GET",    path = "/v1/operations/{id}",   lambda = "op" }
  }
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "${each.value.method} ${each.value.path}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda[each.value.lambda].id}"
}

output "endpoint" {
  value = aws_apigatewayv2_api.api.api_endpoint
}

variable "region" {
  type    = string
  default = "us-east-1"
}

variable "table_name" {
  type    = string
  default = "customer-table"
}
