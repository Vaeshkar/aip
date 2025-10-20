/**
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (c) 2025 Dennis van Leeuwen (Digital Liquids)
 *
 * Example: Using Figma AIP Service with AIP Client
 *
 * This example shows how to connect to the Figma AIP service
 * and use its capabilities from any LLM or AI system.
 */

import { AIPClient } from "@digital-liquids/aip-workspace";

async function main() {
  console.log("🎨 Figma AIP Service Client Example\n");

  // Create AIP client
  const client = new AIPClient({
    url: "http://localhost:3001/aip/v1/rpc",
    name: "FigmaExampleClient",
    version: "1.0.0",
  });

  try {
    // ========================================================================
    // 1. Connect to Figma AIP Service
    // ========================================================================
    console.log("📡 Connecting to Figma AIP service...");
    await client.connect();
    console.log("✅ Connected!\n");

    // Get session info
    const session = client.getSession();
    console.log("🔑 Session:", {
      id: session?.id,
      expires: session?.expires,
    });
    console.log("");

    // ========================================================================
    // 2. List available Figma tools
    // ========================================================================
    console.log("📋 Available Figma tools:\n");
    const capabilities = client.getCapabilities();

    capabilities.forEach((cap) => {
      if (cap.name.startsWith("figma.")) {
        console.log(`  - ${cap.name}`);
        console.log(`    ${cap.description}`);
      }
    });
    console.log("");

    // ========================================================================
    // 3. Get a Figma file
    // ========================================================================
    console.log("📄 Example: Get a Figma file\n");

    // Replace with your actual Figma file key
    const fileKey = "YOUR_FILE_KEY_HERE";

    console.log(`   File key: ${fileKey}`);
    console.log("   Calling figma.getFile...\n");

    const fileResult = await client.invokeTool("figma.getFile", {
      fileKey,
      depth: 1, // Start with depth 1 for large files
    });

    if (fileResult.success) {
      console.log("   ✅ Success!");
      console.log("   File name:", fileResult.data.name);
      console.log("   Last modified:", fileResult.data.lastModified);
      console.log("   Version:", fileResult.data.version);
      console.log("   Pages:", fileResult.data.document?.children?.length || 0);
    } else {
      console.log("   ❌ Error:", fileResult.error);
    }
    console.log("");

    // ========================================================================
    // 4. Get comments from a file
    // ========================================================================
    console.log("💬 Example: Get comments\n");

    const commentsResult = await client.invokeTool("figma.getComments", {
      fileKey,
      as_md: true, // Get comments as markdown
    });

    if (commentsResult.success) {
      console.log("   ✅ Success!");
      console.log("   Comments:", commentsResult.data.comments?.length || 0);
    } else {
      console.log("   ❌ Error:", commentsResult.error);
    }
    console.log("");

    // ========================================================================
    // 5. Get team components
    // ========================================================================
    console.log("🧩 Example: Get team components\n");

    // Replace with your actual team ID
    const teamId = "YOUR_TEAM_ID_HERE";

    const componentsResult = await client.invokeTool(
      "figma.getTeamComponents",
      {
        teamId,
        page_size: 10,
      }
    );

    if (componentsResult.success) {
      console.log("   ✅ Success!");
      console.log(
        "   Components:",
        componentsResult.data.meta?.components?.length || 0
      );
    } else {
      console.log("   ❌ Error:", componentsResult.error);
    }
    console.log("");

    // ========================================================================
    // 6. Disconnect
    // ========================================================================
    console.log("👋 Disconnecting...");
    await client.disconnect();
    console.log("✅ Disconnected!\n");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

// Run example
main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
