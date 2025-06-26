resource "local_file" "api_url_test" {
  content  = aws_apigatewayv2_api.http.api_endpoint
  filename = "${path.root}/../test/http/api_url.txt"
}
