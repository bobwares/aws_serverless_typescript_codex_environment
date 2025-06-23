/**
 * App: Customer API
 * Package: tests
 * File: customerService.test.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-21T00:00:00Z
 * Description: Unit tests for CustomerService.
 */

import { jest } from '@jest/globals';

const sendMock = jest.fn();

jest.unstable_mockModule('../../src/utils/xray', () => ({
  createDocumentClient: () => ({ send: sendMock }),
}));

type CustomerProfile = import('../../src/services/customerService').CustomerProfile;
const { CustomerService } = await import('../../src/services/customerService');

const service = new CustomerService({ send: sendMock } as any);

const sample: CustomerProfile = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  firstName: 'Jane',
  lastName: 'Doe',
  emails: ['jane@example.com'],
  privacySettings: { marketingEmailsEnabled: true, twoFactorEnabled: false },
};

describe('CustomerService', () => {
  beforeEach(() => sendMock.mockReset());

  test('create stores customer and returns operation id', async () => {
    sendMock.mockResolvedValue({});
    const opId = await service.create(sample);
    expect(opId).toBeDefined();
    expect(sendMock).toHaveBeenCalled();
  });

  test('get returns undefined when not found', async () => {
    sendMock.mockResolvedValue({});
    const out = await service.get('missing');
    expect(out).toBeUndefined();
  });
});
