/**
 * App: Customer API
 * Package: test
 * File: delete.test.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-19T20:30:00Z
 * Description: Unit tests for delete handler.
 */

import { jest } from '@jest/globals';

const deleteCustomer = jest.fn<(id: string) => Promise<any>>();
const closeSegment = jest.fn();
const logger = { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() };

jest.unstable_mockModule('../../../src/services/customerService.js', () => ({
  deleteCustomer,
}));

jest.unstable_mockModule('../../../src/utils/xray.js', () => ({
  closeSegment,
}));

jest.unstable_mockModule('../../../src/utils/logger.js', () => ({
  logger,
}));

const { handler } = await import('../../../src/handlers/delete.js');

describe('delete handler', () => {
  const event = { pathParameters: { id: '1' }, requestContext: { requestId: '1' } } as any;

  test('deletes item', async () => {
    deleteCustomer.mockResolvedValueOnce(undefined as any);
    const res = await handler(event);
    expect((res as any).statusCode).toBe(204);
  });
});
