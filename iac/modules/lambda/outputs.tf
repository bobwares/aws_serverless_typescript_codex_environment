# App: CustomerProfileAPI
# Package: iac.modules.lambda
# File: outputs.tf
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:00:00Z
# Description: Outputs Lambda ARNs.
#
output "lambda_arns" {
  description = "ARNs of Lambda functions"
  value       = { for k, v in aws_lambda_function.handlers : k => v.arn }
}
