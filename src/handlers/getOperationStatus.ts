// App: CustomerAPI
// Directory: src/handlers
// File: getOperationStatus.ts
// Version: 0.1.1
// Author: ServerlessArchitectBot
// Date: 2025-06-18
// Description: Get async operation status.

import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';
import { getOperation } from '../utils/operations';

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> {
  const id = event.pathParameters?.id as string;
  const item = await getOperation(id);
  if (!item) {
    return { statusCode: 404, body: 'Not Found' };
  }
  return { statusCode: 200, body: JSON.stringify(item) };
}
