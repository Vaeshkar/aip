/**
 * AICF-RPC vs JSON-RPC Benchmark
 * 
 * Demonstrates token efficiency and parsing speed improvements
 */

import { serializeAICFRequest, parseAICFRequest } from "../src/utils/aicf-rpc";

// ============================================================================
// Token Counting (Approximate)
// ============================================================================

/**
 * Approximate token count (1 token ≈ 4 characters for English text)
 */
function countTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

// ============================================================================
// Test Cases
// ============================================================================

interface TestCase {
  name: string;
  jsonRPC: string;
  aicfRPC: string;
}

const testCases: TestCase[] = [
  {
    name: "Simple tool call (1 arg)",
    jsonRPC: JSON.stringify({
      jsonrpc: "2.0",
      method: "aip.tool.invoke",
      params: {
        tool: "figma.getFile",
        arguments: { fileKey: "abc123" },
      },
      id: 1,
    }),
    aicfRPC: "CALL|figma.getFile|abc123",
  },
  {
    name: "Tool call with multiple args",
    jsonRPC: JSON.stringify({
      jsonrpc: "2.0",
      method: "aip.tool.invoke",
      params: {
        tool: "playwright.screenshot",
        arguments: {
          filename: "test.png",
          width: 1920,
          height: 1080,
        },
      },
      id: 1,
    }),
    aicfRPC: "CALL|playwright.screenshot|test.png|1920|1080",
  },
  {
    name: "Tool call with URL",
    jsonRPC: JSON.stringify({
      jsonrpc: "2.0",
      method: "aip.tool.invoke",
      params: {
        tool: "playwright.navigate",
        arguments: { url: "https://example.com" },
      },
      id: 1,
    }),
    aicfRPC: "CALL|playwright.navigate|https://example.com",
  },
  {
    name: "List tools",
    jsonRPC: JSON.stringify({
      jsonrpc: "2.0",
      method: "aip.capabilities.list",
      params: {},
      id: 1,
    }),
    aicfRPC: "LIST",
  },
  {
    name: "Get tool info",
    jsonRPC: JSON.stringify({
      jsonrpc: "2.0",
      method: "aip.tool.invoke",
      params: {
        tool: "figma.getFile",
        arguments: {},
      },
      id: 1,
    }),
    aicfRPC: "INFO|figma.getFile",
  },
];

// ============================================================================
// Benchmarks
// ============================================================================

console.log("🚀 AICF-RPC vs JSON-RPC Benchmark\n");
console.log("=" .repeat(80));
console.log();

// Token efficiency benchmark
console.log("📊 TOKEN EFFICIENCY\n");

let totalJSONTokens = 0;
let totalAICFTokens = 0;

for (const testCase of testCases) {
  const jsonTokens = countTokens(testCase.jsonRPC);
  const aicfTokens = countTokens(testCase.aicfRPC);
  const savings = ((jsonTokens - aicfTokens) / jsonTokens) * 100;

  totalJSONTokens += jsonTokens;
  totalAICFTokens += aicfTokens;

  console.log(`Test: ${testCase.name}`);
  console.log(`  JSON-RPC: ${jsonTokens} tokens (${testCase.jsonRPC.length} chars)`);
  console.log(`  AICF-RPC: ${aicfTokens} tokens (${testCase.aicfRPC.length} chars)`);
  console.log(`  Savings:  ${savings.toFixed(1)}% fewer tokens`);
  console.log();
}

const totalSavings = ((totalJSONTokens - totalAICFTokens) / totalJSONTokens) * 100;

console.log("─".repeat(80));
console.log(`TOTAL:`);
console.log(`  JSON-RPC: ${totalJSONTokens} tokens`);
console.log(`  AICF-RPC: ${totalAICFTokens} tokens`);
console.log(`  Savings:  ${totalSavings.toFixed(1)}% fewer tokens`);
console.log();
console.log("=" .repeat(80));
console.log();

// Parsing speed benchmark
console.log("⚡ PARSING SPEED\n");

const iterations = 100000;

// JSON-RPC parsing
const jsonStart = performance.now();
for (let i = 0; i < iterations; i++) {
  for (const testCase of testCases) {
    JSON.parse(testCase.jsonRPC);
  }
}
const jsonEnd = performance.now();
const jsonTime = jsonEnd - jsonStart;

// AICF-RPC parsing
const aicfStart = performance.now();
for (let i = 0; i < iterations; i++) {
  for (const testCase of testCases) {
    parseAICFRequest(testCase.aicfRPC);
  }
}
const aicfEnd = performance.now();
const aicfTime = aicfEnd - aicfStart;

const speedup = jsonTime / aicfTime;

console.log(`Iterations: ${iterations.toLocaleString()} per format`);
console.log(`Test cases: ${testCases.length}`);
console.log();
console.log(`JSON-RPC parsing: ${jsonTime.toFixed(2)}ms`);
console.log(`AICF-RPC parsing: ${aicfTime.toFixed(2)}ms`);
console.log(`Speedup:          ${speedup.toFixed(1)}x faster`);
console.log();
console.log("=" .repeat(80));
console.log();

// ============================================================================
// Summary
// ============================================================================

console.log("📝 SUMMARY\n");
console.log(`✅ Token Efficiency: ${totalSavings.toFixed(1)}% fewer tokens with AICF-RPC`);
console.log(`✅ Parsing Speed:    ${speedup.toFixed(1)}x faster with AICF-RPC`);
console.log();
console.log("💡 Why This Matters:");
console.log("   - Fewer tokens = Lower LLM costs");
console.log("   - Faster parsing = Lower latency");
console.log("   - AI-native design = Better for LLM-to-service communication");
console.log();
console.log("🎯 Use Cases:");
console.log("   - JSON-RPC: Human-readable, debugging, existing tools");
console.log("   - AICF-RPC: AI-to-AI communication, production, high-volume");
console.log();
console.log("=" .repeat(80));
console.log();

// ============================================================================
// Example Usage
// ============================================================================

console.log("📖 EXAMPLE USAGE\n");

console.log("JSON-RPC (Human-Friendly):");
console.log("─".repeat(80));
console.log("POST /aip/v1/rpc");
console.log("Content-Type: application/json");
console.log();
console.log(JSON.stringify(JSON.parse(testCases[0].jsonRPC), null, 2));
console.log();

console.log("AICF-RPC (AI-Optimized):");
console.log("─".repeat(80));
console.log("POST /aip/v1/aicf");
console.log("Content-Type: text/plain");
console.log();
console.log(testCases[0].aicfRPC);
console.log();

console.log("=" .repeat(80));
console.log();
console.log("🚀 AIP v2: The AI-Native Protocol");
console.log();

