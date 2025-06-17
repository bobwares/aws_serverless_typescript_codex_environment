# App: CustomerProfileAPI
# Package: test
# File: updateCustomer.test.ts
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:00:00Z
# Description: Tests for updateCustomer handler.
#
import { handler } from '../../src/handlers/updateCustomer.js';
import * as service from '../../src/lib/customerService.js';
import * as ops from '../../src/lib/operations.js';

describe('updateCustomer', () => {
  test('returns 202', async () => {
    jest.spyOn(service, 'updateCustomer').mockResolvedValue({ id: '1' } as any);
    jest.spyOn(ops, 'startOperation').mockResolvedValue();
    jest.spyOn(ops, 'finishOperation').mockResolvedValue();
    const res = await handler({ pathParameters: { id: '1' }, body: '{}' } as any);
    expect(res.statusCode).toBe(202);
  });

  test('handles errors', async () => {
    jest.spyOn(service, 'updateCustomer').mockRejectedValue(new Error('fail'));
    jest.spyOn(ops, 'startOperation').mockResolvedValue();
    jest.spyOn(ops, 'finishOperation').mockResolvedValue();
    const res = await handler({ pathParameters: { id: '1' }, body: '{}' } as any);
    expect(res.statusCode).toBe(202);
  });
});
