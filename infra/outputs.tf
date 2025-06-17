# App: CustomerProfileAPI
# Package: infra
# File: outputs.tf
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:29:04Z
# Description: Outputs exposing resource ARNs and IDs.

output "api_url" {
  description = "Base URL of the HTTP API"
  value       = aws_apigatewayv2_stage.default.invoke_url
}

output "table_name" {
  description = "DynamoDB table name"
  value       = aws_dynamodb_table.customer.name
}
