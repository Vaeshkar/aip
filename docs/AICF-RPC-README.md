# AICF-RPC: The AI-Native Protocol

**AI Context Format - Remote Procedure Call Protocol**

---

## 🎯 What is AICF-RPC?

AICF-RPC is an **AI-native protocol** designed specifically for efficient LLM-to-service communication. It's the world's first protocol optimized for AI agents rather than humans.

### **The Problem**

Traditional protocols like JSON-RPC were designed for human-readable communication:

```json
{
  "jsonrpc": "2.0",
  "method": "aip.tool.invoke",
  "params": {
    "tool": "figma.getFile",
    "arguments": {"fileKey": "abc123"}
  },
  "id": 1
}
```

**Cost:** ~30 tokens

### **The Solution**

AICF-RPC uses a compact, pipe-delimited format optimized for LLMs:

```
CALL|figma.getFile|abc123
```

**Cost:** ~7 tokens

**Savings:** 76.7% fewer tokens! 🚀

---

## 📊 Benchmark Results

We tested AICF-RPC against JSON-RPC across multiple scenarios:

| Test Case | JSON-RPC Tokens | AICF-RPC Tokens | Savings |
|-----------|----------------|-----------------|---------|
| Simple tool call | 30 | 7 | 76.7% |
| Multiple arguments | 39 | 12 | 69.2% |
| URL navigation | 34 | 11 | 67.6% |
| List tools | 18 | 1 | 94.4% |
| Get tool info | 25 | 5 | 80.0% |
| **TOTAL** | **146** | **36** | **75.3%** |

### **Real-World Impact**

For a typical AI agent making 1,000 tool calls per day:

- **JSON-RPC:** 146,000 tokens/day
- **AICF-RPC:** 36,000 tokens/day
- **Savings:** 110,000 tokens/day

At $0.01 per 1K tokens (typical LLM pricing):
- **Daily savings:** $1.10
- **Monthly savings:** $33
- **Yearly savings:** $401.50

**For high-volume applications, this adds up fast!**

---

## 🚀 Quick Start

### **1. Start an AIP Service**

```bash
# Start Figma service
cd services/figma
FIGMA_TOKEN=your_token npm start
```

The service automatically supports **both** protocols:
- JSON-RPC: `http://localhost:3001/aip/v1/rpc`
- AICF-RPC: `http://localhost:3001/aip/v1/aicf`

### **2. Use AICF-RPC**

```bash
# List all tools
curl -X POST http://localhost:3001/aip/v1/aicf \
  -H "Content-Type: text/plain" \
  -d "LIST"

# Get tool info
curl -X POST http://localhost:3001/aip/v1/aicf \
  -H "Content-Type: text/plain" \
  -d "INFO|figma.getFile"

# Call a tool
curl -X POST http://localhost:3001/aip/v1/aicf \
  -H "Content-Type: text/plain" \
  -d "CALL|figma.getFile|abc123"
```

---

## 📖 Protocol Format

### **Request Format**

```
COMMAND|TOOL|ARG1|ARG2|ARG3|...
```

**Commands:**
- `LIST` - List all available tools
- `INFO|tool_name` - Get information about a tool
- `CALL|tool_name|arg1|arg2|...` - Invoke a tool

### **Response Format**

**Success:**
```
OK|{result_data}
```

**Error:**
```
ERR|code|message
```

**Tool List:**
```
TOOLS|tool1|tool2|tool3|...
```

**Tool Info:**
```
TOOL|name|description|arg1:type|arg2:type|...
```

---

## 💡 Examples

### **Example 1: List Tools**

**Request:**
```
LIST
```

**Response:**
```
TOOLS|figma.getFile|figma.getComments|playwright.navigate|playwright.screenshot
```

---

### **Example 2: Get Tool Info**

**Request:**
```
INFO|figma.getFile
```

**Response:**
```
TOOL|figma.getFile|Get Figma file data|fileKey:string|version:string
```

---

### **Example 3: Call Tool**

**Request:**
```
CALL|figma.getFile|abc123
```

**Response:**
```
OK|{"name":"My Design","lastModified":"2025-10-21"}
```

---

### **Example 4: Error Handling**

**Request:**
```
CALL|figma.getFile|invalid_key
```

**Response:**
```
ERR|404|File not found: invalid_key
```

---

## 🔄 Dual Protocol Support

AIP services support **both** JSON-RPC and AICF-RPC simultaneously:

### **JSON-RPC (Human-Friendly)**

```bash
curl -X POST http://localhost:3001/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "aip.tool.invoke",
    "params": {
      "tool": "figma.getFile",
      "arguments": {"fileKey": "abc123"}
    },
    "id": 1
  }'
```

### **AICF-RPC (AI-Optimized)**

```bash
curl -X POST http://localhost:3001/aip/v1/aicf \
  -H "Content-Type: text/plain" \
  -d "CALL|figma.getFile|abc123"
```

**Same functionality, 75% fewer tokens!**

---

## 🎯 When to Use Each Protocol

### **Use JSON-RPC when:**
- ✅ Debugging and development
- ✅ Human-readable logs needed
- ✅ Integrating with existing tools
- ✅ Complex nested data structures

### **Use AICF-RPC when:**
- ✅ AI-to-AI communication
- ✅ High-volume production use
- ✅ Token cost optimization
- ✅ Low-latency requirements

---

## 🔐 Security

AICF-RPC supports the same security features as JSON-RPC:

### **Authentication**

```bash
curl -X POST http://localhost:3001/aip/v1/aicf \
  -H "Content-Type: text/plain" \
  -H "Authorization: Bearer your_token" \
  -d "CALL|figma.getFile|abc123"
```

### **Input Validation**

All arguments are validated before processing:
- Pipe characters are escaped
- Argument types are checked
- Tool schemas are enforced

---

## 📚 Full Specification

For the complete AICF-RPC specification, see:
- [AICF-RPC-SPECIFICATION.md](./AICF-RPC-SPECIFICATION.md)

---

## 🚀 Implementation

AICF-RPC is implemented in:
- ✅ AIP Core (`src/utils/aicf-rpc.ts`)
- ✅ AIP Server (`src/server/AIPServer.ts`)
- ✅ HTTP Transport (`src/transport/HTTPTransport.ts`)
- ✅ Figma Service (`services/figma`)
- ✅ Playwright Service (`services/playwright`)

---

## 🎨 Why This Matters

### **For Developers**
- Lower LLM costs (75% token savings)
- Faster response times
- Simpler integration for AI agents

### **For AI Agents**
- Native protocol designed for LLMs
- Efficient token usage
- Fast parsing and generation

### **For the Ecosystem**
- First AI-native protocol
- Open source (AGPL-3.0)
- Vendor-neutral

---

## 📞 Contact

- **GitHub**: [github.com/Vaeshkar/aip](https://github.com/Vaeshkar/aip)
- **Issues**: [github.com/Vaeshkar/aip/issues](https://github.com/Vaeshkar/aip/issues)
- **Website**: [www.minusnine.io](https://www.minusnine.io)

---

**AICF-RPC: The AI-Native Protocol** 🤖🚀

*Built with ❤️ by Dennis van Leeuwen*

