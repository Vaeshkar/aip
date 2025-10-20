/**
 * MCP Client Wrapper
 * Connects to Playwright MCP server and provides a simple interface
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { spawn, ChildProcess } from "child_process";

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: any;
}

export class MCPClient {
  private client: Client;
  private transport: SSEClientTransport | null = null;
  private mcpProcess: ChildProcess | null = null;
  private connected: boolean = false;
  private tools: MCPTool[] = [];

  constructor() {
    this.client = new Client(
      {
        name: "aip-playwright-bridge",
        version: "1.0.0",
      },
      {
        capabilities: {},
      }
    );
  }

  /**
   * Start Playwright MCP server as a child process
   */
  async startMCPServer(port: number = 8932): Promise<void> {
    console.log(`🚀 Starting Playwright MCP server on port ${port}...`);

    this.mcpProcess = spawn("npx", [
      "@playwright/mcp@latest",
      "--port",
      port.toString(),
      "--headless",
    ]);

    this.mcpProcess.stdout?.on("data", (data) => {
      console.log(`[MCP] ${data.toString().trim()}`);
    });

    this.mcpProcess.stderr?.on("data", (data) => {
      console.error(`[MCP Error] ${data.toString().trim()}`);
    });

    this.mcpProcess.on("error", (error) => {
      console.error("[MCP] Process error:", error);
    });

    this.mcpProcess.on("exit", (code) => {
      console.log(`[MCP] Process exited with code ${code}`);
      this.connected = false;
    });

    // Wait for server to start
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  /**
   * Connect to MCP server via SSE
   */
  async connect(url: string = "http://localhost:8932/sse"): Promise<void> {
    console.log(`🔌 Connecting to MCP server at ${url}...`);

    try {
      this.transport = new SSEClientTransport(new URL(url));
      await this.client.connect(this.transport);
      this.connected = true;

      console.log("✅ Connected to MCP server");

      // List available tools
      await this.listTools();
    } catch (error) {
      console.error("❌ Failed to connect to MCP server:", error);
      throw error;
    }
  }

  /**
   * List all available tools from MCP server
   */
  async listTools(): Promise<MCPTool[]> {
    if (!this.connected) {
      throw new Error("Not connected to MCP server");
    }

    try {
      const response = await this.client.listTools();
      this.tools = response.tools.map((tool) => ({
        name: tool.name,
        description: tool.description || "",
        inputSchema: tool.inputSchema,
      }));

      console.log(`📋 Found ${this.tools.length} tools from MCP server`);
      return this.tools;
    } catch (error) {
      console.error("❌ Failed to list tools:", error);
      throw error;
    }
  }

  /**
   * Call a tool on the MCP server
   */
  async callTool(name: string, args: any): Promise<any> {
    if (!this.connected) {
      throw new Error("Not connected to MCP server");
    }

    try {
      console.log(`🔧 Calling MCP tool: ${name}`);
      const response = await this.client.callTool({
        name,
        arguments: args,
      });

      return response;
    } catch (error) {
      console.error(`❌ Failed to call tool ${name}:`, error);
      throw error;
    }
  }

  /**
   * Get all available tools
   */
  getTools(): MCPTool[] {
    return this.tools;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.connected;
  }

  /**
   * Disconnect and cleanup
   */
  async disconnect(): Promise<void> {
    console.log("🔌 Disconnecting from MCP server...");

    if (this.transport) {
      await this.client.close();
      this.transport = null;
    }

    if (this.mcpProcess) {
      this.mcpProcess.kill();
      this.mcpProcess = null;
    }

    this.connected = false;
    console.log("✅ Disconnected");
  }
}
