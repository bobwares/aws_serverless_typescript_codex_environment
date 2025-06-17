# App: CustomerProfileAPI
# Package: iac
# File: main.tf
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:00:00Z
# Description: Root Terraform configuration invoking child modules.
#
terraform {
  required_version = ">= 1.8"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

module "dynamodb" {
  source = "./modules/dynamodb"
  table_name = var.table_name
}

module "lambda" {
  source = "./modules/lambda"
  table_name = var.table_name
  dynamodb_arn = module.dynamodb.table_arn
}

module "http_api" {
  source = "./modules/http_api"
  lambda_arns = module.lambda.lambda_arns
}
