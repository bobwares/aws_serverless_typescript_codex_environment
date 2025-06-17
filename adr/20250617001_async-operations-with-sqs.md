# Async operations with SQS

**Status**: Accepted

**Date**: 2025-06-17

**Context**
To comply with the async REST requirement, write operations must return 202 and be pollable.

**Decision**
Use SQS to queue operations. API lambdas enqueue a message and create an operation item in DynamoDB. A worker Lambda processes the queue and updates the operation status.

**Consequences**
This approach decouples request latency from database writes and enables retries but introduces an additional Lambda and queue resource.
