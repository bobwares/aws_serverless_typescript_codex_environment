import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
export const docClient = DynamoDBDocumentClient.from(client);

export async function putCustomer(item) {
  await docClient.send(
    new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item: item,
    }),
  );
}

export async function getCustomer(id) {
  const { Item } = await docClient.send(
    new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: { pk: `CUSTOMER#${id}`, sk: 'PROFILE' },
    }),
  );
  return Item;
}
