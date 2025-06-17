# App: CustomerProfileAPI
# Package: lib
# File: operations.ts
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:00:00Z
# Description: Helper functions to manage asynchronous operation records.
#
import { PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME } from './db.js';

export interface OperationRecord {
  id: string;
  status: 'IN_PROGRESS' | 'SUCCEEDED' | 'FAILED';
  result?: unknown;
}

export async function startOperation(id: string): Promise<void> {
  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: { pk: `OP#${id}`, sk: 'STATUS', status: 'IN_PROGRESS' },
    })
  );
}

export async function finishOperation(id: string, result: unknown): Promise<void> {
  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: { pk: `OP#${id}`, sk: 'STATUS', status: 'SUCCEEDED', result },
    })
  );
}

export async function getOperation(id: string): Promise<OperationRecord | null> {
  const res = await docClient.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { pk: `OP#${id}`, sk: 'STATUS' } })
  );
  return res.Item as OperationRecord | null;
}
