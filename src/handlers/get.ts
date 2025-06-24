/**
 * App: Customer API
 * Package: handlers
 * File: get.ts
 * Version: 0.1.0
 * Author: Codex
 * Date: 2025-06-24T21:15:51Z
 * Description: Lambda handler to retrieve a CustomerProfile by id.
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
    const result = await service.get(id);
    metrics.addMetric("GetSuccess", MetricUnit.Count, 1);
    return {
      statusCode: result ? 200 : 404,
      body: JSON.stringify(result ?? { message: "Not Found" }),
    };
  },
);
