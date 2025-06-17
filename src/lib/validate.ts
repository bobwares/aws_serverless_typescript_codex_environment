/*
# App: CustomerProfileAPI
# Package: lib
# File: validate.ts
# Version: 0.1.0
# Author: ServerlessArchitectBot
# Date: 2025-06-17T00:29:04Z
# Description: JSON schema validation utilities using Ajv.
*/

import Ajv from 'ajv';
import { readFileSync } from 'fs';
import { join } from 'path';

const schemaPath = join(__dirname, '..', '..', 'schema', 'customerProfile.schema.json');
const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));

const ajv = new Ajv({ allErrors: true, strict: true });
export const validateProfile = ajv.compile(schema);
