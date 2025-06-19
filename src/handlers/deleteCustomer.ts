/**
 * App: Customer API
 * Package: handlers
 * File: deleteCustomer.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-19T18:25:14Z
 * Description: Lambda handler to delete a customer profile.
 */

import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { deleteCustomer } from '../services/customerService.js';
import { createLogger } from '../utils/logger.js';

export const handler = async (event: APIGatewayProxyEventV2) => {
  const logger = createLogger(event.requestContext.requestId);
  try {
    const id = event.pathParameters?.id as string;
    await deleteCustomer(id);
    return { statusCode: 204, body: '' };
  } catch (err) {
    logger.error(err as Error);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};
