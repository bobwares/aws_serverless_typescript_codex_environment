# Customer Profile Architecture

**Status**: Accepted

**Date**: 2025-06-18

**Context**
We need an async CRUD API for customer profiles using AWS serverless
technologies with DynamoDB and API Gateway. Search by email is required
so a Global Secondary Index must be used. Operations must be pollable.

**Decision**
Implement a single-table DynamoDB design with `pk` and `sk` keys and a
GSI (`gsi1`) keyed by email. POST/PUT/PATCH/DELETE handlers store an
operation record and return `202 Accepted`. Each handler is a separate
Lambda function built with esbuild. Terraform modules manage DynamoDB,
Lambda, and API Gateway resources.

**Consequences**
- Simplifies deployment with isolated modules.
- Asynchronous pattern allows future long-running tasks.
- DynamoDB single-table approach keeps queries predictable via GSI.
