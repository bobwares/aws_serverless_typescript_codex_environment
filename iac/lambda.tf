/**
 * App: Customer API
 * Package: infrastructure
 * File: lambda.tf
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-19T21:00:00Z
 * Description: Deploys Lambda functions for each CRUD handler with minimal
 *              IAM permissions and environment variables.
 */

locals {
  lambda_functions = {
    create = "create"
    get    = "get"
    update = "update"
    patch  = "patch"
    delete = "delete"
    list   = "list"
  }

}

data "archive_file" "handler_zip" {
  for_each    = local.lambda_functions
  type        = "zip"
  source_file = "${path.module}/../dist/handlers/${each.value}.mjs"
  output_path = "${path.module}/../dist/handlers/${each.value}.zip"
}

resource "aws_lambda_function" "handler" {
  for_each      = local.lambda_functions
  function_name = "customer-${var.environment}-${each.key}"
  filename      = data.archive_file.handler_zip[each.key].output_path
  handler       = "${each.value}.handler"
  runtime       = "nodejs20.x"
  architectures = ["arm64"]
  role          = aws_iam_role.lambda[each.key].arn

  environment {
    variables = {
      TABLE_NAME                          = aws_dynamodb_table.table.name
      AWS_NODEJS_CONNECTION_REUSE_ENABLED = "1"
      POWERTOOLS_SERVICE_NAME             = "customer-api"
    }
  }
}
