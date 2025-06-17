# App: CustomerProfileAPI
# Package: iac.modules.lambda
# File: main.tf
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:00:00Z
# Description: Lambda functions for CRUD operations.
#
locals {
  handlers = [
    "createCustomer",
    "getCustomer",
    "updateCustomer",
    "deleteCustomer",
    "searchCustomer",
    "getOperation",
  ]
}

resource "aws_iam_role" "lambda" {
  name               = "customer_lambda_role"
  assume_role_policy = data.aws_iam_policy_document.assume.json
}

data "aws_iam_policy_document" "assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role_policy_attachment" "dynamodb_access" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}

resource "aws_lambda_function" "handlers" {
  for_each = toset(local.handlers)
  function_name = each.value
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  architectures = ["arm64"]
  filename      = "${path.module}/../../dist/${each.value}.zip"
  source_code_hash = filebase64sha256("${path.module}/../../dist/${each.value}.zip")
  environment {
    variables = {
      TABLE_NAME = var.table_name
    }
  }
  role = aws_iam_role.lambda.arn
}

