// App: Customer API
// path: iac/modules/lambda
// File: variables.tf
// Version: 0.1.0
// Author: ServerlessArchitectBot
// Date: 2025-06-18T00:22:49Z
// Description: Input variables for the Lambda module.

variable "function_name" {
  description = "Lambda function name"
  type        = string
}

variable "filename" {
  description = "Path to zipped handler"
  type        = string
}

variable "handler" {
  description = "Handler file"
  type        = string
}

variable "table_name" {
  description = "DynamoDB table name"
  type        = string
}

variable "table_arn" {
  description = "DynamoDB table ARN"
  type        = string
}
