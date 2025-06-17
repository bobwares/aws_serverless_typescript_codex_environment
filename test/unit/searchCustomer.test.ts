# App: CustomerProfileAPI
# Package: test
# File: searchCustomer.test.ts
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:00:00Z
# Description: Tests for searchCustomer handler.
#
import { handler } from '../../src/handlers/searchCustomer.js';
import * as service from '../../src/lib/customerService.js';

describe('searchCustomer', () => {
  test('returns match', async () => {
    jest.spyOn(service, 'searchCustomer').mockResolvedValue({ id: '1' } as any);
    const res = await handler({ queryStringParameters: { email: 'a@b.c' } } as any);
    expect(res.statusCode).toBe(200);
  });

  test('returns 404 when missing', async () => {
    jest.spyOn(service, 'searchCustomer').mockResolvedValue(null);
    const res = await handler({ queryStringParameters: { email: 'x@y.z' } } as any);
    expect(res.statusCode).toBe(404);
  });
});
