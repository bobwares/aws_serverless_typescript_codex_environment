// App: Customer API
// path: test/__tests__
// File: updateCustomer.test.ts
// Version: 0.1.0
// Author: ServerlessArchitectBot
// Date: 2025-06-18T00:22:49Z
// Description: Unit tests for updateCustomer handler verifying success
//              and validation error paths.
// 
import { handler } from '../../src/handlers/updateCustomer';
import { docClient } from '../../src/lib/dynamodb';

jest.mock('../../src/lib/dynamodb');

const valid = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  firstName: 'Jane',
  lastName: 'Doe',
  emails: ['jane@example.com'],
  privacySettings: { marketingEmailsEnabled: true, twoFactorEnabled: false },
};

describe('updateCustomer', () => {
  beforeEach(() => {
    (docClient.send as jest.Mock).mockResolvedValue({});
  });

  it('returns 202 on success', async () => {
    const result = await handler({ body: JSON.stringify(valid) });
    expect(result.statusCode).toBe(202);
  });

  it('returns 400 on invalid', async () => {
    const result = await handler({ body: '{}' });
    expect(result.statusCode).toBe(400);
  });
});
