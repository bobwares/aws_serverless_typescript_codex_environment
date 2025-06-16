import { getCustomer } from '../lib/dynamodb.js';
import { recordDuration } from '../lib/metrics.js';

export const handler = async (event) => {
  const start = Date.now();
  try {
    const id = event.pathParameters.id;
    const item = await getCustomer(id);
    await recordDuration('CustomerOpsDuration', Date.now() - start);
    if (!item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Not found' }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(item.profile),
    };
  } catch (err) {
    console.error(err);
    await recordDuration('CustomerOpsDuration', Date.now() - start);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.message }),
    };
  }
};
