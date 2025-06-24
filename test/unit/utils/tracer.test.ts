/**
 * App: Customer API
 * Package: test
 * File: tracer.test.ts
 * Version: 0.1.0
 * Author: Codex
 * Date: 2025-06-24T21:41:00Z
 * Description: Tests instrumentation helper for DynamoDB clients.
 */

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { instrumentDynamo } from "../../../src/utils/tracer.js";

describe("instrumentDynamo", () => {
  it("returns captured client", () => {
    const client = new DynamoDBClient({});
    const captured = instrumentDynamo(client);
    expect(captured).toBe(client);
  });
});
