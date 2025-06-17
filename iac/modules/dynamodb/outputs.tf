# App: CustomerProfileAPI
# Package: iac.modules.dynamodb
# File: outputs.tf
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:00:00Z
# Description: Outputs for DynamoDB module.
#
output "table_arn" {
  description = "ARN of the DynamoDB table"
  value       = aws_dynamodb_table.this.arn
}
