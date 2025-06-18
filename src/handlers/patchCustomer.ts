// App: Customer API
// path: src/handlers
// File: patchCustomer.ts
// Version: 0.1.0
// Author: ServerlessArchitectBot
// Date: 2025-06-18T00:22:49Z
// Description: Lambda handler to partially update a CustomerProfile.
//              Merges provided fields with the existing record and
//              validates the final object before storing.
//
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../lib/dynamodb";
import { validateProfile } from "../lib/validation";
import { v4 as uuidv4 } from "uuid";

const TABLE_NAME = process.env.TABLE_NAME as string;

export async function handler(event: {
  pathParameters?: { id?: string };
  body: string;
}) {
  const id = event.pathParameters?.id;
  if (!id) return { statusCode: 400, body: "Missing id" };

  let patch: any;
  try {
    patch = JSON.parse(event.body ?? "{}");
  } catch {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  const existing = await docClient.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { pk: `CUS#${id}`, sk: "PROFILE" },
    }),
  );
  if (!existing.Item) return { statusCode: 404, body: "Not found" };

  const updated = { ...existing.Item.data, ...patch, id };
  validateProfile(updated);

  const opId = uuidv4();
  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        pk: `CUS#${id}`,
        sk: "PROFILE",
        gsi1pk: `EMAIL#${updated.emails[0]}`,
        gsi1sk: "PROFILE",
        data: updated,
      },
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
