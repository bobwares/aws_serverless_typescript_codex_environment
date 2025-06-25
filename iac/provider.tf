/**
 * @application Infrastructure-as-Code (IaC)
 * @source provider.tf
 * @author Codex
 * @version 2.1.0
 * @description Terraform provider configuration with remote state placeholders.
 * @updated 2025-06-25T14:00:08Z
*/

terraform {
  required_version = ">= 1.8.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "local" {
    path = "iac/terraform.tfstate"
    # To use remote state, configure:
    # bucket         = "<state-bucket>"
    # key            = "customer-api/terraform.tfstate"
    # region         = var.aws_region
    # dynamodb_table = "<lock-table>"
  }
}

provider "aws" {
  region = var.aws_region
}
