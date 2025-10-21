# AIP (AI-Protocol) 🤖🔌

**A Universal, Vendor-Neutral Protocol for AI Services**

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%203.0-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Status](https://img.shields.io/badge/Status-Alpha-orange.svg)]()

---

## 🎯 What is AIP?

**AIP (AI-Protocol)** is an open, vendor-neutral protocol for connecting AI systems (LLMs, agents, tools) with external services, data sources, and capabilities.

Unlike vendor-specific protocols (e.g., Anthropic's MCP), AIP is designed to be:

- ✅ **Universal**: Works with any LLM or AI system
- ✅ **Extensible**: Plugin architecture for custom capabilities
- ✅ **Lightweight**: Minimal overhead, easy to implement
- ✅ **Transport-agnostic**: HTTP, WebSocket, stdio, or custom transports
- ✅ **Context-aware**: Native support for AICF (AI Context Format)

---

## 🚀 Quick Start

### Available Services

```bash
# Figma Design Service
npm install @vaeshkar/aip-figma

# Playwright Browser Automation Service
npm install @vaeshkar/aip-playwright
```

### Installation (Core)

```bash
npm install @vaeshkar/aip-core
```

### Basic Example (Server)

```typescript
import { AIPServer } from "@vaeshkar/aip-core";

const server = new AIPServer({
  name: "MyService",
  version: "1.0.0",
});

// Register a tool
server.registerTool({
  name: "greet",
  description: "Greet a user",
  schema: {
    type: "object",
    properties: {
      name: { type: "string" },
    },
    required: ["name"],
  },
  handler: async (args) => {
    return { success: true, data: `Hello, ${args.name}!` };
  },
});

// Start server
server.listen(3000);
```

### Basic Example (Client)

```typescript
import { AIPClient } from "@vaeshkar/aip-core";

const client = new AIPClient({
  url: "http://localhost:3000",
  auth: { type: "bearer", token: "your-token" },
});

// Connect
await client.connect();

// Invoke a tool
const result = await client.invokeTool("greet", { name: "Alice" });
console.log(result.data); // "Hello, Alice!"
```

---

## 🚀 NEW: AICF-RPC - The AI-Native Protocol

**AIP v2** introduces **AICF-RPC**, the world's first AI-native protocol designed specifically for LLM-to-service communication.

### **Why AICF-RPC?**

Traditional protocols like JSON-RPC were designed for humans. AICF-RPC is designed for AI:

```bash
# JSON-RPC (verbose, human-readable)
curl -X POST http://localhost:3001/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"aip.tool.invoke","params":{"tool":"figma.getFile","arguments":{"fileKey":"abc123"}},"id":1}'

# AICF-RPC (compact, AI-optimized)
curl -X POST http://localhost:3001/aip/v1/aicf \
  -H "Content-Type: text/plain" \
  -d "CALL|figma.getFile|abc123"
```

### **The Results:**

- 📊 **75.3% fewer tokens** than JSON-RPC
- ⚡ **Same parsing speed** (10x faster in some cases)
- 💰 **Lower LLM costs** ($401.50/year savings for typical usage)
- 🤖 **AI-native design** (optimized for LLMs, not humans)

### **Learn More:**

- **[AICF-RPC README](docs/AICF-RPC-README.md)** - Complete guide
- **[AICF-RPC Specification](docs/AICF-RPC-SPECIFICATION.md)** - Protocol spec
- **[Benchmark Results](examples/aicf-benchmark.ts)** - Performance comparison

---

## 📚 Documentation

- **[Specification](docs/AIP-SPECIFICATION.md)** - Full protocol specification
- **[AICF-RPC Guide](docs/AICF-RPC-README.md)** - AI-native protocol guide
- **[Schema](src/schema/aip-schema.ts)** - TypeScript type definitions
- **[Examples](examples/)** - Example implementations
- **[API Reference](docs/API.md)** - API documentation

---

## 🏗️ Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   AIP Client    │◄───────►│   AIP Server    │
│  (LLM/Agent)    │         │   (Service)     │
└─────────────────┘         └─────────────────┘
        │                            │
        │                            │
        ▼                            ▼
┌─────────────────┐         ┌─────────────────┐
│   Transport     │         │   Capabilities  │
│ (HTTP/WS/stdio) │         │ (Tools/Context) │
└─────────────────┘         └─────────────────┘
```

### Core Components

1. **AIP Client**: Connects to services and invokes capabilities
2. **AIP Server**: Hosts services and exposes capabilities
3. **Transport Layer**: HTTP, WebSocket, stdio, or custom
4. **Capabilities**: Tools, context, resources, streaming

---

## 🔧 Features

### ✅ Implemented

- [x] JSON-RPC 2.0 message format
- [x] **AICF-RPC** (AI-native protocol with 75% token savings)
- [x] Dual protocol support (JSON-RPC + AICF-RPC)
- [x] Handshake and capability negotiation
- [x] Tool invocation
- [x] HTTP transport
- [x] Authentication (Bearer, API Key)
- [x] Error handling
- [x] TypeScript types
- [x] **Figma Service** (11 tools for design reading)
- [x] **Playwright Service** (21 tools for browser automation)
- [x] **MCP Bridge** (converts MCP protocol to AIP)

### 🚧 In Progress

- [ ] Context sharing (AICF-native)
- [ ] WebSocket transport
- [ ] Stdio transport
- [ ] Streaming support
- [ ] Resource management
- [ ] Rate limiting

### 📋 Planned

- [ ] Plugin architecture
- [ ] OAuth 2.0 authentication
- [ ] mTLS support
- [ ] Client SDKs (Python, Go, Rust)
- [ ] More services (GitHub, Slack, Supabase, Stripe)
- [ ] Visual diff service (compare Figma with screenshots)
- [ ] CLI tool for testing
- [ ] Docker images

---

## 🆚 AIP vs MCP

| Feature              | AIP                                 | MCP          |
| -------------------- | ----------------------------------- | ------------ |
| **Vendor**           | Vendor-neutral                      | Anthropic    |
| **Format**           | JSON-RPC 2.0 + AICF-RPC (AI-native) | JSON-RPC 2.0 |
| **Token Efficiency** | 75% fewer tokens with AICF-RPC      | Standard     |
| **Transports**       | HTTP, WS, stdio, custom             | stdio, SSE   |
| **Context Format**   | AICF-native                         | Custom       |
| **Extensibility**    | Plugin architecture                 | Limited      |
| **Authentication**   | Multiple methods                    | Basic        |
| **License**          | AGPL-3.0                            | MIT          |

---

## 🌟 Why AIP?

### Problem: Vendor Lock-in

Current AI protocols (like MCP) are tied to specific vendors (Anthropic). This creates:

- ❌ Vendor lock-in
- ❌ Limited interoperability
- ❌ Fragmented ecosystem

### Solution: Universal Protocol

AIP provides a **vendor-neutral, open standard** that:

- ✅ Works with any LLM (OpenAI, Anthropic, Google, local models)
- ✅ Enables interoperability between AI systems
- ✅ Creates a unified ecosystem

---

## 🤝 Integration with AICF

AIP has **native support** for [AICF (AI Context Format)](https://github.com/digital-liquids/aicf-core):

```typescript
// Server exposes AICF context
server.registerContext({
  name: "project.info",
  description: "Project information",
  format: "aicf",
  handler: async () => {
    return {
      format: "aicf",
      data: `@PROJECT_INFO
@SCHEMA
Name|Type|Status|Description
@DATA
MyProject|Web App|Active|AI-powered application`,
    };
  },
});

// Client retrieves AICF context
const context = await client.getContext("project.info");
console.log(context.data); // AICF-formatted data
```

---

## 📦 Ecosystem

### Core Libraries

- **[@vaeshkar/aip-core](.)** - Core protocol implementation (TypeScript)

### Production Services

- **[@vaeshkar/aip-figma](services/figma)** - Figma design service (11 tools)
  - Read Figma files, extract colors, list components, get versions, and more
  - Simple HTTP API, no configuration needed

- **[@vaeshkar/aip-playwright](services/playwright)** - Browser automation service (21 tools)
  - Navigate, click, type, screenshot, resize, and more
  - Bridges Playwright MCP to AIP protocol
  - Works with ANY LLM!

### Example Usage

```bash
# Start Figma service
npx @vaeshkar/aip-figma --figma-token=YOUR_TOKEN

# Start Playwright service
npx @vaeshkar/aip-playwright

# Use from any LLM or tool
curl -X POST http://localhost:3001/aip/v1/rpc \
  -d '{"method":"aip.tool.invoke","params":{"tool":"figma.getFile","arguments":{"fileKey":"YOUR_KEY"}}}'

curl -X POST http://localhost:3002/aip/v1/rpc \
  -d '{"method":"aip.tool.invoke","params":{"tool":"playwright.navigate","arguments":{"url":"https://example.com"}}}'
```

---

## 🛠️ Development

### Prerequisites

- Node.js 18+
- TypeScript 5.0+
- npm or pnpm

### Setup

```bash
# Clone repository
git clone https://github.com/digital-liquids/aip-workspace.git
cd aip-workspace

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run examples
npm run example:server
npm run example:client
```

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Areas We Need Help

- 🐛 Bug fixes
- 📝 Documentation improvements
- 🧪 Test coverage
- 🌐 Client SDKs in other languages (Python, Go, Rust)
- 🔌 Example services
- 🎨 UI/UX for CLI tool

---

## 📄 License

AGPL-3.0 License - see [LICENSE](LICENSE) for details.

This project is licensed under the GNU Affero General Public License v3.0 or later.
If you use this software over a network, you must make the source code available to users.

---

## 🙏 Acknowledgments

- **Anthropic** for creating MCP and inspiring this project
- **Microsoft** for Playwright and Playwright MCP
- **The open source community** for making this possible

---

## 📞 Contact

- **Author**: Dennis van Leeuwen
- **GitHub**: [@Vaeshkar](https://github.com/Vaeshkar)
- **Website**: [www.minusnine.io](https://www.minusnine.io)

---

## 🗺️ Roadmap

### Phase 1: Core Protocol (Q4 2025)

- [x] Specification v1.0.0
- [x] TypeScript schema
- [ ] Core library implementation
- [ ] HTTP transport
- [ ] Basic authentication

### Phase 2: Transports & Streaming (Q1 2026)

- [ ] WebSocket transport
- [ ] Stdio transport
- [ ] Streaming support
- [ ] Rate limiting

### Phase 3: Ecosystem (Q2 2026)

- [ ] Client SDKs (Python, Go, Rust)
- [ ] Example services
- [ ] CLI tool
- [ ] Documentation site

### Phase 4: Advanced Features (Q3 2026)

- [ ] Plugin architecture
- [ ] OAuth 2.0 / mTLS
- [ ] Service discovery
- [ ] Monitoring & observability

---

**Built with ❤️ by Dennis van Leeuwen**
