// App: CustomerAPI
// Directory: test/unit
// File: operations.test.ts
// Version: 0.1.1
// Author: ServerlessArchitectBot
// Date: 2025-06-18
// Description: Tests for operations utility functions.

import { jest } from '@jest/globals';
import { PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

const sendMock = jest.fn() as any;

jest.unstable_mockModule('../../src/utils/db', () => ({ ddb: { send: sendMock } }));
jest.unstable_mockModule('uuid', () => ({ v4: () => 'uuid-123' }));

let ops: typeof import('../../src/utils/operations');

beforeAll(async () => {
  ops = await import('../../src/utils/operations');
  process.env.OPERATIONS_TABLE = 'Ops';
});

afterEach(() => jest.resetAllMocks());

describe('createOperation', () => {
  it('writes a new operation item', async () => {
    sendMock.mockResolvedValueOnce({});
    const item = await ops.createOperation();
    expect(item.id).toBe('uuid-123');
    const cmd = sendMock.mock.calls[0][0] as PutCommand;
    expect((cmd as any).input.Item.id).toBe('uuid-123');
  });
});

describe('getOperation', () => {
  it('returns the item or null', async () => {
    sendMock.mockResolvedValueOnce({ Item: { id: 'uuid-123', status: 'IN_PROGRESS' } });
    const result = await ops.getOperation('uuid-123');
    expect(result).toEqual({ id: 'uuid-123', status: 'IN_PROGRESS' });
    const cmd = sendMock.mock.calls[0][0] as GetCommand;
    expect((cmd as any).input.Key.id).toBe('uuid-123');
  });
});
