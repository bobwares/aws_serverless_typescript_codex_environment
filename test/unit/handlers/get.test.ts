/**
 * App: Customer API
 * Package: test
 * File: get.test.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-19T20:30:00Z
 * Description: Unit tests for get handler.
 */

import { jest } from '@jest/globals';

const getCustomer = jest.fn<(id: string) => Promise<any>>();
const closeSegment = jest.fn();
const logger = { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() };

jest.unstable_mockModule('../../../src/services/customerService.js', () => ({
  getCustomer,
}));

jest.unstable_mockModule('../../../src/utils/xray.js', () => ({
  closeSegment,
}));

jest.unstable_mockModule('../../../src/utils/logger.js', () => ({
  logger,
}));

const { handler } = await import('../../../src/handlers/get.js');

describe('get handler', () => {
  const baseEvent = { pathParameters: { id: '1' }, requestContext: { requestId: 'a' } } as any;

  test('returns item when found', async () => {
    getCustomer.mockResolvedValueOnce({ id: '1' } as any);
    const res = await handler(baseEvent);
    expect((res as any).statusCode).toBe(200);
  });

  test('returns 404 when not found', async () => {
    getCustomer.mockResolvedValueOnce(null as any);
    const res = await handler(baseEvent);
    expect((res as any).statusCode).toBe(404);
  });

  test('handles error', async () => {
    getCustomer.mockRejectedValueOnce(new Error('x') as any);
    const res = await handler(baseEvent);
    expect((res as any).statusCode).toBe(500);
    expect(logger.error).toHaveBeenCalled();
  });
});
