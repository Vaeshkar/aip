/**
 * Tests for AICF-RPC Parser and Serializer
 */

import {
  parseAICFRequest,
  serializeAICFRequest,
  serializeAICFResponse,
  serializeToolList,
  serializeToolInfo,
  createSuccessResponse,
  createErrorResponse,
  isValidAICFRequest,
  isAICFFormat,
} from "./aicf-rpc";

// ============================================================================
// Parser Tests
// ============================================================================

describe("parseAICFRequest", () => {
  test("parses CALL command with single argument", () => {
    const result = parseAICFRequest("CALL|figma.getFile|abc123");
    expect(result).toEqual({
      command: "CALL",
      tool: "figma.getFile",
      arguments: ["abc123"],
    });
  });

  test("parses CALL command with multiple arguments", () => {
    const result = parseAICFRequest("CALL|playwright.screenshot|test.png|1920|1080");
    expect(result).toEqual({
      command: "CALL",
      tool: "playwright.screenshot",
      arguments: ["test.png", 1920, 1080],
    });
  });

  test("parses CALL command with no arguments", () => {
    const result = parseAICFRequest("CALL|tool.name");
    expect(result).toEqual({
      command: "CALL",
      tool: "tool.name",
      arguments: [],
    });
  });

  test("parses LIST command", () => {
    const result = parseAICFRequest("LIST");
    expect(result).toEqual({
      command: "LIST",
    });
  });

  test("parses INFO command", () => {
    const result = parseAICFRequest("INFO|figma.getFile");
    expect(result).toEqual({
      command: "INFO",
      tool: "figma.getFile",
    });
  });

  test("handles escaped pipes in arguments", () => {
    const result = parseAICFRequest("CALL|tool|arg\\|with\\|pipes");
    expect(result).toEqual({
      command: "CALL",
      tool: "tool",
      arguments: ["arg|with|pipes"],
    });
  });

  test("handles JSON object arguments", () => {
    const result = parseAICFRequest('CALL|tool|{"key":"value"}');
    expect(result).toEqual({
      command: "CALL",
      tool: "tool",
      arguments: [{ key: "value" }],
    });
  });

  test("handles JSON array arguments", () => {
    const result = parseAICFRequest('CALL|tool|["a","b","c"]');
    expect(result).toEqual({
      command: "CALL",
      tool: "tool",
      arguments: [["a", "b", "c"]],
    });
  });

  test("handles boolean arguments", () => {
    const result = parseAICFRequest("CALL|tool|true|false");
    expect(result).toEqual({
      command: "CALL",
      tool: "tool",
      arguments: [true, false],
    });
  });

  test("handles null and undefined arguments", () => {
    const result = parseAICFRequest("CALL|tool|null|undefined");
    expect(result).toEqual({
      command: "CALL",
      tool: "tool",
      arguments: [null, undefined],
    });
  });

  test("throws error for invalid command", () => {
    expect(() => parseAICFRequest("INVALID|tool")).toThrow("Invalid AICF command");
  });

  test("throws error for empty input", () => {
    expect(() => parseAICFRequest("")).toThrow("Invalid AICF request");
  });

  test("throws error for CALL without tool", () => {
    expect(() => parseAICFRequest("CALL")).toThrow("CALL command requires tool name");
  });

  test("throws error for INFO without tool", () => {
    expect(() => parseAICFRequest("INFO")).toThrow("INFO command requires tool name");
  });
});

// ============================================================================
// Serializer Tests
// ============================================================================

describe("serializeAICFRequest", () => {
  test("serializes CALL command", () => {
    const result = serializeAICFRequest({
      command: "CALL",
      tool: "figma.getFile",
      arguments: ["abc123"],
    });
    expect(result).toBe("CALL|figma.getFile|abc123");
  });

  test("serializes LIST command", () => {
    const result = serializeAICFRequest({
      command: "LIST",
    });
    expect(result).toBe("LIST");
  });

  test("serializes INFO command", () => {
    const result = serializeAICFRequest({
      command: "INFO",
      tool: "figma.getFile",
    });
    expect(result).toBe("INFO|figma.getFile");
  });

  test("escapes pipes in arguments", () => {
    const result = serializeAICFRequest({
      command: "CALL",
      tool: "tool",
      arguments: ["arg|with|pipes"],
    });
    expect(result).toBe("CALL|tool|arg\\|with\\|pipes");
  });

  test("serializes JSON objects", () => {
    const result = serializeAICFRequest({
      command: "CALL",
      tool: "tool",
      arguments: [{ key: "value" }],
    });
    expect(result).toBe('CALL|tool|{"key":"value"}');
  });
});

describe("serializeAICFResponse", () => {
  test("serializes success response with string data", () => {
    const result = serializeAICFResponse(createSuccessResponse("Success!"));
    expect(result).toBe("OK|Success!");
  });

  test("serializes success response with object data", () => {
    const result = serializeAICFResponse(
      createSuccessResponse({ name: "Test", id: 123 })
    );
    expect(result).toBe('OK|{"name":"Test","id":123}');
  });

  test("serializes success response with null data", () => {
    const result = serializeAICFResponse(createSuccessResponse(null));
    expect(result).toBe("OK|");
  });

  test("serializes error response", () => {
    const result = serializeAICFResponse(createErrorResponse(404, "Not found"));
    expect(result).toBe("ERR|404|Not found");
  });

  test("escapes pipes in error messages", () => {
    const result = serializeAICFResponse(
      createErrorResponse(500, "Error | with | pipes")
    );
    expect(result).toBe("ERR|500|Error \\| with \\| pipes");
  });
});

describe("serializeToolList", () => {
  test("serializes tool list", () => {
    const result = serializeToolList([
      "figma.getFile",
      "figma.getComments",
      "playwright.navigate",
    ]);
    expect(result).toBe("TOOLS|figma.getFile|figma.getComments|playwright.navigate");
  });

  test("handles empty tool list", () => {
    const result = serializeToolList([]);
    expect(result).toBe("TOOLS|");
  });
});

describe("serializeToolInfo", () => {
  test("serializes tool info", () => {
    const result = serializeToolInfo(
      "figma.getFile",
      "Get Figma file data",
      [
        { name: "fileKey", type: "string" },
        { name: "version", type: "string" },
      ]
    );
    expect(result).toBe(
      "TOOL|figma.getFile|Get Figma file data|fileKey:string|version:string"
    );
  });

  test("handles tool with no arguments", () => {
    const result = serializeToolInfo("tool.name", "Description", []);
    expect(result).toBe("TOOL|tool.name|Description");
  });
});

// ============================================================================
// Validation Tests
// ============================================================================

describe("isValidAICFRequest", () => {
  test("returns true for valid CALL", () => {
    expect(isValidAICFRequest("CALL|tool|arg")).toBe(true);
  });

  test("returns true for valid LIST", () => {
    expect(isValidAICFRequest("LIST")).toBe(true);
  });

  test("returns true for valid INFO", () => {
    expect(isValidAICFRequest("INFO|tool")).toBe(true);
  });

  test("returns false for invalid command", () => {
    expect(isValidAICFRequest("INVALID|tool")).toBe(false);
  });

  test("returns false for empty string", () => {
    expect(isValidAICFRequest("")).toBe(false);
  });
});

describe("isAICFFormat", () => {
  test("detects CALL format", () => {
    expect(isAICFFormat("CALL|tool|arg")).toBe(true);
  });

  test("detects LIST format", () => {
    expect(isAICFFormat("LIST")).toBe(true);
  });

  test("detects INFO format", () => {
    expect(isAICFFormat("INFO|tool")).toBe(true);
  });

  test("rejects JSON format", () => {
    expect(isAICFFormat('{"jsonrpc":"2.0"}')).toBe(false);
  });

  test("rejects empty string", () => {
    expect(isAICFFormat("")).toBe(false);
  });
});

// ============================================================================
// Round-trip Tests
// ============================================================================

describe("round-trip serialization", () => {
  test("CALL request round-trip", () => {
    const original = "CALL|figma.getFile|abc123|1.0";
    const parsed = parseAICFRequest(original);
    const serialized = serializeAICFRequest(parsed);
    expect(serialized).toBe(original);
  });

  test("LIST request round-trip", () => {
    const original = "LIST";
    const parsed = parseAICFRequest(original);
    const serialized = serializeAICFRequest(parsed);
    expect(serialized).toBe(original);
  });

  test("INFO request round-trip", () => {
    const original = "INFO|figma.getFile";
    const parsed = parseAICFRequest(original);
    const serialized = serializeAICFRequest(parsed);
    expect(serialized).toBe(original);
  });
});

