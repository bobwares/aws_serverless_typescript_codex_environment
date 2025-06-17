/*
# App: CustomerProfileAPI
# Package: handlers
# File: operationStatus.ts
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:29:04Z
# Description: Handler to return asynchronous operation status.
*/

import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { getOperation } from '../lib/operations.js';

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyStructuredResultV2> {
  const { id } = event.pathParameters as { id: string };
  const op = await getOperation(id);
  if (!op) return { statusCode: 404, body: 'Not Found' };
  return { statusCode: 200, body: JSON.stringify(op) };
}
