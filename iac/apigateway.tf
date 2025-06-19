/**
 * App: Customer API
 * Package: infrastructure
 * File: apigateway.tf
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-19T21:00:00Z
 * Description: API Gateway HTTP API integrating Lambda functions for CRUD
 *              operations.
 */

resource "aws_apigatewayv2_api" "api" {
  name          = "customer-${var.environment}"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "stage" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = var.environment
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "lambda" {
  for_each               = aws_lambda_function.handler
  api_id                 = aws_apigatewayv2_api.api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = each.value.invoke_arn
  payload_format_version = "2.0"
}

locals {
  routes = {
    "POST /customers"        = { method = "POST", path = "/customers", lambda = "create" }
    "GET /customers/{id}"    = { method = "GET", path = "/customers/{id}", lambda = "get" }
    "PUT /customers/{id}"    = { method = "PUT", path = "/customers/{id}", lambda = "update" }
    "PATCH /customers/{id}"  = { method = "PATCH", path = "/customers/{id}", lambda = "patch" }
    "DELETE /customers/{id}" = { method = "DELETE", path = "/customers/{id}", lambda = "delete" }
    "GET /customers"         = { method = "GET", path = "/customers", lambda = "list" }
  }
}

resource "aws_apigatewayv2_route" "route" {
  for_each  = local.routes
  api_id    = aws_apigatewayv2_api.api.id
  route_key = each.key
  target    = "integrations/${aws_apigatewayv2_integration.lambda[each.value.lambda].id}"
}

resource "aws_lambda_permission" "apigw" {
  for_each      = local.routes
  statement_id  = "AllowAPIGatewayInvoke-${replace(each.key, " ", "-")}"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.handler[each.value.lambda].function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}
