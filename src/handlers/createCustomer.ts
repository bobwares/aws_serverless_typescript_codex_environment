// App: CustomerAPI
// Directory: src/handlers
// File: createCustomer.ts
// Version: 0.1.1
// Author: ServerlessArchitectBot
// Date: 2025-06-18
// Description: Create customer profile handler.

import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';
import { validateProfile } from '../utils/validate';
import { putCustomer } from '../repositories/customerRepository';
import { createOperation } from '../utils/operations';
import { CustomerProfile } from '../types';

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> {
  const body = event.body ? JSON.parse(event.body) : {};
  validateProfile(body);
  const operation = await createOperation();
  await putCustomer(body as CustomerProfile);
  return {
    statusCode: 202,
    body: JSON.stringify({ operationId: operation.id })
  };
}
