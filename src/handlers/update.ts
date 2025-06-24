/**
 * App: Customer API
 * Package: handlers
 * File: update.ts
 * Version: 0.1.0
 * Author: Codex
 * Date: 2025-06-24T21:15:51Z
 * Description: Lambda handler to fully replace an existing CustomerProfile.
 */

import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import logger from "../utils/logger.js";
import { metrics, MetricUnit } from "../utils/metrics.js";
import tracer from "../utils/tracer.js";
import { parseJson } from "../utils/parser.js";
import { validateCustomerProfile } from "../utils/validation.js";
import { CrudService } from "../services/crud_service.js";

const service = new CrudService();

export const handler = (tracer.captureLambdaHandler as any)(
  async (
    event: APIGatewayProxyEventV2,
    context: Context,
  ): Promise<APIGatewayProxyResult> => {
    logger.addContext(context);
    const payload = validateCustomerProfile(parseJson(event));
    const result = await service.update(payload);
    metrics.addMetric("UpdateSuccess", MetricUnit.Count, 1);
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  },
);
