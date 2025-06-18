// App: Customer API
// path: iac/modules/api
// File: variables.tf
// Version: 0.1.0
// Author: ServerlessArchitectBot
// Date: 2025-06-18T00:22:49Z
// Description: Input variables required by the API Gateway module.

variable "api_name" {
  description = "Name for the HTTP API"
  type        = string
}

variable "create_customer_arn" {
  description = "Lambda ARN for create customer"
  type        = string
}

variable "get_customer_arn" {
  description = "Lambda ARN for get customer"
  type        = string
}

variable "update_customer_arn" {
  description = "Lambda ARN for update customer"
  type        = string
}

variable "patch_customer_arn" {
  description = "Lambda ARN for patch customer"
  type        = string
}

variable "delete_customer_arn" {
  description = "Lambda ARN for delete customer"
  type        = string
}

variable "search_customers_arn" {
  description = "Lambda ARN for search customers"
  type        = string
}

variable "get_operation_arn" {
  description = "Lambda ARN for get operation"
  type        = string
}
