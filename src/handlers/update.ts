/**
 * App: Customer API
 * Package: handlers
 * File: update.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-19T19:00:00Z
 * Description: Lambda handler for replacing a customer profile.
 */

import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import {
  updateCustomer,
  CustomerProfile,
} from "../services/customerService.js";
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
    const body = JSON.parse(event.body ?? "{}");
    const updated = await updateCustomer(id, body as CustomerProfile);
    return { statusCode: 200, body: JSON.stringify(updated) };
  } catch (err) {
    logger.error("Update failed", {
      error: err,
      requestId: event.requestContext.requestId,
    });
    return { statusCode: 500, body: "Internal Server Error" };
  } finally {
    closeSegment();
  }
}
