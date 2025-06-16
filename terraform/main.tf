terraform {
  required_version = ">= 1.8"
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

variable "region" {
  type    = string
  default = "us-east-1"
}

resource "aws_dynamodb_table" "customers" {
  name           = "customers"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "pk"
  range_key      = "sk"

  attribute {
    name = "pk"
    type = "S"
  }
  attribute {
    name = "sk"
    type = "S"
  }
  attribute {
    name = "gsi1"
    type = "S"
  }

  global_secondary_index {
    name            = "gsi1"
    hash_key        = "gsi1"
    projection_type = "ALL"
  }
}

resource "aws_iam_role" "lambda_role" {
  name = "customer-api-lambda-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = { Service = "lambda.amazonaws.com" }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "basic_exec" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_lambda_function" "create_customer" {
  function_name = "create-customer"
  role          = aws_iam_role.lambda_role.arn
  handler       = "createCustomer.handler"
  runtime       = "nodejs20.x"
  architectures = ["arm64"]
  filename      = "../dist/createCustomer.js"
  source_code_hash = filebase64sha256("../dist/createCustomer.js")
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.customers.name
    }
  }
}

resource "aws_lambda_function" "get_customer" {
  function_name = "get-customer"
  role          = aws_iam_role.lambda_role.arn
  handler       = "getCustomer.handler"
  runtime       = "nodejs20.x"
  architectures = ["arm64"]
  filename      = "../dist/getCustomer.js"
  source_code_hash = filebase64sha256("../dist/getCustomer.js")
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.customers.name
    }
  }
}

resource "aws_apigatewayv2_api" "api" {
  name          = "customer-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "prod" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "create_integration" {
  api_id           = aws_apigatewayv2_api.api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.create_customer.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "create_route" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /customers"
  target    = "integrations/${aws_apigatewayv2_integration.create_integration.id}"
}

resource "aws_apigatewayv2_integration" "get_integration" {
  api_id           = aws_apigatewayv2_api.api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.get_customer.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "get_route" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /customers/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.get_integration.id}"
}

resource "aws_lambda_permission" "apigw_create" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.create_customer.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "apigw_get" {
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_customer.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

output "api_url" {
  value = aws_apigatewayv2_api.api.api_endpoint
}
