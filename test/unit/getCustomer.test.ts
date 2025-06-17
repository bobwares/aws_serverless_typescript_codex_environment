# App: CustomerProfileAPI
# Package: test
# File: getCustomer.test.ts
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:00:00Z
# Description: Tests for getCustomer handler.
#
import { handler } from '../../src/handlers/getCustomer.js';
import * as service from '../../src/lib/customerService.js';

describe('getCustomer', () => {
  test('returns customer when found', async () => {
    jest.spyOn(service, 'getCustomer').mockResolvedValue({ id: '1' } as any);
    const res = await handler({ pathParameters: { id: '1' } } as any);
    expect(res.statusCode).toBe(200);
  });

  test('returns 404 when missing', async () => {
    jest.spyOn(service, 'getCustomer').mockResolvedValue(null);
    const res = await handler({ pathParameters: { id: 'x' } } as any);
    expect(res.statusCode).toBe(404);
  });
});
