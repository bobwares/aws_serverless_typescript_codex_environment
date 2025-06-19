// App: CustomerAPI
// Directory: test/unit
// File: getCustomer.test.ts
// Version: 0.1.7
// Author: ServerlessArchitectBot
// Date: 2025-06-18
// Description: Validates getCustomer with a stubbed DynamoDB client

import { jest } from '@jest/globals';
import type { CustomerProfile } from '../../src/types';
import { GetCommand } from '@aws-sdk/lib-dynamodb';

/* typed mock — returns a Promise */
const sendMock = jest.fn() as any;

jest.unstable_mockModule('../../src/utils/db', () => ({
  ddb: { send: sendMock }
}));

let repo: typeof import('../../src/repositories/customerRepository');
beforeAll(async () => {
  repo = await import('../../src/repositories/customerRepository');
  process.env.CUSTOMERS_TABLE = 'CustomersTable';
});

afterEach(() => jest.resetAllMocks());

describe('customerRepository.getCustomer', () => {
  it('returns the customer profile when it exists', async () => {
    const expected: CustomerProfile = {
      id: 'c-123',
      firstName: 'Jane',
      lastName: 'Doe',
      emails: ['jane@example.com'],
      phoneNumbers: [{ type: 'mobile', number: '+15551234567' }],
      address: {
        line1: '1 Main St.',
        city: 'Anytown',
        state: 'CA',
        postalCode: '12345',
        country: 'USA'
      },
      privacySettings: { marketingEmailsEnabled: true, twoFactorEnabled: false }
    };

    sendMock.mockResolvedValueOnce({
      Item: { pk: 'C#c-123', sk: 'PROFILE', ...expected }
    });

    const result = await repo.getCustomer('c-123');

    expect(result).toEqual({ pk: 'C#c-123', sk: 'PROFILE', ...expected });
    const cmd = sendMock.mock.calls[0][0] as GetCommand;
    expect((cmd as any).input.Key.pk).toBe('C#c-123');
  });

  it('returns null when the record is not found', async () => {
    sendMock.mockResolvedValueOnce({});   // no Item
    const result = await repo.getCustomer('missing');
    expect(result).toBeNull();
  });
});
