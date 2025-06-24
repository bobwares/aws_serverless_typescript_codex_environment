/**
 * App: Customer API
 * Package: utils
 * File: validation.ts
 * Version: 0.1.0
 * Author: Codex
 * Date: 2025-06-24T21:15:51Z
 * Description: Zod schemas representing the CustomerProfile domain model
 *              and helper validation functions.
 */

import { z } from "zod";

export const PhoneNumberSchema = z.object({
  type: z.enum(["mobile", "home", "work", "other"]),
  number: z.string().regex(/^\+?[1-9]\d{1,14}$/),
});

export const PostalAddressSchema = z.object({
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string(),
  country: z.string().min(2).max(2),
});

export const PrivacySettingsSchema = z.object({
  marketingEmailsEnabled: z.boolean(),
  twoFactorEnabled: z.boolean(),
});

export const CustomerProfileSchema = z
  .object({
    id: z.string().uuid(),
    firstName: z.string().min(1),
    middleName: z.string().min(1).optional(),
    lastName: z.string().min(1),
    emails: z
      .array(z.string().email())
      .min(1)
      .refine((arr) => new Set(arr).size === arr.length, {
        message: "emails must be unique",
      }),
    phoneNumbers: z.array(PhoneNumberSchema).min(1).optional(),
    address: PostalAddressSchema.optional(),
    privacySettings: PrivacySettingsSchema,
  })
  .strict();

export type CustomerProfile = z.infer<typeof CustomerProfileSchema>;

export function validateCustomerProfile(data: unknown): CustomerProfile {
  return CustomerProfileSchema.parse(data);
}

export function validatePartialCustomerProfile(
  data: unknown,
): Partial<CustomerProfile> {
  return CustomerProfileSchema.partial().parse(
    data,
  ) as Partial<CustomerProfile>;
}
