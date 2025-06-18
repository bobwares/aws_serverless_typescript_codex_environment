// App: Customer API
// path: test/__tests__
// File: createCustomer.test.ts
// Version: 0.1.0
// Author: ServerlessArchitectBot
// Date: 2025-06-18T00:22:49Z
// Description: Unit tests for createCustomer handler covering success
//              and validation failure scenarios.
// 
import { handler } from '../../src/handlers/createCustomer';
import { docClient } from '../../src/lib/dynamodb';

jest.mock('../../src/lib/dynamodb');

const valid = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  firstName: 'Jane',
  lastName: 'Doe',
  emails: ['jane@example.com'],
  privacySettings: { marketingEmailsEnabled: true, twoFactorEnabled: false },
};

describe('createCustomer', () => {
  beforeEach(() => {
    (docClient.send as jest.Mock).mockResolvedValue({});
  });

  it('returns 202 when payload is valid', async () => {
    const result = await handler({ body: JSON.stringify(valid) });
    expect(result.statusCode).toBe(202);
    expect(JSON.parse(result.body)).toHaveProperty('operationId');
  });

  it('returns 400 on validation error', async () => {
    await expect(handler({ body: '{}' })).resolves.toMatchObject({ statusCode: 400 });
  });
});
