# Using Figma AIP Service with Augment (Claude Sonnet 4.5) 🚀

This guide shows you **exactly** how to use the Figma AIP service from Augment.

---

## 🎯 The Setup

You have:
- ✅ **Augment** with Claude Sonnet 4.5
- ✅ **Figma AIP Service** running locally
- ✅ **Figma API key** in `.env.local`

You want:
- ✅ Access Figma from Augment
- ✅ No MCP required
- ✅ Works with any LLM

---

## 📋 Step-by-Step Guide

### Step 1: Start the Figma AIP Service

Open a terminal and run:

```bash
cd ~/Programming/aip-workspace/services/figma
npm start
```

You should see:

```
🎨 Figma AIP Service started successfully!

📋 Available tools:
  - figma.getFile: Get a Figma file by key. Returns the full document tree.
  - figma.getFileNodes: Get specific nodes from a Figma file by their IDs
  - figma.getImages: Render images from a Figma file
  ...

🔗 Endpoints:
  - Health: http://0.0.0.0:65001/health
  - RPC: http://0.0.0.0:65001/aip/v1/rpc
```

**Keep this terminal open!** The service needs to keep running.

---

### Step 2: Get Your Figma File Key

1. Open your Figma file in the browser
2. Look at the URL: `https://www.figma.com/file/abcXYZ123/My-Design`
3. The file key is `abcXYZ123`

---

### Step 3: Use It in Augment

Now, in **Augment**, you can tell Claude to use the service!

#### **Example 1: Get a Figma File**

In Augment, type:

```
I have a Figma AIP service running at http://localhost:65001/aip/v1/rpc

Can you get my Figma file with key "abcXYZ123"?

Use this curl command:

curl -X POST http://localhost:65001/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "aip.tool.invoke",
    "params": {
      "tool": "figma.getFile",
      "arguments": {
        "fileKey": "abcXYZ123",
        "depth": 1
      }
    }
  }'
```

Claude will execute the command and show you the Figma data!

#### **Example 2: Generate React Components**

```
I have a Figma AIP service at http://localhost:65001/aip/v1/rpc

Can you:
1. Get my Figma file (key: abcXYZ123)
2. Extract the button component
3. Generate a React component from it

Use the figma.getFile tool first, then analyze the data.
```

Claude will:
1. Call the Figma service
2. Get the file data
3. Find the button component
4. Generate React code for you!

#### **Example 3: Extract Design Tokens**

```
I have a Figma AIP service at http://localhost:65001/aip/v1/rpc

Can you:
1. Get all styles from my Figma file (key: abcXYZ123)
2. Extract the color palette
3. Generate a CSS variables file

Use the figma.getFileStyles tool.
```

---

## 🎓 Advanced: Create a Helper Script

Create a file `figma-cli.sh` in your project:

```bash
#!/bin/bash

# Figma AIP Service Helper
# Usage: ./figma-cli.sh getFile abc123

SERVICE_URL="http://localhost:65001/aip/v1/rpc"

case "$1" in
  getFile)
    curl -s -X POST $SERVICE_URL \
      -H "Content-Type: application/json" \
      -d "{
        \"jsonrpc\": \"2.0\",
        \"id\": \"1\",
        \"method\": \"aip.tool.invoke\",
        \"params\": {
          \"tool\": \"figma.getFile\",
          \"arguments\": {
            \"fileKey\": \"$2\",
            \"depth\": 1
          }
        }
      }" | jq '.result.data'
    ;;
    
  getComments)
    curl -s -X POST $SERVICE_URL \
      -H "Content-Type: application/json" \
      -d "{
        \"jsonrpc\": \"2.0\",
        \"id\": \"1\",
        \"method\": \"aip.tool.invoke\",
        \"params\": {
          \"tool\": \"figma.getComments\",
          \"arguments\": {
            \"fileKey\": \"$2\",
            \"as_md\": true
          }
        }
      }" | jq '.result.data.comments'
    ;;
    
  *)
    echo "Usage: $0 {getFile|getComments} FILE_KEY"
    exit 1
    ;;
esac
```

Make it executable:
```bash
chmod +x figma-cli.sh
```

Then use it:
```bash
./figma-cli.sh getFile abcXYZ123
./figma-cli.sh getComments abcXYZ123
```

Now in Augment, you can just say:
```
Run: ./figma-cli.sh getFile abcXYZ123
```

---

## 🔄 Complete Workflow Example

### Scenario: Design-to-Code Workflow

**Goal**: Convert a Figma button component to React code

**Steps**:

1. **Start the service** (terminal 1):
   ```bash
   cd ~/Programming/aip-workspace/services/figma
   npm start
   ```

2. **In Augment** (your main workspace):
   ```
   I have a Figma AIP service running at http://localhost:65001/aip/v1/rpc
   
   My Figma file key is: abcXYZ123
   
   Can you help me:
   1. Get the file data
   2. Find the "Button" component
   3. Generate a React component with TypeScript
   4. Include all styles (colors, spacing, typography)
   5. Make it accessible (ARIA labels, keyboard navigation)
   
   Start by calling the figma.getFile tool.
   ```

3. **Claude will**:
   - Execute the curl command
   - Parse the Figma data
   - Find the button component
   - Generate clean React + TypeScript code
   - Include all styles
   - Add accessibility features

4. **Result**: You get production-ready React code from your Figma design!

---

## 💡 Pro Tips for Augment

### Tip 1: Create a Context File

Create `.augment/figma-context.md`:

```markdown
# Figma AIP Service Context

I have a Figma AIP service running at http://localhost:65001/aip/v1/rpc

## Available Tools

- figma.getFile - Get a Figma file
- figma.getFileNodes - Get specific nodes
- figma.getImages - Render images
- figma.getComments - Get comments
- figma.getFileStyles - Get styles
- figma.getTeamComponents - Get components

## My Figma Files

- Design System: abc123
- Landing Page: def456
- Mobile App: ghi789

## Usage Pattern

curl -X POST http://localhost:65001/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":"1","method":"aip.tool.invoke","params":{"tool":"TOOL_NAME","arguments":{...}}}'
```

Now Augment will always know about your Figma service!

### Tip 2: Create Aliases

Add to your `.bashrc` or `.zshrc`:

```bash
alias figma-start="cd ~/Programming/aip-workspace/services/figma && npm start"
alias figma-get="curl -s -X POST http://localhost:65001/aip/v1/rpc -H 'Content-Type: application/json' -d"
```

Now you can just run:
```bash
figma-start
```

### Tip 3: Use with Other Tools

Combine with other tools:

```bash
# Get Figma data and save to file
./figma-cli.sh getFile abc123 > design-data.json

# Then in Augment:
# "Analyze design-data.json and generate components"
```

---

## 🚨 Troubleshooting

### "Connection refused"

**Problem**: Service isn't running

**Solution**:
```bash
cd ~/Programming/aip-workspace/services/figma
npm start
```

### "Invalid file key"

**Problem**: Wrong file key or no access

**Solution**: 
1. Check the Figma URL
2. Make sure your token has access
3. Try opening the file in Figma first

### "FIGMA_API_KEY is required"

**Problem**: No API key in `.env.local`

**Solution**:
```bash
cd ~/Programming/aip-workspace/services/figma
echo "FIGMA_API_KEY=your_token_here" > .env.local
npm start
```

---

## 🎯 Summary

**The key insight**: Augment can execute curl commands, so you can use the Figma AIP service just like any other HTTP API!

**Workflow**:
1. ✅ Start the Figma AIP service (once)
2. ✅ Tell Augment about the service
3. ✅ Ask Augment to call the service
4. ✅ Augment executes curl and gets Figma data
5. ✅ Augment helps you with the data (generate code, extract tokens, etc.)

**You're not limited to MCP or Claude Desktop!** 🎉

---

## 📚 Next Steps

- Read [USAGE_FROM_OTHER_PROJECTS.md](../USAGE_FROM_OTHER_PROJECTS.md) for more examples
- Check [QUICKSTART.md](../QUICKSTART.md) for service setup
- See [examples/curl-examples.sh](./curl-examples.sh) for all available tools

---

**Happy designing with Augment! 🎨**

