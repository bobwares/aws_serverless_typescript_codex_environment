import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { handler } from '../../src/handlers/getCustomer.js';

const ddbMock = mockClient(DynamoDBClient);
const docMock = mockClient(DynamoDBDocumentClient);

describe('getCustomer', () => {
  beforeEach(() => {
    ddbMock.reset();
    docMock.reset();
  });

  it('returns customer', async () => {
    docMock.on(GetCommand).resolves({ Item: { profile: { id: '1' } } });
    const event = { pathParameters: { id: '1' } };
    const res = await handler(event);
    expect(res.statusCode).toBe(200);
  });

  it('not found', async () => {
    docMock.on(GetCommand).resolves({});
    const event = { pathParameters: { id: '1' } };
    const res = await handler(event);
    expect(res.statusCode).toBe(404);
  });
});
