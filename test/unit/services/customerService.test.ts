/**
 * App: Customer API
 * Package: test
 * File: customerService.test.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-19T20:30:00Z
 * Description: Unit tests for the customer service layer.
 */

import { jest } from '@jest/globals';

const sendMock = jest.fn<(cmd: any) => Promise<any>>();

jest.unstable_mockModule('@aws-sdk/client-dynamodb', () => ({
  DynamoDBClient: class {},
  PutItemCommand: class {},
  GetItemCommand: class {},
  UpdateItemCommand: class {},
  DeleteItemCommand: class {},
  QueryCommand: class {},
  ScanCommand: class {},
}));

class BaseCmd { constructor(public input: any) { this.input = input; } }

jest.unstable_mockModule('@aws-sdk/lib-dynamodb', () => ({
  DynamoDBDocumentClient: { from: () => ({ send: sendMock }) },
  PutCommand: class extends BaseCmd {},
  GetCommand: class extends BaseCmd {},
  DeleteCommand: class extends BaseCmd {},
  QueryCommand: class extends BaseCmd {},
  UpdateCommand: class extends BaseCmd {},
}));

jest.unstable_mockModule('../../../src/utils/xray.js', () => ({
  createXRayDynamoClient: (c: any) => c,
}));

jest.unstable_mockModule('uuid', () => ({ v4: () => 'uuid-1' }));

jest.unstable_mockModule('../../../src/utils/logger.js', () => ({
  logger: { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() },
}));

const service = await import('../../../src/services/customerService.js');
const {
  createCustomer,
  getCustomer,
  updateCustomer,
  patchCustomer,
  deleteCustomer,
  listCustomers,
} = service;

process.env.TABLE_NAME = 'Customers';
const baseProfile = {
  firstName: 'Jane',
  lastName: 'Doe',
  emails: ['jane@example.com'],
  privacySettings: { marketingEmailsEnabled: true, twoFactorEnabled: false },
};

describe('customerService', () => {
  beforeEach(() => {
    sendMock.mockReset();
  });

  test('createCustomer persists record and returns item with id', async () => {
    sendMock.mockResolvedValueOnce({} as any);
    const result = await createCustomer(baseProfile);
    expect(result).toEqual({ ...baseProfile, id: 'uuid-1' });
    expect(sendMock).toHaveBeenCalledWith(expect.any(BaseCmd));
  });

  test('getCustomer returns item when found', async () => {
    sendMock.mockResolvedValueOnce({ Item: { ...baseProfile, id: 'uuid-1' } } as any);
    const item = await getCustomer('uuid-1');
    expect(item).toEqual({ ...baseProfile, id: 'uuid-1' });
  });

  test('updateCustomer writes record', async () => {
    sendMock.mockResolvedValueOnce({} as any);
    await updateCustomer('uuid-1', { ...baseProfile, id: 'uuid-1' });
    expect(sendMock).toHaveBeenCalledWith(expect.any(BaseCmd));
  });

  test('patchCustomer merges existing', async () => {
    sendMock
      .mockResolvedValueOnce({ Item: { ...baseProfile, id: 'uuid-1' } } as any)
      .mockResolvedValueOnce({} as any);
    const updated = await patchCustomer('uuid-1', { firstName: 'Janet' });
    expect(updated).toEqual({ ...baseProfile, id: 'uuid-1', firstName: 'Janet' });
  });

  test('deleteCustomer removes record', async () => {
    sendMock.mockResolvedValueOnce({} as any);
    await deleteCustomer('uuid-1');
    expect(sendMock).toHaveBeenCalledWith(expect.any(BaseCmd));
  });

  test('listCustomers queries table', async () => {
    sendMock.mockResolvedValueOnce({ Items: [{ ...baseProfile, id: 'uuid-1' }] } as any);
    const list = await listCustomers();
    expect(list).toEqual([{ ...baseProfile, id: 'uuid-1' }]);
  });
});
