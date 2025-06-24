/**
 * App: Customer API
 * Package: test
 * File: delete.test.ts
 * Version: 0.1.0
 * Author: Codex
 * Date: 2025-06-24T21:41:00Z
 * Description: Tests the delete Lambda handler.
 */

import { jest } from "@jest/globals";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { sampleProfile } from "../fixtures/customer.js";

const del = jest.fn() as any;
const addMetric = jest.fn();
const addContext = jest.fn();

jest.unstable_mockModule("../../../src/services/crud_service.js", () => ({
  CrudService: jest.fn().mockImplementation(() => ({ delete: del })),
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

const { handler } = (await import("../../../src/handlers/delete.js")) as any;

describe("delete handler", () => {
  it("deletes item", async () => {
    del.mockResolvedValueOnce(undefined);
    const event = {
      pathParameters: { id: sampleProfile.id },
    } as unknown as APIGatewayProxyEventV2;
    const res = await handler(event, {} as any);
    expect(del).toHaveBeenCalledWith(sampleProfile.id);
    expect(res.statusCode).toBe(204);
  });
});
