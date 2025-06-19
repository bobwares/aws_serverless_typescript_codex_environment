/**
 * App: Customer API
 * Package: infrastructure
 * File: dynamodb.tf
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-19T21:00:00Z
 * Description: DynamoDB single-table with GSI gsi1 used by the Customer API.
 */

resource "aws_dynamodb_table" "table" {
  name         = "customer-${var.environment}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "pk"
  range_key    = "sk"

  attribute {
    name = "pk"
    type = "S"
  }

  attribute {
    name = "sk"
    type = "S"
  }

  attribute {
    name = "gsi1pk"
    type = "S"
  }

  attribute {
    name = "gsi1sk"
    type = "S"
  }

  global_secondary_index {
    name            = "gsi1"
    hash_key        = "gsi1pk"
    range_key       = "gsi1sk"
    projection_type = "ALL"
  }

  tags = {
    Environment = var.environment
    Service     = "customer-api"
  }
}
