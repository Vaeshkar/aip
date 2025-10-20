#!/bin/bash

# Figma AIP Service - curl Examples
# 
# These examples show how to interact with the Figma AIP service
# using plain HTTP requests (curl).

BASE_URL="http://localhost:3001/aip/v1/rpc"

echo "🎨 Figma AIP Service - curl Examples"
echo ""

# ============================================================================
# 1. Handshake - Establish connection
# ============================================================================
echo "1️⃣  Handshake - Establish connection"
echo ""

curl -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "aip.handshake",
    "params": {
      "version": "1.0.0",
      "client": {
        "name": "CurlClient",
        "version": "1.0.0",
        "capabilities": ["tool"]
      }
    }
  }' | jq '.'

echo ""
echo ""

# ============================================================================
# 2. List capabilities - See available tools
# ============================================================================
echo "2️⃣  List capabilities - See available tools"
echo ""

curl -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": "2",
    "method": "aip.capabilities.list",
    "params": {}
  }' | jq '.result.capabilities[] | {name: .name, description: .description}'

echo ""
echo ""

# ============================================================================
# 3. Get a Figma file
# ============================================================================
echo "3️⃣  Get a Figma file"
echo ""
echo "⚠️  Replace YOUR_FILE_KEY with an actual Figma file key"
echo ""

# Example file key: abcXYZ123 (from https://www.figma.com/file/abcXYZ123/...)
FILE_KEY="YOUR_FILE_KEY"

curl -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d "{
    \"jsonrpc\": \"2.0\",
    \"id\": \"3\",
    \"method\": \"aip.tool.invoke\",
    \"params\": {
      \"tool\": \"figma.getFile\",
      \"arguments\": {
        \"fileKey\": \"$FILE_KEY\",
        \"depth\": 1
      }
    }
  }" | jq '.'

echo ""
echo ""

# ============================================================================
# 4. Get comments from a file
# ============================================================================
echo "4️⃣  Get comments from a file"
echo ""

curl -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d "{
    \"jsonrpc\": \"2.0\",
    \"id\": \"4\",
    \"method\": \"aip.tool.invoke\",
    \"params\": {
      \"tool\": \"figma.getComments\",
      \"arguments\": {
        \"fileKey\": \"$FILE_KEY\",
        \"as_md\": true
      }
    }
  }" | jq '.'

echo ""
echo ""

# ============================================================================
# 5. Get specific nodes from a file
# ============================================================================
echo "5️⃣  Get specific nodes from a file"
echo ""
echo "⚠️  Replace NODE_ID_1, NODE_ID_2 with actual node IDs"
echo ""

curl -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d "{
    \"jsonrpc\": \"2.0\",
    \"id\": \"5\",
    \"method\": \"aip.tool.invoke\",
    \"params\": {
      \"tool\": \"figma.getFileNodes\",
      \"arguments\": {
        \"fileKey\": \"$FILE_KEY\",
        \"ids\": [\"NODE_ID_1\", \"NODE_ID_2\"],
        \"depth\": 2
      }
    }
  }" | jq '.'

echo ""
echo ""

# ============================================================================
# 6. Render images from nodes
# ============================================================================
echo "6️⃣  Render images from nodes"
echo ""

curl -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d "{
    \"jsonrpc\": \"2.0\",
    \"id\": \"6\",
    \"method\": \"aip.tool.invoke\",
    \"params\": {
      \"tool\": \"figma.getImages\",
      \"arguments\": {
        \"fileKey\": \"$FILE_KEY\",
        \"ids\": [\"NODE_ID_1\"],
        \"format\": \"png\",
        \"scale\": 2
      }
    }
  }" | jq '.'

echo ""
echo ""

# ============================================================================
# 7. Get team components
# ============================================================================
echo "7️⃣  Get team components"
echo ""
echo "⚠️  Replace YOUR_TEAM_ID with an actual team ID"
echo ""

TEAM_ID="YOUR_TEAM_ID"

curl -X POST $BASE_URL \
  -H "Content-Type: application/json" \
  -d "{
    \"jsonrpc\": \"2.0\",
    \"id\": \"7\",
    \"method\": \"aip.tool.invoke\",
    \"params\": {
      \"tool\": \"figma.getTeamComponents\",
      \"arguments\": {
        \"teamId\": \"$TEAM_ID\",
        \"page_size\": 10
      }
    }
  }" | jq '.'

echo ""
echo ""

echo "✅ Done! Check the responses above."
echo ""
echo "💡 Tips:"
echo "  - Get your Figma API token: https://www.figma.com/developers/api#access-tokens"
echo "  - Find file keys in Figma URLs: https://www.figma.com/file/FILE_KEY/..."
echo "  - Find node IDs by inspecting elements in Figma"
echo ""

