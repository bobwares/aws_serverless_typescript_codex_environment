# App: CustomerProfileAPI
# Package: handlers
# File: getCustomer.ts
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:00:00Z
# Description: Lambda handler for retrieving a customer profile.
#
import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { getCustomer } from '../lib/customerService.js';

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const id = event.pathParameters?.id as string;
  const customer = await getCustomer(id);
  return {
    statusCode: customer ? 200 : 404,
    body: customer ? JSON.stringify(customer) : 'Not Found',
  };
};
