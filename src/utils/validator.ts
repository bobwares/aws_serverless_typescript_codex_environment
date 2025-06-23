/**
 * App: Customer API
 * Package: utils
 * File: validator.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-21T00:00:00Z
 * Description: Ajv schema validation helper for CustomerProfile payloads.
 */

import Ajv from "ajv";
import addFormats from "ajv-formats";
import schema from "../../schema/domain.json" assert { type: "json" };

const ajv = new Ajv({ removeAdditional: true });
addFormats(ajv);
const validate = ajv.compile(schema);

export function validateProfile(
  payload: unknown,
): asserts payload is typeof schema {
  if (!validate(payload)) {
    throw new Error("Validation failed: " + JSON.stringify(validate.errors));
  }
}
