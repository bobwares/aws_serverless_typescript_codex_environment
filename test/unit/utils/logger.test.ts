/**
 * App: Customer API
 * Package: test
 * File: logger.test.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-19T20:30:00Z
 * Description: Unit tests for the structured logger utility.
 */

import { jest } from '@jest/globals';

describe('logger', () => {
  let consoleSpy: any;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  test('debug logs when NODE_ENV=dev', async () => {
    process.env.NODE_ENV = 'dev';
    const { logger } = await import('../../../src/utils/logger.js');
    logger.debug('msg');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('"level":"debug"'));
  });

  test('debug suppressed when NODE_ENV!=dev', async () => {
    process.env.NODE_ENV = 'prod';
    const { logger } = await import('../../../src/utils/logger.js');
    logger.debug('msg');
    expect(consoleSpy).not.toHaveBeenCalled();
  });

  test('info logs always', async () => {
    process.env.NODE_ENV = 'prod';
    const { logger } = await import('../../../src/utils/logger.js');
    logger.info('hello');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('"level":"info"'));
  });
});
