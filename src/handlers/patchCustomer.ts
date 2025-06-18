// App: CustomerAPI
// Directory: src/handlers
// File: patchCustomer.ts
// Version: 0.1.1
// Author: ServerlessArchitectBot
// Date: 2025-06-18
// Description: Patch update customer profile handler.

import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';
import { getCustomer, updateCustomer } from '../repositories/customerRepository';
import { createOperation } from '../utils/operations';
import { validateProfile } from '../utils/validate';

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> {
  const id = event.pathParameters?.id as string;
  const existing = await getCustomer(id);
  if (!existing) {
    return { statusCode: 404, body: 'Not Found' };
  }
  const body = event.body ? JSON.parse(event.body) : {};
  const merged = { ...existing, ...body };
  validateProfile(merged);
  const operation = await createOperation();
  await updateCustomer(merged);
  return {
    statusCode: 202,
    body: JSON.stringify({ operationId: operation.id })
  };
}
