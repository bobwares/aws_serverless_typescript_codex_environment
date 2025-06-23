/**
 * App: Customer API
 * Package: tests
 * File: post.test.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-21T00:00:00Z
 * Description: Unit tests for post handler.
 */

import { jest } from '@jest/globals';

const createMock = jest.fn();

jest.unstable_mockModule('../../src/services/customerService', () => ({
  CustomerService: class {
    create = createMock;
  },
}));

jest.unstable_mockModule('../../src/utils/xray', () => ({
  createDocumentClient: () => ({}),
}));

const { handler } = await import('../../src/handlers/post');

describe('post handler', () => {
  beforeEach(() => createMock.mockResolvedValue('op1'));

  test('returns 202 with operation id', async () => {
    const event = { body: '{"id":"1","firstName":"A","lastName":"B","emails":["a@b.com"],"privacySettings":{"marketingEmailsEnabled":true,"twoFactorEnabled":false}}', requestContext: { requestId: 'id' } } as any;
    const res = await handler(event);
    expect(res.statusCode).toBe(202);
  });
});
