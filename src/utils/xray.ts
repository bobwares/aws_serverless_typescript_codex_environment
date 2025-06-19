/**
 * App: Customer API
 * Package: utils
 * File: xray.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-19T19:00:00Z
 * Description: Initializes AWS X-Ray capturing for AWS SDK clients
 *              and provides helper to close segments.
 */

import { captureAWSv3Client, getSegment, Segment } from "aws-xray-sdk-core";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export function createXRayDynamoClient(client: DynamoDBClient): DynamoDBClient {
  return captureAWSv3Client(client);
}

export function closeSegment(): void {
  const segment = getSegment();
  if (segment) {
    (segment as Segment).close();
  }
}
