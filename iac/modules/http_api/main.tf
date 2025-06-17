# App: CustomerProfileAPI
# Package: iac.modules.http_api
# File: main.tf
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:00:00Z
# Description: API Gateway HTTP API configuration.
#
resource "aws_apigatewayv2_api" "this" {
  name          = "customer-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.this.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_apigatewayv2_integration" "lambda" {
  for_each = var.lambda_arns
  api_id           = aws_apigatewayv2_api.this.id
  integration_type = "AWS_PROXY"
  integration_uri  = each.value
}

resource "aws_apigatewayv2_route" "routes" {
  api_id = aws_apigatewayv2_api.this.id
  for_each = {
    create  = { method = "POST", path = "/customers", integration = "createCustomer" }
    get     = { method = "GET", path = "/customers/{id}", integration = "getCustomer" }
    update  = { method = "PUT", path = "/customers/{id}", integration = "updateCustomer" }
    delete  = { method = "DELETE", path = "/customers/{id}", integration = "deleteCustomer" }
    search  = { method = "GET", path = "/customers", integration = "searchCustomer" }
    op      = { method = "GET", path = "/operations/{id}", integration = "getOperation" }
  }
  route_key = "${each.value.method} ${each.value.path}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda[each.value.integration].id}"
}

