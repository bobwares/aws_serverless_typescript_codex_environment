# App: CustomerProfileAPI
# Package: handlers
# File: searchCustomer.ts
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:00:00Z
# Description: Lambda handler for searching a customer by email.
#
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { searchCustomer } from '../lib/customerService.js';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const email = event.queryStringParameters?.email as string;
  const customer = await searchCustomer(email);
  return {
    statusCode: customer ? 200 : 404,
    body: customer ? JSON.stringify(customer) : 'Not Found',
  };
};
