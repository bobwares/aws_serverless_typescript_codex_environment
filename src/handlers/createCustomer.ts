/**
 * App: Customer API
 * Package: handlers
 * File: createCustomer.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-19T18:24:57Z
 * Description: Lambda handler to create a new customer profile in DynamoDB.
 */

import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { createCustomer } from "../services/customerService.js";
import { createLogger } from "../utils/logger.js";

export const handler = async (event: APIGatewayProxyEventV2) => {
  const logger = createLogger(event.requestContext.requestId);
  try {
    const body = JSON.parse(event.body ?? "{}");
    const customer = await createCustomer(body);
    return {
      statusCode: 201,
      body: JSON.stringify(customer),
    };
  } catch (err) {
    logger.error(err as Error);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};
