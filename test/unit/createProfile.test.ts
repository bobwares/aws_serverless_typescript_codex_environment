import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { createProfile } from '../../src/handlers/customer';
import { putCustomer, logOperation, generateId } from '../../src/lib/repository';

jest.mock('../../src/lib/repository', () => ({
  putCustomer: jest.fn(),
  logOperation: jest.fn(),
  generateId: jest.fn(),
}));

describe('createProfile', () => {
  const baseEvent = {
    headers: { authorization: 'Bearer token' },
    body: JSON.stringify({
      id: '123e4567-e89b-12d3-a456-426614174000',
      firstName: 'John',
      lastName: 'Doe',
      emails: ['john@example.com'],
      privacySettings: { marketingEmailsEnabled: true, twoFactorEnabled: false },
    }),
  } as unknown as APIGatewayProxyEventV2;

  it('returns 202 on success', async () => {
    (putCustomer as jest.Mock).mockResolvedValueOnce(undefined);
    (logOperation as jest.Mock).mockResolvedValueOnce(undefined);
    (generateId as jest.Mock).mockReturnValueOnce('op1');

    const res = await createProfile(baseEvent);
    expect(res.statusCode).toBe(202);
  });

  it('returns 400 when invalid', async () => {
    const event = { ...baseEvent, body: '{}' } as unknown as APIGatewayProxyEventV2;
    const res = await createProfile(event);
    expect(res.statusCode).toBe(400);
  });
});
