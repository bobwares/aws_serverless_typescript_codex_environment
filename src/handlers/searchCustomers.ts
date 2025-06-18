// App: Customer API
// path: src/handlers
// File: searchCustomers.ts
// Version: 0.1.0
// Author: ServerlessArchitectBot
// Date: 2025-06-18T00:22:49Z
// Description: Lambda handler to search for a CustomerProfile by email
//              using the DynamoDB GSI. Returns the customer profile if
//              found, otherwise 404.
//
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../lib/dynamodb";

const TABLE_NAME = process.env.TABLE_NAME as string;

export async function handler(event: {
  queryStringParameters?: { email?: string };
}) {
  const email = event.queryStringParameters?.email;
  if (!email) return { statusCode: 400, body: "Missing email" };

  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: "gsi1",
      KeyConditionExpression: "gsi1pk = :pk and gsi1sk = :sk",
      ExpressionAttributeValues: {
        ":pk": `EMAIL#${email}`,
        ":sk": "PROFILE",
      },
    }),
  );

  if (!result.Items || result.Items.length === 0) {
    return { statusCode: 404, body: "Not found" };
  }

  return { statusCode: 200, body: JSON.stringify(result.Items[0].data) };
}
