//  App: Customer API
//  Package: handlers
//  File: getOperation.ts
//  Version: 0.1.0
//  Author: ServerlessArchitectBot
//  Date: 2025-06-16T21:44:52Z
//  Description: Lambda handler to fetch asynchronous operation status.
// 
import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';
import { getOperation } from '../lib/operations.js';
import { authorize } from '../lib/auth.js';

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> => {
  authorize(event);
  const id = event.pathParameters?.id as string;
  const op = await getOperation(id);
  if (!op) {
    return { statusCode: 404, body: 'Not Found' };
  }
  return { statusCode: 200, body: JSON.stringify(op) };
};
