/**
 * App: Customer API
 * Package: services
 * File: customerService.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-21T00:00:00Z
 * Description: Business logic for CustomerProfile CRUD and asynchronous operation tracking.
 */

import {
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import type { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

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

export interface OperationRecord {
  id: string;
  type: string;
  status: "SUCCEEDED" | "FAILED";
  customerId: string;
  error?: string;
  createdAt: string;
}

const tableName = process.env.TABLE_NAME as string;

export class CustomerService {
  private readonly docClient: DynamoDBDocumentClient;

  constructor(docClient: DynamoDBDocumentClient) {
    this.docClient = docClient;
  }

  async create(profile: CustomerProfile): Promise<string> {
    const opId = uuidv4();
    const now = new Date().toISOString();
    const transactItems = [
      {
        Put: {
          TableName: tableName,
          Item: this.profileToItem(profile),
        },
      },
      ...profile.emails.map((email) => ({
        Put: {
          TableName: tableName,
          Item: this.emailToItem(email, profile.id),
        },
      })),
      {
        Put: {
          TableName: tableName,
          Item: this.operationItem(opId, "CREATE", profile.id, now),
        },
      },
    ];

    for (const ti of transactItems) {
      await this.docClient.send(new PutCommand(ti.Put));
    }

    return opId;
  }

  async get(id: string): Promise<CustomerProfile | undefined> {
    const res = await this.docClient.send(
      new GetCommand({
        TableName: tableName,
        Key: { pk: `CUSTOMER#${id}`, sk: "PROFILE" },
      }),
    );
    return res.Item as CustomerProfile | undefined;
  }

  async update(profile: CustomerProfile): Promise<string> {
    const opId = uuidv4();
    const now = new Date().toISOString();
    await this.docClient.send(
      new PutCommand({
        TableName: tableName,
        Item: this.profileToItem(profile),
      }),
    );
    await this.docClient.send(
      new PutCommand({
        TableName: tableName,
        Item: this.operationItem(opId, "UPDATE", profile.id, now),
      }),
    );
    return opId;
  }

  async patch(id: string, partial: Partial<CustomerProfile>): Promise<string> {
    const opId = uuidv4();
    const now = new Date().toISOString();
    const updateExpr: string[] = [];
    const exprAttrValues: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(partial)) {
      updateExpr.push(`#${k} = :${k}`);
      exprAttrValues[`:${k}`] = v as unknown;
    }
    const exprAttrNames = Object.fromEntries(
      Object.keys(partial).map((k) => [`#${k}`, k]),
    );
    await this.docClient.send(
      new UpdateCommand({
        TableName: tableName,
        Key: { pk: `CUSTOMER#${id}`, sk: "PROFILE" },
        UpdateExpression: "SET " + updateExpr.join(", "),
        ExpressionAttributeNames: exprAttrNames,
        ExpressionAttributeValues: exprAttrValues,
      }),
    );
    await this.docClient.send(
      new PutCommand({
        TableName: tableName,
        Item: this.operationItem(opId, "PATCH", id, now),
      }),
    );
    return opId;
  }

  async remove(id: string): Promise<string> {
    const opId = uuidv4();
    const now = new Date().toISOString();
    await this.docClient.send(
      new DeleteCommand({
        TableName: tableName,
        Key: { pk: `CUSTOMER#${id}`, sk: "PROFILE" },
      }),
    );
    await this.docClient.send(
      new PutCommand({
        TableName: tableName,
        Item: this.operationItem(opId, "DELETE", id, now),
      }),
    );
    return opId;
  }

  async list(): Promise<CustomerProfile[]> {
    const res = await this.docClient.send(
      new QueryCommand({
        TableName: tableName,
        IndexName: "gsi1",
        KeyConditionExpression: "gsi1pk = :gsi1pk",
        ExpressionAttributeValues: { ":gsi1pk": "PROFILE" },
      }),
    );
    return (res.Items ?? []) as CustomerProfile[];
  }

  async searchByEmail(email: string): Promise<CustomerProfile | undefined> {
    const lookup = await this.docClient.send(
      new QueryCommand({
        TableName: tableName,
        IndexName: "gsi1",
        KeyConditionExpression: "gsi1pk = :e and gsi1sk = :e",
        ExpressionAttributeValues: { ":e": `EMAIL#${email}` },
        Limit: 1,
      }),
    );
    if (!lookup.Items?.length) return undefined;
    const item = lookup.Items[0];
    const id = (item.sk as string).replace("CUSTOMER#", "");
    return this.get(id);
  }

  async getOperation(opId: string): Promise<OperationRecord | undefined> {
    const res = await this.docClient.send(
      new GetCommand({
        TableName: tableName,
        Key: { pk: `OPERATION#${opId}`, sk: "STATUS" },
      }),
    );
    return res.Item as OperationRecord | undefined;
  }

  private profileToItem(profile: CustomerProfile): Record<string, unknown> {
    return {
      pk: `CUSTOMER#${profile.id}`,
      sk: "PROFILE",
      gsi1pk: "PROFILE",
      gsi1sk: profile.id,
      ...profile,
    };
  }

  private emailToItem(email: string, id: string): Record<string, unknown> {
    return {
      pk: `CUSTOMER#${id}`,
      sk: `EMAIL#${email}`,
      gsi1pk: `EMAIL#${email}`,
      gsi1sk: `CUSTOMER#${id}`,
    };
  }

  private operationItem(
    opId: string,
    type: string,
    id: string,
    when: string,
  ): Record<string, unknown> {
    return {
      pk: `OPERATION#${opId}`,
      sk: "STATUS",
      gsi1pk: "OPERATION",
      gsi1sk: when,
      id: opId,
      type,
      status: "SUCCEEDED",
      customerId: id,
      createdAt: when,
    };
  }
}
