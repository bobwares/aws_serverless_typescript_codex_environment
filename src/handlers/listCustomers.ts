/**
 * App: Customer API
 * Package: handlers
 * File: listCustomers.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-19T18:25:17Z
 * Description: Lambda handler to list all customer profiles.
 */

import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { listCustomers } from "../services/customerService.js";
import { createLogger } from "../utils/logger.js";

export const handler = async (event: APIGatewayProxyEventV2) => {
  const logger = createLogger(event.requestContext.requestId);
  try {
    const customers = await listCustomers();
    return {
      statusCode: 200,
      body: JSON.stringify(customers),
    };
  } catch (err) {
    logger.error(err as Error);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};
