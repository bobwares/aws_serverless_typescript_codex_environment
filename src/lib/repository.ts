import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { captureAWSv3Client } from 'aws-xray-sdk-core';
import { v4 as uuidv4 } from 'uuid';

const client = captureAWSv3Client(new DynamoDBClient({}));
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME as string;

export interface CustomerProfile {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  emails: string[];
  phoneNumbers?: unknown[];
  address?: unknown;
  privacySettings: unknown;
}

export async function putCustomer(profile: CustomerProfile): Promise<void> {
  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        pk: `CUS#${profile.id}`,
        sk: 'PROFILE',
        gsi1pk: `EMAIL#${profile.emails[0]}`,
        ...profile,
      },
    }),
  );
}

export async function getCustomer(id: string): Promise<CustomerProfile | undefined> {
  const { Item } = await docClient.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { pk: `CUS#${id}`, sk: 'PROFILE' } }),
  );
  return Item as CustomerProfile | undefined;
}

export async function deleteCustomer(id: string): Promise<void> {
  await docClient.send(
    new DeleteCommand({ TableName: TABLE_NAME, Key: { pk: `CUS#${id}`, sk: 'PROFILE' } }),
  );
}

export async function findByEmail(email: string): Promise<CustomerProfile[]> {
  const { Items } = await docClient.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: 'gsi1',
      KeyConditionExpression: 'gsi1pk = :e',
      ExpressionAttributeValues: { ':e': `EMAIL#${email}` },
    }),
  );
  return (Items ?? []) as CustomerProfile[];
}

export interface Operation {
  id: string;
  status: string;
  type: string;
  resourceId: string;
  createdAt: string;
}

export async function logOperation(op: Operation): Promise<void> {
  await docClient.send(
    new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        pk: `OP#${op.id}`,
        sk: 'STATUS',
        ...op,
      },
    }),
  );
}

export async function getOperation(id: string): Promise<Operation | undefined> {
  const { Item } = await docClient.send(
    new GetCommand({ TableName: TABLE_NAME, Key: { pk: `OP#${id}`, sk: 'STATUS' } }),
  );
  return Item as Operation | undefined;
}

export function generateId(): string {
  return uuidv4();
}
