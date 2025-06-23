/**
 * @application Infrastructure-as-Code (IaC)
 * @source apigw.tf
 * @author Bobwares
 * @version 2.0.1
 * @description HTTP API routes per verb.
 * @updated 2025-06-21T18:41:22Z
 */

resource "aws_apigatewayv2_api" "http" {
  name          = local.api_name
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "verb" {
  for_each               = module.lambda
  api_id                 = aws_apigatewayv2_api.http.id
  integration_type       = "AWS_PROXY"
  integration_uri        = each.value.lambda_function_invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "post" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "POST /items"
  target    = "integrations/${aws_apigatewayv2_integration.verb["post"].id}"
}

resource "aws_apigatewayv2_route" "put" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "PUT /items/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.verb["put"].id}"
}

resource "aws_apigatewayv2_route" "list" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "GET /items"
  target    = "integrations/${aws_apigatewayv2_integration.verb["list"].id}"
}

resource "aws_apigatewayv2_route" "get" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "GET /items/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.verb["get"].id}"
}

resource "aws_apigatewayv2_route" "patch" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "PATCH /items/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.verb["patch"].id}"
}

resource "aws_apigatewayv2_route" "delete" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "DELETE /items/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.verb["delete"].id}"
}

resource "aws_apigatewayv2_route" "operation" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "GET /operations/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.verb["operation"].id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_lambda_permission" "allow_apigw" {
  for_each     = module.lambda
  statement_id = "AllowInvoke-${each.key}"
  action        = "lambda:InvokeFunction"
  function_name = each.value.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http.execution_arn}/*/*"
}
