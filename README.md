# Customer API

Serverless customer management API using AWS Lambda, API Gateway and DynamoDB.

## Requirements
- Node.js 20
- Terraform >= 1.8

## Commands

```bash
npm ci
npm run lint
npm test
npm run build
npm run deploy # applies Terraform
```

## Endpoints
- `POST /v1/customers` create profile (202 Accepted)
- `PUT /v1/customers/{id}` update profile (202 Accepted)
- `PATCH /v1/customers/{id}` patch profile (202 Accepted)
- `DELETE /v1/customers/{id}` delete profile (202 Accepted)
- `GET /v1/customers/{id}` get profile
- `GET /v1/customers?email=` search by email
- `GET /v1/operations/{id}` poll operation status

All requests require a Cognito JWT in the `Authorization` header.

The schema for payload validation resides in `schema/customerProfile.schema.json`.
