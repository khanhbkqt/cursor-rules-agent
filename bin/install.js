#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const axios = require('axios');

// Package info
const packageInfo = {
  name: 'Cursor Rules Agent',
  version: '0.3.1',
  github: 'https://github.com/khanhbkqt/cursor-rules-agent'
};

// GitHub raw content base URL
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/khanhbkqt/cursor-rules-agent/master';

// File mappings from GitHub
const fileMapping = {
  core: {
    'master-orchestrator.mdc': `${GITHUB_RAW_BASE}/src/core/master-orchestrator.mdc`,
    'context-loader.mdc': `${GITHUB_RAW_BASE}/src/core/context-loader.mdc`
  },
  
  modes: {
    'initializing-mode.mdc': `${GITHUB_RAW_BASE}/src/modes/initializing-mode.mdc`,
    'brainstorming-mode.mdc': `${GITHUB_RAW_BASE}/src/modes/brainstorming-mode.mdc`,
    'planning-agent.mdc': `${GITHUB_RAW_BASE}/src/modes/planning-agent.mdc`,
    'developing-mode.mdc': `${GITHUB_RAW_BASE}/src/modes/developing-mode.mdc`,
    'documenting-mode.mdc': `${GITHUB_RAW_BASE}/src/modes/documenting-mode.mdc`,
    'bug-fixing-mode.mdc': `${GITHUB_RAW_BASE}/src/modes/bug-fixing-mode.mdc`
  },
  
  utilities: {
    'safe-code-generation.mdc': `${GITHUB_RAW_BASE}/src/utilities/safe-code-generation.mdc`,
    'enforcer.mdc': `${GITHUB_RAW_BASE}/src/utilities/enforcer.mdc`,
    'commit-rules.mdc': `${GITHUB_RAW_BASE}/src/utilities/commit-rules.mdc`,
    'kpi-metrics.mdc': `${GITHUB_RAW_BASE}/src/utilities/kpi-metrics.mdc`,
    'cross-reference-system.mdc': `${GITHUB_RAW_BASE}/src/utilities/cross-reference-system.mdc`
  },
  
  templates: {
    'blueprint-template.yaml': `${GITHUB_RAW_BASE}/src/templates/blueprint-template.yaml`,
    'task-template.md': `${GITHUB_RAW_BASE}/src/templates/task-template.md`,
    'task-index-template.json': `${GITHUB_RAW_BASE}/src/templates/task-index-template.json`,
    'task-index-feature-template.json': `${GITHUB_RAW_BASE}/src/templates/task-index-feature-template.json`,
    'active-context-template.md': `${GITHUB_RAW_BASE}/src/templates/active-context-template.md`,
    'bug-report-template.md': `${GITHUB_RAW_BASE}/src/templates/bug-report-template.md`,
    'idea-requirements-template.md': `${GITHUB_RAW_BASE}/src/templates/idea-requirements-template.md`,
    'idea-research-template.md': `${GITHUB_RAW_BASE}/src/templates/idea-research-template.md`,
    'idea-analysis-template.md': `${GITHUB_RAW_BASE}/src/templates/idea-analysis-template.md`,
    'idea-summary-template.md': `${GITHUB_RAW_BASE}/src/templates/idea-summary-template.md`,
    'ideas-readme-template.md': `${GITHUB_RAW_BASE}/src/templates/ideas-readme-template.md`
  }
};

class CursorRulesInstaller {
  constructor() {
    this.currentDir = process.cwd();
    this.rulesDir = path.join(this.currentDir, '.cursor', 'rules');
  }

  async run() {
    console.log(chalk.cyan.bold(`\n🤖 ${packageInfo.name} Installer v${packageInfo.version}\n`));
    
    try {
      await this.checkPrerequisites();
      await this.confirmInstallation();
      await this.createRulesDirectory();
      await this.installRules();
      await this.setupUserRules();
      this.showSuccess();
    } catch (error) {
      console.error(chalk.red('❌ Installation failed:'), error.message);
      process.exit(1);
    }
  }

  async checkPrerequisites() {
    const spinner = ora('Checking prerequisites...').start();
    
    // Check if already installed
    if (fs.existsSync(this.rulesDir)) {
      spinner.stop();
      const { overwrite } = await inquirer.prompt([{
        type: 'confirm',
        name: 'overwrite',
        message: 'Cursor Rules already exist. Overwrite?',
        default: false
      }]);
      
      if (!overwrite) {
        console.log(chalk.yellow('Installation cancelled.'));
        process.exit(0);
      }
    }
    
    spinner.succeed('Prerequisites checked');
  }

  async confirmInstallation() {
    console.log(chalk.white('This installer will set up:'));
    console.log(chalk.gray('  ✓ .cursor/rules/ directory with all Cursor Rules'));
    console.log(chalk.gray('  ✓ Core rules, modes, utilities, and templates'));
    console.log(chalk.gray('  ✓ NEW v0.3.1: KPI metrics & 100% compliance enforcement'));
    console.log(chalk.gray('  ✓ NEW v0.3.1: Cross-reference system with reinforcement loops'));
    console.log(chalk.gray('  ✓ Enhanced workflow integration (Brainstorming → Planning → Developing)'));
    console.log(chalk.gray('  ✓ Latest rules downloaded from GitHub'));
    console.log(chalk.gray('  ✓ User Rules template guidance\n'));

    const { proceed } = await inquirer.prompt([{
      type: 'confirm',
      name: 'proceed',
      message: 'Continue with Cursor Rules installation?',
      default: true
    }]);

    if (!proceed) {
      console.log(chalk.yellow('Installation cancelled.'));
      process.exit(0);
    }
  }

  async createRulesDirectory() {
    const spinner = ora('Creating .cursor/rules directory...').start();
    
    const directories = [
      '.cursor/rules/core',
      '.cursor/rules/modes', 
      '.cursor/rules/utilities',
      '.cursor/rules/templates'
    ];

    for (const dir of directories) {
      await fs.ensureDir(path.join(this.currentDir, dir));
    }
    
    spinner.succeed('Rules directory created');
  }

  async installRules() {
    const spinner = ora('Installing Cursor Rules...').start();
    
    try {
      // Install core rules
      spinner.text = 'Downloading core rules...';
      for (const [filename, url] of Object.entries(fileMapping.core)) {
        const response = await this.downloadWithRetry(url, filename);
        await fs.writeFile(
          path.join(this.rulesDir, 'core', filename),
          response.data.trim()
        );
      }

      // Install mode rules
      spinner.text = 'Downloading mode rules...';
      for (const [filename, url] of Object.entries(fileMapping.modes)) {
        const response = await this.downloadWithRetry(url, filename);
        await fs.writeFile(
          path.join(this.rulesDir, 'modes', filename),
          response.data.trim()
        );
      }

      // Install utilities
      spinner.text = 'Downloading utilities...';
      for (const [filename, url] of Object.entries(fileMapping.utilities)) {
        const response = await this.downloadWithRetry(url, filename);
        await fs.writeFile(
          path.join(this.rulesDir, 'utilities', filename),
          response.data.trim()
        );
      }

      // Install templates
      spinner.text = 'Downloading templates...';
      for (const [filename, url] of Object.entries(fileMapping.templates)) {
        const response = await this.downloadWithRetry(url, filename);
        await fs.writeFile(
          path.join(this.rulesDir, 'templates', filename),
          response.data.trim()
        );
      }
      
      spinner.succeed('Cursor Rules installed');
    } catch (error) {
      spinner.fail('Failed to download rules');
      throw new Error(`Download failed: ${error.message}`);
    }
  }

  async downloadWithRetry(url, filename, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await axios.get(url, { 
          responseType: 'text',
          timeout: 10000,
          headers: {
            'User-Agent': 'cursor-rules-agent-installer'
          }
        });
        return response;
      } catch (error) {
        if (i === maxRetries - 1) {
          throw new Error(`Failed to download ${filename}: ${error.message}`);
        }
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  async setupUserRules() {
    const { setupUserRules } = await inquirer.prompt([{
      type: 'confirm',
      name: 'setupUserRules',
      message: 'Would you like to see the User Rules template for Cursor Settings?',
      default: true
    }]);

    if (setupUserRules) {
      console.log(chalk.cyan('\n📋 Copy this to Cursor Settings > Rules (User Rules):'));
      console.log(chalk.gray('─'.repeat(60)));
      
      const userRulesTemplate = `# 💬 User Rules for Cursor Rules Agent

**Communication Style**: Friendly, direct, technical terms in English
**Decision Making**: Logic-driven, always explain "why"
**Visual Clarity**: Use ✅ ❌ 🚀 💡 ⚠️ emojis appropriately

## Smart Confirmation Rules
- Ask for confirmation when requirements are unclear
- Make autonomous decisions for best practices
- Always be transparent about errors

## Response Format
1. Mode indicator at start
2. Technical content with explanations  
3. Proper markdown formatting
4. Concise but thorough responses

## Enhanced Features v0.3.1
- ALWAYS use Interactive MCP to get user's feedbacks
- STRICTLY FETCH AND FOLLOW RULES
- 100% compliance enforcement with KPI metrics
- Cross-reference system ensures zero isolated operations`;
      
      console.log(chalk.white(userRulesTemplate));
      console.log(chalk.gray('─'.repeat(60)));
    }
  }

  showSuccess() {
    console.log(chalk.green.bold('\n🎉 Cursor Rules Installed Successfully!\n'));
    
    console.log(chalk.white('Next steps:'));
    console.log(chalk.gray('1. Open Cursor in this project'));
    console.log(chalk.gray('2. ') + chalk.cyan('Ask Agent: "initialize project structure"') + chalk.gray(' (required first step)'));
    console.log(chalk.gray('3. Try: ') + chalk.cyan('"What mode should I be in?"'));
    
    console.log(chalk.white('\nAfter initialization, try these enhanced commands:'));
    console.log(chalk.gray('• ') + chalk.cyan('brainstorm AI-powered customer service features'));
    console.log(chalk.gray('• ') + chalk.cyan('plan feature: Shopping Cart'));
    console.log(chalk.gray('• ') + chalk.cyan('work on TASK_001'));
    console.log(chalk.gray('• ') + chalk.cyan('update documentation for completed features'));
    
    console.log(chalk.white('\n📖 For detailed guidance: ') + chalk.cyan('QUICKSTART.md'));
    console.log(chalk.white(`🌐 Learn more: ${packageInfo.github}\n`));
  }
}

// Run the installer
if (require.main === module) {
  const installer = new CursorRulesInstaller();
  installer.run().catch(console.error);
}

module.exports = CursorRulesInstaller; 