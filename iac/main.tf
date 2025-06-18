// App: Customer API
// path: iac
// File: main.tf
// Version: 0.1.0
// Author: ServerlessArchitectBot
// Date: 2025-06-18T00:22:49Z
// Description: Root Terraform module configuring providers and composing
//              DynamoDB, Lambda and API Gateway modules for the
//              CustomerProfile API.

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

module "dynamodb" {
  source     = "./modules/dynamodb"
  table_name = var.table_name
}

module "create_customer" {
  source        = "./modules/lambda"
  function_name = "create-customer"
  filename      = "${path.module}/../dist/createCustomer.zip"
  handler       = "index.mjs"
  table_name    = module.dynamodb.table_name
  table_arn     = module.dynamodb.table_arn
}

module "get_customer" {
  source        = "./modules/lambda"
  function_name = "get-customer"
  filename      = "${path.module}/../dist/getCustomer.zip"
  handler       = "index.mjs"
  table_name    = module.dynamodb.table_name
  table_arn     = module.dynamodb.table_arn
}

module "update_customer" {
  source        = "./modules/lambda"
  function_name = "update-customer"
  filename      = "${path.module}/../dist/updateCustomer.zip"
  handler       = "index.mjs"
  table_name    = module.dynamodb.table_name
  table_arn     = module.dynamodb.table_arn
}

module "patch_customer" {
  source        = "./modules/lambda"
  function_name = "patch-customer"
  filename      = "${path.module}/../dist/patchCustomer.zip"
  handler       = "index.mjs"
  table_name    = module.dynamodb.table_name
  table_arn     = module.dynamodb.table_arn
}

module "delete_customer" {
  source        = "./modules/lambda"
  function_name = "delete-customer"
  filename      = "${path.module}/../dist/deleteCustomer.zip"
  handler       = "index.mjs"
  table_name    = module.dynamodb.table_name
  table_arn     = module.dynamodb.table_arn
}

module "search_customers" {
  source        = "./modules/lambda"
  function_name = "search-customers"
  filename      = "${path.module}/../dist/searchCustomers.zip"
  handler       = "index.mjs"
  table_name    = module.dynamodb.table_name
  table_arn     = module.dynamodb.table_arn
}

module "get_operation" {
  source        = "./modules/lambda"
  function_name = "get-operation"
  filename      = "${path.module}/../dist/getOperation.zip"
  handler       = "index.mjs"
  table_name    = module.dynamodb.table_name
  table_arn     = module.dynamodb.table_arn
}

module "api" {
  source                = "./modules/api"
  api_name              = "customer-api"
  create_customer_arn   = module.create_customer.arn
  get_customer_arn      = module.get_customer.arn
  update_customer_arn   = module.update_customer.arn
  patch_customer_arn    = module.patch_customer.arn
  delete_customer_arn   = module.delete_customer.arn
  search_customers_arn  = module.search_customers.arn
  get_operation_arn     = module.get_operation.arn
}

