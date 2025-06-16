import { APIGatewayProxyEventV2 } from 'aws-lambda';

export function requireAuth(event: APIGatewayProxyEventV2): void {
  const token = event.headers?.authorization;
  if (!token || !token.startsWith('Bearer ')) {
    const err = new Error('Unauthorized');
    (err as { statusCode?: number }).statusCode = 401;
    throw err;
  }
}
