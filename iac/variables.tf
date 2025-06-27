/**
 * @application Infrastructure-as-Code (IaC)
 * @source variables.tf
 * @author Bobwares
 * @version 2.0.1
 * @description Input variables for CRUD stack.
 * @updated 2025-06-25T14:00:08Z
*/

variable "environment" {
  description = "Stage (dev,stage,prod)"
  type        = string
}

variable "schema_path" {
  description = "Path to Draft-07 schema"
  type        = string
}

variable "lambda_runtime" {
  description = "Runtime"
  type        = string
  default     = "nodejs20.x"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "tags" {
  description = "Common tags"
  type        = map(string)
  default     = {}
}
