/**
 * @application Serverless CRUD API
 * @source src/handlers/get.ts
 * @author Bobwares
 * @version 0.1.1
 * @description Lambda handler for retrieving a single entity by ID (GET /{id}).
 * @updated 2025-06-26T20:04:00Z
 */

import {
  APIGatewayProxyEventV2,
  APIGatewayProxyResult,
  Context,
} from "aws-lambda";
import logger from "../utils/logger";
import { metrics, MetricUnit } from "../utils/metrics";
import { CrudService } from "../services/crud_service";

interface GetResponse {
  statusCode: number;
  headers: { [key: string]: string };
  body: string;
}

const createResponse = (
  statusCode: number,
  body: object,
  errorId?: string,
): GetResponse => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(errorId ? { ...body, errorId } : body),
});

const validateId = (id: unknown): id is string => {
  return typeof id === "string" && id.trim() !== "";
};

export const createHandler =
  (service: CrudService) =>
  async (
    event: APIGatewayProxyEventV2,
    context: Context,
  ): Promise<APIGatewayProxyResult> => {
    logger.addContext(context);
    logger.debug(event);
    try {
      const id = event.pathParameters?.id;
      if (!validateId(id)) {
        logger.error("Missing or invalid id in path parameters", { event });
        metrics.addMetric("GetInvalidId", MetricUnit.Count, 1);
        return createResponse(400, {
          message: "Missing or invalid id parameter",
        });
      }

      const result = await service.get(id);

      if (result) {
        metrics.addMetric("GetSuccess", MetricUnit.Count, 1);
        return createResponse(200, result);
      } else {
        metrics.addMetric("GetNotFound", MetricUnit.Count, 1);
        return createResponse(404, { message: "Not Found" });
      }
    } catch (error) {
      const errorId = context.awsRequestId;
      logger.error("Error in get handler", { error, errorId });
      metrics.addMetric("GetError", MetricUnit.Count, 1);
      return createResponse(500, { message: "Internal Server Error" }, errorId);
    } finally {
      // Publish metrics if required by the metrics utility
      // await metrics.publishStoredMetrics();
    }
  };

export const handler = createHandler(new CrudService());
