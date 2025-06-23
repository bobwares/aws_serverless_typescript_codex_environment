/**
 * @application Infrastructure-as-Code (IaC)
 * @source outputs.tf
 * @author Bobwares
 * @version 2.0.0
 * @description Stack outputs.
 * @updated 2025-06-20
 */

output "api_url" {
  value = aws_apigatewayv2_api.http.api_endpoint
}

output "functions" {
  value = { for k, m in module.lambda : k => m.lambda_function_name }
}

output "table_name" {
  value = aws_dynamodb_table.single.name
}

output "lambda_arns" {
  value = { for k, m in module.lambda : k => m.lambda_function_arn }
}
