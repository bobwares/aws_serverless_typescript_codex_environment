/**
 * App: Customer API
 * Package: test
 * File: list.test.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-19T20:30:00Z
 * Description: Unit tests for list handler.
 */

import { jest } from '@jest/globals';

const listCustomers = jest.fn<() => Promise<any>>();
const closeSegment = jest.fn();
const logger = { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() };

jest.unstable_mockModule('../../../src/services/customerService.js', () => ({
  listCustomers,
}));

jest.unstable_mockModule('../../../src/utils/xray.js', () => ({
  closeSegment,
}));

jest.unstable_mockModule('../../../src/utils/logger.js', () => ({
  logger,
}));

const { handler } = await import('../../../src/handlers/list.js');

describe('list handler', () => {
  test('returns items', async () => {
    listCustomers.mockResolvedValueOnce([{ id: '1' }] as any);
    const res = await handler({} as any);
    expect((res as any).statusCode).toBe(200);
    expect((res as any).body).toContain('1');
  });

  test('handles error', async () => {
    listCustomers.mockRejectedValueOnce(new Error('fail') as any);
    const res = await handler({} as any);
    expect((res as any).statusCode).toBe(500);
  });
});
