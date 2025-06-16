import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { handler } from '../../src/handlers/createCustomer.js';

const ddbMock = mockClient(DynamoDBClient);
const docMock = mockClient(DynamoDBDocumentClient);

describe('createCustomer', () => {
  beforeEach(() => {
    ddbMock.reset();
    docMock.reset();
  });

  it('creates a customer', async () => {
    docMock.on(PutCommand).resolves({});
    const event = {
      body: JSON.stringify({
        id: '11111111-1111-1111-1111-111111111111',
        firstName: 'Alice',
        lastName: 'Smith',
        emails: ['a@example.com'],
        privacySettings: {
          marketingEmailsEnabled: true,
          twoFactorEnabled: false,
        },
      }),
    };
    const res = await handler(event);
    expect(res.statusCode).toBe(201);
  });

  it('fails validation', async () => {
    const event = { body: JSON.stringify({}) };
    const res = await handler(event);
    expect(res.statusCode).toBe(400);
  });
});
