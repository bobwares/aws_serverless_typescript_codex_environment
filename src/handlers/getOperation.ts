# App: CustomerProfileAPI
# Package: handlers
# File: getOperation.ts
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:00:00Z
# Description: Lambda handler returning status of asynchronous operations.
#
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { getOperation } from '../lib/operations.js';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const id = event.pathParameters?.id as string;
  const op = await getOperation(id);
  return {
    statusCode: op ? 200 : 404,
    body: op ? JSON.stringify(op) : 'Not Found',
  };
};
