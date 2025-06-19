/**
 * App: Customer API
 * Package: infrastructure
 * File: outputs.tf
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-19T21:00:00Z
 * Description: Exposes key infrastructure outputs including API URL, table
 *              name, and Lambda ARNs.
 */

output "api_url" {
  value       = aws_apigatewayv2_stage.stage.invoke_url
  description = "Base URL of the Customer API"
}

output "table_name" {
  value       = aws_dynamodb_table.table.name
  description = "Name of the DynamoDB table"
}

output "lambda_arns" {
  value       = { for k, fn in aws_lambda_function.handler : k => fn.arn }
  description = "Map of Lambda function ARNs"
}
