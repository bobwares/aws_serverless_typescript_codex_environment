// App: CustomerAPI
// Directory: src/utils
// File: validate.ts
// Version: 0.1.1
// Author: ServerlessArchitectBot
// Date: 2025-06-18
// Description: Ajv validation for customer profile schema.

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load schema synchronously
const schemaPath = join(__dirname, '../customerProfile.schema.json');
const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const validate = ajv.compile(schema);


export function validateProfile(data: unknown): void {
  const valid = validate(data);
  if (!valid) {
    throw new Error(`Validation failed: ${JSON.stringify(validate.errors)}`);
  }
}