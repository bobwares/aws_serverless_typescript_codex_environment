aws dynamodb get-item \
  --table-name $(terraform output -raw dynamodb_table_name) \
  --key '{
    "pk": {"S":"CUSTOMER#11111111-1111-1111-1111-111101111114"},
    "sk": {"S":"PROFILE"}
  }'
