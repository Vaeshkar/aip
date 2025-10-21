# AIP Quick Start Guide 🚀

Get started with AIP (AI-Protocol) in 5 minutes!

---

## Prerequisites

- Node.js 18+ installed
- npm or pnpm
- Basic TypeScript knowledge

---

## Installation

```bash
# Clone the repository
git clone https://github.com/digital-liquids/aip-workspace.git
cd aip-workspace

# Install dependencies
npm install

# Build the project
npm run build
```

---

## Running the Example Server

In one terminal:

```bash
npm run example:server
```

You should see:

```
✅ AIP Server started successfully!

📋 Available capabilities:
  - tool: greet - Greet a user by name
  - tool: sum - Calculate the sum of two numbers
  - tool: time - Get the current time
  - context: server.info - Server information in AICF format
  - context: system.stats - System statistics

🔗 Endpoints:
  - Health: http://localhost:3000/health
  - RPC: http://localhost:3000/aip/v1/rpc
```

---

## Running the Example Client

In another terminal:

```bash
npm run example:client
```

You should see the client connect, list capabilities, invoke tools, and get context!

---

## Testing with curl

### 1. Handshake

```bash
curl -X POST http://localhost:3000/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "aip.handshake",
    "params": {
      "version": "1.0.0",
      "client": {
        "name": "TestClient",
        "version": "1.0.0",
        "capabilities": ["tool", "context"]
      }
    }
  }'
```

### 2. List Capabilities

```bash
curl -X POST http://localhost:3000/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "2",
    "method": "aip.capabilities.list",
    "params": {}
  }'
```

### 3. Invoke a Tool

```bash
curl -X POST http://localhost:3000/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "3",
    "method": "aip.tool.invoke",
    "params": {
      "tool": "greet",
      "arguments": {
        "name": "Alice"
      }
    }
  }'
```

### 4. Get Context (AICF)

```bash
curl -X POST http://localhost:3000/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "4",
    "method": "aip.context.get",
    "params": {
      "context": "server.info"
    }
  }'
```

---

## Creating Your Own Server

```typescript
import { AIPServer, HTTPTransport } from "@vaeshkar/aip-core";

// Create server
const server = new AIPServer({
  name: "MyAIPServer",
  version: "1.0.0",
});

// Register a tool
server.registerTool(
  {
    type: "tool",
    name: "hello",
    description: "Say hello",
    schema: {
      type: "object",
      properties: {
        name: { type: "string" },
      },
      required: ["name"],
    },
  },
  async (args) => {
    return {
      success: true,
      data: `Hello, ${args.name}!`,
    };
  }
);

// Start HTTP transport
const transport = new HTTPTransport(server);
transport.listen(3000);
```

---

## Creating Your Own Client

```typescript
import { AIPClient } from "@vaeshkar/aip-core";

// Create client
const client = new AIPClient({
  url: "http://localhost:3000/aip/v1/rpc",
});

// Connect
await client.connect();

// Invoke tool
const result = await client.invokeTool("hello", { name: "World" });
console.log(result.data); // "Hello, World!"

// Disconnect
await client.disconnect();
```

---

## Next Steps

1. **Read the specification**: [docs/AIP-SPECIFICATION.md](docs/AIP-SPECIFICATION.md)
2. **Explore the schema**: [schema/aip-schema.ts](schema/aip-schema.ts)
3. **Check out examples**: [examples/](examples/)
4. **Build your own service**: Start with the server example and add your own tools!

---

## Common Issues

### Port already in use

If port 3000 is already in use, you can change it:

```typescript
transport.listen(65001); // Or use dynamic port allocation (recommended)
```

### TypeScript errors

Make sure you've built the project:

```bash
npm run build
```

### Module not found

Make sure dependencies are installed:

```bash
npm install
```

---

## Getting Help

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/digital-liquids/aip-workspace/issues)
- **Discussions**: [GitHub Discussions](https://github.com/digital-liquids/aip-workspace/discussions)

---

**Happy coding! 🎉**
