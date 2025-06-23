/**
 * App: Customer API
 * Package: handlers
 * File: operation.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-21T00:00:00Z
 * Description: Lambda handler for retrieving async operation status.
 */

import {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { createDocumentClient } from "../utils/xray.js";
import { CustomerService } from "../services/customerService.js";
import { debug, error } from "../utils/logger.js";

const service = new CustomerService(createDocumentClient());

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> => {
  const requestId = event.requestContext.requestId;
  try {
    const id = event.pathParameters?.id as string;
    const op = await service.getOperation(id);
    if (!op) return { statusCode: 404, body: "Not Found" };
    debug("operation fetched", requestId);
    return { statusCode: 200, body: JSON.stringify(op) };
  } catch (err) {
    error("get operation failed", err, requestId);
    return { statusCode: 500, body: "Server Error" };
  }
};
