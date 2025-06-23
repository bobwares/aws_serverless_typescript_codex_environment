/**
 * App: Customer API
 * Package: handlers
 * File: get.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-21T00:00:00Z
 * Description: Lambda handler for retrieving a CustomerProfile by id.
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
    const customer = await service.get(id);
    if (!customer) return { statusCode: 404, body: "Not Found" };
    debug("customer fetched", requestId);
    return { statusCode: 200, body: JSON.stringify(customer) };
  } catch (err) {
    error("get failed", err, requestId);
    return { statusCode: 500, body: "Server Error" };
  }
};
