// App: Customer API
// path: iac/modules/api
// File: outputs.tf
// Version: 0.1.0
// Author: ServerlessArchitectBot
// Date: 2025-06-18T00:22:49Z
// Description: Outputs for API Gateway module exposing the endpoint URL.

output "endpoint" {
  description = "HTTP API endpoint"
  value       = aws_apigatewayv2_api.this.api_endpoint
}
