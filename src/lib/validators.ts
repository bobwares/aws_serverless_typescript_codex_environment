//  App: Customer API
//  Package: lib
//  File: validators.ts
//  Version: 0.1.0
//  Author: ServerlessArchitectBot
//  Date: 2025-06-16T21:44:52Z
//  Description: Ajv validators for CustomerProfile schema and helpers.
// 
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(__dirname, '../..', 'schema/customerProfile.schema.json');
const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
export const validateProfile = ajv.compile(schema);

export function assertValidProfile(data: unknown): asserts data is Record<string, unknown> {
  if (!validateProfile(data)) {
    const [error] = validateProfile.errors ?? [];
    const message = error ? `${error.instancePath} ${error.message}` : 'Validation failed';
    const err = new Error(message);
    (err as Error & { statusCode?: number }).statusCode = 400;
    throw err;
  }
}
