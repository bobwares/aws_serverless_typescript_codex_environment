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

The build command bundles each Lambda into a zip file under `dist/`. Deployment
applies the Terraform in `iac/` which provisions DynamoDB, Lambda functions and
an HTTP API.
