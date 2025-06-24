/**
 * App: Customer API
 * Package: test
 * File: logger.test.ts
 * Version: 0.1.0
 * Author: Codex
 * Date: 2025-06-24T21:41:00Z
 * Description: Ensures logger exports a configured Logger instance.
 */

import { Logger } from "@aws-lambda-powertools/logger";
import logger from "../../../src/utils/logger.js";

describe("logger", () => {
  it("is an instance of Logger", () => {
    expect(logger).toBeInstanceOf(Logger);
  });
});
