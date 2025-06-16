//  App: Customer API
//  Package: handlers
//  File: deleteCustomer.ts
//  Version: 0.1.0
//  Author: ServerlessArchitectBot
//  Date: 2025-06-16T21:44:52Z
//  Description: Lambda handler to delete a customer profile.
// 
import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';
import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { ddb } from '../lib/dynamo.js';
import { authorize } from '../lib/auth.js';
import { recordSuccess } from '../lib/operations.js';

const TABLE_NAME = process.env.TABLE_NAME as string;

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> => {
  authorize(event);
  const id = event.pathParameters?.id as string;
  await ddb.send(new DeleteCommand({ TableName: TABLE_NAME, Key: { pk: id, sk: 'PROFILE' } }));
  const op = await recordSuccess();
  return { statusCode: 202, body: JSON.stringify({ operationId: op.id }) };
};
