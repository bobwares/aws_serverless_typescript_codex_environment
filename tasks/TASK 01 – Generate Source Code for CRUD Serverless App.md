# TASK 01 – Generate Source Code for CRUD Serverless App

## Goal

Create a production-ready CRUD serverless application that uses a **DynamoDB single-table** design.
All code must:

* Target **Node 20 (arm64)**, TypeScript, and the dependency versions in `package.json`.
* Provide Lambda handlers for **create, get, update, patch, delete, list/search**.
* Route requests through **API Gateway HTTP API**.
* Persist data in a single DynamoDB table (composite PK/SK) with GSI `gsi1`.
* Emit structured logs:

    * **Error** level (always) to CloudWatch Logs.
    * **Debug** level only when `NODE_ENV=dev`, correlated by `requestId`.
* Integrate **AWS X-Ray** in all handlers (capture AWS SDK and handler segments).

## Inputs

| Path / Reference             | Purpose                                                                |
| ---------------------------- | ---------------------------------------------------------------------- |
| **User input** (JSON Schema) | Domain model for CRUD entities; must be saved as `schema/domain.json`. |
| `package.json`               | Locked runtime and tooling versions                                    |
| `session_memory/*.md`        | Persisted context from prior tasks                                     |

## Tools

| Tool ID      | Shell Invocation | Purpose                                                                 |
| ------------ |------------------|-------------------------------------------------------------------------|
| npm\_install | `npm install`    | Install dependencies                                                    |
| npm\_lint    | `npm run lint`   | ESLint / Prettier check. If warning or errors, then fix code and rerun. |
| npm\_build   | `npm run build`  | Production bundle (esbuild). If errors, then fix code and rereun.       |

## Acceptance Criteria

1. **Compilation** – `npm run build` succeeds without errors.
2. **Lint** – `npm run lint` exits with code 0.
3. **Handlers** – One Lambda handler per CRUD action under `src/handlers/`.
4. **Service layer** – Business logic isolated in `src/services/`.
5. **Data access** – Table name from env `TABLE_NAME`; single-table pattern with GSI `gsi1`.
6. **Logging** –

    * Errors: structured output with stack trace, always.
    * Debug: emitted only when `NODE_ENV=dev`.
7. **Tracing** – `AWSXRay.captureAWSv3Client()` wraps DynamoDB DocumentClient; handler segments closed explicitly.
8. **Type safety** – All code fully typed; no `any` or `ts-ignore`.
9. **Docs** – Each source file begins with the mandated metadata header.
10. **Schema persisted** – The provided JSON Schema is written verbatim to `schema/domain.json`.

## Deliverables

* `src/handlers/*.ts` – Lambda entry points for all CRUD actions.
* `src/services/*.ts` – Business and data-access logic.
* `src/utils/logger.ts` – Environment-aware structured logger.
* `src/utils/xray.ts` – X-Ray initialisation helper.
* `schema/domain.json` – Saved copy of the user-provided JSON Schema.
* `session_memory/01_task_01_output.md` – Summary of created files.
* `session_memory/01_task_01_decisions.md` – Key design decisions and rationale.
