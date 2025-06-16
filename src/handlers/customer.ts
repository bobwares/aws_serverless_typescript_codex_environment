import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import {
  putCustomer,
  getCustomer,
  findByEmail,
  deleteCustomer,
  logOperation,
  getOperation,
  generateId,
  CustomerProfile,
} from '../lib/repository';
import { validateProfile } from '../lib/validation';
import { requireAuth } from '../lib/auth';
import { recordDuration } from '../lib/metrics';

function json(statusCode: number, body: unknown): APIGatewayProxyResultV2 {
  return { statusCode, body: JSON.stringify(body) };
}

export async function createProfile(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const start = Date.now();
  try {
    requireAuth(event);
    const data = JSON.parse(event.body ?? '{}');
    validateProfile(data);
    await putCustomer(data as CustomerProfile);
    const opId = generateId();
    await logOperation({
      id: opId,
      status: 'SUCCEEDED',
      type: 'CREATE',
      resourceId: data.id,
      createdAt: new Date().toISOString(),
    });
    return json(202, { operationId: opId });
  } catch (err: unknown) {
    const e = err as { statusCode?: number; message: string };
    const status = e.statusCode ?? 400;
    return json(status, { message: e.message });
  } finally {
    await recordDuration(start);
  }
}

export async function updateProfile(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  return createProfile(event); // same logic for demo
}

export async function patchProfile(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  return createProfile(event); // reuse validation for demo
}

export async function removeProfile(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const start = Date.now();
  try {
    requireAuth(event);
    const id = event.pathParameters?.id as string;
    await deleteCustomer(id);
    const opId = generateId();
    await logOperation({
      id: opId,
      status: 'SUCCEEDED',
      type: 'DELETE',
      resourceId: id,
      createdAt: new Date().toISOString(),
    });
    return json(202, { operationId: opId });
  } catch (err: unknown) {
    const e = err as { statusCode?: number; message: string };
    const status = e.statusCode ?? 400;
    return json(status, { message: e.message });
  } finally {
    await recordDuration(start);
  }
}

export async function getProfile(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const start = Date.now();
  try {
    requireAuth(event);
    const id = event.pathParameters?.id as string;
    const profile = await getCustomer(id);
    return json(200, profile ?? {});
  } catch (err: unknown) {
    const e = err as { statusCode?: number; message: string };
    const status = e.statusCode ?? 400;
    return json(status, { message: e.message });
  } finally {
    await recordDuration(start);
  }
}

export async function searchByEmail(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const start = Date.now();
  try {
    requireAuth(event);
    const email = event.queryStringParameters?.email as string;
    const profiles = await findByEmail(email);
    return json(200, profiles);
  } catch (err: unknown) {
    const e = err as { statusCode?: number; message: string };
    const status = e.statusCode ?? 400;
    return json(status, { message: e.message });
  } finally {
    await recordDuration(start);
  }
}

export async function getOperationStatus(
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> {
  const start = Date.now();
  try {
    requireAuth(event);
    const id = event.pathParameters?.id as string;
    const op = await getOperation(id);
    return json(200, op ?? {});
  } catch (err: unknown) {
    const e = err as { statusCode?: number; message: string };
    const status = e.statusCode ?? 400;
    return json(status, { message: e.message });
  } finally {
    await recordDuration(start);
  }
}
