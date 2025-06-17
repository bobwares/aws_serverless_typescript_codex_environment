# App: CustomerProfileAPI
# Package: infra
# File: main.tf
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:29:04Z
# Description: Root Terraform module provisioning API, Lambda, and DynamoDB.

terraform {
  required_version = ">= 1.8"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

resource "aws_dynamodb_table" "customer" {
  name           = var.table_name
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
    name = "gsi1pk"
    type = "S"
  }
  global_secondary_index {
    name            = "gsi1"
    hash_key        = "gsi1pk"
    projection_type = "ALL"
  }
}

resource "aws_sqs_queue" "operations" {
  name = "customer-ops"
}

locals {
  lambda_env = {
    TABLE_NAME   = aws_dynamodb_table.customer.name
    OP_QUEUE_URL = aws_sqs_queue.operations.url
  }
}

module "lambdas" {
  source = "terraform-aws-modules/lambda/aws"
  version = "6.0.0"

  for_each = {
    createCustomer  = "createCustomer.zip"
    updateCustomer  = "updateCustomer.zip"
    patchCustomer   = "patchCustomer.zip"
    deleteCustomer  = "deleteCustomer.zip"
    getCustomer     = "getCustomer.zip"
    listByEmail     = "listByEmail.zip"
    operationStatus = "operationStatus.zip"
    worker          = "worker.zip"
  }

  function_name = each.key
  runtime       = "nodejs20.x"
  architectures = ["arm64"]
  handler       = "index.js"
  memory_size   = 128
  timeout       = 10
  publish       = false
  local_existing_package      = "${path.module}/../dist/${each.value}"
  environment_variables = local.lambda_env
}

resource "aws_lambda_event_source_mapping" "worker" {
  event_source_arn = aws_sqs_queue.operations.arn
  function_name    = module.lambdas["worker"].lambda_function_name
}

resource "aws_apigatewayv2_api" "api" {
  name          = "customer-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_authorizer" "jwt" {
  api_id          = aws_apigatewayv2_api.api.id
  name            = "jwt"
  authorizer_type = "JWT"
  identity_sources = ["$request.header.Authorization"]
  jwt_configuration {
    audience = [var.cognito_client_id]
    issuer   = var.cognito_issuer
  }
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "$default"
  auto_deploy = true
}

locals {
  routes = {
    "POST /customerprofiles"          = module.lambdas["createCustomer"].lambda_function_arn
    "PUT /customerprofiles/{id}"       = module.lambdas["updateCustomer"].lambda_function_arn
    "PATCH /customerprofiles/{id}"     = module.lambdas["patchCustomer"].lambda_function_arn
    "DELETE /customerprofiles/{id}"    = module.lambdas["deleteCustomer"].lambda_function_arn
    "GET /customerprofiles/{id}"       = module.lambdas["getCustomer"].lambda_function_arn
    "GET /customerprofiles"           = module.lambdas["listByEmail"].lambda_function_arn
    "GET /operations/{id}"            = module.lambdas["operationStatus"].lambda_function_arn
  }
}

resource "aws_apigatewayv2_integration" "lambda" {
  for_each = local.routes
  api_id             = aws_apigatewayv2_api.api.id
  integration_uri    = each.value
  integration_type   = "AWS_PROXY"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "lambda" {
  for_each = local.routes
  api_id    = aws_apigatewayv2_api.api.id
  route_key = each.key
  target    = "integrations/${aws_apigatewayv2_integration.lambda[each.key].id}"
  authorizer_id = aws_apigatewayv2_authorizer.jwt.id
}
