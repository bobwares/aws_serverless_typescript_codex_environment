/**
 * App: Customer API
 * Package: utils
 * File: logger.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-19T19:00:00Z
 * Description: Provides environment-aware structured logging. Debug logs are
 *              emitted only when NODE_ENV=dev.
 */

export interface LogFields {
  level: "debug" | "info" | "warn" | "error";
  message: string;
  requestId?: string;
  [key: string]: unknown;
}

function log(fields: LogFields): void {
  const { level, ...rest } = fields;
  if (level === "debug" && process.env.NODE_ENV !== "dev") {
    return;
  }
  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ level, ...rest }));
}

export const logger = {
  debug(message: string, meta: Record<string, unknown> = {}): void {
    log({ level: "debug", message, ...meta });
  },
  info(message: string, meta: Record<string, unknown> = {}): void {
    log({ level: "info", message, ...meta });
  },
  warn(message: string, meta: Record<string, unknown> = {}): void {
    log({ level: "warn", message, ...meta });
  },
  error(message: string, meta: Record<string, unknown> = {}): void {
    log({ level: "error", message, ...meta });
  },
};
