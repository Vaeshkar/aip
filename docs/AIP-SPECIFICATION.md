# AIP (AI-Protocol) Specification v1.0.0

**Status:** Draft  
**Version:** 1.0.0  
**Date:** 2025-10-20  
**Authors:** Digital Liquids (Dennis van Leeuwen)

---

## 1. Introduction

### 1.1 Purpose

The **AI-Protocol (AIP)** is an open, vendor-neutral protocol for connecting AI systems (LLMs, agents, tools) with external services, data sources, and capabilities. Unlike vendor-specific protocols (e.g., Anthropic's MCP), AIP is designed to be:

- **Universal**: Works with any LLM or AI system
- **Extensible**: Plugin architecture for custom capabilities
- **Lightweight**: Minimal overhead, easy to implement
- **Transport-agnostic**: HTTP, WebSocket, stdio, or custom transports
- **Context-aware**: Native support for AICF (AI Context Format)

### 1.2 Terminology

- **AIP Client**: An AI system (LLM, agent) that connects to services
- **AIP Server**: A service that provides capabilities to AI systems
- **AIP Service**: A specific capability exposed by an AIP Server
- **Transport**: The communication layer (HTTP, WebSocket, stdio, etc.)
- **Capability**: A feature provided by a service (tools, resources, context, etc.)

### 1.3 Design Principles

1. **Vendor Neutrality**: No dependency on specific LLM providers
2. **Simplicity**: Easy to implement in any language
3. **Extensibility**: Plugin architecture for custom capabilities
4. **Security**: Built-in authentication and authorization
5. **Performance**: Efficient message format and transport options

---

## 2. Architecture

### 2.1 Overview

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

### 2.2 Communication Model

AIP uses a **request-response** model with optional **streaming** support:

1. **Client** initiates connection to **Server**
2. **Handshake** establishes capabilities and authentication
3. **Client** sends requests for services
4. **Server** responds with results
5. **Optional**: Server can push notifications to Client

### 2.3 Message Format

AIP uses **JSON-RPC 2.0** as the base message format for compatibility with existing tools:

```json
{
  "jsonrpc": "2.0",
  "id": "unique-request-id",
  "method": "aip.service.method",
  "params": {
    "key": "value"
  }
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": "unique-request-id",
  "result": {
    "data": "response data"
  }
}
```

**Error:**
```json
{
  "jsonrpc": "2.0",
  "id": "unique-request-id",
  "error": {
    "code": -32600,
    "message": "Invalid Request",
    "data": {}
  }
}
```

---

## 3. Core Protocol

### 3.1 Handshake

**Client → Server:**
```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "method": "aip.handshake",
  "params": {
    "version": "1.0.0",
    "client": {
      "name": "MyAI",
      "version": "1.0.0",
      "capabilities": ["tools", "context", "streaming"]
    },
    "auth": {
      "type": "bearer",
      "token": "optional-auth-token"
    }
  }
}
```

**Server → Client:**
```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "result": {
    "version": "1.0.0",
    "server": {
      "name": "MyService",
      "version": "1.0.0",
      "capabilities": ["tools", "context", "aicf"]
    },
    "session": {
      "id": "session-uuid",
      "expires": "2025-10-20T12:00:00Z"
    }
  }
}
```

### 3.2 Capability Discovery

**Client → Server:**
```json
{
  "jsonrpc": "2.0",
  "id": "2",
  "method": "aip.capabilities.list",
  "params": {}
}
```

**Server → Client:**
```json
{
  "jsonrpc": "2.0",
  "id": "2",
  "result": {
    "capabilities": [
      {
        "type": "tool",
        "name": "file.read",
        "description": "Read file contents",
        "schema": {
          "type": "object",
          "properties": {
            "path": { "type": "string" }
          }
        }
      },
      {
        "type": "context",
        "name": "project.info",
        "description": "Project context in AICF format",
        "format": "aicf"
      }
    ]
  }
}
```

### 3.3 Service Invocation

**Client → Server (Tool Call):**
```json
{
  "jsonrpc": "2.0",
  "id": "3",
  "method": "aip.tool.invoke",
  "params": {
    "tool": "file.read",
    "arguments": {
      "path": "/path/to/file.txt"
    }
  }
}
```

**Server → Client (Tool Response):**
```json
{
  "jsonrpc": "2.0",
  "id": "3",
  "result": {
    "success": true,
    "data": "file contents here",
    "metadata": {
      "size": 1024,
      "modified": "2025-10-20T10:00:00Z"
    }
  }
}
```

---

## 4. Capabilities

### 4.1 Tools

Tools are executable functions that the AI can invoke:

```typescript
interface Tool {
  type: "tool";
  name: string;
  description: string;
  schema: JSONSchema;
  metadata?: {
    category?: string;
    tags?: string[];
    dangerous?: boolean;
  };
}
```

### 4.2 Context (AICF Integration)

Context provides structured information in AICF format:

```typescript
interface Context {
  type: "context";
  name: string;
  description: string;
  format: "aicf" | "json" | "text";
  schema?: AICFSchema;
}
```

**Example AICF Context:**
```json
{
  "jsonrpc": "2.0",
  "id": "4",
  "method": "aip.context.get",
  "params": {
    "context": "project.info"
  }
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": "4",
  "result": {
    "format": "aicf",
    "data": "@PROJECT_INFO\n@SCHEMA\nName|Type|Status|Description\n@DATA\nMyProject|Web App|Active|AI-powered application"
  }
}
```

### 4.3 Resources

Resources are data sources that can be queried:

```typescript
interface Resource {
  type: "resource";
  name: string;
  description: string;
  uri: string;
  mimeType?: string;
}
```

### 4.4 Streaming

For long-running operations, AIP supports streaming responses:

```json
{
  "jsonrpc": "2.0",
  "id": "5",
  "method": "aip.tool.invoke",
  "params": {
    "tool": "generate.text",
    "arguments": { "prompt": "Write a story" },
    "stream": true
  }
}
```

**Streaming Response (multiple messages):**
```json
{ "jsonrpc": "2.0", "id": "5", "result": { "chunk": "Once upon", "done": false } }
{ "jsonrpc": "2.0", "id": "5", "result": { "chunk": " a time", "done": false } }
{ "jsonrpc": "2.0", "id": "5", "result": { "chunk": "...", "done": true } }
```

---

## 5. Transport Layers

### 5.1 HTTP Transport

- **Endpoint**: `POST /aip/v1/rpc`
- **Content-Type**: `application/json`
- **Authentication**: Bearer token in `Authorization` header

### 5.2 WebSocket Transport

- **Endpoint**: `ws://host/aip/v1/ws`
- **Protocol**: JSON-RPC 2.0 messages over WebSocket
- **Bidirectional**: Server can push notifications

### 5.3 Stdio Transport

- **Input**: JSON-RPC messages on stdin
- **Output**: JSON-RPC responses on stdout
- **Use case**: Local processes, CLI tools

---

## 6. Security

### 6.1 Authentication

AIP supports multiple authentication methods:

1. **Bearer Token**: `Authorization: Bearer <token>`
2. **API Key**: `X-AIP-API-Key: <key>`
3. **OAuth 2.0**: Standard OAuth flow
4. **mTLS**: Mutual TLS for high-security environments

### 6.2 Authorization

Services can define permissions for capabilities:

```json
{
  "capability": "file.write",
  "permissions": ["write:files"],
  "dangerous": true
}
```

### 6.3 Rate Limiting

Servers should implement rate limiting:

```json
{
  "error": {
    "code": 429,
    "message": "Rate limit exceeded",
    "data": {
      "limit": 100,
      "remaining": 0,
      "reset": "2025-10-20T12:00:00Z"
    }
  }
}
```

---

## 7. Error Handling

### 7.1 Standard Error Codes

| Code | Message | Description |
|------|---------|-------------|
| -32700 | Parse error | Invalid JSON |
| -32600 | Invalid Request | Invalid JSON-RPC |
| -32601 | Method not found | Unknown method |
| -32602 | Invalid params | Invalid parameters |
| -32603 | Internal error | Server error |
| 401 | Unauthorized | Authentication failed |
| 403 | Forbidden | Permission denied |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

---

## 8. Extensibility

### 8.1 Custom Capabilities

Services can define custom capabilities:

```json
{
  "type": "custom",
  "namespace": "mycompany.myservice",
  "name": "custom.action",
  "schema": { ... }
}
```

### 8.2 Plugins

AIP supports a plugin architecture for extending functionality.

---

## 9. Comparison with MCP

| Feature | AIP | MCP |
|---------|-----|-----|
| Vendor | Vendor-neutral | Anthropic |
| Format | JSON-RPC 2.0 | JSON-RPC 2.0 |
| Transports | HTTP, WS, stdio, custom | stdio, SSE |
| Context Format | AICF-native | Custom |
| Extensibility | Plugin architecture | Limited |
| Authentication | Multiple methods | Basic |

---

## 10. Next Steps

1. Implement `aip-core` library (TypeScript)
2. Create reference server implementation
3. Build client SDKs for popular LLMs
4. Develop AICF-AIP bridge
5. Create example services

---

**License:** MIT  
**Repository:** https://github.com/digital-liquids/aip-core

