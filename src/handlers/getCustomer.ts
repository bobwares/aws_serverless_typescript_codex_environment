// App: CustomerAPI
// Directory: src/handlers
// File: getCustomer.ts
// Version: 0.1.1
// Author: ServerlessArchitectBot
// Date: 2025-06-18
// Description: Get customer profile handler.

import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';
import { getCustomer } from '../repositories/customerRepository';

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> {
  const id = event.pathParameters?.id as string;
  const item = await getCustomer(id);
  if (!item) {
    return { statusCode: 404, body: 'Not Found' };
  }
  return { statusCode: 200, body: JSON.stringify(item) };
}
