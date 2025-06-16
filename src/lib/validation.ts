import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import schema from '../../schema/customerProfile.schema.json' assert { type: 'json' };

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile(schema);

export function validateProfile(data: unknown): void {
  if (!validate(data)) {
    const [error] = validate.errors ?? [];
    throw new Error(
      error ? `${error.instancePath} ${error.message}` : 'Invalid payload',
    );
  }
}
