# App: Customer API
# Package: infra
# File: variables.tf
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-16T21:44:52Z
# Description: Input variables for the root module.
#
variable "region" {
  type    = string
  default = "us-east-1"
}

variable "table_name" {
  type    = string
  default = "customer-api-table"
}
