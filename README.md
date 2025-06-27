# AWS Serverless TypeScript Codex Starter

This project is a **template repository** for building serverless applications with [ChatGPT Codex](https://openai.com/blog/chatgpt-plugins). It provides preconfigured tasks, tooling and infrastructure to generate a complete CRUD API on AWS using TypeScript and Terraform.

The workflow is centred around a domain schema you supply. Codex reads this schema and produces Lambda handlers, a service layer, tests and infrastructure code. Use this starter to bootstrap new projects quickly while keeping structure and best practices consistent.

## Project Structure

```
.
├── schema/                  # Place your domain schema here (JSON or YAML)
├── src/                     # Generated application code (handlers, services, utils)
├── test/                    # Jest unit and integration tests
├── iac/                     # Terraform modules and environment tfvars
├── tasks/                   # Codex task definitions
├── esbuild.mjs              # Build script for Lambda handlers
├── package.json             # Node 20 dependencies and scripts
└── README.md                # Project documentation (this file)
```

## Getting Started

1. **Clone the Repository**

   ```bash
   gh repo create my-serverless-app --template <your-org>/aws_serverless_typescript_codex_starter --public
   cd my-serverless-app
   ```

2. **Install Node Dependencies**

   ```bash
   npm ci
   ```

3. **Provide a Domain Schema**

   Create `schema/domain.json` or `schema/domain.yaml` describing your business entities. This schema drives all subsequent code generation.

   Example snippet:

   ```yaml
   title: Customer
   resource: customers
   type: object
   properties:
     id:
       type: string
       format: uuid
     firstName:
       type: string
     lastName:
       type: string
   required: [id, firstName, lastName]
   ```

4. **Open the Repository with ChatGPT Codex**

   Use the ChatGPT web interface and load this repository. Codex will read the tasks under `tasks/` and guide you through generating source code, tests and infrastructure. Tasks are executed in order:

   1. Generate Source Code for CRUD Serverless App
   2. Generate Unit Tests
   3. Generate Terraform Infrastructure

   Follow the prompts in each task file to complete the implementation.

## Commands

Common npm scripts:

```bash
npm run lint    # ESLint
npm test        # Jest unit tests
npm run build   # Compile handlers with esbuild
npm run deploy  # Builds then applies Terraform (iac/)
```

### Terraform

Infrastructure code lives in the `iac/` directory. Each environment (dev, stage, prod) has a corresponding `tfvars` file under `iac/envs/`.

```bash
cd iac
terraform init -backend-config=envs/dev.tfvars
terraform apply -var-file=envs/dev.tfvars -auto-approve
```

This deploys an HTTP API Gateway, Lambda functions, and a DynamoDB single-table setup with a GSI named `gsi1`.

## Using the Generated API

After deployment, the base API URL is written to `test/http/api_url.txt`. You can send HTTP requests to the CRUD routes using the verb-based paths (e.g., `POST /customers`).

## Contributing

This template follows Conventional Commits and the PR summary format defined in `AGENTS.md`. Please review that file for contribution guidelines.

## License

MIT
