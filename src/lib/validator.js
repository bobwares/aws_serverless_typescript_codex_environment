import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.join(__dirname, '../schema/customer.json');
const schema = JSON.parse(await readFile(schemaPath, 'utf8'));

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile(schema);

export function validateCustomer(data) {
  const valid = validate(data);
  if (!valid) {
    const error = new Error('Validation error');
    error.statusCode = 400;
    error.details = validate.errors;
    throw error;
  }
}
