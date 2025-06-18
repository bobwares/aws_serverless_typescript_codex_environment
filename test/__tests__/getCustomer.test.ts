// App: Customer API
// path: test/__tests__
// File: getCustomer.test.ts
// Version: 0.1.0
// Author: ServerlessArchitectBot
// Date: 2025-06-18T00:22:49Z
// Description: Unit tests for getCustomer handler verifying successful
//              retrieval and not-found behaviour.
// 
import { handler } from '../../src/handlers/getCustomer';
import { docClient } from '../../src/lib/dynamodb';

jest.mock('../../src/lib/dynamodb');

describe('getCustomer', () => {
  beforeEach(() => {
    (docClient.send as jest.Mock).mockReset();
  });

  it('returns 200 when item found', async () => {
    (docClient.send as jest.Mock).mockResolvedValue({ Item: { data: { id: 'x' } } });
    const result = await handler({ pathParameters: { id: 'x' } });
    expect(result.statusCode).toBe(200);
  });

  it('returns 404 when not found', async () => {
    (docClient.send as jest.Mock).mockResolvedValue({});
    const result = await handler({ pathParameters: { id: 'x' } });
    expect(result.statusCode).toBe(404);
  });
});
