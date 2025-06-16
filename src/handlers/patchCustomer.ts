//  App: Customer API
//  Package: handlers
//  File: patchCustomer.ts
//  Version: 0.1.0
//  Author: ServerlessArchitectBot
//  Date: 2025-06-16T21:44:52Z
//  Description: Lambda handler to partially update a customer profile.
// 
import { APIGatewayProxyEventV2, APIGatewayProxyResult } from 'aws-lambda';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ddb } from '../lib/dynamo.js';
import { authorize } from '../lib/auth.js';
import { recordSuccess } from '../lib/operations.js';

const TABLE_NAME = process.env.TABLE_NAME as string;

export const handler = async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResult> => {
  authorize(event);
  const id = event.pathParameters?.id as string;
  const body = event.body ? JSON.parse(event.body) : {};
  const updateExpr = Object.keys(body)
    .map((k, i) => `#k${i} = :v${i}`)
    .join(', ');
  const exprAttrNames = Object.keys(body).reduce((acc, k, i) => ({ ...acc, [`#k${i}`]: k }), {});
  const exprAttrValues = Object.keys(body).reduce((acc, k, i) => ({ ...acc, [`:v${i}`]: body[k] }), {});
  await ddb.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { pk: id, sk: 'PROFILE' },
      UpdateExpression: `set ${updateExpr}`,
      ExpressionAttributeNames: exprAttrNames,
      ExpressionAttributeValues: exprAttrValues,
    }),
  );
  const op = await recordSuccess();
  return { statusCode: 202, body: JSON.stringify({ operationId: op.id }) };
};
