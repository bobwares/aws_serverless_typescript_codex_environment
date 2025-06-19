/**
 * App: Customer API
 * Package: handlers
 * File: delete.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-19T19:00:00Z
 * Description: Lambda handler for deleting a customer profile.
 */

import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { deleteCustomer } from "../services/customerService.js";
import { closeSegment } from "../utils/xray.js";
import { logger } from "../utils/logger.js";

export async function handler(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const id = event.pathParameters?.id;
  if (!id) {
    return { statusCode: 400, body: "Missing id" };
  }
  try {
    await deleteCustomer(id);
    return { statusCode: 204, body: "" };
  } catch (err) {
    logger.error("Delete failed", {
      error: err,
      requestId: event.requestContext.requestId,
    });
    return { statusCode: 500, body: "Internal Server Error" };
  } finally {
    closeSegment();
  }
}
