/**
 * App: Customer API
 * Package: handlers
 * File: patchCustomer.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-19T18:25:10Z
 * Description: Lambda handler to partially update a customer profile.
 */

import type { APIGatewayProxyEventV2 } from "aws-lambda";
import { patchCustomer } from "../services/customerService.js";
import { createLogger } from "../utils/logger.js";

export const handler = async (event: APIGatewayProxyEventV2) => {
  const logger = createLogger(event.requestContext.requestId);
  try {
    const id = event.pathParameters?.id as string;
    const body = JSON.parse(event.body ?? "{}");
    const updated = await patchCustomer(id, body);
    return {
      statusCode: 200,
      body: JSON.stringify(updated),
    };
  } catch (err) {
    logger.error(err as Error);
    return { statusCode: 500, body: "Internal Server Error" };
  }
};
