/**
 * App: Customer API
 * Package: utils
 * File: logger.ts
 * Version: 0.1.0
 * Author: Codex
 * Date: 2025-06-24T21:15:51Z
 * Description: Provides a singleton Powertools Logger instance
 *              with environment-aware log level and Lambda context support.
 */

import { Logger } from "@aws-lambda-powertools/logger";

const logger = new Logger({
  serviceName: process.env.POWERTOOLS_SERVICE_NAME ?? "customer-api",
  logLevel: process.env.NODE_ENV === "dev" ? "DEBUG" : "INFO",
});

export default logger;
