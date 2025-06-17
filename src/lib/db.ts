/*
# App: CustomerProfileAPI
# Package: lib
# File: db.ts
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:29:04Z
# Description: /*
*/

import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
export const ddb = DynamoDBDocumentClient.from(client);

export const TABLE_NAME = process.env.TABLE_NAME as string;
export const GSI1_NAME = 'gsi1';
