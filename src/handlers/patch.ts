/**
 * App: Customer API
 * Package: handlers
 * File: patch.ts
 * Version: 0.1.0
 * Author: Codex
 * Date: 2025-06-24T21:15:51Z
 * Description: Lambda handler to partially update a CustomerProfile.
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
import { validatePartialCustomerProfile } from "../utils/validation.js";
import { CrudService } from "../services/crud_service.js";

const service = new CrudService();

export const handler = (tracer.captureLambdaHandler as any)(
  async (
    event: APIGatewayProxyEventV2,
    context: Context,
  ): Promise<APIGatewayProxyResult> => {
    logger.addContext(context);
    const id = event.pathParameters?.id as string;
    const payload = validatePartialCustomerProfile(parseJson(event));
    const result = await service.patch(id, payload);
    metrics.addMetric("PatchSuccess", MetricUnit.Count, 1);
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  },
);
