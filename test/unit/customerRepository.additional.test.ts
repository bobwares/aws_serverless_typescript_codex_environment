// App: CustomerAPI
// Directory: test/unit
// File: customerRepository.additional.test.ts
// Version: 0.1.1
// Author: ServerlessArchitectBot
// Date: 2025-06-18
// Description: Additional repository tests for delete and search.

import { jest } from '@jest/globals';
import { DeleteCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import type { CustomerProfile } from '../../src/types';

const sendMock = jest.fn() as any;

jest.unstable_mockModule('../../src/utils/db', () => ({ ddb: { send: sendMock } }));

let repo: typeof import('../../src/repositories/customerRepository');

beforeAll(async () => {
  repo = await import('../../src/repositories/customerRepository');
  process.env.CUSTOMERS_TABLE = 'CustomersTable';
});

afterEach(() => jest.resetAllMocks());

describe('deleteCustomer', () => {
  it('issues DeleteCommand with expected key', async () => {
    sendMock.mockResolvedValueOnce({});
    await repo.deleteCustomer('c-123');
    const cmd = sendMock.mock.calls[0][0] as DeleteCommand;
    expect((cmd as any).input.Key.pk).toBe('C#c-123');
  });
});

describe('searchByEmail', () => {
  it('queries the GSI', async () => {
    const items: CustomerProfile[] = [{ id:'1', firstName:'a', lastName:'b', emails:['a@test'], privacySettings:{marketingEmailsEnabled:false,twoFactorEnabled:false} }];
    sendMock.mockResolvedValueOnce({ Items: items });
    const result = await repo.searchByEmail('a@test');
    expect(result).toEqual(items);
    const cmd = sendMock.mock.calls[0][0] as QueryCommand;
    expect((cmd as any).input.ExpressionAttributeValues[':gsi1pk']).toBe('EMAIL#a@test');
  });
});
