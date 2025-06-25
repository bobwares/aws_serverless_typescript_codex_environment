/**
 * @application Infrastructure-as-Code (IaC)
 * @source lambda.tf
 * @author Bobwares
* @version 2.0.3
* @description Lambda functions for CRUD actions.
* @updated 2025-06-25T14:00:08Z
*/

locals {
  lambda_map = {
    create = { handler = "create.handler", policy_json = data.aws_iam_policy_document.ddb_write.json }
    list   = { handler = "list.handler", policy_json = data.aws_iam_policy_document.ddb_read.json }
    get    = { handler = "get.handler", policy_json = data.aws_iam_policy_document.ddb_read.json }
    update = { handler = "update.handler", policy_json = data.aws_iam_policy_document.ddb_write.json }
    patch  = { handler = "patch.handler", policy_json = data.aws_iam_policy_document.ddb_write.json }
    delete = { handler = "delete.handler", policy_json = data.aws_iam_policy_document.ddb_delete.json }
  }
}

module "lambda" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "7.20.1"

  for_each = local.lambda_map

  function_name      = "${local.domain_title}-${each.key}-${var.environment}"
  runtime            = var.lambda_runtime
  handler            = each.value.handler
  source_path        = "dist/handlers"
  attach_policy_json = true
  policy_json        = each.value.policy_json

  environment_variables = {
    TABLE_NAME                          = aws_dynamodb_table.single.name
    DOMAIN_SCHEMA                       = jsonencode(local.domain_schema)
    AWS_NODEJS_CONNECTION_REUSE_ENABLED = 1
    POWERTOOLS_SERVICE_NAME             = local.domain_title
  }

  tags = merge(var.tags, { Verb = each.key })
}
