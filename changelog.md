# Version History

### 0.1.0 – 2025-06-21 00:00:00 UTC (main)

#### Task
Initial project setup.

#### Changes
- Initial project structure and configuration.

### 0.1.1 – 2025-06-21 18:34:41 UTC (work)

#### Task
Update tfvars schema path.

#### Changes
- Point env schema_path to ../schema/domain.json.

### 0.1.2 – 2025-06-21 18:41:22 UTC (work)

#### Task
Add GET /items route and Lambda mapping.

#### Changes
- Add GET /items route in apigw.tf.
- Register list Lambda in lambda.tf.

### 0.1.3 – 2025-06-24 21:15:51 UTC (work)

#### Task
Task 01 – Generate Source Code for CRUD Serverless App

#### Changes
- Added CRUD handlers, service layer, and utility singletons
- Saved CustomerProfile schema
- Recorded session memory files for Task 01

### 0.1.4 – 2025-06-24 21:41:00 UTC (work)

#### Task
Task 02 – Generate Unit Tests

#### Changes
- Added comprehensive Jest suites covering handlers, services, and utilities
- Created HTTP request examples under test/http
- Configured jest.config with coverage thresholds and tsconfig for tests
