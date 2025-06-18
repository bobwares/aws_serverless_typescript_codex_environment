// App: Customer API
// path: src/handlers
// File: getCustomer.ts
// Version: 0.1.0
// Author: ServerlessArchitectBot
// Date: 2025-06-18T00:22:49Z
// Description: Lambda handler returning a CustomerProfile by identifier.
//              Queries DynamoDB using the pk and returns the stored
//              profile data or 404 if not found.
//
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../lib/dynamodb";

const TABLE_NAME = process.env.TABLE_NAME as string;

export async function handler(event: { pathParameters?: { id?: string } }) {
  const id = event.pathParameters?.id;
  if (!id) {
    return { statusCode: 400, body: "Missing id" };
  }

  const result = await docClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { pk: `CUS#${id}`, sk: "PROFILE" },
    }),
  );

  if (!result.Item) {
    return { statusCode: 404, body: "Not found" };
  }

  return { statusCode: 200, body: JSON.stringify(result.Item.data) };
}
