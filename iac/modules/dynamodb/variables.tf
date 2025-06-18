// App: Customer API
// path: iac/modules/dynamodb
// File: variables.tf
// Version: 0.1.0
// Author: ServerlessArchitectBot
// Date: 2025-06-18T00:22:49Z
// Description: Input variables for DynamoDB module.
#
variable "table_name" {
  description = "Name of the DynamoDB table"
  type        = string
}
