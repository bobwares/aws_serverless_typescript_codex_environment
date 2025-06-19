/**
 * App: Customer API
 * Package: services
 * File: customerService.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-19T18:24:52Z
 * Description: Provides CRUD operations for the CustomerProfile domain using a
 *              DynamoDB single-table design.
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuid } from 'uuid';
import { withXRay } from '../utils/xray.js';

export interface CustomerProfile {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  emails: string[];
  phoneNumbers?: Array<{ type: string; number: string }>;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  privacySettings: {
    marketingEmailsEnabled: boolean;
    twoFactorEnabled: boolean;
  };
}

const TABLE_NAME = process.env.TABLE_NAME as string;
const client = withXRay(new DynamoDBClient({}));
const ddb = DynamoDBDocumentClient.from(client);

function toDbItem(profile: CustomerProfile) {
  return {
    pk: `CUSTOMER#${profile.id}`,
    sk: `PROFILE#${profile.id}`,
    gsi1pk: 'PROFILE',
    gsi1sk: profile.emails[0],
    ...profile
  };
}

export async function createCustomer(profile: Omit<CustomerProfile, 'id'>): Promise<CustomerProfile> {
  const item = { ...profile, id: uuid() } as CustomerProfile;
  await ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: toDbItem(item) }));
  return item;
}

export async function getCustomer(id: string): Promise<CustomerProfile | null> {
  const res = await ddb.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { pk: `CUSTOMER#${id}`, sk: `PROFILE#${id}` } })
  );
  return (res.Item as CustomerProfile) ?? null;
}

export async function updateCustomer(profile: CustomerProfile): Promise<CustomerProfile> {
  await ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: toDbItem(profile) }));
  return profile;
}

export async function patchCustomer(id: string, partial: Partial<CustomerProfile>): Promise<CustomerProfile> {
  const existing = (await getCustomer(id)) ?? { id } as CustomerProfile;
  const updated = { ...existing, ...partial } as CustomerProfile;
  await ddb.send(new PutCommand({ TableName: TABLE_NAME, Item: toDbItem(updated) }));
  return updated;
}

export async function deleteCustomer(id: string): Promise<void> {
  await ddb.send(
    new DeleteCommand({ TableName: TABLE_NAME, Key: { pk: `CUSTOMER#${id}`, sk: `PROFILE#${id}` } })
  );
}

export async function listCustomers(): Promise<CustomerProfile[]> {
  const res = await ddb.send(new ScanCommand({ TableName: TABLE_NAME, FilterExpression: 'begins_with(pk, :prefix)', ExpressionAttributeValues: { ':prefix': 'CUSTOMER#' } }));
  return (res.Items as CustomerProfile[]) ?? [];
}
