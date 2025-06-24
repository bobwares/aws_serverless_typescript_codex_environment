/**
 * App: Customer API
 * Package: test
 * File: fixtures/customer.ts
 * Version: 0.1.0
 * Author: Codex
 * Date: 2025-06-24T21:41:00Z
 * Description: Provides sample CustomerProfile objects for unit tests.
 */

import { CustomerProfile } from "../../../src/utils/validation.js";

export const sampleProfile: CustomerProfile = {
  id: "11111111-1111-1111-1111-111111111111",
  firstName: "Alice",
  middleName: "Q",
  lastName: "Doe",
  emails: ["alice@example.com"],
  phoneNumbers: [{ type: "mobile", number: "+1234567890" }],
  address: {
    line1: "123 Main St",
    city: "Metropolis",
    state: "NY",
    postalCode: "12345",
    country: "US",
  },
  privacySettings: {
    marketingEmailsEnabled: true,
    twoFactorEnabled: true,
  },
};
