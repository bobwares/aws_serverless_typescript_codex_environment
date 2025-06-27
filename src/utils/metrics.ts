/**
 * App: Customer API
 * Package: utils
 * File: metrics.ts
 * Version: 0.1.0
 * Author: Codex
 * Date: 2025-06-24T21:15:51Z
 * Description: Exposes Powertools Metrics instance and logMetrics decorator
 *              with automatic ColdStart metric emission.
 */

import { Metrics, MetricUnit } from "@aws-lambda-powertools/metrics";
import { logMetrics } from "@aws-lambda-powertools/metrics/middleware";

export const metrics = new Metrics({
  namespace: "CustomerAPI",
  serviceName: process.env.POWERTOOLS_SERVICE_NAME ?? "customer-api",
});

export { MetricUnit, logMetrics };
