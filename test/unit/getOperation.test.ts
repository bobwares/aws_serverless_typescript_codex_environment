# App: CustomerProfileAPI
# Package: test
# File: getOperation.test.ts
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:00:00Z
# Description: Tests for getOperation handler.
#
import { handler } from '../../src/handlers/getOperation.js';
import * as ops from '../../src/lib/operations.js';

describe('getOperation', () => {
  test('returns status', async () => {
    jest.spyOn(ops, 'getOperation').mockResolvedValue({ id: '1', status: 'SUCCEEDED' });
    const res = await handler({ pathParameters: { id: '1' } } as any);
    expect(res.statusCode).toBe(200);
  });

  test('returns 404 when missing', async () => {
    jest.spyOn(ops, 'getOperation').mockResolvedValue(null);
    const res = await handler({ pathParameters: { id: 'x' } } as any);
    expect(res.statusCode).toBe(404);
  });
});
