/**
 * App: Customer API
 * Package: handlers
 * File: put.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-21T00:00:00Z
 * Description: Lambda handler for replacing a CustomerProfile.
 */

import {
  APIGatewayProxyEventV2,
  APIGatewayProxyStructuredResultV2,
} from "aws-lambda";
import { createDocumentClient } from "../utils/xray.js";
import { CustomerService } from "../services/customerService.js";
import { validateProfile } from "../utils/validator.js";
import { debug, error } from "../utils/logger.js";

const service = new CustomerService(createDocumentClient());

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyStructuredResultV2> => {
  const requestId = event.requestContext.requestId;
  try {
    const payload = JSON.parse(event.body ?? "{}");
    validateProfile(payload);
    const opId = await service.update(payload);
    debug("customer updated", requestId);
    return { statusCode: 202, body: JSON.stringify({ operationId: opId }) };
  } catch (err) {
    error("update failed", err, requestId);
    return { statusCode: 400, body: "Bad Request" };
  }
};
