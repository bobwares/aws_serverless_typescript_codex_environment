// App: Customer API
// path: iac/modules/api
// File: main.tf
// Version: 0.1.0
// Author: ServerlessArchitectBot
// Date: 2025-06-18T00:22:49Z
// Description: Terraform module creating API Gateway HTTP API with routes
//              integrated to the various Lambda functions.

resource "aws_apigatewayv2_api" "this" {
  name          = var.api_name
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id = aws_apigatewayv2_api.this.id
  name   = "$default"
  auto_deploy = true
}

locals {
  lambdas = {
    "POST /customers"                    = var.create_customer_arn
    "GET /customers/{id}"                = var.get_customer_arn
    "PUT /customers"                     = var.update_customer_arn
    "PATCH /customers/{id}"              = var.patch_customer_arn
    "DELETE /customers/{id}"             = var.delete_customer_arn
    "GET /customers"                     = var.search_customers_arn
    "GET /operations/{id}"               = var.get_operation_arn
  }
}

resource "aws_apigatewayv2_integration" "this" {
  for_each           = local.lambdas
  api_id             = aws_apigatewayv2_api.this.id
  integration_type   = "AWS_PROXY"
  integration_uri    = each.value
  integration_method = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "this" {
  for_each = local.lambdas
  api_id   = aws_apigatewayv2_api.this.id
  route_key = each.key
  target    = "integrations/${aws_apigatewayv2_integration.this[each.key].id}"
}

