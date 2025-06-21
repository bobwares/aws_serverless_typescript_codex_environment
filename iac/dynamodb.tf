/**
 * @application Infrastructure-as-Code (IaC)
 * @source dynamodb.tf
 * @author Bobwares
 * @version 2.0.0
 * @description DynamoDB single table.
 * @updated 2025-06-20
 */

resource "aws_dynamodb_table" "single" {
  name         = "${local.domain_title}-${var.environment}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "pk"
  range_key    = "sk"

  attribute { name = "pk"     type = "S" }
  attribute { name = "sk"     type = "S" }
  attribute { name = "gsi1pk" type = "S" }

  global_secondary_index {
    name            = "gsi1"
    hash_key        = "gsi1pk"
    range_key       = "sk"
    projection_type = "ALL"
  }

  tags = merge(var.tags, {
    Domain      = local.domain_title
    Environment = var.environment
  })
}
