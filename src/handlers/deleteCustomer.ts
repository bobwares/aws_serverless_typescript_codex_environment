# App: CustomerProfileAPI
# Package: handlers
# File: deleteCustomer.ts
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:00:00Z
# Description: Lambda handler for deleting a customer profile asynchronously.
#
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { deleteCustomer } from '../lib/customerService.js';
import { startOperation, finishOperation } from '../lib/operations.js';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const id = event.pathParameters?.id as string;
  const operationId = id + '-del';
  await startOperation(operationId);
  try {
    await deleteCustomer(id);
    await finishOperation(operationId, {});
  } catch (err) {
    await finishOperation(operationId, { error: (err as Error).message });
  }
  return {
    statusCode: 202,
    body: JSON.stringify({ operationId }),
  };
};
