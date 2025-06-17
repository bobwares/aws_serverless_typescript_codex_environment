/*
# App: CustomerProfileAPI
# Package: handlers
# File: worker.ts
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:29:04Z
# Description: SQS consumer to execute profile operations.
*/

interface QueueMessage { action: string; profile?: Record<string, unknown>; id?: string; update?: Record<string, unknown>; operationId: string; }

import { SQSEvent } from 'aws-lambda';
import { ddb, TABLE_NAME } from '../lib/db.js';
import { PutCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { completeOperation } from '../lib/operations.js';

export async function handler(event: SQSEvent): Promise<void> {
  for (const record of event.Records) {
    const msg = JSON.parse(record.body) as QueueMessage;
    try {
      if (msg.action === 'create' || msg.action === 'update') {
        await ddb.send(
          new PutCommand({
            TableName: TABLE_NAME,
            Item: {
              pk: `CUST#${msg.profile.id ?? msg.id}`,
              sk: 'META',
              data: msg.profile,
              gsi1pk: `EMAIL#${msg.profile.emails[0]}`,
            },
          }),
        );
      } else if (msg.action === 'patch') {
        await ddb.send(
          new UpdateCommand({
            TableName: TABLE_NAME,
            Key: { pk: `CUST#${msg.id}`, sk: 'META' },
            UpdateExpression: 'set data = :u',
            ExpressionAttributeValues: { ':u': msg.update },
          }),
        );
      } else if (msg.action === 'delete') {
        await ddb.send(
          new DeleteCommand({ TableName: TABLE_NAME, Key: { pk: `CUST#${msg.id}`, sk: 'META' } }),
        );
      }
      await completeOperation(msg.operationId, 'SUCCEEDED');
    } catch (err) {
      await completeOperation(msg.operationId, 'FAILED');
    }
  }
}
