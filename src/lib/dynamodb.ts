// App: Customer API
// path: src/lib
// File: dynamodb.ts
// Version: 0.1.0
// Author: ServerlessArchitectBot
// Date: 2025-06-18T00:22:49Z
// Description: DynamoDB DocumentClient factory configured for the AWS
//              environment. Provides a singleton instance used by
//              Lambda handlers to interact with the Customer table.
//
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
export const docClient = DynamoDBDocumentClient.from(client);
