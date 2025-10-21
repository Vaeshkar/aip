"use strict";
/**
 * AIP (AI-Protocol) Schema v1.0.0
 *
 * TypeScript type definitions for the AI-Protocol specification.
 * This schema defines the core types and interfaces for AIP communication.
 *
 * @version 1.0.0
 * @author Digital Liquids (Dennis van Leeuwen)
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIPErrorCode = void 0;
exports.isToolCapability = isToolCapability;
exports.isContextCapability = isContextCapability;
exports.isResourceCapability = isResourceCapability;
exports.isStreamingCapability = isStreamingCapability;
exports.isCustomCapability = isCustomCapability;
exports.isAIPError = isAIPError;
// ============================================================================
// Error Types
// ============================================================================
var AIPErrorCode;
(function (AIPErrorCode) {
    // JSON-RPC standard errors
    AIPErrorCode[AIPErrorCode["PARSE_ERROR"] = -32700] = "PARSE_ERROR";
    AIPErrorCode[AIPErrorCode["INVALID_REQUEST"] = -32600] = "INVALID_REQUEST";
    AIPErrorCode[AIPErrorCode["METHOD_NOT_FOUND"] = -32601] = "METHOD_NOT_FOUND";
    AIPErrorCode[AIPErrorCode["INVALID_PARAMS"] = -32602] = "INVALID_PARAMS";
    AIPErrorCode[AIPErrorCode["INTERNAL_ERROR"] = -32603] = "INTERNAL_ERROR";
    // HTTP-style errors
    AIPErrorCode[AIPErrorCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    AIPErrorCode[AIPErrorCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    AIPErrorCode[AIPErrorCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    AIPErrorCode[AIPErrorCode["RATE_LIMIT_EXCEEDED"] = 429] = "RATE_LIMIT_EXCEEDED";
    AIPErrorCode[AIPErrorCode["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    // AIP-specific errors
    AIPErrorCode[AIPErrorCode["CAPABILITY_NOT_SUPPORTED"] = 1000] = "CAPABILITY_NOT_SUPPORTED";
    AIPErrorCode[AIPErrorCode["TOOL_EXECUTION_FAILED"] = 1001] = "TOOL_EXECUTION_FAILED";
    AIPErrorCode[AIPErrorCode["CONTEXT_NOT_AVAILABLE"] = 1002] = "CONTEXT_NOT_AVAILABLE";
    AIPErrorCode[AIPErrorCode["RESOURCE_NOT_ACCESSIBLE"] = 1003] = "RESOURCE_NOT_ACCESSIBLE";
    AIPErrorCode[AIPErrorCode["STREAM_ERROR"] = 1004] = "STREAM_ERROR";
    AIPErrorCode[AIPErrorCode["SESSION_EXPIRED"] = 1005] = "SESSION_EXPIRED";
    AIPErrorCode[AIPErrorCode["AUTHENTICATION_FAILED"] = 1006] = "AUTHENTICATION_FAILED";
    AIPErrorCode[AIPErrorCode["AUTHORIZATION_FAILED"] = 1007] = "AUTHORIZATION_FAILED";
})(AIPErrorCode || (exports.AIPErrorCode = AIPErrorCode = {}));
// ============================================================================
// Type Guards
// ============================================================================
function isToolCapability(cap) {
    return cap.type === "tool";
}
function isContextCapability(cap) {
    return cap.type === "context";
}
function isResourceCapability(cap) {
    return cap.type === "resource";
}
function isStreamingCapability(cap) {
    return cap.type === "streaming";
}
function isCustomCapability(cap) {
    return cap.type === "custom";
}
function isAIPError(response) {
    return response.error !== undefined;
}
//# sourceMappingURL=aip-schema.js.map