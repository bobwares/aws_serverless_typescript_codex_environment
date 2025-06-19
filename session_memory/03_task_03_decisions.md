# Task 03 Decisions

- Used data.archive_file to package compiled handler files into zip archives for Lambda deployment.
- Defined one IAM role per Lambda with minimum DynamoDB actions required.
- API Gateway routes map HTTP verbs and paths to corresponding Lambda integrations.
- Backend S3 config uses placeholders; Terraform initialized with `-backend=false` to avoid credential requirement.
- Provider options disable AWS credential validation for local development.
