/**
 * @application Infrastructure-as-Code (IaC)
 * @source lambda.tf
 * @author Bobwares
 * @version 2.1.0
 * @description Lambda functions for CRUD verbs.  Each entry is packaged
 *              separately, receives verb-specific IAM, and now has pinned
 *              memory_size/timeout for predictable performance.
 * @updated 2025-06-26T12:45:00-05:00
 */

/*-----------------------------------------------------------------------------
# locals.lambda_map
# ---------------------------------------------------------------------------
# Central verb-to-configuration map.  Adding a new verb (e.g., bulkUpdate)
# requires only a new element here; the module block below will pick it up.
# Keys:
#   - handler      → file.function exported in the ZIP
#   - source_dir   → path to compiled bundle
#   - policy_json  → inline IAM policy (read/write/delete)
#   - memory       → MB
#   - timeout      → seconds
-----------------------------------------------------------------------------*/
locals {
  lambda_map = {
    create = {
      handler     = "create.handler"
      source_dir  = "${path.root}/../dist/handlers/create"
      policy_json = data.aws_iam_policy_document.ddb_write.json
      memory      = 256
      timeout     = 10
    }
    list = {
      handler     = "list.handler"
      source_dir  = "${path.root}/../dist/handlers/list"
      policy_json = data.aws_iam_policy_document.ddb_read.json
      memory      = 128
      timeout     = 5
    }
    get = {
      handler     = "get.handler"
      source_dir  = "${path.root}/../dist/handlers/get"
      policy_json = data.aws_iam_policy_document.ddb_read.json
      memory      = 128
      timeout     = 5
    }
    update = {
      handler     = "update.handler"
      source_dir  = "${path.root}/../dist/handlers/update"
      policy_json = data.aws_iam_policy_document.ddb_write.json
      memory      = 256
      timeout     = 10
    }
    patch = {
      handler     = "patch.handler"
      source_dir  = "${path.root}/../dist/handlers/patch"
      policy_json = data.aws_iam_policy_document.ddb_write.json
      memory      = 256
      timeout     = 10
    }
    delete = {
      handler     = "delete.handler"
      source_dir  = "${path.root}/../dist/handlers/delete"
      policy_json = data.aws_iam_policy_document.ddb_delete.json
      memory      = 128
      timeout     = 5
    }
  }
}

/*-----------------------------------------------------------------------------
# module.lambda
# ---------------------------------------------------------------------------
# One Lambda per CRUD verb via terraform-aws-modules/lambda.  Memory and
# timeout are pulled from local.lambda_map.  IAM is verb-scoped (least
# privilege).  Tags include the verb for easy CloudWatch filtering.
-----------------------------------------------------------------------------*/
module "lambda" {
  source  = "terraform-aws-modules/lambda/aws"
  version = "7.21.0"

  for_each = local.lambda_map

  function_name = "${local.domain_title}-${each.key}-${var.environment}"
  runtime       = var.lambda_runtime
  handler       = each.value.handler
  source_path   = each.value.source_dir

  # Performance limits
  memory_size = each.value.memory
  timeout     = each.value.timeout

  # IAM
  attach_policy_json = true
  policy_json        = each.value.policy_json

  # Environment
  environment_variables = {
    TABLE_NAME                          = aws_dynamodb_table.single.name
    DOMAIN_SCHEMA                       = jsonencode(local.domain_schema)
    AWS_NODEJS_CONNECTION_REUSE_ENABLED = 1
    POWERTOOLS_SERVICE_NAME             = local.domain_title
  }

  tags = merge(var.tags, { Verb = each.key })
}

