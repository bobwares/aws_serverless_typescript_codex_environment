/**
 * App: Customer API
 * Package: utils
 * File: tracer.ts
 * Version: 0.1.0
 * Author: Codex
 * Date: 2025-06-24T21:15:51Z
 * Description: Provides Powertools Tracer singleton and helper to
 *              instrument AWS SDK v3 clients.
 */

import { Tracer } from "@aws-lambda-powertools/tracer";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export const tracer = new Tracer({
  serviceName: process.env.POWERTOOLS_SERVICE_NAME ?? "customer-api",
});

export function instrumentDynamo<T extends DynamoDBClient>(client: T): T {
  return tracer.captureAWSv3Client(client);
}

export default tracer;
