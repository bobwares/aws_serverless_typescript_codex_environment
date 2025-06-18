// App: CustomerAPI
// Directory: test/unit
// File: getCustomer.test.ts
// Version: 0.1.1
// Author: ServerlessArchitectBot
// Date: 2025-06-18
// Description: Unit test for getCustomer handler.

import { handler } from '../../src/handlers/getCustomer';
import * as repo from '../../src/repositories/customerRepository';

jest.mock('../../src/repositories/customerRepository');

const mockGet = repo.getCustomer as jest.Mock;

describe('getCustomer', () => {
  it('returns 404 when not found', async () => {
    mockGet.mockResolvedValue(null);
    const result = await handler({ pathParameters: { id: '1' } } as any);
    expect(result.statusCode).toBe(404);
  });
});
