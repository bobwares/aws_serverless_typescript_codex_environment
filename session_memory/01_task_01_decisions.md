# Decisions
- Adopted simple single-table design with `pk` and `sk` plus GSI `gsi1` on primary email.
- Implemented generic logger emitting JSON and filtering debug logs by `NODE_ENV`.
- Provided X-Ray wrapper utility using `aws-xray-sdk-core` to wrap DynamoDB client.
- Lambda handlers delegate to service layer for business logic.
- Each file includes required metadata header.
- Stored provided JSON Schema verbatim in `schema/domain.json`.
