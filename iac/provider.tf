/**
 * @application Infrastructure-as-Code (IaC)
 * @source provider.tf
 * @author Codex
 * @version 2.2.1
 * @description Backend configuration and provider instantiation.
 *              Version constraints are declared in versions.tf.
 * @updated 2025-06-26T16:05:00-05:00
 */

terraform {
  // -------------------------------------------------------------------------
  // State backend (local file).  Supply an external backend configuration
  // with `terraform init -backend-config=<file>` to switch to S3 + DynamoDB.
  // -------------------------------------------------------------------------
  backend "local" {
    path = "terraform.tfstate"
  }
}

/*-----------------------------------------------------------------------------
# AWS & Local Providers
# ---------------------------------------------------------------------------*/
provider "aws" {
  region = var.aws_region
  default_tags { tags = var.tags }
}

provider "local" {}
