#!/usr/bin/env node

/**
 * Publishing script for cursor-rules-agent-installer
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const packagePath = path.join(__dirname, '..', 'package.json');
const package = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

console.log(`📦 Publishing ${package.name} v${package.version}...`);

try {
  // Check if we're logged in to npm
  console.log('🔐 Checking npm authentication...');
  execSync('npm whoami', { stdio: 'inherit' });
  
  // Run npm publish
  console.log('🚀 Publishing to npm...');
  execSync('npm publish --access public', { stdio: 'inherit' });
  
  console.log('✅ Package published successfully!');
  console.log(`\n📋 Users can now install with:`);
  console.log(`   npx ${package.name}`);
  
} catch (error) {
  console.error('❌ Publish failed:', error.message);
  process.exit(1);
} 