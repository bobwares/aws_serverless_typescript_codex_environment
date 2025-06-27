/**
 * App: Customer API
 * Package: services
 * File: crud_service.ts
 * Version: 0.1.0
 * Author: Codex
 * Date: 2025-06-24T21:15:51Z
 * Description: Business logic and DynamoDB data access layer implementing
 *              CRUD operations for CustomerProfile items.
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { CustomerProfile } from "../utils/validation.js";
import { instrumentDynamo } from "../utils/tracer.js";

const client = instrumentDynamo(new DynamoDBClient({}));
const ddb = DynamoDBDocumentClient.from(client);

export class CrudService {
  private readonly tableName: string = process.env.TABLE_NAME ?? "";

  private pk(id: string): string {
    return `CUSTOMER#${id}`;
  }

  async create(profile: CustomerProfile): Promise<CustomerProfile> {
    const item = {
      pk: this.pk(profile.id),
      sk: "PROFILE",
      gsi1pk: this.pk(profile.id),
      ...profile,
    };
    await ddb.send(new PutCommand({ TableName: this.tableName, Item: item }));
    return profile;
  }

  async get(id: string): Promise<CustomerProfile | null> {
    const res = await ddb.send(
      new GetCommand({
        TableName: this.tableName,
        Key: { pk: this.pk(id), sk: "PROFILE" },
      }),
    );
    return (res.Item as CustomerProfile) ?? null;
  }

  async update(profile: CustomerProfile): Promise<CustomerProfile> {
    await this.create(profile);
    return profile;
  }

  async patch(
    id: string,
    partial: Partial<CustomerProfile>,
  ): Promise<CustomerProfile | null> {
    const updateExp = Object.keys(partial)
      .map((_k, i) => `#k${i} = :v${i}`)
      .join(", ");
    const ExpressionAttributeNames = Object.fromEntries(
      Object.keys(partial).map((k, i) => [`#k${i}`, k]),
    );
    const ExpressionAttributeValues = Object.fromEntries(
      Object.entries(partial).map(([, v], i) => [`:v${i}`, v]),
    );
    const res = await ddb.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { pk: this.pk(id), sk: "PROFILE" },
        UpdateExpression: `SET ${updateExp}`,
        ExpressionAttributeNames,
        ExpressionAttributeValues,
        ReturnValues: "ALL_NEW",
      }),
    );
    return res.Attributes as CustomerProfile | null;
  }

  async delete(id: string): Promise<void> {
    await ddb.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: { pk: this.pk(id), sk: "PROFILE" },
      }),
    );
  }

  async list(): Promise<CustomerProfile[]> {
    const res = await ddb.send(new ScanCommand({ TableName: this.tableName }));
    return (res.Items as CustomerProfile[]) ?? [];
  }
}
