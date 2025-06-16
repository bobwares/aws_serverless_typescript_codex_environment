import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { removeProfile } from '../../src/handlers/customer';
import { deleteCustomer, logOperation, generateId } from '../../src/lib/repository';

jest.mock('../../src/lib/repository', () => ({
  deleteCustomer: jest.fn(),
  logOperation: jest.fn(),
  generateId: jest.fn(),
}));

describe('removeProfile', () => {
  const event = {
    headers: { authorization: 'Bearer token' },
    pathParameters: { id: '123e4567-e89b-12d3-a456-426614174000' },
  } as unknown as APIGatewayProxyEventV2;

  it('returns 202 on success', async () => {
    (deleteCustomer as jest.Mock).mockResolvedValueOnce(undefined);
    (logOperation as jest.Mock).mockResolvedValueOnce(undefined);
    (generateId as jest.Mock).mockReturnValueOnce('op1');
    const res = await removeProfile(event);
    expect(res.statusCode).toBe(202);
  });

  it('returns 401 when unauthorized', async () => {
    const bad = { ...event, headers: {} } as unknown as APIGatewayProxyEventV2;
    const res = await removeProfile(bad);
    expect(res.statusCode).toBe(401);
  });
});
