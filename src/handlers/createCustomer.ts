// App: Customer API
// path: src/handlers
// File: createCustomer.ts
// Version: 0.1.0
// Author: ServerlessArchitectBot
// Date: 2025-06-18T00:22:49Z
// Description: Lambda handler to create a new CustomerProfile. Validates
//              the request body against the schema, stores the item in
//              DynamoDB, and records an operation result. Returns 202
//              Accepted with the operation identifier.
//
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../lib/dynamodb";
import { validateProfile } from "../lib/validation";
import { v4 as uuidv4 } from "uuid";

const TABLE_NAME = process.env.TABLE_NAME as string;

export async function handler(event: { body: string }) {
  let data: any;
  try {
    data = JSON.parse(event.body ?? "{}");
    validateProfile(data);
  } catch (err) {
    return { statusCode: 400, body: (err as Error).message };
  }

  const opId = uuidv4();

  const item = {
    pk: `CUS#${data.id}`,
    sk: "PROFILE",
    gsi1pk: `EMAIL#${data.emails[0]}`,
    gsi1sk: "PROFILE",
    data,
  };
  await docClient.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        pk: `OP#${opId}`,
        sk: "META",
        status: "SUCCEEDED",
      },
    }),
  );

  return {
    statusCode: 202,
    body: JSON.stringify({ operationId: opId }),
  };
}
