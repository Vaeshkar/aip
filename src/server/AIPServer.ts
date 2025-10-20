/**
 * AIP Server implementation
 */

import type {
  AIPVersion,
  ServerInfo,
  SessionInfo,
  AnyCapability,
  ToolCapability,
  ContextCapability,
  HandshakeRequest,
  HandshakeResponse,
  ToolInvokeRequest,
  ToolInvokeResponse,
  ContextGetRequest,
  ContextGetResponse,
  JSONRPCRequest,
  JSONRPCResponse,
} from "../schema/aip-schema";

import {
  createJSONRPCResponse,
  createJSONRPCError,
  validateJSONRPCRequest,
} from "../utils/jsonrpc";

import {
  AIPError,
  MethodNotFoundError,
  InvalidParamsError,
  ToolExecutionError,
  ContextNotAvailableError,
} from "../utils/errors";

import { AIPErrorCode } from "../schema/aip-schema";

/**
 * Tool handler function
 */
export type ToolHandler = (
  args: Record<string, unknown>
) => Promise<ToolInvokeResponse>;

/**
 * Context handler function
 */
export type ContextHandler = () => Promise<ContextGetResponse>;

/**
 * AIP Server configuration
 */
export interface AIPServerConfig {
  name: string;
  version: string;
  capabilities?: string[];
  metadata?: Record<string, unknown>;
}

/**
 * AIP Server class
 */
export class AIPServer {
  private config: AIPServerConfig;
  private tools: Map<
    string,
    { capability: ToolCapability; handler: ToolHandler }
  > = new Map();
  private contexts: Map<
    string,
    { capability: ContextCapability; handler: ContextHandler }
  > = new Map();
  private sessions: Map<string, SessionInfo> = new Map();

  constructor(config: AIPServerConfig) {
    this.config = config;
  }

  /**
   * Get server info
   */
  getServerInfo(): ServerInfo {
    const capabilities: string[] = [];

    if (this.tools.size > 0) capabilities.push("tool");
    if (this.contexts.size > 0) capabilities.push("context");

    return {
      name: this.config.name,
      version: this.config.version,
      capabilities: capabilities as any,
      metadata: this.config.metadata,
    };
  }

  /**
   * Register a tool
   */
  registerTool(capability: ToolCapability, handler: ToolHandler): void {
    this.tools.set(capability.name, { capability, handler });
  }

  /**
   * Register a context provider
   */
  registerContext(
    capability: ContextCapability,
    handler: ContextHandler
  ): void {
    this.contexts.set(capability.name, { capability, handler });
  }

  /**
   * Get all capabilities
   */
  getCapabilities(): AnyCapability[] {
    const capabilities: AnyCapability[] = [];

    for (const { capability } of this.tools.values()) {
      capabilities.push(capability);
    }

    for (const { capability } of this.contexts.values()) {
      capabilities.push(capability);
    }

    return capabilities;
  }

  /**
   * Handle handshake request
   */
  private async handleHandshake(
    params: HandshakeRequest
  ): Promise<HandshakeResponse> {
    // Create session
    const sessionId = this.generateSessionId();
    const session: SessionInfo = {
      id: sessionId,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    };

    this.sessions.set(sessionId, session);

    return {
      version: "1.0.0" as AIPVersion,
      server: this.getServerInfo(),
      session,
    };
  }

  /**
   * Handle capabilities list request
   */
  private async handleCapabilitiesList(): Promise<{
    capabilities: AnyCapability[];
  }> {
    return {
      capabilities: this.getCapabilities(),
    };
  }

  /**
   * Handle tool invocation
   */
  private async handleToolInvoke(
    params: ToolInvokeRequest
  ): Promise<ToolInvokeResponse> {
    const tool = this.tools.get(params.tool);

    if (!tool) {
      throw new ToolExecutionError(params.tool, "Tool not found");
    }

    try {
      const result = await tool.handler(params.arguments);
      return result;
    } catch (error) {
      throw new ToolExecutionError(
        params.tool,
        error instanceof Error ? error.message : "Unknown error",
        { originalError: error }
      );
    }
  }

  /**
   * Handle context get request
   */
  private async handleContextGet(
    params: ContextGetRequest
  ): Promise<ContextGetResponse> {
    const context = this.contexts.get(params.context);

    if (!context) {
      throw new ContextNotAvailableError(params.context);
    }

    try {
      const result = await context.handler();
      return result;
    } catch (error) {
      throw new ContextNotAvailableError(params.context, {
        originalError: error,
      });
    }
  }

  /**
   * Handle JSON-RPC request
   */
  async handleRequest(request: JSONRPCRequest): Promise<JSONRPCResponse> {
    try {
      // Validate request
      if (!validateJSONRPCRequest(request)) {
        const reqId = (request as any)?.id ?? "unknown";
        return createJSONRPCError(
          reqId,
          AIPErrorCode.INVALID_REQUEST,
          "Invalid JSON-RPC request"
        );
      }

      // Route to appropriate handler
      let result: unknown;

      switch (request.method) {
        case "aip.handshake":
          result = await this.handleHandshake(
            request.params as unknown as HandshakeRequest
          );
          break;

        case "aip.capabilities.list":
          result = await this.handleCapabilitiesList();
          break;

        case "aip.tool.invoke":
          if (!request.params) {
            throw new InvalidParamsError("Missing params for tool invocation");
          }
          result = await this.handleToolInvoke(
            request.params as unknown as ToolInvokeRequest
          );
          break;

        case "aip.context.get":
          if (!request.params) {
            throw new InvalidParamsError("Missing params for context get");
          }
          result = await this.handleContextGet(
            request.params as unknown as ContextGetRequest
          );
          break;

        default:
          throw new MethodNotFoundError(request.method);
      }

      return createJSONRPCResponse(request.id, result);
    } catch (error) {
      if (error instanceof AIPError) {
        return createJSONRPCError(
          request.id,
          error.code,
          error.message,
          error.data
        );
      }

      // Unknown error
      return createJSONRPCError(
        request.id,
        AIPErrorCode.INTERNAL_ERROR,
        error instanceof Error ? error.message : "Unknown error",
        { originalError: error }
      );
    }
  }

  /**
   * Generate a unique session ID
   */
  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Clean up expired sessions
   */
  cleanupSessions(): void {
    const now = Date.now();

    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.expires && new Date(session.expires).getTime() < now) {
        this.sessions.delete(sessionId);
      }
    }
  }
}
