# Using Figma AIP Service from Other Projects 🚀

This guide shows you how to use the Figma AIP service from **any project** with **any LLM** - including Claude Sonnet 4.5 in Augment!

---

## 🎯 The Problem

- **Augment** uses Claude Sonnet 4.5 but **doesn't have MCP access**
- **Figma's MCP server** only works with Claude Desktop (not Augment)
- **You need** a way to access Figma from Augment

## ✅ The Solution: AIP

**AIP (AI-Protocol)** is a universal protocol that works with **any LLM**, not just Claude Desktop!

---

## 🚀 Quick Start (3 Steps)

### Step 1: Start the Figma AIP Service

In the `aip-workspace` directory:

```bash
cd services/figma

# Make sure .env.local has your Figma API key
# FIGMA_API_KEY=your_token_here

npm start
```

The service will start on `http://localhost:65001`

### Step 2: Use It from Your Other Project

You have **3 options**:

#### **Option A: Direct HTTP Requests (Works Everywhere!)**

From **any project**, **any language**, **any LLM**:

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

**This works from:**
- ✅ Augment (Claude Sonnet 4.5)
- ✅ ChatGPT
- ✅ Any terminal
- ✅ Any programming language
- ✅ Any AI tool

#### **Option B: AIP Client (TypeScript/JavaScript)**

Install the AIP client in your project:

```bash
npm install @vaeshkar/aip-core
```

Then use it:

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

#### **Option C: Tell Your LLM to Use It**

In **Augment** or any AI chat, just tell the LLM:

```
I have a Figma AIP service running at http://localhost:65001/aip/v1/rpc

Can you help me get data from my Figma file?
File key: abc123

Use this curl command:
curl -X POST http://localhost:65001/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":"1","method":"aip.tool.invoke","params":{"tool":"figma.getFile","arguments":{"fileKey":"abc123","depth":1}}}'
```

The LLM will execute the curl command and get your Figma data!

### Step 3: Profit! 🎉

Now you can:
- ✅ Access Figma from Augment
- ✅ Access Figma from any LLM
- ✅ Access Figma from any project
- ✅ No MCP required!

---

## 📖 Complete Example: Using from Augment

### Scenario: You're working in Augment and need Figma data

1. **Start the Figma AIP service** (in terminal):
   ```bash
   cd ~/Programming/aip-workspace/services/figma
   npm start
   ```

2. **In Augment**, tell Claude:
   ```
   I have a Figma AIP service running locally at http://localhost:65001/aip/v1/rpc
   
   Can you help me get my Figma file with key "abc123"?
   
   Use this curl command:
   curl -X POST http://localhost:65001/aip/v1/rpc \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","id":"1","method":"aip.tool.invoke","params":{"tool":"figma.getFile","arguments":{"fileKey":"abc123","depth":1}}}'
   ```

3. **Claude will execute the command** and show you the Figma data!

4. **Then you can ask Claude**:
   - "Generate React components from this design"
   - "Extract the color palette"
   - "Show me all the text styles"
   - "Create CSS from these styles"

---

## 🔧 Available Tools

Tell your LLM about these tools:

### File Operations
- `figma.getFile` - Get a Figma file
- `figma.getFileNodes` - Get specific nodes
- `figma.getImages` - Render images
- `figma.getFileVersions` - Get version history

### Comments
- `figma.getComments` - Get comments
- `figma.postComment` - Post a comment

### Components & Styles
- `figma.getTeamComponents` - Get components
- `figma.getFileStyles` - Get styles

### Projects
- `figma.getTeamProjects` - Get projects
- `figma.getProjectFiles` - Get project files

### User
- `figma.getMe` - Get user info

---

## 🌐 Using from Different Languages

### Python

```python
import requests

response = requests.post(
    'http://localhost:65001/aip/v1/rpc',
    json={
        'jsonrpc': '2.0',
        'id': '1',
        'method': 'aip.tool.invoke',
        'params': {
            'tool': 'figma.getFile',
            'arguments': {
                'fileKey': 'YOUR_FILE_KEY',
                'depth': 1
            }
        }
    }
)

data = response.json()
print(data['result']['data'])
```

### Go

```go
package main

import (
    "bytes"
    "encoding/json"
    "net/http"
)

func main() {
    payload := map[string]interface{}{
        "jsonrpc": "2.0",
        "id": "1",
        "method": "aip.tool.invoke",
        "params": map[string]interface{}{
            "tool": "figma.getFile",
            "arguments": map[string]interface{}{
                "fileKey": "YOUR_FILE_KEY",
                "depth": 1,
            },
        },
    }
    
    jsonData, _ := json.Marshal(payload)
    resp, _ := http.Post(
        "http://localhost:65001/aip/v1/rpc",
        "application/json",
        bytes.NewBuffer(jsonData),
    )
    // Handle response...
}
```

### Rust

```rust
use reqwest;
use serde_json::json;

#[tokio::main]
async fn main() {
    let client = reqwest::Client::new();
    
    let response = client
        .post("http://localhost:65001/aip/v1/rpc")
        .json(&json!({
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
        }))
        .send()
        .await
        .unwrap();
    
    let data = response.json::<serde_json::Value>().await.unwrap();
    println!("{:?}", data);
}
```

---

## 🔐 Security Notes

### Running Locally (Development)

- ✅ Service runs on `localhost:65001`
- ✅ Only accessible from your machine
- ✅ Figma API key stored in `.env.local` (not committed to git)

### Running on a Server (Production)

If you want to run this on a server:

1. **Use HTTPS**: Add SSL/TLS
2. **Add authentication**: Require API keys for clients
3. **Use environment variables**: Never hardcode tokens
4. **Restrict CORS**: Only allow specific origins

---

## 🎓 Advanced: Creating a Wrapper Script

Create a helper script in your project:

**`figma-helper.sh`**:
```bash
#!/bin/bash

FIGMA_SERVICE="http://localhost:65001/aip/v1/rpc"

function figma_get_file() {
  local file_key=$1
  curl -s -X POST $FIGMA_SERVICE \
    -H "Content-Type: application/json" \
    -d "{
      \"jsonrpc\": \"2.0\",
      \"id\": \"1\",
      \"method\": \"aip.tool.invoke\",
      \"params\": {
        \"tool\": \"figma.getFile\",
        \"arguments\": {
          \"fileKey\": \"$file_key\",
          \"depth\": 1
        }
      }
    }" | jq '.result.data'
}

# Usage: ./figma-helper.sh abc123
figma_get_file $1
```

Then use it:
```bash
chmod +x figma-helper.sh
./figma-helper.sh YOUR_FILE_KEY
```

---

## 🚨 Troubleshooting

### "Connection refused"

**Problem**: Service isn't running

**Solution**: Start the service:
```bash
cd ~/Programming/aip-workspace/services/figma
npm start
```

### "Invalid file key"

**Problem**: Wrong file key or no access

**Solution**: 
1. Check the file key in the Figma URL
2. Make sure your Figma token has access to the file

### "FIGMA_API_KEY is required"

**Problem**: No API key configured

**Solution**: Create `.env.local`:
```bash
cd services/figma
echo "FIGMA_API_KEY=your_token_here" > .env.local
```

---

## 💡 Pro Tips

1. **Keep the service running**: Run it in a separate terminal or use `tmux`/`screen`
2. **Use jq for JSON parsing**: `curl ... | jq '.result.data.name'`
3. **Create aliases**: Add to your `.bashrc`:
   ```bash
   alias figma-start="cd ~/Programming/aip-workspace/services/figma && npm start"
   ```
4. **Use with AI**: Tell your LLM about the service and let it help you!

---

## 🎯 Summary

**The key insight**: AIP is just HTTP + JSON-RPC, so you can use it from **anywhere**:

- ✅ **Augment** (Claude Sonnet 4.5) - Use curl or tell Claude about the service
- ✅ **ChatGPT** - Same approach
- ✅ **Any terminal** - Direct curl commands
- ✅ **Any programming language** - HTTP POST requests
- ✅ **Any project** - No special setup needed

**You're not locked into MCP or Claude Desktop!** 🎉

---

**Questions? Just ask Dennis or check the other docs!** 📚

