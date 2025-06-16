import { v4 as uuid } from 'uuid';
import { validateCustomer } from '../lib/validator.js';
import { putCustomer } from '../lib/dynamodb.js';
import { recordDuration } from '../lib/metrics.js';

export const handler = async (event) => {
  const start = Date.now();
  try {
    const body = JSON.parse(event.body || '{}');
    validateCustomer(body);
    const id = body.id || uuid();
    const item = {
      pk: `CUSTOMER#${id}`,
      sk: 'PROFILE',
      gsi1: body.emails[0],
      profile: body,
    };
    await putCustomer(item);
    await recordDuration('CustomerOpsDuration', Date.now() - start);
    return {
      statusCode: 201,
      body: JSON.stringify({ id }),
    };
  } catch (err) {
    console.error(err);
    await recordDuration('CustomerOpsDuration', Date.now() - start);
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({ message: err.message }),
    };
  }
};
