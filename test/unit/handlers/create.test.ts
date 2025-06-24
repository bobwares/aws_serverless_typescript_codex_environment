/**
 * App: Customer API
 * Package: test
 * File: create.test.ts
 * Version: 0.1.0
 * Author: Codex
 * Date: 2025-06-24T21:41:00Z
 * Description: Tests the create Lambda handler.
 */

import { jest } from "@jest/globals";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { sampleProfile } from "../fixtures/customer.js";

const parseJson = jest.fn();
const validateCustomerProfile = jest.fn();
const create = jest.fn() as any;
const addMetric = jest.fn();
const addContext = jest.fn();

jest.unstable_mockModule("../../../src/utils/parser.js", () => ({ parseJson }));
jest.unstable_mockModule("../../../src/utils/validation.js", () => ({
  validateCustomerProfile,
}));
jest.unstable_mockModule("../../../src/services/crud_service.js", () => ({
  CrudService: jest.fn().mockImplementation(() => ({ create })),
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

const { handler } = (await import("../../../src/handlers/create.js")) as any;

describe("create handler", () => {
  it("creates profile", async () => {
    parseJson.mockReturnValue(sampleProfile);
    validateCustomerProfile.mockReturnValue(sampleProfile);
    create.mockResolvedValueOnce(sampleProfile);
    const event = { body: "{}" } as unknown as APIGatewayProxyEventV2;
    const res = await handler(event, {} as any);
    expect(create).toHaveBeenCalledWith(sampleProfile);
    expect(res.statusCode).toBe(201);
    expect(JSON.parse(res.body)).toEqual(sampleProfile);
  });
});
