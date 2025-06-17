# App: CustomerProfileAPI
# Package: iac.modules.http_api
# File: variables.tf
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:00:00Z
# Description: Input variables for HTTP API module.
#
variable "lambda_arns" {
  description = "Map of Lambda function ARNs"
  type        = map(string)
}
