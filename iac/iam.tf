/**
 * @application Infrastructure-as-Code (IaC)
 * @source iam.tf
 * @author Bobwares
 * @version 2.0.0
 * @description Inline policies for read/write/delete.
 * @updated 2025-06-20
 */

data "aws_iam_policy_document" "ddb_read" {
  statement {
    actions = ["dynamodb:GetItem", "dynamodb:Query"]
    resources = [
      aws_dynamodb_table.single.arn,
      "${aws_dynamodb_table.single.arn}/index/*"
    ]
  }
}

data "aws_iam_policy_document" "ddb_write" {
  statement {
    actions = ["dynamodb:PutItem", "dynamodb:UpdateItem"]
    resources = [aws_dynamodb_table.single.arn]
  }
}

data "aws_iam_policy_document" "ddb_delete" {
  statement {
    actions = ["dynamodb:DeleteItem"]
    resources = [aws_dynamodb_table.single.arn]
  }
}
