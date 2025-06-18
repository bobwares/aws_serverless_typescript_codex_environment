# App: CustomerAPI
# Directory: iac
# File: provider.tf
# Version: 0.1.1
# Author: ServerlessArchitectBot
# Date: 2025-06-18
# Description: Terraform provider and backend configuration.

terraform {
  required_version = ">= 1.8"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

terraform {
  backend "local" {}
}
