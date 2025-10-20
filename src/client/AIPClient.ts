/**
 * AIP Client implementation
 */

import type {
  AIPVersion,
  ClientInfo,
  AuthInfo,
  SessionInfo,
  AnyCapability,
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
  createJSONRPCRequest,
  validateJSONRPCResponse,
} from "../utils/jsonrpc";

import { AIPError, UnauthorizedError, InternalError } from "../utils/errors";

import { AIPErrorCode } from "../schema/aip-schema";

/**
 * AIP Client configuration
 */
export interface AIPClientConfig {
  url: string;
  name?: string;
  version?: string;
  auth?: AuthInfo;
  timeout?: number;
}

/**
 * AIP Client class
 */
export class AIPClient {
  private config: AIPClientConfig;
  private session?: SessionInfo;
  private capabilities: AnyCapability[] = [];
  private connected: boolean = false;

  constructor(config: AIPClientConfig) {
    this.config = {
      name: "AIPClient",
      version: "1.0.0",
      timeout: 30000,
      ...config,
    };
  }

  /**
   * Get client info
   */
  private getClientInfo(): ClientInfo {
    return {
      name: this.config.name!,
      version: this.config.version!,
      capabilities: ["tool", "context"] as any,
    };
  }

  /**
   * Send JSON-RPC request
   */
  private async sendRequest<T = Record<string, unknown>>(
    request: JSONRPCRequest<T>
  ): Promise<JSONRPCResponse> {
    try {
      const response = await fetch(this.config.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.config.auth?.type === "bearer" && this.config.auth.token
            ? { Authorization: `Bearer ${this.config.auth.token}` }
            : {}),
        },
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(this.config.timeout!),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new UnauthorizedError("Authentication failed");
        }
        throw new InternalError(
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();

      if (!validateJSONRPCResponse(data)) {
        throw new InternalError("Invalid JSON-RPC response");
      }

      // Check for error
      if (data.error) {
        throw new AIPError(
          data.error.code as AIPErrorCode,
          data.error.message,
          data.error.data
        );
      }

      return data;
    } catch (error) {
      if (error instanceof AIPError) {
        throw error;
      }

      throw new InternalError(
        error instanceof Error ? error.message : "Unknown error",
        { originalError: error }
      );
    }
  }

  /**
   * Connect to AIP server
   */
  async connect(): Promise<void> {
    const handshakeParams: HandshakeRequest = {
      version: "1.0.0" as AIPVersion,
      client: this.getClientInfo(),
      auth: this.config.auth,
    };

    const request = createJSONRPCRequest("aip.handshake", handshakeParams);

    const response = await this.sendRequest(request);
    const result = response.result as HandshakeResponse;

    this.session = result.session;
    this.connected = true;

    // Fetch capabilities
    await this.fetchCapabilities();
  }

  /**
   * Disconnect from AIP server
   */
  async disconnect(): Promise<void> {
    this.session = undefined;
    this.capabilities = [];
    this.connected = false;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Get session info
   */
  getSession(): SessionInfo | undefined {
    return this.session;
  }

  /**
   * Fetch capabilities from server
   */
  private async fetchCapabilities(): Promise<void> {
    const request = createJSONRPCRequest("aip.capabilities.list", {});
    const response = await this.sendRequest(request);
    const result = response.result as { capabilities: AnyCapability[] };
    this.capabilities = result.capabilities;
  }

  /**
   * Get available capabilities
   */
  getCapabilities(): AnyCapability[] {
    return this.capabilities;
  }

  /**
   * Invoke a tool
   */
  async invokeTool(
    tool: string,
    args: Record<string, unknown>
  ): Promise<ToolInvokeResponse> {
    if (!this.connected) {
      throw new InternalError("Not connected to server");
    }

    const invokeParams: ToolInvokeRequest = {
      tool,
      arguments: args,
    };

    const request = createJSONRPCRequest("aip.tool.invoke", invokeParams);

    const response = await this.sendRequest(request);
    return response.result as ToolInvokeResponse;
  }

  /**
   * Get context
   */
  async getContext(context: string): Promise<ContextGetResponse> {
    if (!this.connected) {
      throw new InternalError("Not connected to server");
    }

    const contextParams: ContextGetRequest = {
      context,
    };

    const request = createJSONRPCRequest("aip.context.get", contextParams);

    const response = await this.sendRequest(request);
    return response.result as ContextGetResponse;
  }

  /**
   * Find tool by name
   */
  findTool(name: string): AnyCapability | undefined {
    return this.capabilities.find(
      (cap) => cap.type === "tool" && cap.name === name
    );
  }

  /**
   * Find context by name
   */
  findContext(name: string): AnyCapability | undefined {
    return this.capabilities.find(
      (cap) => cap.type === "context" && cap.name === name
    );
  }
}
