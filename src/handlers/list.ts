/**
 * App: Customer API
 * Package: handlers
 * File: list.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-21T00:00:00Z
 * Description: Lambda handler for listing or searching CustomerProfiles.
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
    const email = event.queryStringParameters?.email;
    const result = email
      ? await service.searchByEmail(email)
      : await service.list();
    debug("customer list/search", requestId);
    return { statusCode: 200, body: JSON.stringify(result) };
  } catch (err) {
    error("list failed", err, requestId);
    return { statusCode: 500, body: "Server Error" };
  }
};
