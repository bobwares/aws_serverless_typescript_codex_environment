/**
 * App: Customer API
 * Package: test
 * File: metrics.test.ts
 * Version: 0.1.0
 * Author: Codex
 * Date: 2025-06-24T21:41:00Z
 * Description: Tests Metrics utility exports.
 */

import { metrics } from "../../../src/utils/metrics.js";

describe("metrics", () => {
  it("has namespace CustomerAPI", () => {
    // @ts-ignore internal property
    expect(metrics.namespace).toBe("CustomerAPI");
  });
});
