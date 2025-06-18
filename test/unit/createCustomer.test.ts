// App: CustomerAPI
// Directory: test/unit
// File: createCustomer.test.ts
// Version: 0.1.1
// Author: ServerlessArchitectBot
// Date: 2025-06-18
// Description: Unit test for createCustomer handler.

import { handler } from '../../src/handlers/createCustomer';
import * as repo from '../../src/repositories/customerRepository';
import * as ops from '../../src/utils/operations';

jest.mock('../../src/repositories/customerRepository');
jest.mock('../../src/utils/operations');

const mockPut = repo.putCustomer as jest.Mock;
const mockOp = ops.createOperation as jest.Mock;

mockOp.mockResolvedValue({ id: 'op-1', status: 'IN_PROGRESS' });

const validBody = {
  id: 'id',
  firstName: 'a',
  lastName: 'b',
  emails: ['a@b.com'],
  privacySettings: { marketingEmailsEnabled: true, twoFactorEnabled: false }
};

describe('createCustomer', () => {
  it('returns 202', async () => {
    mockPut.mockResolvedValue(null);
    const result = await handler({ body: JSON.stringify(validBody) } as any);
    expect(result.statusCode).toBe(202);
  });
});
