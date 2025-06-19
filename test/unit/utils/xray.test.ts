/**
 * App: Customer API
 * Package: test
 * File: xray.test.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-19T20:30:00Z
 * Description: Unit tests for X-Ray helper utilities.
 */

import { jest } from '@jest/globals';

const captureFn = jest.fn();
const getSegmentFn = jest.fn();
const closeFn = jest.fn();

jest.unstable_mockModule('aws-xray-sdk-core', () => ({
  captureAWSv3Client: captureFn,
  getSegment: getSegmentFn,
}));

const { createXRayDynamoClient, closeSegment } = await import('../../../src/utils/xray.js');

describe('xray utilities', () => {
  beforeEach(() => {
    captureFn.mockReset();
    getSegmentFn.mockReset();
    closeFn.mockReset();
  });
  test('wraps dynamo client', () => {
    const client = {} as any;
    captureFn.mockReturnValue('wrapped');
    const result = createXRayDynamoClient(client);
    expect(result).toBe('wrapped');
    expect(captureFn).toHaveBeenCalledWith(client);
  });

  test('closeSegment closes when segment exists', () => {
    getSegmentFn.mockReturnValue({ close: closeFn });
    closeSegment();
    expect(closeFn).toHaveBeenCalled();
  });

  test('closeSegment no-op when no segment', () => {
    getSegmentFn.mockReturnValue(undefined);
    closeSegment();
    expect(closeFn).not.toHaveBeenCalled();
  });
});
