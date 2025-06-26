/**
 * @application Infrastructure-as-Code (IaC)
 * @source locals.tf
 * @author Bobwares
 * @version 2.1.0
 * @description Derive API names and helpers from schema_path (= envs/*.tfvars).
 * @updated 2025-06-25
 */

locals {
  # ---------------------------------------------------------------------------
  # domain_schema
  # ---------------------------------------------------------------------------
  # Reads and decodes the JSON schema specified by var.schema_path.
  # Example path comes from envs/dev.tfvars → `schema_path = "../schema/domain.json"`.
  # The schema must include at least a `"title"` field; `"resource"` is optional
  # but recommended for API path generation.
  domain_schema = jsondecode(file(var.schema_path))

  # ---------------------------------------------------------------------------
  # domain_title
  # ---------------------------------------------------------------------------
  # Lower-cased version of schema["title"] (e.g., "CustomerProfile" → "customerprofile").
  # Used as a base for naming AWS resources in a consistent, environment-agnostic way.
  domain_title  = lower(local.domain_schema.title)

  # ---------------------------------------------------------------------------
  # domain_resource
  # ---------------------------------------------------------------------------
  # REST path segment used by API Gateway routes.
  # If the `"resource"` key is missing in the schema, we fall back to `"items"`
  # so Terraform plans remain valid (CI won’t fail on missing keys).
  domain_resource = lookup(local.domain_schema, "resource", "items")

  # ---------------------------------------------------------------------------
  # api_name
  # ---------------------------------------------------------------------------
  # Combines domain_title with the current environment to produce a unique,
  # readable API Gateway name. Example: "customerprofile-api-dev".
  api_name = "${local.domain_title}-api-${var.environment}"
}
