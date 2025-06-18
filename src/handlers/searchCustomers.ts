// App: CustomerAPI
// Directory: src/handlers
// File: searchCustomers.ts
// Version: 0.1.1
// Author: ServerlessArchitectBot
// Date: 2025-06-18
// Description: Search customers by email handler.

import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';
import { searchByEmail } from '../repositories/customerRepository';

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> {
  const email = event.queryStringParameters?.email as string;
  if (!email) {
    return { statusCode: 400, body: 'email query parameter required' };
  }
  const items = await searchByEmail(email);
  return { statusCode: 200, body: JSON.stringify(items) };
}
