
# AWS Serverless Codex Starter

A reference implementation of a **serverless CRUD application** built with:

- **AWS Lambda (Node.js 20, ESM)**
- **Amazon API Gateway (HTTP API)**
- **Amazon DynamoDB (single-table design)**
- **Terraform ≥ 1.8** for infrastructure-as-code (IaC)

The repository is organized so that _everything_—handlers, tests, and IaC—can be generated and maintained by AI coding agents orchestrated through the tasks in `/tasks`.

---

## Requirements

| Tool            | Version | Notes                              |
|-----------------|---------|------------------------------------|
| Node.js         | 20.x    | See `.nvmrc` for exact minor       |
| Terraform CLI   | ≥ 1.8   | Tested with 1.8.5                  |
| npm             | 10.x    | Installed with Node 20             |

---

## Project Structure

```text
.
├── src/          # Lambda handlers & service code (generated)
├── test/         # Jest unit tests (generated)
├── iac/          # Terraform modules & root configuration
│   └── envs/     # *.tfvars for dev, stage, prod
├── tasks/        # Task definitions for the AI coding agent
├── AGENTS.md     # Versioning, commit, & PR guidelines
└── README.md
````

---

## Getting Started

1. **Install dependencies & run static checks**

   ```bash
   npm ci
   npm run lint
   npm test
   ```

2. **Build**

   ```bash
   npm run build
   ```

   The `esbuild.mjs` script bundles each TypeScript handler into an
   ESM-compatible artifact for the Lambda (Node 20) runtime.

3. **Deploy**

   ```bash
   npm run deploy         # invokes build + terraform apply
   ```

   This command:

    1. Compiles the handlers.
    2. Applies the Terraform under `iac/`, provisioning:

        * An HTTP API in API Gateway
        * One Lambda function per CRUD verb
        * A DynamoDB single-table instance
        * IAM roles and least-privilege policies

---

## How It Works

| Task file                                                     | Purpose                                                                                       |
| ------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Task 01 – Generate Source Code for CRUD Serverless App.md** | Define the Lambda handler interfaces, service layer, and DynamoDB data-access helpers.        |
| **Task 02 – Generate Unit Tests.md**                          | Achieve ≥ 90 % branch/function/line coverage with Jest 29 (ESM).                              |
| **Task 03 – Generate Terraform.md**                           | Provision API Gateway, Lambda, DynamoDB, and IAM roles using best-practice Terraform modules. |

The AI coding agent processes these tasks sequentially to keep source, tests, and infrastructure in sync.

---

## Development Workflow

1. Follow **AGENTS.md** for:

    * JSDoc headers
    * Semantic versioning
    * Conventional commit messages

2. Before every commit:

   ```bash
   npm run lint
   npm test
   npm run build
   ```

3. Deploy to your target environment:

   ```bash
   # e.g. DEV
   npm run deploy -- --var-file=iac/envs/dev.tfvars
   ```

---

## Environment Configuration

* **Terraform variable files** live in `iac/envs/`.

    * `dev.tfvars`, `stage.tfvars`, `prod.tfvars`
* Per-environment overrides include DynamoDB read/write capacity, API Gateway logging level, and Lambda memory/timeout settings.

---

> **Tip:** Use the task-driven approach to regenerate any layer (handlers, tests, or IaC). Update the relevant `tasks/*.md`, run the agent, and commit the generated artifacts together.


