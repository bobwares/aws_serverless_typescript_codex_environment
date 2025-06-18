// App: Customer API
// path: test/__tests__
// File: getOperation.test.ts
// Version: 0.1.0
// Author: ServerlessArchitectBot
// Date: 2025-06-18T00:22:49Z
// Description: Unit tests for getOperation handler confirming successful
//              lookup and 404 when missing.
// 
import { handler } from '../../src/handlers/getOperation';
import { docClient } from '../../src/lib/dynamodb';

jest.mock('../../src/lib/dynamodb');

describe('getOperation', () => {
  beforeEach(() => {
    (docClient.send as jest.Mock).mockReset();
  });

  it('returns 200 when found', async () => {
    (docClient.send as jest.Mock).mockResolvedValue({ Item: { status: 'SUCCEEDED' } });
    const result = await handler({ pathParameters: { id: '1' } });
    expect(result.statusCode).toBe(200);
  });

  it('returns 404 when missing', async () => {
    (docClient.send as jest.Mock).mockResolvedValue({});
    const result = await handler({ pathParameters: { id: '1' } });
    expect(result.statusCode).toBe(404);
  });
});
