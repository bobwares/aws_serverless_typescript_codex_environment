// App: Customer API
// path: test/__tests__
// File: patchCustomer.test.ts
// Version: 0.1.0
// Author: ServerlessArchitectBot
// Date: 2025-06-18T00:22:49Z
// Description: Unit tests for patchCustomer handler covering success and
//              validation error scenarios.
// 
import { handler } from '../../src/handlers/patchCustomer';
import { docClient } from '../../src/lib/dynamodb';

jest.mock('../../src/lib/dynamodb');

describe('patchCustomer', () => {
  beforeEach(() => {
    (docClient.send as jest.Mock).mockReset();
  });

  it('returns 202 when patch valid', async () => {
    (docClient.send as jest.Mock)
      .mockResolvedValueOnce({
        Item: {
          data: {
            id: "123e4567-e89b-12d3-a456-426614174000",
            emails: ['e@example.com'],
            firstName: 'f',
            lastName: 'l',
            privacySettings: { marketingEmailsEnabled: true, twoFactorEnabled: false },
          },
        },
      })
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({});
    const result = await handler({ pathParameters: { id: "123e4567-e89b-12d3-a456-426614174000" }, body: JSON.stringify({ firstName: 'New' }) });
    expect(result.statusCode).toBe(202);
  });

  it('returns 404 when item missing', async () => {
    (docClient.send as jest.Mock).mockResolvedValueOnce({});
    const result = await handler({ pathParameters: { id: 'x' }, body: '{}' });
    expect(result.statusCode).toBe(404);
  });
});
