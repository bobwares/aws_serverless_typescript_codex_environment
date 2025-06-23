/**
 * App: Customer API
 * Package: utils
 * File: logger.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-21T00:00:00Z
 * Description: Environment-aware structured logging utilities for Lambda handlers.
 */

export interface LogEntry {
  level: "debug" | "error";
  message: string;
  requestId?: string;
  stack?: string;
}

const debugEnabled = process.env.NODE_ENV === "dev";

export function debug(message: string, requestId?: string): void {
  if (debugEnabled) {
    const entry: LogEntry = { level: "debug", message, requestId };
    console.debug(JSON.stringify(entry));
  }
}

export function error(message: string, err: unknown, requestId?: string): void {
  const entry: LogEntry = {
    level: "error",
    message,
    requestId,
    stack: err instanceof Error ? err.stack : undefined,
  };
  console.error(JSON.stringify(entry));
}
