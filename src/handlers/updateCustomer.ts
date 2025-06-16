//  App: Customer API
//  Package: handlers
//  File: updateCustomer.ts
//  Version: 0.1.0
//  Author: ServerlessArchitectBot
//  Date: 2025-06-16T21:44:52Z
//  Description: Lambda handler to replace a customer profile.
// 
import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { ddb } from '../lib/dynamo.js';
import { assertValidProfile } from '../lib/validators.js';
import { authorize } from '../lib/auth.js';
import { recordSuccess } from '../lib/operations.js';

const TABLE_NAME = process.env.TABLE_NAME as string;

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> => {
  authorize(event);
  const id = event.pathParameters?.id as string;
  const body = event.body ? JSON.parse(event.body) : {};
  body.id = id;
  assertValidProfile(body);
  await ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: { pk: id, sk: 'PROFILE', ...body } }));
  const op = await recordSuccess();
  return { statusCode: 202, body: JSON.stringify({ operationId: op.id }) };
};
