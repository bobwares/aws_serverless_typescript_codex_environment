/**
 * App: Customer API
 * Package: infrastructure
 * File: iam.tf
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-19T21:00:00Z
 * Description: IAM roles and policies granting minimal DynamoDB and CloudWatch
 *              permissions to Lambda functions.
 */

locals {
  lambda_actions = {
    create = ["dynamodb:PutItem"]
    get    = ["dynamodb:GetItem"]
    update = ["dynamodb:PutItem"]
    patch  = ["dynamodb:GetItem", "dynamodb:PutItem"]
    delete = ["dynamodb:DeleteItem"]
    list   = ["dynamodb:Query"]
  }
}

resource "aws_iam_role" "lambda" {
  for_each = local.lambda_actions
  name     = "customer-${var.environment}-${each.key}-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy" "lambda" {
  for_each = local.lambda_actions
  name     = "customer-${var.environment}-${each.key}-policy"
  role     = aws_iam_role.lambda[each.key].id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect   = "Allow"
        Action   = local.lambda_actions[each.key]
        Resource = aws_dynamodb_table.table.arn
      }
    ]
  })
}
