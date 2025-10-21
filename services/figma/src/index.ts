#!/usr/bin/env node
/**
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (c) 2025 Dennis van Leeuwen (Digital Liquids)
 *
 * Figma AIP Service
 *
 * A complete Figma service implementation using AIP (AI-Protocol)
 */

import * as dotenv from "dotenv";
import { AIPServer } from "./server/AIPServer";
import { HTTPTransport } from "./transport/HTTPTransport";
import type { ToolCapability } from "./schema/aip-schema";
import { FigmaClient } from "./figma-client";
import {
  allocatePort,
  getRecommendedPort,
  formatPortAllocationResult,
} from "./utils/port-manager";

// Load environment variables
dotenv.config();
dotenv.config({ path: ".env.local" }); // Also load .env.local

// Get Figma API key from environment or command line
const figmaApiKey =
  process.env.FIGMA_API_KEY ||
  process.argv.find((arg) => arg.startsWith("--figma-token="))?.split("=")[1];

if (!figmaApiKey) {
  console.error(
    "❌ Error: FIGMA_API_KEY environment variable or --figma-token argument is required"
  );
  process.exit(1);
}

// Create Figma client
const figmaClient = new FigmaClient({ apiKey: figmaApiKey });

// Create AIP server
const server = new AIPServer({
  name: "FigmaAIPService",
  version: "1.0.0",
  metadata: {
    description: "Figma service implementation using AIP (AI-Protocol)",
    author: "Digital Liquids",
    figmaApiVersion: "v1",
  },
});

// ============================================================================
// Register File Tools
// ============================================================================

const getFileTool: ToolCapability = {
  type: "tool",
  name: "figma.getFile",
  description: "Get a Figma file by key. Returns the full document tree.",
  schema: {
    type: "object",
    properties: {
      fileKey: {
        type: "string",
        description: "The Figma file key (from the URL)",
      },
      version: {
        type: "string",
        description: "Optional version ID to get a specific version",
      },
      depth: {
        type: "number",
        description: "How deep to traverse the document tree (default: 1)",
      },
    },
    required: ["fileKey"],
  },
};

server.registerTool(getFileTool, async (args) => {
  try {
    const result = await figmaClient.getFile(args.fileKey as string, {
      version: args.version as string | undefined,
      depth: args.depth as number | undefined,
    });
    return {
      success: true,
      data: result,
      metadata: {
        fileKey: args.fileKey,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      metadata: {
        fileKey: args.fileKey,
      },
    };
  }
});

const getFileNodesTool: ToolCapability = {
  type: "tool",
  name: "figma.getFileNodes",
  description: "Get specific nodes from a Figma file by their IDs",
  schema: {
    type: "object",
    properties: {
      fileKey: {
        type: "string",
        description: "The Figma file key",
      },
      ids: {
        type: "array",
        items: { type: "string" },
        description: "Array of node IDs to retrieve",
      },
      depth: {
        type: "number",
        description: "How deep to traverse each node",
      },
    },
    required: ["fileKey", "ids"],
  },
};

server.registerTool(getFileNodesTool, async (args) => {
  try {
    const result = await figmaClient.getFileNodes(
      args.fileKey as string,
      args.ids as string[],
      {
        depth: args.depth as number | undefined,
      }
    );
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

const getImagesTool: ToolCapability = {
  type: "tool",
  name: "figma.getImages",
  description: "Render images from a Figma file",
  schema: {
    type: "object",
    properties: {
      fileKey: {
        type: "string",
        description: "The Figma file key",
      },
      ids: {
        type: "array",
        items: { type: "string" },
        description: "Array of node IDs to render",
      },
      scale: {
        type: "number",
        description: "Scale factor (1-4)",
      },
      format: {
        type: "string",
        enum: ["jpg", "png", "svg", "pdf"],
        description: "Image format",
      },
    },
    required: ["fileKey", "ids"],
  },
};

server.registerTool(getImagesTool, async (args) => {
  try {
    const result = await figmaClient.getImages(args.fileKey as string, {
      ids: args.ids as string[],
      scale: args.scale as number | undefined,
      format: args.format as "jpg" | "png" | "svg" | "pdf" | undefined,
    });
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

// ============================================================================
// Register Comment Tools
// ============================================================================

const getCommentsTool: ToolCapability = {
  type: "tool",
  name: "figma.getComments",
  description: "Get comments from a Figma file",
  schema: {
    type: "object",
    properties: {
      fileKey: {
        type: "string",
        description: "The Figma file key",
      },
      as_md: {
        type: "boolean",
        description: "Return comments as markdown",
      },
    },
    required: ["fileKey"],
  },
};

server.registerTool(getCommentsTool, async (args) => {
  try {
    const result = await figmaClient.getComments(args.fileKey as string, {
      as_md: args.as_md as boolean | undefined,
    });
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

const postCommentTool: ToolCapability = {
  type: "tool",
  name: "figma.postComment",
  description: "Post a comment to a Figma file",
  schema: {
    type: "object",
    properties: {
      fileKey: {
        type: "string",
        description: "The Figma file key",
      },
      message: {
        type: "string",
        description: "The comment message",
      },
      comment_id: {
        type: "string",
        description: "Optional parent comment ID for replies",
      },
    },
    required: ["fileKey", "message"],
  },
};

server.registerTool(postCommentTool, async (args) => {
  try {
    const result = await figmaClient.postComment(
      args.fileKey as string,
      args.message as string,
      {
        comment_id: args.comment_id as string | undefined,
      }
    );
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

// ============================================================================
// Register Component Tools
// ============================================================================

const getTeamComponentsTool: ToolCapability = {
  type: "tool",
  name: "figma.getTeamComponents",
  description: "Get components from a Figma team",
  schema: {
    type: "object",
    properties: {
      teamId: {
        type: "string",
        description: "The Figma team ID",
      },
      page_size: {
        type: "number",
        description: "Number of results per page",
      },
    },
    required: ["teamId"],
  },
};

server.registerTool(getTeamComponentsTool, async (args) => {
  try {
    const result = await figmaClient.getTeamComponents(args.teamId as string, {
      page_size: args.page_size as number | undefined,
    });
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

// ============================================================================
// Register Style Tools
// ============================================================================

const getFileStylesTool: ToolCapability = {
  type: "tool",
  name: "figma.getFileStyles",
  description: "Get all styles from a Figma file",
  schema: {
    type: "object",
    properties: {
      fileKey: {
        type: "string",
        description: "The Figma file key",
      },
    },
    required: ["fileKey"],
  },
};

server.registerTool(getFileStylesTool, async (args) => {
  try {
    const result = await figmaClient.getFileStyles(args.fileKey as string);
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

// ============================================================================
// Register Project Tools
// ============================================================================

const getTeamProjectsTool: ToolCapability = {
  type: "tool",
  name: "figma.getTeamProjects",
  description: "Get all projects in a Figma team",
  schema: {
    type: "object",
    properties: {
      teamId: {
        type: "string",
        description: "The Figma team ID",
      },
    },
    required: ["teamId"],
  },
};

server.registerTool(getTeamProjectsTool, async (args) => {
  try {
    const result = await figmaClient.getTeamProjects(args.teamId as string);
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

const getProjectFilesTool: ToolCapability = {
  type: "tool",
  name: "figma.getProjectFiles",
  description: "Get all files in a Figma project",
  schema: {
    type: "object",
    properties: {
      projectId: {
        type: "string",
        description: "The Figma project ID",
      },
    },
    required: ["projectId"],
  },
};

server.registerTool(getProjectFilesTool, async (args) => {
  try {
    const result = await figmaClient.getProjectFiles(args.projectId as string);
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

// ============================================================================
// Register User Tool
// ============================================================================

const getMeTool: ToolCapability = {
  type: "tool",
  name: "figma.getMe",
  description: "Get information about the authenticated user",
  schema: {
    type: "object",
    properties: {},
  },
};

server.registerTool(getMeTool, async () => {
  try {
    const result = await figmaClient.getMe();
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

// ============================================================================
// Register File Version Tool
// ============================================================================

const getFileVersionsTool: ToolCapability = {
  type: "tool",
  name: "figma.getFileVersions",
  description: "Get version history of a Figma file",
  schema: {
    type: "object",
    properties: {
      fileKey: {
        type: "string",
        description: "The Figma file key",
      },
    },
    required: ["fileKey"],
  },
};

server.registerTool(getFileVersionsTool, async (args) => {
  try {
    const result = await figmaClient.getFileVersions(args.fileKey as string);
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

// ============================================================================
// Start HTTP Transport
// ============================================================================

// Dynamic port allocation
const preferredPort = process.env.PORT
  ? parseInt(process.env.PORT)
  : getRecommendedPort("figma");
const host = process.env.HOST || "0.0.0.0";

console.log("\n🔌 Allocating port...");
console.log(`   Preferred port: ${preferredPort}`);

allocatePort({
  preferredPort,
  serviceName: "figma",
  killSameService: true,
})
  .then((result) => {
    console.log(formatPortAllocationResult(result));

    const transport = new HTTPTransport(server, {
      port: result.port,
      host,
      path: "/aip/v1/rpc",
      cors: true,
    });

    return transport.listen().then(() => result.port);
  })
  .then((port) => {
    console.log("\n🎨 Figma AIP Service started successfully!\n");

    console.log("📋 Available tools:");

    const capabilities = server.getCapabilities();
    capabilities.forEach((cap) => {
      console.log(`  - ${cap.name}: ${cap.description}`);
    });

    console.log("\n🔗 Endpoints:");
    console.log(`  - Health: http://${host}:${port}/health`);
    console.log(`  - RPC: http://${host}:${port}/aip/v1/rpc`);

    console.log("\n📖 Example:");
    console.log(`  curl -X POST http://localhost:${port}/aip/v1/rpc \\`);
    console.log('    -H "Content-Type: application/json" \\');
    console.log(
      '    -d \'{"jsonrpc":"2.0","id":"1","method":"aip.tool.invoke","params":{"tool":"figma.getFile","arguments":{"fileKey":"YOUR_FILE_KEY"}}}\''
    );

    console.log("\n💡 Tip: Just pass the file key directly to any tool!");
    console.log("   No configuration files needed!\n");
  })
  .catch((error) => {
    console.error("\n❌ Failed to start Figma AIP service:");
    console.error(error.message);
    process.exit(1);
  });

// Cleanup on exit
process.on("SIGINT", () => {
  console.log("\n\n👋 Shutting down Figma AIP service...");
  process.exit(0);
});
