#!/usr/bin/env bash
set -euo pipefail

API_NAME="customerprofile-api-dev"         # <- check spelling in AWS Console
LOG_GROUP="/aws/apigw/${API_NAME}"
REQ_ID="MyNWgieNIAMEM5A="

# macOS-compatible epoch helper
epoch() { date -j -u -f "%Y-%m-%dT%H:%M:%SZ" "$1" +"%s"; }

START=$(epoch "2025-06-26T18:10:00Z")
END=$(epoch   "2025-06-26T18:25:00Z")

echo "Querying $LOG_GROUP from $START to $END for requestId=$REQ_ID"

QUERY_ID=$(aws logs start-query \
  --log-group-name "$LOG_GROUP" \
  --start-time "$START" \
  --end-time   "$END" \
  --query-string "
      fields @timestamp, routeKey, status, error
      | filter requestId = '$REQ_ID'
      | sort @timestamp asc
    " \
  --query "queryId" --output text)

# AWS needs a short wait for the query to finish (~1‒3 s)
sleep 2

aws logs get-query-results --query-id "$QUERY_ID"
