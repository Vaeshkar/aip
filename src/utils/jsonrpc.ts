/**
 * JSON-RPC 2.0 utility functions
 */

import type {
  JSONRPCRequest,
  JSONRPCResponse,
  JSONRPCError,
  AIPErrorCode,
} from "../schema/aip-schema";

/**
 * Create a JSON-RPC 2.0 request
 */
export function createJSONRPCRequest<T = Record<string, unknown>>(
  method: string,
  params?: T,
  id?: string | number
): JSONRPCRequest<T> {
  return {
    jsonrpc: "2.0",
    id: id ?? generateRequestId(),
    method,
    params,
  };
}

/**
 * Create a JSON-RPC 2.0 success response
 */
export function createJSONRPCResponse<T>(
  id: string | number,
  result: T
): JSONRPCResponse<T> {
  return {
    jsonrpc: "2.0",
    id,
    result,
  };
}

/**
 * Create a JSON-RPC 2.0 error response
 */
export function createJSONRPCError(
  id: string | number,
  code: AIPErrorCode,
  message: string,
  data?: unknown
): JSONRPCResponse {
  return {
    jsonrpc: "2.0",
    id,
    error: {
      code,
      message,
      data,
    },
  };
}

/**
 * Generate a unique request ID
 */
export function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Validate JSON-RPC request
 */
export function validateJSONRPCRequest(obj: unknown): obj is JSONRPCRequest {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  const req = obj as Partial<JSONRPCRequest>;

  return (
    req.jsonrpc === "2.0" &&
    (typeof req.id === "string" || typeof req.id === "number") &&
    typeof req.method === "string"
  );
}

/**
 * Validate JSON-RPC response
 */
export function validateJSONRPCResponse(obj: unknown): obj is JSONRPCResponse {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }

  const res = obj as Partial<JSONRPCResponse>;

  return (
    res.jsonrpc === "2.0" &&
    (typeof res.id === "string" || typeof res.id === "number") &&
    (res.result !== undefined || res.error !== undefined)
  );
}
