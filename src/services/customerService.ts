/**
 * App: Customer API
 * Package: services
 * File: customerService.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-19T19:00:00Z
 * Description: Implements business logic and data access for customer profiles
 *              using DynamoDB single-table design with GSI gsi1.
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { createXRayDynamoClient } from "../utils/xray.js";
import { logger } from "../utils/logger.js";

export interface PhoneNumber {
  type: "mobile" | "home" | "work" | "other";
  number: string;
}

export interface PostalAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PrivacySettings {
  marketingEmailsEnabled: boolean;
  twoFactorEnabled: boolean;
}

export interface CustomerProfile {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  emails: string[];
  phoneNumbers?: PhoneNumber[];
  address?: PostalAddress;
  privacySettings: PrivacySettings;
}

const tableName = process.env.TABLE_NAME as string;

const baseClient = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(createXRayDynamoClient(baseClient));

export async function createCustomer(
  profile: Omit<CustomerProfile, "id">,
): Promise<CustomerProfile> {
  const item: CustomerProfile = { ...profile, id: uuidv4() };
  logger.debug("Saving customer", { item });
  await ddb.send(
    new PutCommand({
      TableName: tableName,
      Item: {
        pk: `CUST#${item.id}`,
        sk: "PROFILE",
        gsi1pk: "CUSTOMERS",
        gsi1sk: item.lastName,
        ...item,
      },
    }),
  );
  return item;
}

export async function getCustomer(id: string): Promise<CustomerProfile | null> {
  const result = await ddb.send(
    new GetCommand({
      TableName: tableName,
      Key: { pk: `CUST#${id}`, sk: "PROFILE" },
    }),
  );
  return (result.Item as CustomerProfile) || null;
}

export async function updateCustomer(
  id: string,
  profile: CustomerProfile,
): Promise<CustomerProfile> {
  await ddb.send(
    new PutCommand({
      TableName: tableName,
      Item: {
        pk: `CUST#${id}`,
        sk: "PROFILE",
        gsi1pk: "CUSTOMERS",
        gsi1sk: profile.lastName,
        ...profile,
      },
    }),
  );
  return profile;
}

export async function patchCustomer(
  id: string,
  partial: Partial<CustomerProfile>,
): Promise<CustomerProfile | null> {
  const existing = await getCustomer(id);
  if (!existing) return null;
  const updated = { ...existing, ...partial };
  await updateCustomer(id, updated);
  return updated;
}

export async function deleteCustomer(id: string): Promise<void> {
  await ddb.send(
    new DeleteCommand({
      TableName: tableName,
      Key: { pk: `CUST#${id}`, sk: "PROFILE" },
    }),
  );
}

export async function listCustomers(): Promise<CustomerProfile[]> {
  const result = await ddb.send(
    new QueryCommand({
      TableName: tableName,
      IndexName: "gsi1",
      KeyConditionExpression: "gsi1pk = :pk",
      ExpressionAttributeValues: { ":pk": "CUSTOMERS" },
    }),
  );
  return (result.Items as CustomerProfile[]) || [];
}
