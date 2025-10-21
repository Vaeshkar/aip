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
export type JSONRPC = "2.0";
export interface JSONRPCRequest<T = Record<string, unknown>> {
    jsonrpc: JSONRPC;
    id: string | number;
    method: string;
    params?: T;
}
export interface JSONRPCResponse<T = unknown> {
    jsonrpc: JSONRPC;
    id: string | number;
    result?: T;
    error?: JSONRPCError;
}
export interface JSONRPCError {
    code: number;
    message: string;
    data?: unknown;
}
export interface JSONRPCNotification<T = Record<string, unknown>> {
    jsonrpc: JSONRPC;
    method: string;
    params?: T;
}
export type AIPVersion = "1.0.0";
export type TransportType = "http" | "websocket" | "stdio" | "custom";
export type AuthType = "bearer" | "apikey" | "oauth2" | "mtls" | "none";
export type CapabilityType = "tool" | "context" | "resource" | "streaming" | "custom";
export type ContextFormat = "aicf" | "json" | "text" | "markdown";
export interface HandshakeRequest {
    version: AIPVersion;
    client: ClientInfo;
    auth?: AuthInfo;
}
export interface ClientInfo {
    name: string;
    version: string;
    capabilities: CapabilityType[];
    metadata?: Record<string, unknown>;
}
export interface AuthInfo {
    type: AuthType;
    token?: string;
    credentials?: Record<string, unknown>;
}
export interface HandshakeResponse {
    version: AIPVersion;
    server: ServerInfo;
    session: SessionInfo;
}
export interface ServerInfo {
    name: string;
    version: string;
    capabilities: CapabilityType[];
    metadata?: Record<string, unknown>;
}
export interface SessionInfo {
    id: string;
    expires?: string;
    metadata?: Record<string, unknown>;
}
export interface Capability {
    type: CapabilityType;
    name: string;
    description: string;
    metadata?: Record<string, unknown>;
}
export interface ToolCapability extends Capability {
    type: "tool";
    schema: JSONSchema;
    dangerous?: boolean;
    category?: string;
    tags?: string[];
}
export interface ContextCapability extends Capability {
    type: "context";
    format: ContextFormat;
    schema?: AICFSchema | JSONSchema;
    refreshable?: boolean;
}
export interface ResourceCapability extends Capability {
    type: "resource";
    uri: string;
    mimeType?: string;
    size?: number;
}
export interface StreamingCapability extends Capability {
    type: "streaming";
    chunkSize?: number;
    timeout?: number;
}
export interface CustomCapability extends Capability {
    type: "custom";
    namespace: string;
    schema: JSONSchema;
}
export type AnyCapability = ToolCapability | ContextCapability | ResourceCapability | StreamingCapability | CustomCapability;
export interface ToolInvokeRequest {
    tool: string;
    arguments: Record<string, unknown>;
    stream?: boolean;
    timeout?: number;
}
export interface ToolInvokeResponse {
    success: boolean;
    data?: unknown;
    error?: string;
    metadata?: Record<string, unknown>;
}
export interface ToolStreamChunk {
    chunk: unknown;
    done: boolean;
    metadata?: Record<string, unknown>;
}
export interface ContextGetRequest {
    context: string;
    format?: ContextFormat;
    refresh?: boolean;
}
export interface ContextGetResponse {
    format: ContextFormat;
    data: string | object;
    metadata?: {
        size?: number;
        updated?: string;
        version?: string;
    };
}
export interface ResourceGetRequest {
    resource: string;
    range?: {
        start: number;
        end: number;
    };
}
export interface ResourceGetResponse {
    uri: string;
    mimeType?: string;
    data: string | Buffer;
    metadata?: {
        size?: number;
        modified?: string;
    };
}
export interface AICFSchema {
    section: string;
    fields: string[];
    description?: string;
}
export interface AICFData {
    section: string;
    schema: string[];
    data: string[][];
    notes?: string[];
}
export interface JSONSchema {
    type?: "object" | "array" | "string" | "number" | "boolean" | "null";
    properties?: Record<string, JSONSchema>;
    items?: JSONSchema;
    required?: string[];
    description?: string;
    enum?: unknown[];
    default?: unknown;
    [key: string]: unknown;
}
export declare enum AIPErrorCode {
    PARSE_ERROR = -32700,
    INVALID_REQUEST = -32600,
    METHOD_NOT_FOUND = -32601,
    INVALID_PARAMS = -32602,
    INTERNAL_ERROR = -32603,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    RATE_LIMIT_EXCEEDED = 429,
    INTERNAL_SERVER_ERROR = 500,
    CAPABILITY_NOT_SUPPORTED = 1000,
    TOOL_EXECUTION_FAILED = 1001,
    CONTEXT_NOT_AVAILABLE = 1002,
    RESOURCE_NOT_ACCESSIBLE = 1003,
    STREAM_ERROR = 1004,
    SESSION_EXPIRED = 1005,
    AUTHENTICATION_FAILED = 1006,
    AUTHORIZATION_FAILED = 1007
}
export interface AIPError extends JSONRPCError {
    code: AIPErrorCode;
    message: string;
    data?: {
        details?: string;
        retryAfter?: number;
        [key: string]: unknown;
    };
}
export interface RateLimitInfo {
    limit: number;
    remaining: number;
    reset: string;
    retryAfter?: number;
}
export interface ServerNotification {
    type: "capability.added" | "capability.removed" | "session.expiring" | "custom";
    data: unknown;
}
export type AIPMethod = "aip.handshake" | "aip.capabilities.list" | "aip.tool.invoke" | "aip.context.get" | "aip.resource.get" | "aip.session.refresh" | "aip.session.close";
export type AIPRequest = JSONRPCRequest<HandshakeRequest> | JSONRPCRequest<{}> | JSONRPCRequest<ToolInvokeRequest> | JSONRPCRequest<ContextGetRequest> | JSONRPCRequest<ResourceGetRequest>;
export type AIPResponse = JSONRPCResponse<HandshakeResponse> | JSONRPCResponse<{
    capabilities: AnyCapability[];
}> | JSONRPCResponse<ToolInvokeResponse> | JSONRPCResponse<ContextGetResponse> | JSONRPCResponse<ResourceGetResponse> | JSONRPCResponse<ToolStreamChunk>;
export declare function isToolCapability(cap: AnyCapability): cap is ToolCapability;
export declare function isContextCapability(cap: AnyCapability): cap is ContextCapability;
export declare function isResourceCapability(cap: AnyCapability): cap is ResourceCapability;
export declare function isStreamingCapability(cap: AnyCapability): cap is StreamingCapability;
export declare function isCustomCapability(cap: AnyCapability): cap is CustomCapability;
export declare function isAIPError(response: JSONRPCResponse): response is JSONRPCResponse & {
    error: AIPError;
};
//# sourceMappingURL=aip-schema.d.ts.map