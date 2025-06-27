/**
 * App: Customer API
 * Package: test
 * File: crud_service.test.ts
 * Version: 0.1.0
 * Author: Codex
 * Date: 2025-06-24T21:41:00Z
 * Description: Unit tests for the CrudService DynamoDB layer.
 */

import { jest } from "@jest/globals";
import { sampleProfile } from "../fixtures/customer.js";

const sendMock = jest.fn() as any;

jest.unstable_mockModule("../../../src/utils/tracer.js", () => ({
  instrumentDynamo: (c: any) => c,
}));

jest.unstable_mockModule("@aws-sdk/lib-dynamodb", () => ({
  DynamoDBDocumentClient: { from: () => ({ send: sendMock }) },
  PutCommand: class {
    constructor(public input: any) {}
  },
  GetCommand: class {
    constructor(public input: any) {}
  },
  UpdateCommand: class {
    constructor(public input: any) {}
  },
  DeleteCommand: class {
    constructor(public input: any) {}
  },
  ScanCommand: class {
    constructor(public input: any) {}
  },
}));

const { CrudService } = (await import(
  "../../../src/services/crud_service.js"
)) as any;

describe("CrudService", () => {
  beforeEach(() => {
    sendMock.mockReset();
  });

  it("creates item", async () => {
    sendMock.mockResolvedValueOnce({});
    const service = new CrudService();
    await service.create(sampleProfile);
    expect((sendMock.mock.calls[0][0] as any).constructor.name).toBe(
      "PutCommand",
    );
  });

  it("gets item", async () => {
    sendMock.mockResolvedValueOnce({ Item: sampleProfile });
    const service = new CrudService();
    const result = await service.get(sampleProfile.id);
    expect(result).toEqual(sampleProfile);
  });

  it("returns null when get misses", async () => {
    sendMock.mockResolvedValueOnce({});
    const service = new CrudService();
    const result = await service.get(sampleProfile.id);
    expect(result).toBeNull();
  });

  it("updates item", async () => {
    sendMock.mockResolvedValueOnce({});
    const service = new CrudService();
    await service.update(sampleProfile);
    expect((sendMock.mock.calls[0][0] as any).constructor.name).toBe(
      "PutCommand",
    );
  });

  it("patches item", async () => {
    sendMock.mockResolvedValueOnce({ Attributes: sampleProfile });
    const service = new CrudService();
    const result = await service.patch(sampleProfile.id, { firstName: "Bob" });
    expect(result).toEqual(sampleProfile);
  });

  it("deletes item", async () => {
    sendMock.mockResolvedValueOnce({});
    const service = new CrudService();
    await service.delete(sampleProfile.id);
    expect((sendMock.mock.calls[0][0] as any).constructor.name).toBe(
      "DeleteCommand",
    );
  });

  it("lists items", async () => {
    sendMock.mockResolvedValueOnce({ Items: [sampleProfile] });
    const service = new CrudService();
    const result = await service.list();
    expect(result).toEqual([sampleProfile]);
  });
});
