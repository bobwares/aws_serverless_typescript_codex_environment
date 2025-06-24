/**
 * App: Customer API
 * Package: handlers
 * File: delete.ts
 * Version: 0.1.0
 * Author: Codex
 * Date: 2025-06-24T21:15:51Z
 * Description: Lambda handler to delete a CustomerProfile item by id.
 */

import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import logger from "../utils/logger.js";
import { metrics, MetricUnit } from "../utils/metrics.js";
import tracer from "../utils/tracer.js";
import { CrudService } from "../services/crud_service.js";

const service = new CrudService();

export const handler = (tracer.captureLambdaHandler as any)(
  async (
    event: APIGatewayProxyEventV2,
    context: Context,
  ): Promise<APIGatewayProxyResult> => {
    logger.addContext(context);
    const id = event.pathParameters?.id as string;
    await service.delete(id);
    metrics.addMetric("DeleteSuccess", MetricUnit.Count, 1);
    return {
      statusCode: 204,
      body: "",
    };
  },
);
