# App: CustomerAPI
# Directory: iac
# File: variables.tf
# Version: 0.1.1
# Author: ServerlessArchitectBot
# Date: 2025-06-18
# Description: Input variables.

variable "region" {
  type    = string
  default = "us-east-1"
}

variable "environment" {
  type    = string
  default = "dev"
}
