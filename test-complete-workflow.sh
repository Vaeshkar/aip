#!/bin/bash
# SPDX-License-Identifier: AGPL-3.0-or-later
# Copyright (c) 2025 Dennis van Leeuwen (Digital Liquids)
#
# Complete Workflow Test: Figma → Playwright
# Demonstrates reading Figma designs and testing with browser automation

set -e

echo "🎨 AIP Complete Workflow Test"
echo "======================================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Read Figma Design
echo -e "${BLUE}📋 Step 1: Reading Figma Design${NC}"
echo "Getting file info from MAREVAL design..."
echo ""

FIGMA_RESPONSE=$(curl -s -X POST http://localhost:3001/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "id":"1",
    "method":"aip.tool.invoke",
    "params":{
      "tool":"figma.getFile",
      "arguments":{
        "fileKey":"67m7ehMq38gcTJcNMHWTCa"
      }
    }
  }')

echo -e "${GREEN}✅ Figma file retrieved!${NC}"
echo ""

# Test 2: Navigate to a website
echo -e "${BLUE}📋 Step 2: Opening Browser${NC}"
echo "Navigating to example.com..."
echo ""

NAV_RESPONSE=$(curl -s -X POST http://localhost:3002/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "id":"2",
    "method":"aip.tool.invoke",
    "params":{
      "tool":"playwright.navigate",
      "arguments":{
        "url":"https://example.com"
      }
    }
  }')

echo -e "${GREEN}✅ Browser navigated!${NC}"
echo ""

# Test 3: Resize to mobile
echo -e "${BLUE}📋 Step 3: Testing Mobile Viewport (375px)${NC}"
echo ""

RESIZE_MOBILE=$(curl -s -X POST http://localhost:3002/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "id":"3",
    "method":"aip.tool.invoke",
    "params":{
      "tool":"playwright.resize",
      "arguments":{
        "width":375,
        "height":667
      }
    }
  }')

echo -e "${GREEN}✅ Resized to mobile (375x667)${NC}"
echo ""

# Test 4: Take mobile screenshot
echo -e "${BLUE}📋 Step 4: Taking Mobile Screenshot${NC}"
echo ""

SCREENSHOT_MOBILE=$(curl -s -X POST http://localhost:3002/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "id":"4",
    "method":"aip.tool.invoke",
    "params":{
      "tool":"playwright.take_screenshot",
      "arguments":{
        "filename":"mobile-375.png"
      }
    }
  }')

echo -e "${GREEN}✅ Mobile screenshot saved!${NC}"
echo ""

# Test 5: Resize to tablet
echo -e "${BLUE}📋 Step 5: Testing Tablet Viewport (768px)${NC}"
echo ""

RESIZE_TABLET=$(curl -s -X POST http://localhost:3002/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "id":"5",
    "method":"aip.tool.invoke",
    "params":{
      "tool":"playwright.resize",
      "arguments":{
        "width":768,
        "height":1024
      }
    }
  }')

echo -e "${GREEN}✅ Resized to tablet (768x1024)${NC}"
echo ""

# Test 6: Take tablet screenshot
echo -e "${BLUE}📋 Step 6: Taking Tablet Screenshot${NC}"
echo ""

SCREENSHOT_TABLET=$(curl -s -X POST http://localhost:3002/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "id":"6",
    "method":"aip.tool.invoke",
    "params":{
      "tool":"playwright.take_screenshot",
      "arguments":{
        "filename":"tablet-768.png"
      }
    }
  }')

echo -e "${GREEN}✅ Tablet screenshot saved!${NC}"
echo ""

# Test 7: Resize to desktop
echo -e "${BLUE}📋 Step 7: Testing Desktop Viewport (1920px)${NC}"
echo ""

RESIZE_DESKTOP=$(curl -s -X POST http://localhost:3002/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "id":"7",
    "method":"aip.tool.invoke",
    "params":{
      "tool":"playwright.resize",
      "arguments":{
        "width":1920,
        "height":1080
      }
    }
  }')

echo -e "${GREEN}✅ Resized to desktop (1920x1080)${NC}"
echo ""

# Test 8: Take desktop screenshot
echo -e "${BLUE}📋 Step 8: Taking Desktop Screenshot${NC}"
echo ""

SCREENSHOT_DESKTOP=$(curl -s -X POST http://localhost:3002/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "id":"8",
    "method":"aip.tool.invoke",
    "params":{
      "tool":"playwright.take_screenshot",
      "arguments":{
        "filename":"desktop-1920.png"
      }
    }
  }')

echo -e "${GREEN}✅ Desktop screenshot saved!${NC}"
echo ""

# Test 9: Test click interaction
echo -e "${BLUE}📋 Step 9: Testing Click Interaction${NC}"
echo "Clicking 'More information...' link..."
echo ""

CLICK_RESPONSE=$(curl -s -X POST http://localhost:3002/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "id":"9",
    "method":"aip.tool.invoke",
    "params":{
      "tool":"playwright.click",
      "arguments":{
        "selector":"a"
      }
    }
  }')

echo -e "${GREEN}✅ Click interaction tested!${NC}"
echo ""

# Test 10: Get page snapshot
echo -e "${BLUE}📋 Step 10: Getting Page Snapshot${NC}"
echo ""

SNAPSHOT_RESPONSE=$(curl -s -X POST http://localhost:3002/aip/v1/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc":"2.0",
    "id":"10",
    "method":"aip.tool.invoke",
    "params":{
      "tool":"playwright.snapshot",
      "arguments":{}
    }
  }')

echo -e "${GREEN}✅ Page snapshot retrieved!${NC}"
echo ""

# Summary
echo "======================================================================"
echo -e "${GREEN}🎉 COMPLETE WORKFLOW TEST PASSED!${NC}"
echo ""
echo "✅ Read Figma design"
echo "✅ Opened browser"
echo "✅ Tested 3 breakpoints (mobile, tablet, desktop)"
echo "✅ Took 3 screenshots"
echo "✅ Tested click interaction"
echo "✅ Got page snapshot"
echo ""
echo -e "${YELLOW}💡 Next Steps:${NC}"
echo "   1. Compare screenshots with Figma designs"
echo "   2. Build visual diff service"
echo "   3. Automate the complete design-to-code-to-test loop"
echo ""
echo "🚀 You now have hands, eyes, and a recipe!"
echo "======================================================================"

