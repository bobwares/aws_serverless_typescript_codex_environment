# App: CustomerProfileAPI
# Package: test
# File: createCustomer.test.ts
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:00:00Z
# Description: Tests for createCustomer handler.
#
import { handler } from '../../src/handlers/createCustomer.js';
import * as service from '../../src/lib/customerService.js';
import * as ops from '../../src/lib/operations.js';

describe('createCustomer', () => {
  test('returns 202', async () => {
    jest.spyOn(service, 'createCustomer').mockResolvedValue({ id: '1', emails: ['a@b.c'], firstName: 'A', lastName: 'B', privacySettings: { marketingEmailsEnabled: true, twoFactorEnabled: true } });
    jest.spyOn(ops, 'startOperation').mockResolvedValue();
    jest.spyOn(ops, 'finishOperation').mockResolvedValue();
    const res = await handler({ body: '{}' } as any);
    expect(res.statusCode).toBe(202);
  });

  test('validation error recorded', async () => {
    jest.spyOn(service, 'createCustomer').mockRejectedValue(new Error('Validation error'));
    jest.spyOn(ops, 'startOperation').mockResolvedValue();
    jest.spyOn(ops, 'finishOperation').mockResolvedValue();
    const res = await handler({ body: '{}' } as any);
    expect(res.statusCode).toBe(202);
  });
});
