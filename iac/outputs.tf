/**
 * @application Infrastructure-as-Code (IaC)
 * @source outputs.tf
 * @author Bobwares
 * @version 2.0.1
 * @description Stack outputs for API and database.
 * @updated 2025-06-25T14:00:08Z
*/

output "api_url" {
  value = aws_apigatewayv2_api.http.api_endpoint
}

output "table_name" {
  value = aws_dynamodb_table.single.name
}

output "lambda_arns" {
  value = { for k, m in module.lambda : k => m.lambda_function_arn }
}
