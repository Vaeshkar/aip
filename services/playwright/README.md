# 🎭 AIP Playwright Service

**Browser automation for any LLM via AIP protocol**

This service bridges [Microsoft's Playwright MCP](https://github.com/microsoft/playwright-mcp) to the AIP (AI-Protocol) HTTP interface, making browser automation accessible to any LLM, not just Claude.

---

## 🎯 **What It Does**

- **Wraps Playwright MCP** - Uses Microsoft's battle-tested browser automation
- **Exposes AIP HTTP API** - Simple JSON-RPC over HTTP (no SSE complexity)
- **Universal compatibility** - Works with any LLM (Claude, GPT-4, Gemini, local models)
- **All Playwright tools** - Navigate, click, type, screenshot, resize, test, etc.

---

## 🚀 **Quick Start**

### **Install Globally**

```bash
# Install from npm
npm install -g @vaeshkar/aip-playwright

# Or use with npx
npx @vaeshkar/aip-playwright
```

**Port Management**: The service uses **dynamic port allocation** starting from port **65002**. It automatically:

- ✅ Detects if the port is in use
- ✅ Kills old instances of the same service
- ✅ Finds the next available port if needed
- ✅ Reports the allocated port on startup

Override with: `PORT=12345 aip-playwright`

### **Install from Source**

```bash
# Clone repository
git clone https://github.com/Vaeshkar/aip.git
cd aip/services/playwright

# Install and build
npm install
npm run build

# Run
npm start
```

The service will:

1. Start Playwright MCP server internally (port 8932)
2. Connect to it via MCP SDK
3. Expose AIP HTTP interface with **dual protocol support**:
   - **JSON-RPC**: `http://localhost:65002/aip/v1/rpc`
   - **AICF-RPC**: `http://localhost:65002/aip/v1/aicf` (75% fewer tokens!)

### **Test with JSON-RPC**

```bash
# Navigate to a webpage
curl -X POST http://localhost:65002/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "aip.tool.invoke",
    "params": {
      "tool": "playwright.navigate",
      "arguments": {
        "url": "https://example.com"
      }
    }
  }'

# Take a screenshot
curl -X POST http://localhost:65002/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "2",
    "method": "aip.tool.invoke",
    "params": {
      "tool": "playwright.take_screenshot",
      "arguments": {
        "filename": "screenshot.png"
      }
    }
  }'
```

### **Test with AICF-RPC (AI-Optimized)** 🚀

**75% fewer tokens than JSON-RPC!**

```bash
# List all tools
curl -X POST http://localhost:65002/aip/v1/aicf \
  -H "Content-Type: text/plain" \
  -d "LIST"

# Navigate to a webpage
curl -X POST http://localhost:65002/aip/v1/aicf \
  -H "Content-Type: text/plain" \
  -d "CALL|playwright.navigate|https://example.com"

# Take a screenshot
curl -X POST http://localhost:65002/aip/v1/aicf \
  -H "Content-Type: text/plain" \
  -d "CALL|playwright.take_screenshot|screenshot.png"
```

**Learn more:** [AICF-RPC Documentation](../../docs/AICF-RPC-README.md)

---

## 🛠️ **Available Tools**

All Playwright MCP tools are exposed with `playwright.` prefix:

### **Core Automation**

- `playwright.navigate` - Navigate to URL
- `playwright.click` - Click element
- `playwright.type` - Type text
- `playwright.fill_form` - Fill multiple form fields
- `playwright.press_key` - Press keyboard key
- `playwright.hover` - Hover over element
- `playwright.drag` - Drag and drop
- `playwright.select_option` - Select dropdown option
- `playwright.file_upload` - Upload files
- `playwright.handle_dialog` - Handle alerts/confirms
- `playwright.wait_for` - Wait for text/time
- `playwright.evaluate` - Run JavaScript

### **Inspection**

- `playwright.snapshot` - Get accessibility tree (better than screenshot!)
- `playwright.take_screenshot` - Take screenshot
- `playwright.console_messages` - Get console logs
- `playwright.network_requests` - Get network activity

### **Viewport**

- `playwright.resize` - Resize browser window
- `playwright.navigate_back` - Go back

### **Session**

- `playwright.close` - Close browser
- `playwright.tabs` - Manage tabs (list, create, close, select)

### **Advanced** (opt-in via `--caps`)

- `playwright.pdf_save` - Save as PDF
- `playwright.mouse_click_xy` - Click at coordinates
- `playwright.mouse_move_xy` - Move mouse
- `playwright.mouse_drag_xy` - Drag mouse
- `playwright.verify_*` - Test assertions
- `playwright.generate_locator` - Generate test locators
- `playwright.start_tracing` - Start trace recording
- `playwright.stop_tracing` - Stop trace recording

---

## 🎨 **Use Cases**

### **1. Design-to-Code Testing**

```javascript
// Read Figma design
const figmaResponse = await fetch("http://localhost:65001/aip/v1/rpc", {
  method: "POST",
  body: JSON.stringify({
    jsonrpc: "2.0",
    id: "1",
    method: "aip.tool.invoke",
    params: {
      tool: "figma.getFile",
      arguments: { fileKey: "YOUR_FILE_KEY" },
    },
  }),
});

// Generate React code with exact colors
// ... (AI generates code)

// Test with Playwright
await fetch("http://localhost:65002/aip/v1/rpc", {
  method: "POST",
  body: JSON.stringify({
    jsonrpc: "2.0",
    id: "2",
    method: "aip.tool.invoke",
    params: {
      tool: "playwright.navigate",
      arguments: { url: "http://localhost:3000" },
    },
  }),
});

// Screenshot at mobile size
await fetch("http://localhost:65002/aip/v1/rpc", {
  method: "POST",
  body: JSON.stringify({
    jsonrpc: "2.0",
    id: "3",
    method: "aip.tool.invoke",
    params: {
      tool: "playwright.resize",
      arguments: { width: 375, height: 667 },
    },
  }),
});

await fetch("http://localhost:65002/aip/v1/rpc", {
  method: "POST",
  body: JSON.stringify({
    jsonrpc: "2.0",
    id: "4",
    method: "aip.tool.invoke",
    params: {
      tool: "playwright.take_screenshot",
      arguments: { filename: "mobile.png" },
    },
  }),
});
```

### **2. Responsive Testing**

Test your app at multiple breakpoints:

```bash
# Mobile (375x667)
# Tablet (768x1024)
# Desktop (1920x1080)
```

### **3. E2E Testing**

```bash
# Navigate → Fill form → Click button → Verify result
```

---

## ⚙️ **Configuration**

### **Environment Variables**

```bash
PORT=65002          # AIP HTTP server port
MCP_PORT=8932      # Internal MCP server port
```

### **Playwright Options**

Pass options to Playwright MCP via command line:

```bash
# Headless mode (default)
npm start

# Headed mode (see browser)
MCP_ARGS="--no-headless" npm start

# Specific browser
MCP_ARGS="--browser firefox" npm start

# Custom viewport
MCP_ARGS="--viewport-size 1280x720" npm start
```

---

## 🏗️ **Architecture**

```
┌─────────────────────────────────────────────────────────┐
│                    Any LLM                              │
│         (Claude, GPT-4, Gemini, Local)                  │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP POST (JSON-RPC)
                     ↓
┌─────────────────────────────────────────────────────────┐
│              AIP Playwright Service                     │
│                  (This Service)                         │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  AIP Server (HTTP)                              │   │
│  │  - Receives JSON-RPC requests                   │   │
│  │  - Routes to MCP client                         │   │
│  └──────────────────┬──────────────────────────────┘   │
│                     │                                   │
│  ┌──────────────────▼──────────────────────────────┐   │
│  │  MCP Client (SSE)                               │   │
│  │  - Connects to Playwright MCP                   │   │
│  │  - Translates AIP → MCP                         │   │
│  └──────────────────┬──────────────────────────────┘   │
└────────────────────┬┴───────────────────────────────────┘
                     │ SSE (Server-Sent Events)
                     ↓
┌─────────────────────────────────────────────────────────┐
│           Playwright MCP Server                         │
│         (Microsoft's @playwright/mcp)                   │
│                                                         │
│  - Browser automation                                   │
│  - Screenshot capture                                   │
│  - Accessibility tree                                   │
│  - Network monitoring                                   │
└─────────────────────────────────────────────────────────┘
```

---

## 🎉 **Why This Matters**

### **Before (MCP only):**

- ❌ Only works with Claude Desktop
- ❌ Vendor lock-in
- ❌ Complex SSE protocol
- ❌ Can't use with other LLMs

### **After (AIP bridge):**

- ✅ Works with ANY LLM
- ✅ Vendor-neutral
- ✅ Simple HTTP JSON-RPC
- ✅ Universal browser automation

---

## 📦 **Publishing**

```bash
# Build
npm run build

# Test locally
npm link
aip-playwright

# Publish to npm
npm publish --access public
```

Then install globally:

```bash
npm install -g @vaeshkar/aip-playwright
aip-playwright
```

---

## 🤝 **Integration with AIP Figma**

Perfect combo for design-to-code workflows:

```bash
# Terminal 1: Start Figma service
cd services/figma
npm start  # Port 65001

# Terminal 2: Start Playwright service
cd services/playwright
npm start  # Port 65002

# Now you have:
# - Design reading (Figma)
# - Code testing (Playwright)
# - All via simple HTTP!
```

---

## 📄 **License**

AGPL-3.0 - Same as AIP core

---

## 🙏 **Credits**

- **Playwright MCP** by Microsoft - https://github.com/microsoft/playwright-mcp
- **AIP Protocol** by Digital Liquids - Universal AI protocol
- **Playwright** by Microsoft - Browser automation framework

---

**Built with ❤️ by Dennis van Leeuwen**
