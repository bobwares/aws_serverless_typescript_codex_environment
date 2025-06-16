//  App: Customer API
//  Package: lib
//  File: operations.ts
//  Version: 0.1.0
//  Author: ServerlessArchitectBot
//  Date: 2025-06-16T21:44:52Z
//  Description: Utilities for asynchronous operation tracking.
// 
import { PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { ddb } from './dynamo.js';

const TABLE_NAME = process.env.TABLE_NAME as string;

export interface Operation {
  id: string;
  status: 'SUCCEEDED' | 'FAILED';
  startedAt: string;
  endedAt: string;
}

export async function recordSuccess(): Promise<Operation> {
  const op: Operation = {
    id: uuidv4(),
    status: 'SUCCEEDED',
    startedAt: new Date().toISOString(),
    endedAt: new Date().toISOString(),
  };
  await ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: { pk: `OP#${op.id}`, sk: 'STATUS', ...op } }));
  return op;
}

export async function getOperation(id: string): Promise<Operation | undefined> {
  const res = await ddb.send(new GetCommand({ TableName: TABLE_NAME, Key: { pk: `OP#${id}`, sk: 'STATUS' } }));
  return res.Item as Operation | undefined;
}
