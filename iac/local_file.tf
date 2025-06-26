/**
 * @application Infrastructure-as-Code (IaC)
 * @source local_file.tf
 * @author Bobwares
 * @version 2.3.0
 * @description Writes the base URL used by the integration-test suite.
 *              Format: <api_endpoint>/<environment>/<resource>
 *              Example: https://abc123.execute-api.us-east-1.amazonaws.com/dev/customers
 * @updated 2025-06-26T13:21:00-05:00
 */

/*-----------------------------------------------------------------------------
# local_file.api_url_test
# ---------------------------------------------------------------------------
# Combines the API’s execute-api host, the stage name (`var.environment`)
# and the REST resource segment (`local.domain_resource`).  The resulting
# URL is the prefix every test appends verb-specific paths to.
-----------------------------------------------------------------------------*/
resource "local_file" "api_url_test" {
content  = "${aws_apigatewayv2_api.http.api_endpoint}/${var.environment}/${local.domain_resource}"
filename = "${path.root}/../test/http/api_url.txt"
}
