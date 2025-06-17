# App: CustomerProfileAPI
# Package: iac
# File: outputs.tf
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:00:00Z
# Description: Root module outputs exposing resources.
#
output "api_url" {
  description = "HTTP API endpoint"
  value       = module.http_api.api_url
}
