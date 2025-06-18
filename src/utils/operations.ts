// App: CustomerAPI
// Directory: src/utils
// File: operations.ts
// Version: 0.1.1
// Author: ServerlessArchitectBot
// Date: 2025-06-18
// Description: Helper functions for async operations.

import { v4 as uuid } from 'uuid';
import { ddb } from './db';
import { PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

const OPERATIONS_TABLE = process.env.OPERATIONS_TABLE as string;

export interface OperationItem {
  id: string;
  status: 'IN_PROGRESS' | 'SUCCEEDED' | 'FAILED';
  message?: string;
}

export async function createOperation(): Promise<OperationItem> {
  const item: OperationItem = { id: uuid(), status: 'IN_PROGRESS' };
  await ddb.send(
    new PutCommand({ TableName: OPERATIONS_TABLE, Item: item })
  );
  return item;
}

export async function getOperation(id: string): Promise<OperationItem | null> {
  const result = await ddb.send(
    new GetCommand({ TableName: OPERATIONS_TABLE, Key: { id } })
  );
  return result.Item as OperationItem | null;
}
