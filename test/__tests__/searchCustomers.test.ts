// App: Customer API
// path: test/__tests__
// File: searchCustomers.test.ts
// Version: 0.1.0
// Author: ServerlessArchitectBot
// Date: 2025-06-18T00:22:49Z
// Description: Unit tests for searchCustomers handler verifying email
//              search success and not-found handling.
// 
import { handler } from '../../src/handlers/searchCustomers';
import { docClient } from '../../src/lib/dynamodb';

jest.mock('../../src/lib/dynamodb');

describe('searchCustomers', () => {
  beforeEach(() => {
    (docClient.send as jest.Mock).mockReset();
  });

  it('returns 200 when found', async () => {
    (docClient.send as jest.Mock).mockResolvedValue({ Items: [{ data: { id: 'x' } }] });
    const result = await handler({ queryStringParameters: { email: 'a@b.com' } });
    expect(result.statusCode).toBe(200);
  });

  it('returns 404 when none', async () => {
    (docClient.send as jest.Mock).mockResolvedValue({ Items: [] });
    const result = await handler({ queryStringParameters: { email: 'a@b.com' } });
    expect(result.statusCode).toBe(404);
  });
});
