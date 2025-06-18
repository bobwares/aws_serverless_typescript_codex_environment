// App: CustomerAPI
// Directory: test/unit
// File: createCustomer.test.ts
// Version: 0.1.7
// Author: ServerlessArchitectBot
// Date: 2025-06-18
// Description: Verifies putCustomer and updateCustomer send correct DynamoDB commands

import { jest } from '@jest/globals';
import type { CustomerProfile } from '../../src/types';
import { PutCommand } from '@aws-sdk/lib-dynamodb';

/* typed mock — returns a Promise */
const sendMock = jest.fn<Promise<any>>();

jest.unstable_mockModule('../../src/utils/db', () => ({
  ddb: { send: sendMock }
}));

let repo: typeof import('../../src/repositories/customerRepository');
beforeAll(async () => {
  repo = await import('../../src/repositories/customerRepository');
  process.env.CUSTOMERS_TABLE = 'CustomersTable';
});

afterEach(() => jest.resetAllMocks());

const sample: CustomerProfile = {
  id: 'c-456',
  firstName: 'John',
  lastName: 'Smith',
  emails: ['john@example.com'],
  phoneNumbers: [{ type: 'mobile', number: '+1234567890' }],
  address: {
    line1: '99 Market St.',
    city: 'Metropolis',
    state: 'NY',
    postalCode: '10001',
    country: 'USA'
  },
  privacySettings: { marketingEmailsEnabled: false, twoFactorEnabled: true }
};

describe('customerRepository.putCustomer', () => {
  it('sends expected PutCommand', async () => {
    sendMock.mockResolvedValueOnce({});

    await repo.putCustomer(sample);

    const cmd = sendMock.mock.calls[0][0] as PutCommand;
    const item = (cmd as any).input.Item;
    expect(item.pk).toBe('C#c-456');
    expect(item.gsi1pk).toBe('EMAIL#john@example.com');
  });
});

describe('customerRepository.updateCustomer', () => {
  it('delegates to putCustomer', async () => {
    sendMock.mockResolvedValueOnce({});
    await repo.updateCustomer(sample);

    const cmd = sendMock.mock.calls[0][0] as PutCommand;
    expect((cmd as any).input.Item.id).toBe('c-456');
  });
});
