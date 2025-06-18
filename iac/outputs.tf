// App: Customer API
// path: iac
// File: outputs.tf
// Version: 0.1.0
// Author: ServerlessArchitectBot
// Date: 2025-06-18T00:22:49Z
// Description: Outputs from the root Terraform module exposing key
//              resource identifiers for external consumption.

output "table_name" {
  description = "DynamoDB table name"
  value       = module.dynamodb.table_name
}

output "api_endpoint" {
  description = "HTTP API endpoint"
  value       = module.api.endpoint
}
