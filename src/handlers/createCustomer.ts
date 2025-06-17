# App: CustomerProfileAPI
# Package: handlers
# File: createCustomer.ts
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:00:00Z
# Description: Lambda handler for creating a customer profile asynchronously.
#
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { createCustomer, newId } from '../lib/customerService.js';
import { startOperation, finishOperation } from '../lib/operations.js';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const id = newId();
  const operationId = newId();
  const profile = { id, ...(event.body ? JSON.parse(event.body) : {}) };
  await startOperation(operationId);
  try {
    const result = await createCustomer(profile);
    await finishOperation(operationId, result);
  } catch (err) {
    await finishOperation(operationId, { error: (err as Error).message });
  }
  return {
    statusCode: 202,
    body: JSON.stringify({ operationId }),
  };
};
