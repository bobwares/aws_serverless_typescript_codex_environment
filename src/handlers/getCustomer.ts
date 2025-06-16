//  App: Customer API
//  Package: handlers
//  File: getCustomer.ts
//  Version: 0.1.0
//  Author: ServerlessArchitectBot
//  Date: 2025-06-16T21:44:52Z
//  Description: Lambda handler to retrieve a customer profile.
// 
import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { ddb } from '../lib/dynamo.js';
import { authorize } from '../lib/auth.js';

const TABLE_NAME = process.env.TABLE_NAME as string;

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> => {
  authorize(event);
  const id = event.pathParameters?.id as string;
  const res = await ddb.send(new GetCommand({ TableName: TABLE_NAME, Key: { pk: id, sk: 'PROFILE' } }));
  if (!res.Item) {
    return { statusCode: 404, body: 'Not Found' };
  }
  return { statusCode: 200, body: JSON.stringify(res.Item) };
};
