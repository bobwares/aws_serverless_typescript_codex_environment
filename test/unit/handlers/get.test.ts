/**
 * App: Customer API
 * Package: test
 * File: get.test.ts
 * Version: 0.1.0
 * Author: Codex
 * Date: 2025-06-24T21:41:00Z
 * Description: Tests the get Lambda handler.
 */

import { jest } from "@jest/globals";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { sampleProfile } from "../fixtures/customer.js";

const getItem = jest.fn() as any;
const addMetric = jest.fn();
const addContext = jest.fn();

jest.unstable_mockModule("../../../src/services/crud_service.js", () => ({
  CrudService: jest.fn().mockImplementation(() => ({ get: getItem })),
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

const { handler } = (await import("../../../src/handlers/get.js")) as any;

describe("get handler", () => {
  it("returns item when found", async () => {
    getItem.mockResolvedValueOnce(sampleProfile);
    const event = {
      pathParameters: { id: sampleProfile.id },
    } as unknown as APIGatewayProxyEventV2;
    const res = await handler(event, {} as any);
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.body)).toEqual(sampleProfile);
  });

  it("returns 404 when missing", async () => {
    getItem.mockResolvedValueOnce(null);
    const event = {
      pathParameters: { id: sampleProfile.id },
    } as unknown as APIGatewayProxyEventV2;
    const res = await handler(event, {} as any);
    expect(res.statusCode).toBe(404);
  });
});
