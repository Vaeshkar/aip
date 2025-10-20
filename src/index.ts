/**
 * AIP (AI-Protocol) Core Library
 *
 * @module @digital-liquids/aip-core
 * @version 1.0.0
 * @license MIT
 */

// Export types
export * from "./schema/aip-schema";

// Export core classes
export { AIPServer } from "./server/AIPServer";
export { AIPClient } from "./client/AIPClient";

// Export transport implementations
export { HTTPTransport } from "./transport/HTTPTransport";

// Export utilities
export {
  createJSONRPCRequest,
  createJSONRPCResponse,
  createJSONRPCError,
} from "./utils/jsonrpc";
export { AIPError } from "./utils/errors";

// Export version
export const AIP_VERSION = "1.0.0";
