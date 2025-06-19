/**
 * App: Customer API
 * Package: handlers
 * File: get.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-19T19:00:00Z
 * Description: Lambda handler for retrieving a customer profile by id.
 */

import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { getCustomer } from "../services/customerService.js";
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
    const customer = await getCustomer(id);
    if (!customer) {
      return { statusCode: 404, body: "Not Found" };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(customer),
    };
  } catch (err) {
    logger.error("Get failed", {
      error: err,
      requestId: event.requestContext.requestId,
    });
    return { statusCode: 500, body: "Internal Server Error" };
  } finally {
    closeSegment();
  }
}
