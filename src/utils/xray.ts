/**
 * App: Customer API
 * Package: utils
 * File: xray.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-21T00:00:00Z
 * Description: AWS X-Ray initialization helper wrapping the DynamoDB client.
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { captureAWSv3Client } from "aws-xray-sdk-core";

export function createDocumentClient(): DynamoDBDocumentClient {
  const client = new DynamoDBClient({});
  const traced = captureAWSv3Client(client);
  return DynamoDBDocumentClient.from(traced);
}
