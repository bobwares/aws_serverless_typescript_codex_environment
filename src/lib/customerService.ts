# App: CustomerProfileAPI
# Package: lib
# File: customerService.ts
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:00:00Z
# Description: Service functions performing CRUD operations on Customer profiles.
#
import { PutCommand, GetCommand, UpdateCommand, DeleteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME } from './db.js';
import { validateProfile } from './validation.js';
import { v4 as uuidv4 } from 'uuid';

export interface CustomerProfile {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  emails: string[];
  phoneNumbers?: Array<{ type: string; number: string }>;
  address?: unknown;
  privacySettings: { marketingEmailsEnabled: boolean; twoFactorEnabled: boolean };
}

export async function createCustomer(profile: CustomerProfile): Promise<CustomerProfile> {
  validateProfile(profile);
  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        pk: `CUS#${profile.id}`,
        sk: 'PROFILE',
        gsi1pk: `EMAIL#${profile.emails[0]}`,
        gsi1sk: 'PROFILE',
        ...profile,
      },
    })
  );
  return profile;
}

export async function getCustomer(id: string): Promise<CustomerProfile | null> {
  const res = await docClient.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { pk: `CUS#${id}`, sk: 'PROFILE' } })
  );
  return res.Item as CustomerProfile | null;
}

export async function updateCustomer(id: string, profile: Partial<CustomerProfile>): Promise<CustomerProfile> {
  const existing = await getCustomer(id);
  if (!existing) throw new Error('NotFound');
  const updated = { ...existing, ...profile } as CustomerProfile;
  validateProfile(updated);
  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        pk: `CUS#${id}`,
        sk: 'PROFILE',
        gsi1pk: `EMAIL#${updated.emails[0]}`,
        gsi1sk: 'PROFILE',
        ...updated,
      },
    })
  );
  return updated;
}

export async function deleteCustomer(id: string): Promise<void> {
  await docClient.send(
    new DeleteCommand({ TableName: TABLE_NAME, Key: { pk: `CUS#${id}`, sk: 'PROFILE' } })
  );
}

export async function searchCustomer(email: string): Promise<CustomerProfile | null> {
  const res = await docClient.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'gsi1',
      KeyConditionExpression: 'gsi1pk = :pk and gsi1sk = :sk',
      ExpressionAttributeValues: { ':pk': `EMAIL#${email}`, ':sk': 'PROFILE' },
    })
  );
  return res.Items && res.Items[0] ? (res.Items[0] as CustomerProfile) : null;
}

export function newId(): string {
  return uuidv4();
}
