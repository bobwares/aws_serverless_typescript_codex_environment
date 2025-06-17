/*
# App: CustomerProfileAPI
# Package: lib
# File: operations.ts
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:29:04Z
# Description: Utilities for async operation records in DynamoDB.
*/

import { v4 as uuidv4 } from 'uuid';
import { ddb, TABLE_NAME } from './db.js';
import { PutCommand, UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

export interface Operation {
  id: string;
  status: 'IN_PROGRESS' | 'SUCCEEDED' | 'FAILED';
  message?: string;
}

export async function createOperation(): Promise<Operation> {
  const id = uuidv4();
  const operation: Operation = { id, status: 'IN_PROGRESS' };
  await ddb.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        pk: `OP#${id}`,
        sk: 'META',
        status: operation.status,
      },
    }),
  );
  return operation;
}

export async function completeOperation(id: string, status: Operation['status']): Promise<void> {
  await ddb.send(
    new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { pk: `OP#${id}`, sk: 'META' },
      UpdateExpression: 'set #s = :s',
      ExpressionAttributeNames: { '#s': 'status' },
      ExpressionAttributeValues: { ':s': status },
    }),
  );
}

export async function getOperation(id: string): Promise<Operation | null> {
  const res = await ddb.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { pk: `OP#${id}`, sk: 'META' } }),
  );
  if (!res.Item) return null;
  return { id, status: res.Item.status } as Operation;
}
