/**
 * App: Customer API
 * Package: test
 * File: update.test.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-19T20:30:00Z
 * Description: Unit tests for update handler.
 */

import { jest } from '@jest/globals';

const updateCustomer = jest.fn<(id: string, p: any) => Promise<any>>();
const closeSegment = jest.fn();
const logger = { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() };

jest.unstable_mockModule('../../../src/services/customerService.js', () => ({
  updateCustomer,
}));

jest.unstable_mockModule('../../../src/utils/xray.js', () => ({
  closeSegment,
}));

jest.unstable_mockModule('../../../src/utils/logger.js', () => ({
  logger,
}));

const { handler } = await import('../../../src/handlers/update.js');

describe('update handler', () => {
  const event = {
    pathParameters: { id: '1' },
    body: '{"firstName":"a"}',
    requestContext: { requestId: 'x' },
  } as any;

  test('updates item', async () => {
    updateCustomer.mockResolvedValueOnce({ id: '1' } as any);
    const res = await handler(event);
    expect((res as any).statusCode).toBe(200);
    expect(updateCustomer).toHaveBeenCalled();
  });
});
