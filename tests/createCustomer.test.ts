//  App: Customer API
//  Package: tests
//  File: createCustomer.test.ts
//  Version: 0.1.0
//  Author: ServerlessArchitectBot
//  Date: 2025-06-16T21:44:52Z
//  Description: Tests for createCustomer handler.
// 
import { handler } from '../src/handlers/createCustomer';
import { ddb } from '../src/lib/dynamo';
import { recordSuccess } from '../src/lib/operations';

jest.mock('../src/lib/dynamo');
jest.mock('../src/lib/operations');

const sendMock = jest.fn();
(ddb as unknown as { send: typeof sendMock }).send = sendMock;
(recordSuccess as jest.Mock) = jest.fn().mockResolvedValue({ id: 'op1' });

describe('createCustomer', () => {
  beforeEach(() => jest.clearAllMocks());
  it('creates profile', async () => {
    sendMock.mockResolvedValueOnce({});
    const res = await handler({ headers: { authorization: 'x' }, body: JSON.stringify({ firstName: 'A', lastName: 'B', emails: ['a@example.com'], privacySettings: { marketingEmailsEnabled: true, twoFactorEnabled: false }, id: '123e4567-e89b-12d3-a456-426614174000' } ) } as any);
    expect(res.statusCode).toBe(202);
    expect(sendMock).toHaveBeenCalled();
  });
  it('fails validation', async () => {
    await expect(handler({ headers: { authorization: 'x' }, body: '{}' } as any)).rejects.toThrow();
  });
});
