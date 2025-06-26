/**
 * @application Infrastructure-as-Code (IaC)
 * @source versions.tf
 * @author Bobwares
 * @version 1.0.0
 * @description Centralised Terraform and provider version pinning.
 *              Keeping this in a single file avoids drift across modules.
 * @updated 2025-06-26T16:05:00-05:00
 */

terraform {
  // -------------------------------------------------------------------------
  // Terraform CLI
  // -------------------------------------------------------------------------
  required_version = ">= 1.8.0"

  // -------------------------------------------------------------------------
  // Providers
  // -------------------------------------------------------------------------
  required_providers {
    aws   = { source = "hashicorp/aws", version = "~> 5.32" }
    local = { source = "hashicorp/local", version = "~> 2.0" }
  }
}
