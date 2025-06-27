/**
 * App: Customer API
 * Package: utils
 * File: parser.ts
 * Version: 0.1.0
 * Author: Codex
 * Date: 2025-06-24T21:15:51Z
 * Description: Helper to parse HTTP API events using Powertools Parser.
 */

import { APIGatewayProxyEventV2 } from "aws-lambda";

export function parseJson<T>(event: APIGatewayProxyEventV2): T {
  if (!event.body) {
    throw new Error("Missing body");
  }
  return JSON.parse(event.body) as T;
}
