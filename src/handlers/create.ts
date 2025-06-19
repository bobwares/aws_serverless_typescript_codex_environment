/**
 * App: Customer API
 * Package: handlers
 * File: create.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-19T19:00:00Z
 * Description: Lambda handler for creating a new customer profile.
 */

import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import {
  createCustomer,
  CustomerProfile,
} from "../services/customerService.js";
import { closeSegment } from "../utils/xray.js";
import { logger } from "../utils/logger.js";

export async function handler(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  try {
    const body = JSON.parse(event.body ?? "{}");
    const created = await createCustomer(body as Omit<CustomerProfile, "id">);
    return {
      statusCode: 201,
      body: JSON.stringify(created),
    };
  } catch (err) {
    logger.error("Create failed", {
      error: err,
      requestId: event.requestContext.requestId,
    });
    return { statusCode: 500, body: "Internal Server Error" };
  } finally {
    closeSegment();
  }
}
