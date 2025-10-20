#!/usr/bin/env node
/**
 * SPDX-License-Identifier: AGPL-3.0-or-later
 * Copyright (c) 2025 Dennis van Leeuwen (Digital Liquids)
 *
 * Figma AIP CLI
 *
 * Interactive CLI for exploring Figma files
 */

import * as readline from "readline";
import * as dotenv from "dotenv";
import * as path from "path";
import { FigmaClient } from "./figma-client";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const FIGMA_API_KEY = process.env.FIGMA_API_KEY;

if (!FIGMA_API_KEY) {
  console.error("❌ Error: FIGMA_API_KEY not found in environment variables");
  console.error("Please set it in .env.local or export it:");
  console.error("  export FIGMA_API_KEY=your_token_here");
  process.exit(1);
}

const figmaClient = new FigmaClient({ apiKey: FIGMA_API_KEY });

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Promisify question
function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

// Store recent files
let recentFiles: Array<{ key: string; name: string }> = [];

async function mainMenu() {
  console.clear();
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║          🎨 Figma AIP Interactive CLI                     ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log("");
  console.log("What would you like to do?");
  console.log("");
  console.log("  1. Enter Figma file URL or key");
  console.log("  2. List my recent files");
  console.log("  3. Get my user info");
  console.log("  4. Start AIP server");
  console.log("  5. Exit");
  console.log("");

  const choice = await question("Enter your choice (1-5): ");

  switch (choice.trim()) {
    case "1":
      await enterFileUrl();
      break;
    case "2":
      await listRecentFiles();
      break;
    case "3":
      await getUserInfo();
      break;
    case "4":
      await startServer();
      break;
    case "5":
      console.log("\n👋 Goodbye!\n");
      rl.close();
      process.exit(0);
      break;
    default:
      console.log("\n❌ Invalid choice. Please try again.\n");
      await question("Press Enter to continue...");
      await mainMenu();
  }
}

async function enterFileUrl() {
  console.clear();
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║          📁 Enter Figma File                               ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log("");
  console.log("Enter a Figma file URL or file key:");
  console.log("  URL: https://www.figma.com/design/abc123XYZ/My-File");
  console.log("  Key: abc123XYZ");
  console.log("");

  const input = await question("File URL or key: ");

  // Extract file key from URL or use as-is
  let fileKey = input.trim();
  const urlMatch = fileKey.match(/figma\.com\/(?:file|design)\/([a-zA-Z0-9]+)/);
  if (urlMatch) {
    fileKey = urlMatch[1];
  }

  if (!fileKey) {
    console.log("\n❌ Invalid input. Please try again.\n");
    await question("Press Enter to continue...");
    await enterFileUrl();
    return;
  }

  await fileMenu(fileKey);
}

async function fileMenu(fileKey: string) {
  console.clear();
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║          📄 File Actions                                   ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log("");
  console.log(`File Key: ${fileKey}`);
  console.log("");
  console.log("What would you like to do?");
  console.log("");
  console.log("  1. Get file info");
  console.log("  2. List all pages");
  console.log("  3. Search for frames");
  console.log("  4. Extract colors");
  console.log("  5. Get file versions");
  console.log("  6. Back to main menu");
  console.log("");

  const choice = await question("Enter your choice (1-6): ");

  switch (choice.trim()) {
    case "1":
      await getFileInfo(fileKey);
      break;
    case "2":
      await listPages(fileKey);
      break;
    case "3":
      await searchFrames(fileKey);
      break;
    case "4":
      await extractColors(fileKey);
      break;
    case "5":
      await getVersions(fileKey);
      break;
    case "6":
      await mainMenu();
      return;
    default:
      console.log("\n❌ Invalid choice. Please try again.\n");
      await question("Press Enter to continue...");
      await fileMenu(fileKey);
  }
}

async function getFileInfo(fileKey: string) {
  console.clear();
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║          📊 File Information                               ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log("");
  console.log("⏳ Fetching file info...\n");

  try {
    const file = await figmaClient.getFile(fileKey, { depth: 1 });

    console.log(`📁 Name: ${file.name}`);
    console.log(`🔑 Key: ${fileKey}`);
    console.log(`📅 Last Modified: ${file.lastModified}`);
    console.log(`👤 Role: ${file.role}`);
    console.log(`📄 Pages: ${file.document.children.length}`);
    console.log(`🔗 Thumbnail: ${file.thumbnailUrl}`);
    console.log("");

    // Add to recent files
    if (!recentFiles.find((f) => f.key === fileKey)) {
      recentFiles.unshift({ key: fileKey, name: file.name });
      if (recentFiles.length > 10) recentFiles.pop();
    }
  } catch (error: any) {
    console.log(`❌ Error: ${error.message}\n`);
  }

  await question("Press Enter to continue...");
  await fileMenu(fileKey);
}

async function listPages(fileKey: string) {
  console.clear();
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║          📑 Pages                                          ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log("");
  console.log("⏳ Fetching pages...\n");

  try {
    const file = await figmaClient.getFile(fileKey, { depth: 2 });

    console.log(`Pages in "${file.name}":\n`);
    file.document.children.forEach((page: any, index: number) => {
      console.log(
        `  ${index + 1}. ${page.name} (${page.children?.length || 0} frames)`
      );
    });
    console.log("");
  } catch (error: any) {
    console.log(`❌ Error: ${error.message}\n`);
  }

  await question("Press Enter to continue...");
  await fileMenu(fileKey);
}

async function searchFrames(fileKey: string) {
  console.clear();
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║          🔍 Search Frames                                  ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log("");

  const searchTerm = await question("Enter frame name to search: ");

  console.log("\n⏳ Searching...\n");

  try {
    const file = await figmaClient.getFile(fileKey, { depth: 3 });

    const results: any[] = [];

    function searchNode(node: any, path: string = "") {
      const currentPath = path ? `${path} > ${node.name}` : node.name;

      if (
        node.type === "FRAME" &&
        node.name.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        results.push({ node, path: currentPath });
      }

      if (node.children) {
        node.children.forEach((child: any) => searchNode(child, currentPath));
      }
    }

    file.document.children.forEach((page: any) => searchNode(page));

    if (results.length === 0) {
      console.log(`❌ No frames found matching "${searchTerm}"\n`);
    } else {
      console.log(`✅ Found ${results.length} frame(s):\n`);
      results.forEach((result, index) => {
        console.log(`  ${index + 1}. ${result.path}`);
        console.log(`     ID: ${result.node.id}`);
        console.log("");
      });
    }
  } catch (error: any) {
    console.log(`❌ Error: ${error.message}\n`);
  }

  await question("Press Enter to continue...");
  await fileMenu(fileKey);
}

async function extractColors(fileKey: string) {
  console.clear();
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║          🎨 Extract Colors                                 ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log("");

  const frameName = await question(
    "Enter frame name (or press Enter for all): "
  );

  console.log("\n⏳ Extracting colors...\n");

  try {
    const file = await figmaClient.getFile(fileKey, { depth: 5 });

    const colors = new Map<
      string,
      { name: string; hex: string; rgb: string }
    >();

    function extractFromNode(node: any) {
      if (
        frameName &&
        !node.name.toLowerCase().includes(frameName.toLowerCase())
      ) {
        if (node.children) {
          node.children.forEach((child: any) => extractFromNode(child));
        }
        return;
      }

      if (node.fills && Array.isArray(node.fills)) {
        node.fills.forEach((fill: any) => {
          if (fill.type === "SOLID" && fill.color) {
            const c = fill.color;
            const r = Math.round(c.r * 255);
            const g = Math.round(c.g * 255);
            const b = Math.round(c.b * 255);
            const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
            const rgb = `RGB(${r}, ${g}, ${b})`;

            colors.set(hex, { name: node.name, hex, rgb });
          }
        });
      }

      if (node.children) {
        node.children.forEach((child: any) => extractFromNode(child));
      }
    }

    file.document.children.forEach((page: any) => extractFromNode(page));

    if (colors.size === 0) {
      console.log(`❌ No colors found\n`);
    } else {
      console.log(`✅ Found ${colors.size} unique color(s):\n`);
      Array.from(colors.values()).forEach((color, index) => {
        console.log(
          `  ${index + 1}. ${color.hex} ${color.rgb} - ${color.name}`
        );
      });
      console.log("");
    }
  } catch (error: any) {
    console.log(`❌ Error: ${error.message}\n`);
  }

  await question("Press Enter to continue...");
  await fileMenu(fileKey);
}

async function getVersions(fileKey: string) {
  console.clear();
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║          📜 Version History                                ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log("");
  console.log("⏳ Fetching versions...\n");

  try {
    const versions = await figmaClient.getFileVersions(fileKey);

    console.log(`Version history:\n`);
    versions.versions.slice(0, 10).forEach((version: any, index: number) => {
      console.log(`  ${index + 1}. ${version.label || "(no label)"}`);
      console.log(`     Created: ${version.created_at}`);
      console.log(`     By: ${version.user?.handle || "Unknown"}`);
      console.log("");
    });
  } catch (error: any) {
    console.log(`❌ Error: ${error.message}\n`);
  }

  await question("Press Enter to continue...");
  await fileMenu(fileKey);
}

async function listRecentFiles() {
  console.clear();
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║          📚 Recent Files                                   ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log("");

  if (recentFiles.length === 0) {
    console.log("No recent files. Enter a file URL first!\n");
    await question("Press Enter to continue...");
    await mainMenu();
    return;
  }

  console.log("Recent files:\n");
  recentFiles.forEach((file, index) => {
    console.log(`  ${index + 1}. ${file.name}`);
    console.log(`     Key: ${file.key}`);
    console.log("");
  });

  const choice = await question("Enter number to open (or 0 to go back): ");
  const index = parseInt(choice.trim()) - 1;

  if (index >= 0 && index < recentFiles.length) {
    await fileMenu(recentFiles[index].key);
  } else {
    await mainMenu();
  }
}

async function getUserInfo() {
  console.clear();
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║          👤 User Information                               ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log("");
  console.log("⏳ Fetching user info...\n");

  try {
    const user = await figmaClient.getMe();

    console.log(`👤 Handle: ${user.handle}`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`🆔 ID: ${user.id}`);
    console.log(`🖼️  Avatar: ${user.img_url}`);
    console.log("");
  } catch (error: any) {
    console.log(`❌ Error: ${error.message}\n`);
  }

  await question("Press Enter to continue...");
  await mainMenu();
}

async function startServer() {
  console.clear();
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║          🚀 Starting AIP Server                            ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log("");
  console.log("Starting server in the background...");
  console.log("The server will run on http://localhost:3001/aip/v1/rpc");
  console.log("");
  console.log("Press Ctrl+C to stop the server and return to CLI.");
  console.log("");

  rl.close();

  // Import and start the server
  require("./index");
}

// Start the CLI
mainMenu().catch((error) => {
  console.error("Fatal error:", error);
  rl.close();
  process.exit(1);
});
