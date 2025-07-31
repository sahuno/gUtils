#!/usr/bin/env node

/**
 * Quick test script to verify R bridge functionality
 */

const { RBridge } = require('./dist/utils/rbridge');

async function testRBridge() {
  console.log('Testing gUtils MCP Server R Bridge...\n');
  
  const rBridge = new RBridge();
  
  try {
    // Test 1: Initialize R bridge
    console.log('1. Initializing R bridge...');
    await rBridge.initialize();
    console.log('✓ R bridge initialized successfully\n');
    
    // Test 2: Simple R command
    console.log('2. Testing simple R command (1 + 1)...');
    const simpleResult = await rBridge.executeRCommand('1 + 1');
    console.log(`✓ Result: ${simpleResult.data}\n`);
    
    // Test 3: Check gUtils availability
    console.log('3. Checking gUtils package...');
    const gUtilsCheck = await rBridge.executeRCommand('"gUtils" %in% loadedNamespaces()');
    console.log(`✓ gUtils loaded: ${gUtilsCheck.data}\n`);
    
    // Test 4: Parse genomic coordinates
    console.log('4. Testing parse.gr function...');
    const parseResult = await rBridge.executeRCommand('parse.gr("chr1:1000-2000")');
    console.log('✓ Parsed result:', JSON.stringify(parseResult, null, 2), '\n');
    
    // Test 5: Create and manipulate GRanges
    console.log('5. Testing GRanges creation...');
    const grCmd = `
      gr <- GRanges(
        seqnames = c("chr1", "chr2"),
        ranges = IRanges(start = c(1000, 5000), end = c(2000, 6000)),
        strand = c("+", "-")
      )
      length(gr)
    `;
    const grResult = await rBridge.executeRCommand(grCmd);
    console.log(`✓ Created GRanges with ${grResult.data} ranges\n`);
    
    console.log('All tests passed! ✅');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await rBridge.close();
  }
}

testRBridge().catch(console.error);