/**
 * App: Customer API
 * Package: handlers
 * File: getCustomer.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-19T18:25:01Z
 * Description: Lambda handler to retrieve a customer profile by ID.
 */

import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { getCustomer } from "../services/customerService.js";
import { createLogger } from "../utils/logger.js";

export const handler = async (event: APIGatewayProxyEventV2) => {
  const logger = createLogger(event.requestContext.requestId);
  try {
    const id = event.pathParameters?.id as string;
    const customer = await getCustomer(id);
    if (!customer) {
      return { statusCode: 404, body: "Not Found" };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(customer),
    };
  } catch (err) {
    logger.error(err as Error);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};
