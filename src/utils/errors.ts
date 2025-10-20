/**
 * AIP Error classes
 */

import { AIPErrorCode } from "../schema/aip-schema";

/**
 * Base AIP Error class
 */
export class AIPError extends Error {
  public readonly code: AIPErrorCode;
  public readonly data?: unknown;

  constructor(code: AIPErrorCode, message: string, data?: unknown) {
    super(message);
    this.name = "AIPError";
    this.code = code;
    this.data = data;
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Convert to JSON-RPC error format
   */
  toJSON() {
    return {
      code: this.code,
      message: this.message,
      data: this.data,
    };
  }
}

/**
 * Parse error (-32700)
 */
export class ParseError extends AIPError {
  constructor(message = "Parse error", data?: unknown) {
    super(AIPErrorCode.PARSE_ERROR, message, data);
    this.name = "ParseError";
  }
}

/**
 * Invalid request (-32600)
 */
export class InvalidRequestError extends AIPError {
  constructor(message = "Invalid Request", data?: unknown) {
    super(AIPErrorCode.INVALID_REQUEST, message, data);
    this.name = "InvalidRequestError";
  }
}

/**
 * Method not found (-32601)
 */
export class MethodNotFoundError extends AIPError {
  constructor(method: string, data?: unknown) {
    super(AIPErrorCode.METHOD_NOT_FOUND, `Method not found: ${method}`, data);
    this.name = "MethodNotFoundError";
  }
}

/**
 * Invalid params (-32602)
 */
export class InvalidParamsError extends AIPError {
  constructor(message = "Invalid params", data?: unknown) {
    super(AIPErrorCode.INVALID_PARAMS, message, data);
    this.name = "InvalidParamsError";
  }
}

/**
 * Internal error (-32603)
 */
export class InternalError extends AIPError {
  constructor(message = "Internal error", data?: unknown) {
    super(AIPErrorCode.INTERNAL_ERROR, message, data);
    this.name = "InternalError";
  }
}

/**
 * Unauthorized (401)
 */
export class UnauthorizedError extends AIPError {
  constructor(message = "Unauthorized", data?: unknown) {
    super(AIPErrorCode.UNAUTHORIZED, message, data);
    this.name = "UnauthorizedError";
  }
}

/**
 * Forbidden (403)
 */
export class ForbiddenError extends AIPError {
  constructor(message = "Forbidden", data?: unknown) {
    super(AIPErrorCode.FORBIDDEN, message, data);
    this.name = "ForbiddenError";
  }
}

/**
 * Not found (404)
 */
export class NotFoundError extends AIPError {
  constructor(resource: string, data?: unknown) {
    super(AIPErrorCode.NOT_FOUND, `Not found: ${resource}`, data);
    this.name = "NotFoundError";
  }
}

/**
 * Rate limit exceeded (429)
 */
export class RateLimitError extends AIPError {
  constructor(retryAfter?: number, data?: unknown) {
    const errorData =
      data && typeof data === "object"
        ? { retryAfter, ...(data as Record<string, unknown>) }
        : { retryAfter, data };

    super(AIPErrorCode.RATE_LIMIT_EXCEEDED, "Rate limit exceeded", errorData);
    this.name = "RateLimitError";
  }
}

/**
 * Tool execution failed (1001)
 */
export class ToolExecutionError extends AIPError {
  constructor(tool: string, message: string, data?: unknown) {
    super(
      AIPErrorCode.TOOL_EXECUTION_FAILED,
      `Tool execution failed: ${tool} - ${message}`,
      data
    );
    this.name = "ToolExecutionError";
  }
}

/**
 * Context not available (1002)
 */
export class ContextNotAvailableError extends AIPError {
  constructor(context: string, data?: unknown) {
    super(
      AIPErrorCode.CONTEXT_NOT_AVAILABLE,
      `Context not available: ${context}`,
      data
    );
    this.name = "ContextNotAvailableError";
  }
}

/**
 * Session expired (1005)
 */
export class SessionExpiredError extends AIPError {
  constructor(data?: unknown) {
    super(AIPErrorCode.SESSION_EXPIRED, "Session expired", data);
    this.name = "SessionExpiredError";
  }
}
