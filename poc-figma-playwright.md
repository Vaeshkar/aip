# 🎯 Proof of Concept: Figma → Code → Playwright Testing

## 🎉 **What We're Building**

A complete workflow that:
1. **Reads Figma designs** via AIP Figma service
2. **Generates code** (React components with exact colors)
3. **Tests the code** via Playwright MCP (screenshots, interactions, responsive)
4. **Compares results** with Figma designs

---

## 🚀 **Current Status**

### ✅ **Working:**
- **AIP Figma Service** - Running on port 3001
  - Can read Figma files
  - Extract colors, layouts, components
  - Works with any LLM via HTTP

- **Playwright MCP Server** - Running on port 8931
  - Browser automation (navigate, click, type)
  - Screenshots at any viewport size
  - Accessibility snapshots
  - Console/network monitoring

### ⚠️ **Challenge:**
- **MCP uses SSE (Server-Sent Events)** - Requires persistent connection
- **Not simple HTTP POST** like AIP
- Need proper MCP client to communicate

---

## 💡 **Solution Options**

### **Option A: Use MCP SDK (Proper Way)**

Install the MCP SDK and create a proper client:

```bash
npm install @modelcontextprotocol/sdk
```

```javascript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

// Create MCP client
const transport = new SSEClientTransport(
  new URL('http://localhost:8931/mcp')
);

const client = new Client({
  name: 'aip-test-client',
  version: '1.0.0'
}, {
  capabilities: {}
});

await client.connect(transport);

// Now we can call tools!
const result = await client.callTool({
  name: 'browser_navigate',
  arguments: { url: 'https://example.com' }
});
```

---

### **Option B: Use Playwright MCP in Claude Desktop (Easiest!)**

Since you're already using Claude (me!), just install Playwright MCP in Claude Desktop:

**Config:** `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    },
    "figma-aip": {
      "url": "http://localhost:3001/aip/v1/rpc"
    }
  }
}
```

Then I (Claude) can:
1. Read your Figma file via AIP
2. Generate React code
3. Test it via Playwright MCP
4. Take screenshots
5. Compare with Figma

**All in one conversation!** 🎉

---

### **Option C: Build AIP Playwright Service (Long-term)**

Create `services/playwright` that wraps Playwright MCP in AIP protocol:

```typescript
// services/playwright/src/index.ts
import { AIPServer } from '@vaeshkar/aip-core';
import { spawn } from 'child_process';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';

// Start Playwright MCP internally
const mcpProcess = spawn('npx', ['@playwright/mcp@latest', '--port', '8932']);

// Create MCP client
const mcpClient = new Client(/* ... */);
await mcpClient.connect(/* ... */);

// Create AIP server
const aipServer = new AIPServer({
  name: 'playwright',
  version: '1.0.0'
});

// Bridge: AIP tool → MCP tool
aipServer.registerTool({
  name: 'playwright.navigate',
  description: 'Navigate to URL',
  schema: { /* ... */ }
}, async (args) => {
  // Call MCP tool
  return await mcpClient.callTool({
    name: 'browser_navigate',
    arguments: args
  });
});

// Register all other tools...
aipServer.start({ port: 3002 });
```

Now you have:
- **AIP Figma** on port 3001
- **AIP Playwright** on port 3002
- **Both use same protocol!**

---

## 🎯 **Recommended Approach**

### **For Proof of Concept (NOW):**

**Use Option B** - Install Playwright MCP in Claude Desktop

**Why:**
- ✅ Works immediately
- ✅ No code needed
- ✅ I can use both Figma AIP and Playwright MCP
- ✅ Perfect for testing the workflow

**Steps:**
1. Add Playwright MCP to Claude Desktop config
2. Restart Claude Desktop
3. Tell me: "Read this Figma file and test it with Playwright"
4. I do everything! 🎉

---

### **For Production (LATER):**

**Build Option C** - AIP Playwright Service

**Why:**
- ✅ Unified protocol (everything is AIP)
- ✅ Works with any LLM (not just Claude)
- ✅ Can be published to npm
- ✅ Part of your AIP ecosystem

**Timeline:**
- Proof of Concept: **Today** (Option B)
- Production Service: **Next week** (Option C)

---

## 📋 **The Complete Workflow (Option B)**

### **You:**
```
"Hey Claude, I need to build a dashboard.

The design is here:
https://www.figma.com/design/67m7ehMq38gcTJcNMHWTCa/MAREVAL

1. Read the Figma file
2. Generate React components
3. Test at mobile (375px), tablet (768px), desktop (1920px)
4. Take screenshots
5. Test the 'Report Issue' button
6. Compare with Figma design"
```

### **Me (Claude):**
```
Step 1: Reading Figma file...
✅ Got navbar design
✅ Got button styles  
✅ Got color palette

Step 2: Generating React components...
✅ Created Navbar.tsx
✅ Created Button.tsx
✅ Applied exact colors from Figma

Step 3: Starting dev server...
✅ Running on localhost:3000

Step 4: Testing with Playwright...
✅ Navigated to localhost:3000
✅ Screenshot at 375px (mobile)
✅ Screenshot at 768px (tablet)
✅ Screenshot at 1920px (desktop)

Step 5: Testing interactions...
✅ Clicked "Report Issue" button
✅ Modal appeared
✅ Form validation works

Step 6: Checking console...
✅ No errors
✅ All assets loaded

Step 7: Visual comparison...
✅ Mobile: 98% match with Figma
✅ Tablet: 97% match with Figma
✅ Desktop: 99% match with Figma

All tests passed! 🎉
```

---

## 🎨 **What This Enables**

### **Design-to-Code-to-Test Loop:**

```
Figma Design
  ↓ (AIP Figma)
Extract Tokens
  ↓ (Claude)
Generate Code
  ↓ (npm run dev)
Deploy Locally
  ↓ (Playwright MCP)
Test & Screenshot
  ↓ (Visual Diff)
Compare with Figma
  ↓
Report Results
```

**All automated. All AI-driven. All in one conversation.** 🚀

---

## 🔥 **Next Steps**

### **Immediate (Proof of Concept):**

1. **Install Playwright MCP in Claude Desktop**
   ```bash
   # Edit config file
   code ~/Library/Application\ Support/Claude/claude_desktop_config.json
   
   # Add Playwright MCP
   {
     "mcpServers": {
       "playwright": {
         "command": "npx",
         "args": ["@playwright/mcp@latest"]
       }
     }
   }
   
   # Restart Claude Desktop
   ```

2. **Test the workflow**
   - Give me a Figma URL
   - I'll read it, generate code, and test it
   - All in one conversation!

---

### **Future (Production Service):**

1. **Build AIP Playwright Service**
   - Wrap Playwright MCP in AIP protocol
   - Publish to npm as `@vaeshkar/aip-playwright`
   - Install globally: `npm install -g @vaeshkar/aip-playwright`

2. **Build Visual Diff Service**
   - Compare screenshots with Figma designs
   - Pixel-perfect comparison
   - Generate diff reports

3. **Build MCP Bridge**
   - Universal adapter: MCP → AIP
   - Makes ALL MCP servers work with AIP
   - Vendor-neutral ecosystem

---

## 🎉 **Summary**

### **What We Have:**
- ✅ AIP Figma Service (working!)
- ✅ Playwright MCP Server (working!)
- ✅ Both running locally

### **What We Need:**
- 🔧 Proper MCP client (use SDK or Claude Desktop)
- 🔧 Test the complete workflow
- 🔧 Build AIP Playwright service (later)

### **Recommendation:**
**Use Claude Desktop with both services** - Proof of Concept works TODAY! 🚀

---

**Dennis, ready to test this?** 😊

Just add Playwright MCP to your Claude Desktop config and we can run the complete workflow right now!

