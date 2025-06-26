/**
 * @application Infrastructure-as-Code (IaC)
 * @source apigateway.tf
 * @author Bobwares
 * @version 2.1.0
 * @description HTTP API, CloudWatch access logging, integrations, routes,
 *              and invoke permissions for CRUD operations.  Paths are derived
 *              from local.domain_resource (schema/domain.json).
 * @updated 2025-06-26T13:05:00-05:00
 */

/*-----------------------------------------------------------------------------
# aws_cloudwatch_log_group.api_access
# ---------------------------------------------------------------------------
# Access-log destination for the HTTP API stage.  Logs are retained 14 days
# and charged only for storage/ingest (~MB per month in dev).  A single log
# group per environment keeps queries simple: /aws/apigw/<api_name>.
-----------------------------------------------------------------------------*/
resource "aws_cloudwatch_log_group" "api_access" {
  name              = "/aws/apigw/${local.api_name}"
  retention_in_days = 1
}

/*-----------------------------------------------------------------------------
# aws_apigatewayv2_stage.default
# ---------------------------------------------------------------------------
# Default stage for the HTTP API.  `auto_deploy = true` publishes each new
# route immediately after `terraform apply`.  Access logs are streamed to the
# CloudWatch group above in structured JSON, keyed by requestId.
-----------------------------------------------------------------------------*/
resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.http.id
  name        = var.environment                      # e.g. dev, stage, prod
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_access.arn
    format = jsonencode({
      requestId = "$context.requestId",
      routeKey  = "$context.routeKey",
      status    = "$context.status",
      latency   = "$context.responseLatency",
      error     = "$context.error.message"
    })
  }
}

/*-----------------------------------------------------------------------------
# aws_apigatewayv2_api.http
# ---------------------------------------------------------------------------
# Single regional HTTP API (API Gateway v2).  The name combines the domain
# title and environment for readability, e.g. customerprofile-api-dev.
-----------------------------------------------------------------------------*/
resource "aws_apigatewayv2_api" "http" {
  name          = local.api_name
  protocol_type = "HTTP"            # Lower cost & latency than REST v1
}

/*-----------------------------------------------------------------------------
# aws_apigatewayv2_integration.verb
# ---------------------------------------------------------------------------
# One AWS_PROXY integration per Lambda handler (create, list, get, update,
# patch, delete).  Using `for_each` keeps the map in sync with module.lambda.
-----------------------------------------------------------------------------*/
resource "aws_apigatewayv2_integration" "verb" {
  for_each               = module.lambda
  api_id                 = aws_apigatewayv2_api.http.id
  integration_type       = "AWS_PROXY"                 # Full pass-through
  integration_uri        = each.value.lambda_function_invoke_arn
  payload_format_version = "2.0"
}

/*-----------------------------------------------------------------------------
# ROUTES ─────────────────────────────────────────────────────────────────────
# Six routes provide standard CRUD semantics.  `${local.domain_resource}`
# comes from schema/domain.json → "resource".
-----------------------------------------------------------------------------*/

# POST /<resource>          → Create entity
resource "aws_apigatewayv2_route" "create" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "POST /${local.domain_resource}"
  target    = "integrations/${aws_apigatewayv2_integration.verb["create"].id}"
}

# GET  /<resource>          → List entities
resource "aws_apigatewayv2_route" "list" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "GET /${local.domain_resource}"
  target    = "integrations/${aws_apigatewayv2_integration.verb["list"].id}"
}

# GET  /<resource>/{id}     → Fetch one entity
resource "aws_apigatewayv2_route" "get" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "GET /${local.domain_resource}/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.verb["get"].id}"
}

# PUT  /<resource>/{id}     → Full update
resource "aws_apigatewayv2_route" "update" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "PUT /${local.domain_resource}/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.verb["update"].id}"
}

# PATCH /<resource>/{id}    → Partial update
resource "aws_apigatewayv2_route" "patch" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "PATCH /${local.domain_resource}/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.verb["patch"].id}"
}

# DELETE /<resource>/{id}   → Remove entity
resource "aws_apigatewayv2_route" "delete" {
  api_id    = aws_apigatewayv2_api.http.id
  route_key = "DELETE /${local.domain_resource}/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.verb["delete"].id}"
}

/*-----------------------------------------------------------------------------
# aws_lambda_permission.allow_apigw
# ---------------------------------------------------------------------------
# Grants API Gateway permission to invoke each Lambda handler.  Source ARN is
# scoped to this API and stage for least privilege.
-----------------------------------------------------------------------------*/
resource "aws_lambda_permission" "allow_apigw" {
  for_each      = module.lambda
  statement_id  = "AllowInvoke-${each.key}"
  action        = "lambda:InvokeFunction"
  function_name = each.value.lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http.execution_arn}/${var.environment}/*"
}
