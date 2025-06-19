/**
 * App: Customer API
 * Package: utils
 * File: logger.ts
 * Version: 0.1.0
 * Author: ServerlessArchitectBot
 * Date: 2025-06-19T18:24:33Z
 * Description: Environment-aware structured logger exposing debug and error
 *              methods. Debug logs emit only when NODE_ENV is 'dev'.
 */

export interface Logger {
  debug(message: string, meta?: Record<string, unknown>): void;
  error(error: Error, meta?: Record<string, unknown>): void;
}

export function createLogger(requestId: string): Logger {
  const base = { requestId };
  const isDev = process.env.NODE_ENV === "dev";

  return {
    debug(message, meta = {}): void {
      if (isDev) {
        console.debug(
          JSON.stringify({ level: "DEBUG", message, ...base, ...meta }),
        );
      }
    },
    error(error, meta = {}): void {
      console.error(
        JSON.stringify({
          level: "ERROR",
          message: error.message,
          stack: error.stack,
          ...base,
          ...meta,
        }),
      );
    },
  };
}
