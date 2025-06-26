/**
 * @application Infrastructure-as-Code (IaC)
 * @source iam.tf
 * @author Bobwares
 * @version 2.1.0
 * @description Inline IAM policies used by the Lambda CRUD functions.  Each
 *              policy grants the minimum set of DynamoDB actions required by
 *              its verb.  Policies are injected directly into the Lambda
 *              module via `policy_json`, avoiding separate IAM resources.
 * @updated 2025-06-26T12:47:00-05:00
 */

/*-----------------------------------------------------------------------------
# data.aws_iam_policy_document.ddb_read
# ---------------------------------------------------------------------------
# Read-only access:
#   - GetItem   → fetch one item by PK/SK
#   - Query     → list items via PK and/or GSI
# Includes indexes so queries on gsi1 work.  Used by `list` and `get`
# Lambda handlers.
-----------------------------------------------------------------------------*/
data "aws_iam_policy_document" "ddb_read" {
  statement {
    actions = [
      "dynamodb:GetItem",
      "dynamodb:Query"
    ]
    resources = [
      aws_dynamodb_table.single.arn,
      "${aws_dynamodb_table.single.arn}/index/*"   # gsi1
    ]
  }
}

/*-----------------------------------------------------------------------------
# data.aws_iam_policy_document.ddb_write
# ---------------------------------------------------------------------------
# Write access without deletes:
#   - PutItem      → create new entity
#   - UpdateItem   → full/partial overwrite
# Targets the base table only (no indexes).  Used by `create`, `update`,
# and `patch` handlers.
-----------------------------------------------------------------------------*/
data "aws_iam_policy_document" "ddb_write" {
  statement {
    actions = [
      "dynamodb:PutItem",
      "dynamodb:UpdateItem"
    ]
    resources = [
      aws_dynamodb_table.single.arn
    ]
  }
}

/*-----------------------------------------------------------------------------
# data.aws_iam_policy_document.ddb_delete
# ---------------------------------------------------------------------------
# Delete access:
#   - DeleteItem   → remove entity
# Limited to the base table.  Used exclusively by the `delete` handler.
-----------------------------------------------------------------------------*/
data "aws_iam_policy_document" "ddb_delete" {
  statement {
    actions = [
      "dynamodb:DeleteItem"
    ]
    resources = [
      aws_dynamodb_table.single.arn
    ]
  }
}
