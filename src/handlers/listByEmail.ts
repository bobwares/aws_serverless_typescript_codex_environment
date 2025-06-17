/*
# App: CustomerProfileAPI
# Package: handlers
# File: listByEmail.ts
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:29:04Z
# Description: Handler to search customer profiles by email using GSI.
*/

import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { ddb, TABLE_NAME, GSI1_NAME } from '../lib/db.js';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyStructuredResultV2> {
  const email = event.queryStringParameters?.email;
  if (!email) return { statusCode: 400, body: 'email required' };
  const res = await ddb.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: GSI1_NAME,
      KeyConditionExpression: 'gsi1pk = :e',
      ExpressionAttributeValues: { ':e': `EMAIL#${email}` },
    }),
  );
  const items = res.Items?.map((i) => i.data) ?? [];
  return { statusCode: 200, body: JSON.stringify(items) };
}
