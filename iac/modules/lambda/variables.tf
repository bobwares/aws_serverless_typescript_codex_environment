# App: CustomerProfileAPI
# Package: iac.modules.lambda
# File: variables.tf
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:00:00Z
# Description: Lambda module variables.
#
variable "table_name" {
  description = "DynamoDB table name"
  type        = string
}

variable "dynamodb_arn" {
  description = "DynamoDB table ARN"
  type        = string
}
