# Task 01 Decisions

- Chose DynamoDB single-table with pk `CUST#<id>` and sk `PROFILE`.
- Added GSI `gsi1` for listing customers by last name.
- Logger suppresses debug messages unless `NODE_ENV=dev`.
- X-Ray helper wraps DynamoDB client and closes segments after each handler.
- Handlers implemented for CRUD actions following API Gateway HTTP API events.
