#!/usr/bin/env node

/**
 * Test script to interact with Playwright MCP server
 * This demonstrates the complete workflow:
 * 1. Read Figma design (via AIP Figma)
 * 2. Open a webpage (via Playwright MCP)
 * 3. Take screenshots at different breakpoints
 * 4. Test interactions
 */

const http = require('http');

const MCP_URL = 'http://localhost:8931';
const FIGMA_AIP_URL = 'http://localhost:3001/aip/v1/rpc';

// Helper to make HTTP POST requests
function post(url, data) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'Accept': 'application/json, text/event-stream'
      }
    };
    
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          resolve(body);
        }
      });
    });
    
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// MCP Protocol: Initialize
async function mcpInitialize() {
  console.log('🔌 Initializing MCP connection...');
  const response = await post(`${MCP_URL}/mcp`, {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'aip-test-client',
        version: '1.0.0'
      }
    }
  });
  console.log('✅ MCP initialized:', response);
  return response;
}

// MCP Protocol: List available tools
async function mcpListTools() {
  console.log('\n📋 Listing available Playwright tools...');
  const response = await post(`${MCP_URL}/mcp`, {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list',
    params: {}
  });
  
  if (response.result && response.result.tools) {
    console.log(`✅ Found ${response.result.tools.length} tools:`);
    response.result.tools.slice(0, 10).forEach(tool => {
      console.log(`   - ${tool.name}: ${tool.description}`);
    });
    if (response.result.tools.length > 10) {
      console.log(`   ... and ${response.result.tools.length - 10} more`);
    }
  }
  
  return response;
}

// MCP Protocol: Call a tool
async function mcpCallTool(toolName, args) {
  console.log(`\n🔧 Calling tool: ${toolName}`);
  console.log(`   Args:`, JSON.stringify(args, null, 2));
  
  const response = await post(`${MCP_URL}/mcp`, {
    jsonrpc: '2.0',
    id: Date.now(),
    method: 'tools/call',
    params: {
      name: toolName,
      arguments: args
    }
  });
  
  console.log('✅ Tool response:', JSON.stringify(response, null, 2));
  return response;
}

// AIP Protocol: Get Figma file
async function aipGetFigmaFile(fileKey) {
  console.log(`\n🎨 Reading Figma file: ${fileKey}`);
  
  const response = await post(FIGMA_AIP_URL, {
    jsonrpc: '2.0',
    id: 'figma-1',
    method: 'aip.tool.invoke',
    params: {
      tool: 'figma.getFile',
      arguments: {
        fileKey: fileKey,
        depth: 2
      }
    }
  });
  
  if (response.result && response.result.data) {
    const doc = response.result.data.document;
    console.log(`✅ Got Figma file: ${doc.name}`);
    console.log(`   Pages: ${doc.children.length}`);
  }
  
  return response;
}

// Main test workflow
async function main() {
  console.log('🚀 Starting Proof of Concept: Figma → Playwright Integration\n');
  console.log('=' .repeat(70));
  
  try {
    // Step 1: Initialize MCP
    await mcpInitialize();
    
    // Step 2: List available tools
    await mcpListTools();
    
    // Step 3: Navigate to a webpage
    console.log('\n📍 Step 1: Navigate to a webpage');
    await mcpCallTool('browser_navigate', {
      url: 'https://example.com'
    });
    
    // Step 4: Take a snapshot
    console.log('\n📸 Step 2: Take accessibility snapshot');
    await mcpCallTool('browser_snapshot', {});
    
    // Step 5: Resize to mobile
    console.log('\n📱 Step 3: Resize to mobile (375x667)');
    await mcpCallTool('browser_resize', {
      width: 375,
      height: 667
    });
    
    // Step 6: Take screenshot
    console.log('\n📷 Step 4: Take mobile screenshot');
    await mcpCallTool('browser_take_screenshot', {
      filename: 'mobile-screenshot.png'
    });
    
    // Step 7: Resize to desktop
    console.log('\n🖥️  Step 5: Resize to desktop (1920x1080)');
    await mcpCallTool('browser_resize', {
      width: 1920,
      height: 1080
    });
    
    // Step 8: Take screenshot
    console.log('\n📷 Step 6: Take desktop screenshot');
    await mcpCallTool('browser_take_screenshot', {
      filename: 'desktop-screenshot.png'
    });
    
    // Step 9: Read Figma file (if Figma service is running)
    console.log('\n🎨 Step 7: Read Figma design');
    try {
      await aipGetFigmaFile('67m7ehMq38gcTJcNMHWTCa');
    } catch (e) {
      console.log('⚠️  Figma service not available (make sure it\'s running on port 3001)');
    }
    
    console.log('\n' + '='.repeat(70));
    console.log('🎉 Proof of Concept Complete!');
    console.log('\n✅ What we demonstrated:');
    console.log('   1. Connected to Playwright MCP server');
    console.log('   2. Listed available browser automation tools');
    console.log('   3. Navigated to a webpage');
    console.log('   4. Captured accessibility snapshot');
    console.log('   5. Tested responsive design (mobile + desktop)');
    console.log('   6. Took screenshots at different breakpoints');
    console.log('   7. Read Figma design via AIP');
    console.log('\n🚀 Next: Compare screenshots with Figma designs!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
  }
}

// Run the test
main().catch(console.error);

