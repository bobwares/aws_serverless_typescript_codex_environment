/**
 * App: Customer API
 * Package: handlers
 * File: create.ts
 * Version: 0.1.0
 * Author: Codex
 * Date: 2025-06-24T21:15:51Z
 * Description: Lambda handler to create a new CustomerProfile item.
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
    const created = await service.create(payload);
    metrics.addMetric("CreateSuccess", MetricUnit.Count, 1);
    return {
      statusCode: 201,
      body: JSON.stringify(created),
    };
  },
);
