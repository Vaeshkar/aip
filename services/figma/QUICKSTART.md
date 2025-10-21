# Figma AIP Service - Quick Start Guide 🚀

Get started with the Figma AIP service in 5 minutes!

---

## Step 1: Get Your Figma API Token 🔑

1. Go to [Figma Account Settings](https://www.figma.com/settings)
2. Scroll to **Personal Access Tokens**
3. Click **Generate new token**
4. Give it a name (e.g., "AIP Service")
5. Copy the token (you won't see it again!)

---

## Step 2: Configure the Service ⚙️

Create a `.env` file in the `services/figma/` directory:

```bash
cd services/figma
cp .env.example .env
```

Edit `.env` and add your token:

```bash
FIGMA_API_KEY=your_figma_api_key_here
PORT=65001
HOST=0.0.0.0
```

---

## Step 3: Start the Service 🚀

```bash
npm start
```

You should see:

```
🎨 Figma AIP Service started successfully!

📋 Available tools:
  - figma.getFile: Get a Figma file by key. Returns the full document tree.
  - figma.getFileNodes: Get specific nodes from a Figma file by their IDs
  - figma.getImages: Render images from a Figma file
  - figma.getComments: Get comments from a Figma file
  - figma.postComment: Post a comment to a Figma file
  - figma.getTeamComponents: Get components from a Figma team

🔗 Endpoints:
  - Health: http://0.0.0.0:65001/health
  - RPC: http://0.0.0.0:65001/aip/v1/rpc
```

---

## Step 4: Test It! 🧪

### Option A: Using curl

```bash
# Get a Figma file
curl -X POST http://localhost:65001/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "aip.tool.invoke",
    "params": {
      "tool": "figma.getFile",
      "arguments": {
        "fileKey": "YOUR_FILE_KEY",
        "depth": 1
      }
    }
  }'
```

**Where to find your file key:**
- Open any Figma file
- Look at the URL: `https://www.figma.com/file/abcXYZ123/My-Design`
- The file key is `abcXYZ123`

### Option B: Using the example script

```bash
# Run all examples
./examples/curl-examples.sh
```

### Option C: Using AIP Client (TypeScript)

```typescript
import { AIPClient } from '@vaeshkar/aip-core';

const client = new AIPClient({
  url: 'http://localhost:65001/aip/v1/rpc',
});

await client.connect();

const result = await client.invokeTool('figma.getFile', {
  fileKey: 'YOUR_FILE_KEY',
  depth: 1,
});

console.log(result.data);
```

---

## Step 5: Explore! 🔍

### Get File Information

```bash
curl -X POST http://localhost:65001/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "aip.tool.invoke",
    "params": {
      "tool": "figma.getFile",
      "arguments": {
        "fileKey": "YOUR_FILE_KEY",
        "depth": 1
      }
    }
  }' | jq '.result.data | {name, lastModified, version}'
```

### Get Comments

```bash
curl -X POST http://localhost:65001/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "2",
    "method": "aip.tool.invoke",
    "params": {
      "tool": "figma.getComments",
      "arguments": {
        "fileKey": "YOUR_FILE_KEY",
        "as_md": true
      }
    }
  }' | jq '.result.data.comments'
```

### Render Images

```bash
curl -X POST http://localhost:65001/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "3",
    "method": "aip.tool.invoke",
    "params": {
      "tool": "figma.getImages",
      "arguments": {
        "fileKey": "YOUR_FILE_KEY",
        "ids": ["NODE_ID"],
        "format": "png",
        "scale": 2
      }
    }
  }' | jq '.result.data.images'
```

**How to find node IDs:**
1. Open your Figma file
2. Right-click on any element
3. Select "Copy/Paste as" → "Copy link"
4. The node ID is in the URL: `?node-id=123-456`
5. Use `123:456` as the node ID (replace `-` with `:`)

---

## Common Use Cases 💡

### 1. Extract Design Tokens

```bash
# Get all styles from a file
curl -X POST http://localhost:65001/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "aip.tool.invoke",
    "params": {
      "tool": "figma.getFileStyles",
      "arguments": {
        "fileKey": "YOUR_FILE_KEY"
      }
    }
  }'
```

### 2. Monitor Design Changes

```bash
# Get file version history
curl -X POST http://localhost:65001/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "aip.tool.invoke",
    "params": {
      "tool": "figma.getFileVersions",
      "arguments": {
        "fileKey": "YOUR_FILE_KEY"
      }
    }
  }'
```

### 3. Generate Code from Designs

```bash
# Get specific frame/component
curl -X POST http://localhost:65001/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "aip.tool.invoke",
    "params": {
      "tool": "figma.getFileNodes",
      "arguments": {
        "fileKey": "YOUR_FILE_KEY",
        "ids": ["NODE_ID"],
        "depth": 3
      }
    }
  }'
```

Then use an LLM to generate code from the node data!

---

## Troubleshooting 🔧

### Error: "FIGMA_API_KEY is required"

Make sure you've set the environment variable:

```bash
export FIGMA_API_KEY=your_token_here
npm start
```

Or use the command line argument:

```bash
npm start -- --figma-token your_token_here
```

### Error: "Invalid file key"

- Check that your file key is correct
- Make sure you have access to the file
- Try opening the file in Figma first

### Error: "Rate limit exceeded"

Figma has rate limits. Wait a few seconds and try again.

---

## Next Steps 🎯

1. **Explore all tools**: Run `./examples/curl-examples.sh`
2. **Build an integration**: Use the AIP client in your app
3. **Connect to an LLM**: Use with OpenAI, Claude, or any LLM
4. **Automate workflows**: Create scripts to sync designs with code

---

## Resources 📚

- [Figma API Documentation](https://www.figma.com/developers/api)
- [AIP Protocol Specification](../../docs/AIP-SPECIFICATION.md)
- [Example Client Code](./examples/client-example.ts)
- [curl Examples](./examples/curl-examples.sh)

---

**Happy designing! 🎨**

