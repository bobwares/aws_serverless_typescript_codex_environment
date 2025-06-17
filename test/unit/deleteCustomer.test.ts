# App: CustomerProfileAPI
# Package: test
# File: deleteCustomer.test.ts
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:00:00Z
# Description: Tests for deleteCustomer handler.
#
import { handler } from '../../src/handlers/deleteCustomer.js';
import * as service from '../../src/lib/customerService.js';
import * as ops from '../../src/lib/operations.js';

describe('deleteCustomer', () => {
  test('returns 202', async () => {
    jest.spyOn(service, 'deleteCustomer').mockResolvedValue();
    jest.spyOn(ops, 'startOperation').mockResolvedValue();
    jest.spyOn(ops, 'finishOperation').mockResolvedValue();
    const res = await handler({ pathParameters: { id: '1' } } as any);
    expect(res.statusCode).toBe(202);
  });

  test('handles errors', async () => {
    jest.spyOn(service, 'deleteCustomer').mockRejectedValue(new Error('fail'));
    jest.spyOn(ops, 'startOperation').mockResolvedValue();
    jest.spyOn(ops, 'finishOperation').mockResolvedValue();
    const res = await handler({ pathParameters: { id: '1' } } as any);
    expect(res.statusCode).toBe(202);
  });
});
