/**
 * @application Infrastructure-as-Code (IaC)
 * @source outputs.tf
 * @author Bobwares
 * @version 2.1.0
 * @description Stack outputs for API, database, and derived locals.
 * @updated 2025-06-25T20:05:00-05:00
 */

##############################
# Core infrastructure outputs #
##############################

output "api_url" {
  description = "Invoke URL for the HTTP API"
  value       = aws_apigatewayv2_api.http.api_endpoint
}

output "table_name" {
  description = "DynamoDB single-table design name"
  value       = aws_dynamodb_table.single.name
}

output "lambda_arns" {
  description = "Map of CRUD verbs to Lambda ARNs"
  value       = { for k, m in module.lambda : k => m.lambda_function_arn }
}

############################
# Locals surfaced as output #
############################

output "api_name" {
  description = "Computed API Gateway name (title + environment)"
  value       = local.api_name
}

output "domain_resource" {
  description = "REST path segment derived from schema.domain_resource"
  value       = local.domain_resource
}

output "domain_title" {
  description = "Lower-cased title from the domain schema"
  value       = local.domain_title
}

output "lambda_function_names" {
  description = "Map of verb → Lambda function name"
  value       = { for k, m in module.lambda : k => m.lambda_function_name }
}