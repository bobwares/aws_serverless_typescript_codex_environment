# Async operations in DynamoDB

**Status**: Accepted

**Date**: 2025-06-16

**Context**
The API must expose asynchronous CRUD endpoints with pollable status records.

**Decision**
Store operation records in the same DynamoDB table as customer profiles using
items keyed by `pk = "OP#<id>"` and `sk = "STATUS"`.

**Consequences**
- Simplifies infrastructure with a single table.
- Polling `/v1/operations/{id}` returns the stored status item.
