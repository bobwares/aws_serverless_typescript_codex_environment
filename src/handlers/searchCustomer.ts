//  App: Customer API
//  Package: handlers
//  File: searchCustomer.ts
//  Version: 0.1.0
//  Author: ServerlessArchitectBot
//  Date: 2025-06-16T21:44:52Z
//  Description: Lambda handler to search customer profiles by email.
// 
import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';
import { QueryCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { ddb } from '../lib/dynamo.js';
import { authorize } from '../lib/auth.js';

const TABLE_NAME = process.env.TABLE_NAME as string;

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> => {
  authorize(event);
  const email = event.queryStringParameters?.email?.toLowerCase();
  if (!email) {
    return { statusCode: 400, body: 'email query parameter required' };
  }
  const q = await ddb.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'gsi1',
      KeyConditionExpression: 'gsi1pk = :e',
      ExpressionAttributeValues: { ':e': `EMAIL#${email}` },
      Limit: 1,
    }),
  );
  if (!q.Items?.length) {
    return { statusCode: 404, body: 'Not Found' };
  }
  const id = q.Items[0].gsi1sk as string;
  const res = await ddb.send(new GetCommand({ TableName: TABLE_NAME, Key: { pk: id, sk: 'PROFILE' } }));
  return { statusCode: 200, body: JSON.stringify(res.Item) };
};
