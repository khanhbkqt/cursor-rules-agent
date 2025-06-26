#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

// Test installer functionality
async function testInstaller() {
  console.log(chalk.cyan.bold('🧪 Testing Cursor Rules Agent Installer\n'));
  
  const testDir = path.join(__dirname, '../test-install');
  
  try {
    // Clean up any previous test
    await fs.remove(testDir);
    await fs.ensureDir(testDir);
    
    console.log(chalk.gray('✓ Created test directory'));
    
    // Change to test directory
    process.chdir(testDir);
    
    // Run installer
    const CursorRulesInstaller = require('../bin/install.js');
    const installer = new CursorRulesInstaller();
    
    // Mock inquirer responses
    const inquirer = require('inquirer');
    const originalPrompt = inquirer.prompt;
    inquirer.prompt = async (questions) => {
      // Auto-respond to all prompts
      return { proceed: true, setupUserRules: false };
    };
    
    await installer.run();
    
    // Restore original prompt
    inquirer.prompt = originalPrompt;
    
    // Verify installation
    const checksData = [
      { path: '.cursor/rules/core', name: 'Core rules' },
      { path: '.cursor/rules/modes', name: 'Mode rules' },
      { path: '.cursor/rules/utilities', name: 'Utilities' },
      { path: '.cursor/rules/templates', name: 'Templates' }
    ];
    
    console.log(chalk.white('\n📋 Verification Results:'));
    
    let allPassed = true;
    for (const check of checksData) {
      const exists = await fs.pathExists(check.path);
      if (exists) {
        console.log(chalk.green(`✓ ${check.name}`));
      } else {
        console.log(chalk.red(`✗ ${check.name}`));
        allPassed = false;
      }
    }
    
    // Check some specific files
    const specificFiles = [
      '.cursor/rules/core/master-orchestrator.mdc',
      '.cursor/rules/modes/developing-mode.mdc',
      '.cursor/rules/utilities/safe-code-generation.mdc'
    ];
    
    console.log(chalk.white('\n📄 File Content Check:'));
    for (const file of specificFiles) {
      try {
        const content = await fs.readFile(file, 'utf8');
        if (content.length > 100) {
          console.log(chalk.green(`✓ ${path.basename(file)} (${content.length} chars)`));
        } else {
          console.log(chalk.yellow(`⚠ ${path.basename(file)} (too short: ${content.length} chars)`));
        }
      } catch (error) {
        console.log(chalk.red(`✗ ${path.basename(file)} (not readable)`));
        allPassed = false;
      }
    }
    
    if (allPassed) {
      console.log(chalk.green.bold('\n🎉 All tests passed! Installer works correctly.'));
    } else {
      console.log(chalk.red.bold('\n❌ Some tests failed. Check the output above.'));
      process.exit(1);
    }
    
  } catch (error) {
    console.error(chalk.red('❌ Test failed:'), error.message);
    process.exit(1);
  } finally {
    // Clean up
    process.chdir(path.join(__dirname, '..'));
    await fs.remove(testDir);
    console.log(chalk.gray('\n🧹 Cleaned up test directory'));
  }
}

// Run tests
if (require.main === module) {
  testInstaller().catch(console.error);
}

module.exports = testInstaller; 