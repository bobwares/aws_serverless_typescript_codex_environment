# App: CustomerProfileAPI
# Package: iac.modules.dynamodb
# File: variables.tf
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:00:00Z
# Description: Input variables for DynamoDB module.
#
variable "table_name" {
  description = "Name of the DynamoDB table"
  type        = string
}
