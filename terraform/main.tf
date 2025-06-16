# App: Customer API
# Package: infra
# File: main.tf
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: $TS
# Description: Terraform configuration for Customer API resources.
#
terraform {
  required_version = ">= 1.8"
}

provider "aws" {
  region = var.region
}

resource "aws_dynamodb_table" "main" {
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

  attribute {
    name = "gsi1sk"
    type = "S"
  }

  global_secondary_index {
    name            = "gsi1"
    hash_key        = "gsi1pk"
    range_key       = "gsi1sk"
    projection_type = "ALL"
  }
}

resource "aws_iam_role" "lambda" {
  name               = "customer_api_lambda"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

data "aws_iam_policy_document" "lambda_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

locals {
  handlers = {
    create  = "createCustomer"
    get     = "getCustomer"
    update  = "updateCustomer"
    patch   = "patchCustomer"
    delete  = "deleteCustomer"
    search  = "searchCustomer"
    oper    = "getOperation"
  }
}

resource "aws_lambda_function" "handlers" {
  for_each = local.handlers
  function_name = each.value
  handler       = "${each.value}.handler"
  filename      = "${path.module}/../dist/${each.value}.js"
  source_code_hash = filebase64sha256("${path.module}/../dist/${each.value}.js")
  runtime       = "nodejs20.x"
  architectures = ["arm64"]
  role          = aws_iam_role.lambda.arn
  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.main.name
    }
  }
}

resource "aws_apigatewayv2_api" "api" {
  name          = "customer-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_lambda_permission" "api" {
  for_each = aws_lambda_function.handlers
  statement_id  = "AllowInvoke${each.value.function_name}"
  action        = "lambda:InvokeFunction"
  function_name = each.value.arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

resource "aws_apigatewayv2_integration" "handlers" {
  for_each = aws_lambda_function.handlers
  api_id           = aws_apigatewayv2_api.api.id
  integration_type = "AWS_PROXY"
  integration_uri  = each.value.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "create" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /profiles"
  target    = "integrations/${aws_apigatewayv2_integration.handlers["create"].id}"
}
resource "aws_apigatewayv2_route" "get" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /profiles/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.handlers["get"].id}"
}
resource "aws_apigatewayv2_route" "update" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "PUT /profiles/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.handlers["update"].id}"
}
resource "aws_apigatewayv2_route" "patch" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "PATCH /profiles/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.handlers["patch"].id}"
}
resource "aws_apigatewayv2_route" "delete" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "DELETE /profiles/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.handlers["delete"].id}"
}
resource "aws_apigatewayv2_route" "search" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /profiles"
  target    = "integrations/${aws_apigatewayv2_integration.handlers["search"].id}"
}
resource "aws_apigatewayv2_route" "op" {
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "GET /operations/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.handlers["oper"].id}"
}
