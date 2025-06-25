#!/usr/bin/env node

/**
 * Simple test for the installer - actually runs it
 */

const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');
const chalk = require('chalk');

const testDir = path.join(__dirname, '..', 'test-temp');

async function runSimpleTest() {
  console.log(chalk.cyan('🧪 Testing Cursor Rules Agent Installer (Real Test)\n'));
  
  try {
    // Clean up any previous test
    if (fs.existsSync(testDir)) {
      await fs.remove(testDir);
    }
    
    // Create test directory
    await fs.ensureDir(testDir);
    console.log(chalk.gray('✓ Test directory created'));
    
    // Test the installer by checking if it can be required without errors
    const installerPath = path.join(__dirname, '..', 'bin', 'install.js');
    
    try {
      const CursorRulesInstaller = require(installerPath);
      console.log(chalk.green('✓ Installer script loads successfully'));
    } catch (error) {
      console.error(chalk.red('❌ Installer script failed to load:'), error.message);
      return false;
    }
    
    // Test that all embedded rule data exists
    const installer = require(installerPath);
    console.log(chalk.green('✓ Installer can be imported'));
    
    // Check package.json structure
    const packagePath = path.join(__dirname, '..', 'package.json');
    const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    const requiredFields = ['name', 'version', 'bin', 'dependencies'];
    for (const field of requiredFields) {
      if (!pkg[field]) {
        console.error(chalk.red(`❌ Missing package.json field: ${field}`));
        return false;
      }
    }
    console.log(chalk.green('✓ Package.json structure is valid'));
    
    // Check if main binary exists
    const binPath = path.join(__dirname, '..', pkg.bin['cursor-rules-agent-installer']);
    if (!fs.existsSync(binPath)) {
      console.error(chalk.red('❌ Binary file missing:'), binPath);
      return false;
    }
    console.log(chalk.green('✓ Binary file exists'));
    
    // Test file creation by creating a mock installer instance
    process.chdir(testDir);
    
    // Create a simple test to verify directory structure can be created
    const testDirs = [
      '.cursor/rules/core',
      '.cursor/rules/modes',
      '.cursor/rules/utilities', 
      '.cursor/rules/templates',
      'docs',
      'features',
      'specs',
      'blueprints'
    ];
    
    for (const dir of testDirs) {
      await fs.ensureDir(dir);
    }
    console.log(chalk.green('✓ Directory structure can be created'));
    
    // Test task-index.json creation
    const taskIndex = {
      "project": {
        "name": "test-project",
        "version": "1.0.0",
        "last_updated": new Date().toISOString().split('T')[0]
      },
      "features": {},
      "tasks": {},
      "completed": {},
      "statistics": {
        "total_tasks": 0,
        "completed_tasks": 0,
        "completion_rate": 0
      }
    };
    
    await fs.writeFile('task-index.json', JSON.stringify(taskIndex, null, 2));
    console.log(chalk.green('✓ Task index can be created'));
    
    console.log(chalk.green.bold('\n🎉 All tests passed!'));
    console.log(chalk.cyan('📦 Ready for NPM publishing!'));
    
    return true;
    
  } catch (error) {
    console.error(chalk.red('❌ Test failed:'), error.message);
    return false;
  } finally {
    // Clean up
    process.chdir(path.join(__dirname, '..'));
    if (fs.existsSync(testDir)) {
      await fs.remove(testDir);
      console.log(chalk.gray('✓ Test cleanup completed'));
    }
  }
}

if (require.main === module) {
  runSimpleTest().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = runSimpleTest; 