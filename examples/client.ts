/**
 * Example AIP Client
 * 
 * This example demonstrates how to connect to an AIP server and use its capabilities.
 */

import { AIPClient } from '../src/client/AIPClient';

async function main() {
  console.log('🚀 AIP Client Example\n');

  // Create client
  const client = new AIPClient({
    url: 'http://localhost:3000/aip/v1/rpc',
    name: 'ExampleClient',
    version: '1.0.0',
    // Optional: Add authentication
    // auth: {
    //   type: 'bearer',
    //   token: 'your-secret-token',
    // },
  });

  try {
    // ========================================================================
    // 1. Connect to server
    // ========================================================================
    console.log('📡 Connecting to AIP server...');
    await client.connect();
    console.log('✅ Connected!\n');

    // Get session info
    const session = client.getSession();
    console.log('🔑 Session:', {
      id: session?.id,
      expires: session?.expires,
    });
    console.log('');

    // ========================================================================
    // 2. List capabilities
    // ========================================================================
    console.log('📋 Available capabilities:');
    const capabilities = client.getCapabilities();
    
    capabilities.forEach((cap) => {
      console.log(`  - ${cap.type}: ${cap.name}`);
      console.log(`    ${cap.description}`);
    });
    console.log('');

    // ========================================================================
    // 3. Invoke tools
    // ========================================================================
    console.log('🔧 Invoking tools:\n');

    // Tool 1: Greet
    console.log('1️⃣ Calling greet tool...');
    const greetResult = await client.invokeTool('greet', { name: 'Alice' });
    console.log('   Result:', greetResult.data);
    console.log('');

    // Tool 2: Sum
    console.log('2️⃣ Calling sum tool...');
    const sumResult = await client.invokeTool('sum', { a: 42, b: 58 });
    console.log('   Result:', sumResult.data);
    console.log('');

    // Tool 3: Time
    console.log('3️⃣ Calling time tool...');
    const timeResult = await client.invokeTool('time', {});
    console.log('   Result:', JSON.stringify(timeResult.data, null, 2));
    console.log('');

    // ========================================================================
    // 4. Get context
    // ========================================================================
    console.log('📚 Getting context:\n');

    // Context 1: Server info (AICF)
    console.log('1️⃣ Getting server.info context (AICF format)...');
    const serverInfo = await client.getContext('server.info');
    console.log('   Format:', serverInfo.format);
    console.log('   Data:');
    console.log('   ' + (serverInfo.data as string).split('\n').join('\n   '));
    console.log('');

    // Context 2: System stats (JSON)
    console.log('2️⃣ Getting system.stats context (JSON format)...');
    const systemStats = await client.getContext('system.stats');
    console.log('   Format:', systemStats.format);
    console.log('   Data:', JSON.stringify(systemStats.data, null, 2));
    console.log('');

    // ========================================================================
    // 5. Disconnect
    // ========================================================================
    console.log('👋 Disconnecting...');
    await client.disconnect();
    console.log('✅ Disconnected!\n');

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run example
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

