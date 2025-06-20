/**
 * App: Customer API
 * Package: infrastructure
 * File: variables.tf
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-19T21:00:00Z
 * Description: Terraform input variables for region and environment.
 */

variable "region" {
  type        = string
  description = "AWS region"
  default     = "us-east-1"
}

variable "environment" {
  type        = string
  description = "Deployment environment name"
  default = "dev"
}
