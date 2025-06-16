# App: Customer API
# Package: infra
# File: outputs.tf
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-16T21:44:52Z
# Description: Outputs exposing resource ARNs and IDs.
#
output "api_url" {
  value = aws_apigatewayv2_stage.default.invoke_url
}

output "table_name" {
  value = aws_dynamodb_table.main.name
}
