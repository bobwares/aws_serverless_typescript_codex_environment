/**
 * App: Customer API
 * Package: test
 * File: list.test.ts
 * Version: 0.1.0
 * Author: Codex
 * Date: 2025-06-24T21:41:00Z
 * Description: Tests the list Lambda handler.
 */

import { jest } from "@jest/globals";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { sampleProfile } from "../fixtures/customer.js";

const listItems = jest.fn() as any;
const addMetric = jest.fn();
const addContext = jest.fn();

jest.unstable_mockModule("../../../src/services/crud_service.js", () => ({
  CrudService: jest.fn().mockImplementation(() => ({ list: listItems })),
}));
jest.unstable_mockModule("../../../src/utils/metrics.js", () => ({
  metrics: { addMetric },
  MetricUnit: { Count: "Count" },
}));
jest.unstable_mockModule("../../../src/utils/tracer.js", () => ({
  default: { captureLambdaHandler: (h: any) => h },
}));
jest.unstable_mockModule("../../../src/utils/logger.js", () => ({
  default: { addContext },
}));

const { handler } = (await import("../../../src/handlers/list.js")) as any;

describe("list handler", () => {
  it("returns all items", async () => {
    listItems.mockResolvedValueOnce([sampleProfile]);
    const res = await handler(
      {} as unknown as APIGatewayProxyEventV2,
      {} as any,
    );
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual([sampleProfile]);
  });
});
