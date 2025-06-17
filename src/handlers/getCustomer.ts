/*
# App: CustomerProfileAPI
# Package: handlers
# File: getCustomer.ts
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:29:04Z
# Description: Handler to fetch a customer profile by id.
*/

import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { ddb, TABLE_NAME } from '../lib/db.js';
import { GetCommand } from '@aws-sdk/lib-dynamodb';

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyStructuredResultV2> {
  const { id } = event.pathParameters as { id: string };
  const res = await ddb.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { pk: `CUST#${id}`, sk: 'META' } }),
  );
  if (!res.Item) {
    return { statusCode: 404, body: 'Not Found' };
  }
  return { statusCode: 200, body: JSON.stringify(res.Item.data) };
}
