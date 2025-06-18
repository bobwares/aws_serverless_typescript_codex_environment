// App: CustomerAPI
// Directory: src/utils
// File: validate.ts
// Version: 0.1.1
// Author: ServerlessArchitectBot
// Date: 2025-06-18
// Description: Ajv validation for customer profile schema.

import Ajv from 'ajv';
import schema from '../customerProfile.schema.json' assert { type: 'json' };

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);

export function validateProfile(data: unknown): void {
  const valid = validate(data);
  if (!valid) {
    const errorText = ajv.errorsText(validate.errors);
    throw new Error(`Schema validation failed: ${errorText}`);
  }
}
