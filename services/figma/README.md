# Figma AIP Service 🎨

A complete Figma service implementation using the **AIP (AI-Protocol)** standard.

This service provides the same capabilities as Figma's MCP server, but using the universal AIP protocol - meaning **any LLM** can use it, not just Claude!

---

## 🌟 Features

### File Operations

- ✅ Get Figma files
- ✅ Get specific nodes from files
- ✅ Render images from files
- ✅ Get image fills
- ✅ Get file version history

### Comments

- ✅ Get comments
- ✅ Post comments
- ✅ Delete comments
- ✅ Manage comment reactions

### Components & Styles

- ✅ Get team/file components
- ✅ Get component sets
- ✅ Get team/file styles
- ✅ Get style details

### Projects & Teams

- ✅ Get team projects
- ✅ Get project files

### Webhooks (V2 API)

- ✅ Create webhooks
- ✅ Get/update/delete webhooks
- ✅ List team webhooks

### Library Analytics

- ✅ Component usage analytics
- ✅ Style usage analytics
- ✅ Variable usage analytics

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Figma API token ([Get one here](https://www.figma.com/developers/api#access-tokens))

### Installation

```bash
# Install globally
npm install -g @digital-liquids/aip-figma

# Or use with npx
npx @digital-liquids/aip-figma --figma-token=YOUR_TOKEN
```

### From Source

```bash
# Clone and install
git clone https://github.com/Vaeshkar/aip.git
cd aip/services/figma
npm install

# Set your Figma API token
export FIGMA_API_KEY=your_figma_api_key

# Start the service
npm start
```

The service will start on `http://localhost:3001/aip/v1/rpc`

---

## 📖 Usage

### With AIP Client

```typescript
import { AIPClient } from "@digital-liquids/aip-core";

const client = new AIPClient({
  url: "http://localhost:3001/aip/v1/rpc",
});

await client.connect();

// Get a Figma file
const result = await client.invokeTool("figma.getFile", {
  fileKey: "your-file-key",
});

console.log(result.data);
```

### With curl

```bash
# Get a Figma file
curl -X POST http://localhost:3001/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "aip.tool.invoke",
    "params": {
      "tool": "figma.getFile",
      "arguments": {
        "fileKey": "your-file-key"
      }
    }
  }'
```

---

## 🔧 Available Tools

### File Tools

- `figma.getFile` - Get a Figma file by key
- `figma.getFileNodes` - Get specific nodes from a file
- `figma.getImages` - Render images from a file
- `figma.getImageFills` - Get image fills in a file
- `figma.getFileVersions` - Get version history

### Comment Tools

- `figma.getComments` - Get comments in a file
- `figma.postComment` - Add a comment
- `figma.deleteComment` - Delete a comment

### Component Tools

- `figma.getTeamComponents` - Get components in a team
- `figma.getFileComponents` - Get components in a file
- `figma.getComponent` - Get a component by key

### Style Tools

- `figma.getTeamStyles` - Get styles in a team
- `figma.getFileStyles` - Get styles in a file
- `figma.getStyle` - Get a style by key

### Project Tools

- `figma.getTeamProjects` - Get projects in a team
- `figma.getProjectFiles` - Get files in a project

---

## 🆚 AIP vs MCP

| Feature            | Figma AIP Service      | Figma MCP Server |
| ------------------ | ---------------------- | ---------------- |
| **Protocol**       | AIP (Universal)        | MCP (Anthropic)  |
| **LLM Support**    | Any LLM                | Claude only      |
| **Transport**      | HTTP, WebSocket, stdio | stdio, SSE       |
| **Context Format** | AICF-native            | Custom           |
| **Extensibility**  | Plugin architecture    | Limited          |

---

## 📝 Configuration

### Environment Variables

- `FIGMA_API_KEY` - Your Figma API token (required)
- `PORT` - Server port (default: 3001)
- `HOST` - Server host (default: 0.0.0.0)

### Command Line Arguments

```bash
npm start -- --figma-token YOUR_TOKEN --port 3001
```

---

## 🔐 Authentication

The service requires a Figma API token. You can provide it via:

1. **Environment variable**: `FIGMA_API_KEY=your_token`
2. **Command line**: `--figma-token your_token`
3. **Config file**: Create `config.json` with `{"figmaApiKey": "your_token"}`

---

## 📚 Examples

See the [examples/](examples/) directory for complete usage examples.

---

## 🤝 Contributing

This is part of the AIP ecosystem. Contributions welcome!

---

## 📄 License

AGPL-3.0-or-later

Copyright (c) 2025 Dennis van Leeuwen (Digital Liquids)

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

See [LICENSE](LICENSE) for full details.

---

**Built with ❤️ by Digital Liquids using AIP (AI-Protocol)**
