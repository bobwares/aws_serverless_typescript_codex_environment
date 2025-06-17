# App: CustomerProfileAPI
# Package: lib
# File: validation.ts
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:00:00Z
# Description: AJV validator wrapper enforcing the customer profile schema.
#
import Ajv from 'ajv';
import schema from '../../schema/customerProfile.schema.json' assert { type: 'json' };

const ajv = new Ajv({ strict: true });
const validate = ajv.compile(schema);

export function validateProfile(data: unknown): void {
  const valid = validate(data);
  if (!valid) {
    const [error] = validate.errors ?? [];
    throw new Error(`Validation error: ${error?.instancePath} ${error?.message}`);
  }
}
