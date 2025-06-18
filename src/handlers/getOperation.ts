// App: Customer API
// path: src/handlers
// File: getOperation.ts
// Version: 0.1.0
// Author: ServerlessArchitectBot
// Date: 2025-06-18T00:22:49Z
// Description: Lambda handler that retrieves the status of an asynchronous
//              operation recorded in DynamoDB. Returns 404 when the
//              operation is unknown.
//
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../lib/dynamodb";

const TABLE_NAME = process.env.TABLE_NAME as string;

export async function handler(event: { pathParameters?: { id?: string } }) {
  const id = event.pathParameters?.id;
  if (!id) return { statusCode: 400, body: "Missing id" };

  const result = await docClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { pk: `OP#${id}`, sk: "META" },
    }),
  );
  if (!result.Item) return { statusCode: 404, body: "Not found" };

  return { statusCode: 200, body: JSON.stringify(result.Item) };
}
