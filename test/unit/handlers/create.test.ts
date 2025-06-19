/**
 * App: Customer API
 * Package: test
 * File: create.test.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-19T20:30:00Z
 * Description: Unit tests for create handler.
 */

import { jest } from '@jest/globals';

const createCustomer = jest.fn<(p: any) => Promise<any>>();
const closeSegment = jest.fn();
const logger = { debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error: jest.fn() };

jest.unstable_mockModule('../../../src/services/customerService.js', () => ({
  createCustomer,
}));

jest.unstable_mockModule('../../../src/utils/xray.js', () => ({
  closeSegment,
}));

jest.unstable_mockModule('../../../src/utils/logger.js', () => ({
  logger,
}));

const { handler } = await import('../../../src/handlers/create.js');

describe('create handler', () => {
  const event = {
    body: '{"firstName":"Ann","lastName":"Doe","emails":["ann@example.com"],"privacySettings":{"marketingEmailsEnabled":true,"twoFactorEnabled":false}}',
    requestContext: { requestId: '1' },
  } as any;

  test('returns created item', async () => {
    createCustomer.mockResolvedValueOnce({ id: '1', firstName: 'Ann' } as any);
    const res = await handler(event);
    expect((res as any).statusCode).toBe(201);
    expect(createCustomer).toHaveBeenCalled();
    expect(closeSegment).toHaveBeenCalled();
  });

  test('handles failure', async () => {
    createCustomer.mockRejectedValueOnce(new Error('boom') as any);
    const res = await handler(event);
    expect((res as any).statusCode).toBe(500);
    expect(logger.error).toHaveBeenCalled();
  });
});
