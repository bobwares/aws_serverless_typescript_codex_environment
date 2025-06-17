# App: CustomerProfileAPI
# Package: iac.modules.http_api
# File: outputs.tf
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:00:00Z
# Description: Outputs for HTTP API module.
#
output "api_url" {
  description = "HTTP API invoke URL"
  value       = aws_apigatewayv2_stage.default.invoke_url
}
