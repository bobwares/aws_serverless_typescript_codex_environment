// App: CustomerAPI
// Directory: src/repositories
// File: customerRepository.ts
// Version: 0.1.1
// Author: ServerlessArchitectBot
// Date: 2025-06-18
// Description: DynamoDB repository for customer profiles.

import { ddb } from "../utils/db";
import {
  PutCommand,
  GetCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { CustomerProfile } from "../types";

const TABLE_NAME = process.env.CUSTOMERS_TABLE as string;
const GSI1_NAME = "gsi1";

export async function putCustomer(profile: CustomerProfile): Promise<void> {
  await ddb.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        pk: `C#${profile.id}`,
        sk: "PROFILE",
        gsi1pk: `EMAIL#${profile.emails[0]}`,
        ...profile,
      },
    }),
  );
}

export async function getCustomer(id: string): Promise<CustomerProfile | null> {
  const result = await ddb.send(
    new GetCommand({
      TableName: TABLE_NAME,
      Key: { pk: `C#${id}`, sk: "PROFILE" },
    }),
  );
  return (result.Item ?? null) as CustomerProfile | null;
}

export async function updateCustomer(profile: CustomerProfile): Promise<void> {
  await putCustomer(profile);
}

export async function deleteCustomer(id: string): Promise<void> {
  await ddb.send(
    new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { pk: `C#${id}`, sk: "PROFILE" },
    }),
  );
}

export async function searchByEmail(email: string): Promise<CustomerProfile[]> {
  const result = await ddb.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: GSI1_NAME,
      KeyConditionExpression: "gsi1pk = :gsi1pk",
      ExpressionAttributeValues: { ":gsi1pk": `EMAIL#${email}` },
    }),
  );
  return (result.Items ?? []) as CustomerProfile[];
}
