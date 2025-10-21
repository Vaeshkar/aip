#!/usr/bin/env node

/**
 * AIP Playwright Service
 * Bridges Playwright MCP to AIP protocol
 *
 * This service:
 * 1. Starts Playwright MCP server internally
 * 2. Connects to it via MCP SDK
 * 3. Exposes all MCP tools via AIP HTTP interface
 * 4. Provides universal browser automation for any LLM
 */

import { AIPServer } from "./server/AIPServer";
import { HTTPTransport } from "./transport/HTTPTransport";
import type { ToolCapability } from "./schema/aip-schema";
import { MCPClient } from "./mcp-client";

const PORT = parseInt(process.env.PORT || "3002", 10);
const MCP_PORT = parseInt(process.env.MCP_PORT || "8932", 10);

async function main() {
  console.log("🎭 AIP Playwright Service");
  console.log("=".repeat(70));
  console.log("Bridging Playwright MCP to AIP protocol");
  console.log("");

  // Create MCP client
  const mcpClient = new MCPClient();

  try {
    // Step 1: Start Playwright MCP server
    await mcpClient.startMCPServer(MCP_PORT);

    // Step 2: Connect to MCP server
    await mcpClient.connect(`http://localhost:${MCP_PORT}/sse`);

    // Step 3: Get available tools
    const mcpTools = mcpClient.getTools();
    console.log(`\n📋 Bridging ${mcpTools.length} MCP tools to AIP:\n`);

    // Step 4: Create AIP server
    const aipServer = new AIPServer({
      name: "playwright",
      version: "1.0.0",
      metadata: {
        description: "Browser automation via Playwright (MCP bridge)",
      },
    });

    // Step 5: Register all MCP tools as AIP tools
    for (const tool of mcpTools) {
      // Convert MCP tool name to AIP format
      // browser_navigate → playwright.navigate
      const aipToolName = tool.name.replace("browser_", "playwright.");

      console.log(`   ✓ ${tool.name} → ${aipToolName}`);

      const toolCapability: ToolCapability = {
        type: "tool",
        name: aipToolName,
        description: tool.description,
        schema: tool.inputSchema,
      };

      aipServer.registerTool(toolCapability, async (args: any) => {
        try {
          // Call MCP tool
          const result = await mcpClient.callTool(tool.name, args);

          return {
            success: true,
            data: result,
          };
        } catch (error: any) {
          return {
            success: false,
            error: error.message,
          };
        }
      });
    }

    // Step 6: Start AIP HTTP transport
    console.log(`\n🚀 Starting AIP server on port ${PORT}...\n`);

    const transport = new HTTPTransport(aipServer, {
      port: PORT,
      host: "0.0.0.0",
      cors: true,
    });

    await transport.listen();

    console.log("=".repeat(70));
    console.log("✅ AIP Playwright Service is running!");
    console.log("");
    console.log(`   AIP HTTP:  http://localhost:${PORT}/aip/v1/rpc`);
    console.log(`   MCP SSE:   http://localhost:${MCP_PORT}/mcp`);
    console.log("");
    console.log(`   Tools: ${mcpTools.length} browser automation tools`);
    console.log("");
    console.log("Example usage:");
    console.log("");
    console.log("  curl -X POST http://localhost:" + PORT + "/aip/v1/rpc \\");
    console.log('    -H "Content-Type: application/json" \\');
    console.log(
      '    -d \'{"jsonrpc":"2.0","id":"1","method":"aip.tool.invoke",'
    );
    console.log('         "params":{"tool":"playwright.navigate",');
    console.log(
      '                   "arguments":{"url":"https://example.com"}}}\''
    );
    console.log("");
    console.log("=".repeat(70));

    // Handle shutdown
    process.on("SIGINT", async () => {
      console.log("\n\n🛑 Shutting down...");
      await mcpClient.disconnect();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      console.log("\n\n🛑 Shutting down...");
      await mcpClient.disconnect();
      process.exit(0);
    });
  } catch (error) {
    console.error("\n❌ Failed to start service:", error);
    await mcpClient.disconnect();
    process.exit(1);
  }
}

// Start the service
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
