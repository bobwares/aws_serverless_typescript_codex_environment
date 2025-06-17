/*
# App: CustomerProfileAPI
# Package: handlers
# File: patchCustomer.ts
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:29:04Z
# Description: Handler for partially updating a customer profile asynchronously.
*/

import { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2 } from 'aws-lambda';
import { createOperation } from '../lib/operations.js';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

const sqs = new SQSClient({});
const QUEUE_URL = process.env.OP_QUEUE_URL as string;

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyStructuredResultV2> {
  const body = event.body ? JSON.parse(event.body) : {};
  const { id } = event.pathParameters as { id: string };
  const operation = await createOperation();
  await sqs.send(new SendMessageCommand({
    QueueUrl: QUEUE_URL,
    MessageBody: JSON.stringify({ action: 'patch', id, update: body, operationId: operation.id }),
  }));
  return { statusCode: 202, body: JSON.stringify({ operationId: operation.id }) };
}
