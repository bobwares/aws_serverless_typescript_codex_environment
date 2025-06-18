// App: CustomerAPI
// Directory: src/utils
// File: db.ts
// Version: 0.1.1
// Author: ServerlessArchitectBot
// Date: 2025-06-18
// Description: DynamoDB client helper.

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
export const ddb = DynamoDBDocumentClient.from(client);
