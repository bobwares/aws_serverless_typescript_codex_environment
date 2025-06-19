/**
 * App: Customer API
 * Package: handlers
 * File: list.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-19T19:00:00Z
 * Description: Lambda handler for listing customer profiles.
 */

import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { listCustomers } from "../services/customerService.js";
import { closeSegment } from "../utils/xray.js";
import { logger } from "../utils/logger.js";

export async function handler(
  _: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  try {
    const customers = await listCustomers();
    return { statusCode: 200, body: JSON.stringify(customers) };
  } catch (err) {
    logger.error("List failed", { error: err });
    return { statusCode: 500, body: "Internal Server Error" };
  } finally {
    closeSegment();
  }
}
