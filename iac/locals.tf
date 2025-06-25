/**
 * @application Infrastructure-as-Code (IaC)
 * @source locals.tf
 * @author Bobwares
 * @version 2.0.0
 * @description Derive domain names and helpers.
 * @updated 2025-06-20
 */

locals {
  domain_schema = jsondecode(file(var.schema_path))
  domain_title  = lower(local.domain_schema.title)

  api_name = "${local.domain_title}-api-${var.environment}"
}
