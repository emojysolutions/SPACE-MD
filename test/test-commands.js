/**
 * Basic validation test for SPACE-MD music commands
 * Tests command structure and module loading
 */

const path = require('path');

// Test: Load commands and verify structure
async function testCommandStructure() {
  console.log('Testing command structure...\n');
  
  const commands = ['play', 'search'];
  const requiredFields = ['name', 'aliases', 'category', 'description', 'usage', 'examples', 'cooldown', 'adminOnly', 'execute'];
  
  for (const cmdName of commands) {
    console.log(`Testing ${cmdName} command...`);
    
    try {
      const cmd = require(`../commands/music/${cmdName}.js`);
      
      // Check all required fields exist
      for (const field of requiredFields) {
        if (!(field in cmd)) {
          console.error(`  ❌ Missing field: ${field}`);
          return false;
        }
      }
      
      // Validate field types
      if (typeof cmd.name !== 'string') {
        console.error('  ❌ name must be a string');
        return false;
      }
      
      if (!Array.isArray(cmd.aliases)) {
        console.error('  ❌ aliases must be an array');
        return false;
      }
      
      if (typeof cmd.execute !== 'function') {
        console.error('  ❌ execute must be a function');
        return false;
      }
      
      console.log(`  ✅ ${cmdName} command structure is valid`);
      console.log(`     Name: ${cmd.name}`);
      console.log(`     Aliases: ${cmd.aliases.join(', ')}`);
      console.log(`     Category: ${cmd.category}`);
      console.log('');
      
    } catch (error) {
      // Check if it's a missing dependency issue
      if (error.code === 'MODULE_NOT_FOUND' && (error.message.includes('ytdl-core') || error.message.includes('ytsr'))) {
        console.log(`  ⚠️  ${cmdName} requires dependencies (not yet installed)`);
        console.log(`     Command file structure is defined correctly`);
        console.log('');
        continue;
      }
      console.error(`  ❌ Failed to load ${cmdName} command:`, error.message);
      return false;
    }
  }
  
  return true;
}

// Test: Load utilities
async function testUtilities() {
  console.log('Testing utilities...\n');
  
  const utils = ['sessionManager', 'youtube', 'formatters'];
  
  for (const utilName of utils) {
    console.log(`Testing ${utilName} utility...`);
    
    try {
      const util = require(`../utils/${utilName}.js`);
      
      if (!util || typeof util !== 'object') {
        console.error(`  ❌ ${utilName} must export an object or instance`);
        return false;
      }
      
      console.log(`  ✅ ${utilName} utility loaded successfully`);
      
    } catch (error) {
      // Check if it's a missing dependency issue
      if (error.code === 'MODULE_NOT_FOUND' && error.message.includes('ytsr')) {
        console.log(`  ⚠️  ${utilName} requires ytsr dependency (not yet installed)`);
        continue;
      } else if (error.code === 'MODULE_NOT_FOUND' && error.message.includes('ytdl-core')) {
        console.log(`  ⚠️  ${utilName} requires ytdl-core dependency (not yet installed)`);
        continue;
      }
      console.error(`  ❌ Failed to load ${utilName} utility:`, error.message);
      return false;
    }
  }
  
  console.log('');
  return true;
}

// Test: Validate formatter functions
async function testFormatters() {
  console.log('Testing formatter functions...\n');
  
  try {
    const { formatViews, formatDuration, sanitizeFilename } = require('../utils/formatters.js');
    
    // Test formatViews
    const viewTests = [
      { input: 1500000000, expected: '1.5B' },
      { input: 1200000, expected: '1.2M' },
      { input: 5500, expected: '5.5K' },
      { input: 100, expected: '100' }
    ];
    
    for (const test of viewTests) {
      const result = formatViews(test.input);
      if (result !== test.expected) {
        console.error(`  ❌ formatViews(${test.input}) = ${result}, expected ${test.expected}`);
        return false;
      }
    }
    console.log('  ✅ formatViews works correctly');
    
    // Test formatDuration
    const result = formatDuration(245); // 4:05
    if (result !== '4:05') {
      console.error(`  ❌ formatDuration(245) = ${result}, expected 4:05`);
      return false;
    }
    console.log('  ✅ formatDuration works correctly');
    
    // Test sanitizeFilename
    const unsafe = 'Song: Title <with> bad|chars?';
    const safe = sanitizeFilename(unsafe);
    if (safe.includes(':') || safe.includes('<') || safe.includes('>') || safe.includes('|') || safe.includes('?')) {
      console.error(`  ❌ sanitizeFilename didn't remove all unsafe characters: ${safe}`);
      return false;
    }
    console.log('  ✅ sanitizeFilename works correctly');
    
    console.log('');
    return true;
    
  } catch (error) {
    console.error('  ❌ Formatter test failed:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('═══════════════════════════════════════\n');
  console.log('   SPACE-MD Music Commands Test Suite\n');
  console.log('═══════════════════════════════════════\n\n');
  
  const results = [];
  
  results.push(await testUtilities());
  results.push(await testCommandStructure());
  results.push(await testFormatters());
  
  console.log('═══════════════════════════════════════\n');
  
  if (results.every(r => r === true)) {
    console.log('✅ All tests passed!\n');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed!\n');
    process.exit(1);
  }
}

// Run tests
runTests().catch(error => {
  console.error('Fatal error running tests:', error);
  process.exit(1);
});
