//  App: Customer API
//  Package: lib
//  File: auth.ts
//  Version: 0.1.0
//  Author: ServerlessArchitectBot
//  Date: 2025-06-16T21:44:52Z
//  Description: Simple Cognito JWT authorization stub.
// 
import { APIGatewayProxyEventV2 } from 'aws-lambda';

export function authorize(event: APIGatewayProxyEventV2): void {
  const auth = event.headers?.authorization;
  if (!auth) {
    const err = new Error('Unauthorized');
    (err as Error & { statusCode?: number }).statusCode = 401;
    throw err;
  }
}
