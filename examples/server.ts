/**
 * Example AIP Server
 *
 * This example demonstrates how to create an AIP server with tools and context.
 */

import { AIPServer } from "../src/server/AIPServer";
import { HTTPTransport } from "../src/transport/HTTPTransport";
import type {
  ToolCapability,
  ContextCapability,
} from "../src/schema/aip-schema";

// Create AIP server
const server = new AIPServer({
  name: "ExampleAIPServer",
  version: "1.0.0",
  metadata: {
    description: "Example AIP server with tools and context",
    author: "Digital Liquids",
  },
});

// ============================================================================
// Register Tools
// ============================================================================

// Tool 1: Greet user
const greetTool: ToolCapability = {
  type: "tool",
  name: "greet",
  description: "Greet a user by name",
  schema: {
    type: "object",
    properties: {
      name: {
        type: "string",
        description: "Name of the person to greet",
      },
    },
    required: ["name"],
  },
};

server.registerTool(greetTool, async (args) => {
  const name = args.name as string;
  return {
    success: true,
    data: `Hello, ${name}! Welcome to AIP.`,
    metadata: {
      timestamp: new Date().toISOString(),
    },
  };
});

// Tool 2: Calculate sum
const sumTool: ToolCapability = {
  type: "tool",
  name: "sum",
  description: "Calculate the sum of two numbers",
  schema: {
    type: "object",
    properties: {
      a: {
        type: "number",
        description: "First number",
      },
      b: {
        type: "number",
        description: "Second number",
      },
    },
    required: ["a", "b"],
  },
};

server.registerTool(sumTool, async (args) => {
  const a = args.a as number;
  const b = args.b as number;
  const result = a + b;

  return {
    success: true,
    data: result,
    metadata: {
      operation: "addition",
      operands: [a, b],
    },
  };
});

// Tool 3: Get current time
const timeTool: ToolCapability = {
  type: "tool",
  name: "time",
  description: "Get the current time",
  schema: {
    type: "object",
    properties: {},
  },
};

server.registerTool(timeTool, async () => {
  const now = new Date();
  return {
    success: true,
    data: {
      iso: now.toISOString(),
      unix: now.getTime(),
      formatted: now.toLocaleString(),
    },
  };
});

// ============================================================================
// Register Context Providers
// ============================================================================

// Context 1: Server info (AICF format)
const serverInfoContext: ContextCapability = {
  type: "context",
  name: "server.info",
  description: "Server information in AICF format",
  format: "aicf",
};

server.registerContext(serverInfoContext, async () => {
  const aicfData = `@SERVER_INFO
@SCHEMA
Name|Version|Status|Uptime|Capabilities
@DATA
ExampleAIPServer|1.0.0|Running|${process.uptime().toFixed(0)}s|tool,context

@NOTES
- This is an example AIP server
- Demonstrates AICF integration
- Built with TypeScript`;

  return {
    format: "aicf",
    data: aicfData,
    metadata: {
      updated: new Date().toISOString(),
      version: "1.0.0",
    },
  };
});

// Context 2: System stats (JSON format)
const systemStatsContext: ContextCapability = {
  type: "context",
  name: "system.stats",
  description: "System statistics",
  format: "json",
};

server.registerContext(systemStatsContext, async () => {
  return {
    format: "json",
    data: {
      memory: {
        total: process.memoryUsage().heapTotal,
        used: process.memoryUsage().heapUsed,
        external: process.memoryUsage().external,
      },
      uptime: process.uptime(),
      platform: process.platform,
      nodeVersion: process.version,
    },
    metadata: {
      updated: new Date().toISOString(),
    },
  };
});

// ============================================================================
// Start HTTP Transport
// ============================================================================

const transport = new HTTPTransport(server, {
  port: 3000,
  host: "0.0.0.0",
  path: "/aip/v1/rpc",
  cors: true,
  // Optional: Add authentication
  // authValidator: async (req) => {
  //   const token = req.headers.authorization?.replace('Bearer ', '');
  //   return token === 'your-secret-token';
  // },
});

// Start server
transport.listen().then(() => {
  console.log("\n✅ AIP Server started successfully!\n");
  console.log("📋 Available capabilities:");

  const capabilities = server.getCapabilities();
  capabilities.forEach((cap) => {
    console.log(`  - ${cap.type}: ${cap.name} - ${cap.description}`);
  });

  console.log("\n🔗 Endpoints:");
  console.log("  - Health: http://localhost:3000/health");
  console.log("  - RPC: http://localhost:3000/aip/v1/rpc");

  console.log("\n📖 Try it:");
  console.log("  curl -X POST http://localhost:3000/aip/v1/rpc \\");
  console.log('    -H "Content-Type: application/json" \\');
  console.log(
    '    -d \'{"jsonrpc":"2.0","id":"1","method":"aip.handshake","params":{"version":"1.0.0","client":{"name":"TestClient","version":"1.0.0","capabilities":["tool"]}}}\''
  );

  console.log("\n");
});

// Cleanup on exit
process.on("SIGINT", () => {
  console.log("\n\n👋 Shutting down AIP server...");
  process.exit(0);
});
