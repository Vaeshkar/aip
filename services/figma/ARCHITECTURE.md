# Figma AIP Service - Architecture 🏗️

This document explains the architecture and design decisions behind the Figma AIP Service.

---

## 🎯 Design Goals

1. **Universal Protocol**: Use AIP instead of MCP, so any LLM can use it
2. **Complete API Coverage**: Support all major Figma API endpoints
3. **Type Safety**: Full TypeScript with strict mode
4. **Clean Architecture**: Separation of concerns (client, service, transport)
5. **Easy Integration**: Simple to use with any AI system

---

## 📐 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      AI Client (Any LLM)                     │
│              (OpenAI, Claude, Gemini, Local, etc.)           │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ AIP Protocol (HTTP/JSON-RPC)
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                   Figma AIP Service                          │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              AIP Server (Core)                      │    │
│  │  - Handshake handling                               │    │
│  │  - Capability registration                          │    │
│  │  - Tool invocation routing                          │    │
│  └──────────────────────┬──────────────────────────────┘    │
│                         │                                    │
│  ┌──────────────────────▼──────────────────────────────┐    │
│  │           Tool Handlers (11 tools)                  │    │
│  │  - figma.getFile                                    │    │
│  │  - figma.getFileNodes                               │    │
│  │  - figma.getImages                                  │    │
│  │  - figma.getComments                                │    │
│  │  - figma.postComment                                │    │
│  │  - figma.getTeamComponents                          │    │
│  │  - figma.getFileStyles                              │    │
│  │  - figma.getTeamProjects                            │    │
│  │  - figma.getProjectFiles                            │    │
│  │  - figma.getMe                                      │    │
│  │  - figma.getFileVersions                            │    │
│  └──────────────────────┬──────────────────────────────┘    │
│                         │                                    │
│  ┌──────────────────────▼──────────────────────────────┐    │
│  │            Figma API Client                         │    │
│  │  - HTTP client (axios)                              │    │
│  │  - Authentication (X-Figma-Token)                   │    │
│  │  - Request/response handling                        │    │
│  └──────────────────────┬──────────────────────────────┘    │
└────────────────────────┼────────────────────────────────────┘
                         │
                         │ HTTPS
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    Figma REST API                            │
│                  (api.figma.com/v1)                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Project Structure

```
services/figma/
├── src/
│   ├── index.ts              # Main entry point, tool registration
│   └── figma-client.ts       # Figma API client wrapper
├── examples/
│   ├── client-example.ts     # TypeScript client example
│   └── curl-examples.sh      # curl examples
├── dist/                     # Compiled JavaScript
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── .env.example              # Environment variable template
├── README.md                 # User documentation
├── QUICKSTART.md             # Quick start guide
└── ARCHITECTURE.md           # This file

```

---

## 🔧 Core Components

### 1. Figma API Client (`figma-client.ts`)

**Purpose**: Wrapper around the Figma REST API

**Responsibilities**:
- HTTP communication with Figma API
- Authentication (X-Figma-Token header)
- Request/response handling
- Error handling

**Key Methods**:
- `getFile()` - Get file data
- `getFileNodes()` - Get specific nodes
- `getImages()` - Render images
- `getComments()` - Get comments
- `postComment()` - Post comments
- `getTeamComponents()` - Get components
- `getFileStyles()` - Get styles
- `getTeamProjects()` - Get projects
- `getProjectFiles()` - Get project files
- `getMe()` - Get user info
- `getFileVersions()` - Get version history

**Design Pattern**: Facade pattern - simplifies Figma API complexity

### 2. AIP Service (`index.ts`)

**Purpose**: Main service that exposes Figma capabilities via AIP

**Responsibilities**:
- Initialize AIP server
- Register all Figma tools
- Handle tool invocations
- Start HTTP transport
- Manage lifecycle

**Tool Registration Pattern**:
```typescript
const toolCapability: ToolCapability = {
  type: 'tool',
  name: 'figma.getFile',
  description: 'Get a Figma file by key',
  schema: {
    type: 'object',
    properties: {
      fileKey: { type: 'string', description: '...' }
    },
    required: ['fileKey']
  }
};

server.registerTool(toolCapability, async (args) => {
  try {
    const result = await figmaClient.getFile(args.fileKey);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
```

**Design Pattern**: Registry pattern - tools are registered dynamically

### 3. HTTP Transport (from AIP Core)

**Purpose**: Expose AIP server over HTTP

**Responsibilities**:
- HTTP server (Express)
- CORS handling
- Request routing
- Health checks

**Endpoints**:
- `POST /aip/v1/rpc` - JSON-RPC endpoint
- `GET /health` - Health check

---

## 🔄 Request Flow

### Example: Get a Figma File

1. **Client sends request**:
   ```json
   {
     "jsonrpc": "2.0",
     "id": "1",
     "method": "aip.tool.invoke",
     "params": {
       "tool": "figma.getFile",
       "arguments": {
         "fileKey": "abc123",
         "depth": 1
       }
     }
   }
   ```

2. **HTTP Transport receives request**:
   - Validates JSON-RPC format
   - Routes to AIP Server

3. **AIP Server processes request**:
   - Validates session (if required)
   - Finds tool handler for `figma.getFile`
   - Validates arguments against schema
   - Invokes tool handler

4. **Tool Handler executes**:
   - Extracts arguments
   - Calls `figmaClient.getFile(fileKey, { depth })`
   - Handles errors
   - Returns result

5. **Figma Client makes API call**:
   - Constructs HTTP request to Figma API
   - Adds authentication header
   - Sends request
   - Parses response

6. **Response flows back**:
   - Figma Client → Tool Handler → AIP Server → HTTP Transport → Client

7. **Client receives response**:
   ```json
   {
     "jsonrpc": "2.0",
     "id": "1",
     "result": {
       "success": true,
       "data": {
         "name": "My Design",
         "lastModified": "2025-10-20T...",
         "document": { ... }
       }
     }
   }
   ```

---

## 🔐 Security

### Authentication

- **Figma API Token**: Required for all Figma API calls
- **Storage**: Environment variable or command-line argument
- **Transmission**: Sent as `X-Figma-Token` header to Figma API
- **Never exposed**: Token never sent to clients

### Best Practices

1. **Never commit tokens**: Use `.env` file (gitignored)
2. **Rotate tokens**: Regularly regenerate Figma tokens
3. **Limit scope**: Use tokens with minimal required permissions
4. **Monitor usage**: Track API calls for suspicious activity

---

## 📊 Error Handling

### Error Flow

```
Figma API Error
    ↓
Figma Client catches error
    ↓
Tool Handler receives error
    ↓
Returns { success: false, error: message }
    ↓
AIP Server wraps in JSON-RPC response
    ↓
Client receives error response
```

### Error Types

1. **Authentication Errors**: Invalid or expired token
2. **Not Found Errors**: File/node/team doesn't exist
3. **Permission Errors**: No access to resource
4. **Rate Limit Errors**: Too many requests
5. **Validation Errors**: Invalid arguments

### Error Response Format

```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "result": {
    "success": false,
    "error": "File not found: abc123"
  }
}
```

---

## 🚀 Performance Considerations

### Optimization Strategies

1. **Depth Control**: Use `depth` parameter to limit tree traversal
2. **Selective Fetching**: Use `getFileNodes()` for specific nodes
3. **Caching**: Consider caching file data (not implemented yet)
4. **Pagination**: Use pagination for large result sets

### Figma API Limits

- **Rate Limits**: Figma has rate limits per token
- **File Size**: Large files can be slow to fetch
- **Image Rendering**: Image generation can take time

---

## 🔮 Future Enhancements

### Planned Features

1. **Caching Layer**: Cache file data to reduce API calls
2. **WebSocket Support**: Real-time updates via WebSocket transport
3. **Batch Operations**: Batch multiple requests
4. **Code Generation**: Generate code from Figma designs
5. **Design Tokens**: Extract design tokens automatically
6. **Webhook Support**: Receive Figma webhook events
7. **Context Providers**: Expose design system as AICF context

### Extensibility

The service is designed to be easily extended:

1. **Add new tools**: Register new tool handlers in `index.ts`
2. **Add new transports**: Use WebSocket or stdio transport
3. **Add middleware**: Add authentication, logging, etc.
4. **Add context providers**: Expose design system data

---

## 🆚 Comparison with Figma MCP Server

| Feature | Figma AIP Service | Figma MCP Server |
|---------|-------------------|------------------|
| **Protocol** | AIP (Universal) | MCP (Anthropic) |
| **LLM Support** | Any LLM | Claude only |
| **Transport** | HTTP, WebSocket, stdio | stdio, SSE |
| **Architecture** | Layered, modular | Monolithic |
| **Type Safety** | Full TypeScript | TypeScript |
| **Extensibility** | Plugin architecture | Limited |
| **Context Format** | AICF-native | Custom |
| **Open Source** | Yes (MIT) | Yes |

---

## 📚 References

- [AIP Specification](../../docs/AIP-SPECIFICATION.md)
- [Figma API Documentation](https://www.figma.com/developers/api)
- [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification)

---

**Built with ❤️ by Digital Liquids using AIP (AI-Protocol)**

