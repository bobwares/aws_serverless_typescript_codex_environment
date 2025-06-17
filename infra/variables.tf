# App: CustomerProfileAPI
# Package: infra
# File: variables.tf
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:29:04Z
# Description: Input variables for the root module.

variable "aws_region" {
  type        = string
  description = "AWS region"
  default     = "us-east-1"
}

variable "table_name" {
  type        = string
  description = "DynamoDB table name"
  default     = "customer-profile"
}

variable "cognito_client_id" {
  type        = string
  description = "Cognito app client ID"
}

variable "cognito_issuer" {
  type        = string
  description = "Cognito issuer URL"
}
