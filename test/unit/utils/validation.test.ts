/**
 * App: Customer API
 * Package: test
 * File: validation.test.ts
 * Version: 0.1.0
 * Author: Codex
 * Date: 2025-06-24T21:41:00Z
 * Description: Tests validation helpers for CustomerProfile domain.
 */

import {
  validateCustomerProfile,
  validatePartialCustomerProfile,
} from "../../../src/utils/validation.js";
import { sampleProfile } from "../fixtures/customer.js";

describe("validation helpers", () => {
  it("validates full profile", () => {
    expect(validateCustomerProfile(sampleProfile)).toEqual(sampleProfile);
  });

  it("validates partial profile", () => {
    const partial = { firstName: "Bob" };
    expect(validatePartialCustomerProfile(partial)).toEqual(partial);
  });

  it("throws on invalid profile", () => {
    expect(() => validateCustomerProfile({})).toThrow();
  });
});
