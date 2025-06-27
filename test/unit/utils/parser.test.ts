/**
 * App: Customer API
 * Package: test
 * File: parser.test.ts
 * Version: 0.1.0
 * Author: Codex
 * Date: 2025-06-24T21:41:00Z
 * Description: Tests the parseJson utility for correct body parsing.
 */

import { APIGatewayProxyEventV2 } from "aws-lambda";
import { parseJson } from "../../../src/utils/parser.js";

describe("parseJson", () => {
  it("parses JSON body", () => {
    const event = { body: '{"foo":"bar"}' } as APIGatewayProxyEventV2;
    expect(parseJson<{ foo: string }>(event)).toEqual({ foo: "bar" });
  });

  it("throws when body missing", () => {
    const event = { body: undefined } as unknown as APIGatewayProxyEventV2;
    expect(() => parseJson(event)).toThrow("Missing body");
  });
});
