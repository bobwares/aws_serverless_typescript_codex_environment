// App: CustomerAPI
// Directory: src/handlers
// File: deleteCustomer.ts
// Version: 0.1.1
// Author: ServerlessArchitectBot
// Date: 2025-06-18
// Description: Delete customer profile handler.

import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';
import { deleteCustomer } from '../repositories/customerRepository';
import { createOperation } from '../utils/operations';

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> {
  const id = event.pathParameters?.id as string;
  const operation = await createOperation();
  await deleteCustomer(id);
  return {
    statusCode: 202,
    body: JSON.stringify({ operationId: operation.id })
  };
}
