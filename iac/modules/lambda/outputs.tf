// App: Customer API
// path: iac/modules/lambda
// File: outputs.tf
// Version: 0.1.0
// Author: ServerlessArchitectBot
// Date: 2025-06-18T00:22:49Z
// Description: Outputs for the Lambda module exposing the function ARN.

output "arn" {
  description = "Lambda function ARN"
  value       = aws_lambda_function.this.arn
}
