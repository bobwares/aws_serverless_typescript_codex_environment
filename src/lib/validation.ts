// App: Customer API
// path: src/lib
// File: validation.ts
// Version: 0.1.0
// Author: ServerlessArchitectBot
// Date: 2025-06-18T00:22:49Z
// Description: Utility to load and compile JSON Schema validation
//              for the CustomerProfile using Ajv. Exposes a validate
//              function that throws an error when validation fails.
//
import { readFileSync } from "fs";
import { resolve } from "path";
import Ajv from "ajv";
import addFormats from "ajv-formats";

const schemaPath = resolve(
  __dirname,
  "../../schema/customerProfile.schema.json",
);
const schema = JSON.parse(readFileSync(schemaPath, "utf-8"));
const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
const validateFn = ajv.compile(schema);

export function validateProfile(data: unknown): void {
  const valid = validateFn(data);
  if (!valid) {
    const [error] = validateFn.errors ?? [];
    throw new Error(`Invalid request: ${error?.message ?? "unknown error"}`);
  }
}
