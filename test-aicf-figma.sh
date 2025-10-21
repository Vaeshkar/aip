#!/bin/bash

# Test AICF-RPC with Figma Service
# Demonstrates the AI-native protocol in action

echo "🚀 Testing AICF-RPC with Figma Service"
echo "========================================"
echo ""

# Check if Figma service is running
echo "📡 Checking if Figma service is running on port 3001..."
if ! curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "❌ Figma service is not running!"
    echo "   Start it with: cd services/figma && npm start"
    exit 1
fi
echo "✅ Figma service is running"
echo ""

# Test 1: LIST tools (AICF)
echo "Test 1: LIST tools (AICF-RPC)"
echo "────────────────────────────────────────"
echo "Request:  LIST"
echo ""
echo "Response:"
curl -s -X POST http://localhost:3001/aip/v1/aicf \
  -H "Content-Type: text/plain" \
  -d "LIST"
echo ""
echo ""

# Test 2: INFO tool (AICF)
echo "Test 2: INFO tool (AICF-RPC)"
echo "────────────────────────────────────────"
echo "Request:  INFO|figma.getFile"
echo ""
echo "Response:"
curl -s -X POST http://localhost:3001/aip/v1/aicf \
  -H "Content-Type: text/plain" \
  -d "INFO|figma.getFile"
echo ""
echo ""

# Test 3: CALL tool (AICF) - Get Figma file
echo "Test 3: CALL tool (AICF-RPC)"
echo "────────────────────────────────────────"
echo "Request:  CALL|figma.getFile|zViXRwW2VmrZCBKJFjiNbE"
echo ""
echo "Response:"
curl -s -X POST http://localhost:3001/aip/v1/aicf \
  -H "Content-Type: text/plain" \
  -d "CALL|figma.getFile|zViXRwW2VmrZCBKJFjiNbE"
echo ""
echo ""

# Comparison: Same request in JSON-RPC
echo "Comparison: Same request in JSON-RPC"
echo "────────────────────────────────────────"
echo "Request:"
echo '{
  "jsonrpc": "2.0",
  "method": "aip.tool.invoke",
  "params": {
    "tool": "figma.getFile",
    "arguments": {"fileKey": "zViXRwW2VmrZCBKJFjiNbE"}
  },
  "id": 1
}'
echo ""
echo "Response:"
curl -s -X POST http://localhost:3001/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "aip.tool.invoke",
    "params": {
      "tool": "figma.getFile",
      "arguments": {"fileKey": "zViXRwW2VmrZCBKJFjiNbE"}
    },
    "id": 1
  }' | jq -r '.result' 2>/dev/null || echo "(Response too large to display)"
echo ""
echo ""

# Token comparison
echo "📊 TOKEN COMPARISON"
echo "========================================"
echo ""

AICF_REQUEST="CALL|figma.getFile|zViXRwW2VmrZCBKJFjiNbE"
JSON_REQUEST='{"jsonrpc":"2.0","method":"aip.tool.invoke","params":{"tool":"figma.getFile","arguments":{"fileKey":"zViXRwW2VmrZCBKJFjiNbE"}},"id":1}'

AICF_CHARS=${#AICF_REQUEST}
JSON_CHARS=${#JSON_REQUEST}

AICF_TOKENS=$((AICF_CHARS / 4))
JSON_TOKENS=$((JSON_CHARS / 4))

SAVINGS=$(( (JSON_TOKENS - AICF_TOKENS) * 100 / JSON_TOKENS ))

echo "AICF-RPC:"
echo "  Characters: $AICF_CHARS"
echo "  Tokens:     ~$AICF_TOKENS"
echo ""
echo "JSON-RPC:"
echo "  Characters: $JSON_CHARS"
echo "  Tokens:     ~$JSON_TOKENS"
echo ""
echo "Savings:      $SAVINGS% fewer tokens with AICF-RPC!"
echo ""

echo "========================================"
echo "✅ AICF-RPC Test Complete!"
echo ""
echo "💡 Key Takeaways:"
echo "   - AICF-RPC uses $SAVINGS% fewer tokens"
echo "   - Same functionality as JSON-RPC"
echo "   - Perfect for AI-to-AI communication"
echo "   - Both protocols work side-by-side"
echo ""

