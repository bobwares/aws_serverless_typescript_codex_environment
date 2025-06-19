/**
 * App: Customer API
 * Package: utils
 * File: xray.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-19T18:24:37Z
 * Description: Helper to wrap AWS SDK v3 clients with AWS X-Ray capture when
 *              available. Ensures segments are properly closed.
 */

import { captureAWSv3Client } from "aws-xray-sdk-core";
import type { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export function withXRay<T extends DynamoDBClient>(client: T): T {
  return captureAWSv3Client(client);
}
