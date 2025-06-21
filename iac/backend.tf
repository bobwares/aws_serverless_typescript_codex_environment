/**
 * @application Infrastructure-as-Code (IaC)
 * @source backend.tf
 * @author Bobwares
 * @version 2.0.0
 * @description Terraform backend configuration (local by default).
 * @updated 2025-06-20
 */

terraform {
  required_version = ">= 1.8.0"

  backend "local" {
    path = "iac/terraform.tfstate"
  }
}

provider "aws" {
  region = var.aws_region
}
