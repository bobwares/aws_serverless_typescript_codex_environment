/**
 * App: Customer API
 * Package: test
 * File: patch.test.ts
 * Version: 0.1.0
 * Author: Codex
 * Date: 2025-06-24T21:41:00Z
 * Description: Tests the patch Lambda handler.
 */

import { jest } from "@jest/globals";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { sampleProfile } from "../fixtures/customer.js";

const parseJson = jest.fn();
const validatePartialCustomerProfile = jest.fn();
const patch = jest.fn() as any;
const addMetric = jest.fn();
const addContext = jest.fn();

jest.unstable_mockModule("../../../src/utils/parser.js", () => ({ parseJson }));
jest.unstable_mockModule("../../../src/utils/validation.js", () => ({
  validatePartialCustomerProfile,
}));
jest.unstable_mockModule("../../../src/services/crud_service.js", () => ({
  CrudService: jest.fn().mockImplementation(() => ({ patch })),
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

const { handler } = (await import("../../../src/handlers/patch.js")) as any;

describe("patch handler", () => {
  it("patches profile", async () => {
    parseJson.mockReturnValue({ firstName: "Bob" });
    validatePartialCustomerProfile.mockReturnValue({ firstName: "Bob" });
    patch.mockResolvedValueOnce(sampleProfile);
    const event = {
      body: "{}",
      pathParameters: { id: sampleProfile.id },
    } as unknown as APIGatewayProxyEventV2;
    const res = await handler(event, {} as any);
    expect(patch).toHaveBeenCalledWith(sampleProfile.id, { firstName: "Bob" });
    expect(res.statusCode).toBe(200);
  });
});
