// App: Customer API
// path: src/handlers
// File: deleteCustomer.ts
// Version: 0.1.0
// Author: ServerlessArchitectBot
// Date: 2025-06-18T00:22:49Z
// Description: Lambda handler to delete a CustomerProfile record. Removes
//              the profile item and records an asynchronous operation
//              indicating success.
//
import { DeleteCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../lib/dynamodb";
import { v4 as uuidv4 } from "uuid";

const TABLE_NAME = process.env.TABLE_NAME as string;

export async function handler(event: { pathParameters?: { id?: string } }) {
  const id = event.pathParameters?.id;
  if (!id) return { statusCode: 400, body: "Missing id" };

  const opId = uuidv4();
  await docClient.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { pk: `CUS#${id}`, sk: "PROFILE" },
    }),
  );
  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: { pk: `OP#${opId}`, sk: "META", status: "SUCCEEDED" },
    }),
  );
  return { statusCode: 202, body: JSON.stringify({ operationId: opId }) };
}
