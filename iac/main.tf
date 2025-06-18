# App: CustomerAPI
# Directory: iac
# File: main.tf
# Version: 0.1.1
# Author: ServerlessArchitectBot
# Date: 2025-06-18
# Description: Infrastructure resources for Customer API.

resource "aws_dynamodb_table" "customers" {
  name         = "customer-api-${var.environment}"
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

  global_secondary_index {
    name            = "gsi1"
    hash_key        = "gsi1pk"
    range_key       = "sk"
    projection_type = "ALL"
  }

  tags = {
    App         = "CustomerAPI"
    Environment = var.environment
  }
}

resource "aws_dynamodb_table" "operations" {
  name         = "customer-api-ops-${var.environment}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }

  tags = {
    App         = "CustomerAPI"
    Environment = var.environment
  }
}

resource "aws_iam_role" "lambda_role" {
  name = "customer-api-${var.environment}-lambda"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action    = "sts:AssumeRole",
      Principal = { Service = "lambda.amazonaws.com" },
      Effect    = "Allow"
    }]
  })

  tags = {
    App         = "CustomerAPI"
    Environment = var.environment
  }
}

resource "aws_iam_role_policy" "lambda_policy" {
  name = "customer-api-${var.environment}-policy"
  role = aws_iam_role.lambda_role.id
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action   = ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:DeleteItem", "dynamodb:Query", "dynamodb:UpdateItem"],
        Effect   = "Allow",
        Resource = [aws_dynamodb_table.customers.arn, aws_dynamodb_table.operations.arn]
      },
      {
        Action   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"],
        Effect   = "Allow",
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

data "archive_file" "lambda_zip" {
  for_each    = fileset("../dist", "*.mjs")
  type        = "zip"
  source_file = "../dist/${each.key}"
  output_path = "../dist/${replace(each.key, "mjs", "zip")}"
}

resource "aws_lambda_function" "handlers" {
  for_each         = data.archive_file.lambda_zip
  function_name    = "${each.key}-${var.environment}"
  filename         = each.value.output_path
  source_code_hash = filebase64sha256(each.value.output_path)
  handler          = each.key
  runtime          = "nodejs20.x"
  architectures    = ["arm64"]
  role             = aws_iam_role.lambda_role.arn
  environment {
    variables = {
      CUSTOMERS_TABLE  = aws_dynamodb_table.customers.name
      OPERATIONS_TABLE = aws_dynamodb_table.operations.name
    }
  }
  tags = {
    App         = "CustomerAPI"
    Environment = var.environment
  }
}

resource "aws_apigatewayv2_api" "api" {
  name          = "customer-api-${var.environment}"
  protocol_type = "HTTP"
  tags = {
    App         = "CustomerAPI"
    Environment = var.environment
  }
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "$default"
  auto_deploy = true
  tags = {
    App         = "CustomerAPI"
    Environment = var.environment
  }
}

resource "aws_apigatewayv2_integration" "lambda" {
  for_each               = aws_lambda_function.handlers
  api_id                 = aws_apigatewayv2_api.api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = each.value.invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "routes" {
  api_id = aws_apigatewayv2_api.api.id
  for_each = {
    create = { method = "POST", path = "/customers", handler = "createCustomer.mjs" }
    get    = { method = "GET", path = "/customers/{id}", handler = "getCustomer.mjs" }
    update = { method = "PUT", path = "/customers/{id}", handler = "updateCustomer.mjs" }
    patch  = { method = "PATCH", path = "/customers/{id}", handler = "patchCustomer.mjs" }
    delete = { method = "DELETE", path = "/customers/{id}", handler = "deleteCustomer.mjs" }
    search = { method = "GET", path = "/customers", handler = "searchCustomers.mjs" }
    op     = { method = "GET", path = "/operations/{id}", handler = "getOperationStatus.mjs" }
  }
  route_key = "${each.value.method} ${each.value.path}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda[each.value.handler].id}"
}

resource "aws_lambda_permission" "api" {
  for_each      = aws_lambda_function.handlers
  action        = "lambda:InvokeFunction"
  function_name = each.value.arn
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}

output "api_endpoint" {
  value = aws_apigatewayv2_stage.default.invoke_url
}
