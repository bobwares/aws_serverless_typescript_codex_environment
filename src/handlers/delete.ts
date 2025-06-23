/**
 * App: Customer API
 * Package: handlers
 * File: delete.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-21T00:00:00Z
 * Description: Lambda handler for deleting a CustomerProfile.
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
    const opId = await service.remove(id);
    debug("customer deleted", requestId);
    return { statusCode: 202, body: JSON.stringify({ operationId: opId }) };
  } catch (err) {
    error("delete failed", err, requestId);
    return { statusCode: 400, body: "Bad Request" };
  }
};
