/**
 * App: Customer API
 * Package: handlers
 * File: create.ts
 * Version: 0.1.2
 * Author: Codex
 * Date: 2025-06-25T19:30:00Z
 * Description: Lambda handler to create a new CustomerProfile item, with basic parsing and validation.
 */

import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import { parseJson } from "../utils/parser";
import { validateCustomerProfile } from "../utils/validation";
import { CrudService } from "../services/crud_service";

const service = new CrudService();

export const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  console.log(event);
  let raw: unknown;
  try {
    raw = parseJson(event);
  } catch (err) {
    console.error("Invalid JSON in request body:", err, "body:", event);
    return { statusCode: 400, body: "Invalid JSON" };
  }

  // 2) Validate against schema
  let payload;
  try {
    payload = validateCustomerProfile(raw);
  } catch (err) {
    console.error("Validation failed:", err);
    return { statusCode: 422, body: "Validation error" };
  }

  // 3) Determine target table name
  const tableName = process.env.TABLE_NAME;
  if (!tableName) {
    console.error("TABLE_NAME environment variable is not set");
    return { statusCode: 500, body: "Server configuration error" };
  }

  // 4) Attempt creation in DynamoDB
  let created;
  try {
    created = await service.create(payload);
  } catch (err) {
    console.error("Error writing to DynamoDB:", err);
    return { statusCode: 500, body: "Internal server error" };
  }

  // 5) Return successful response
  return {
    statusCode: 201,
    body: JSON.stringify(created),
  };
};
