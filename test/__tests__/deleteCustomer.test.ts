// App: Customer API
// path: test/__tests__
// File: deleteCustomer.test.ts
// Version: 0.1.0
// Author: ServerlessArchitectBot
// Date: 2025-06-18T00:22:49Z
// Description: Unit tests for deleteCustomer handler ensuring 202
//              response and missing id error.
// 
import { handler } from '../../src/handlers/deleteCustomer';
import { docClient } from '../../src/lib/dynamodb';

jest.mock('../../src/lib/dynamodb');

describe('deleteCustomer', () => {
  beforeEach(() => {
    (docClient.send as jest.Mock).mockResolvedValue({});
  });

  it('returns 202 on delete', async () => {
    const result = await handler({ pathParameters: { id: 'x' } });
    expect(result.statusCode).toBe(202);
  });

  it('returns 400 when id missing', async () => {
    const result = await handler({});
    expect(result.statusCode).toBe(400);
  });
});
