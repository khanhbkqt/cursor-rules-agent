# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1] - 2025-01-15

### ⚡ Enhanced Installer
- **GitHub Integration**: Files now downloaded directly from GitHub repository instead of embedded content
  - Always up-to-date content ensuring users get latest rules and templates
  - No more issues with incomplete or stale embedded content
  - Direct access to all utilities, modes, and templates from source

- **Reliable Downloads**: Implemented robust download mechanism
  - Retry logic with exponential backoff for network failures
  - Comprehensive error handling and user feedback
  - Progress indicators during download process
  - Timeout protection and recovery

- **Complete Content Delivery**: All templates and utilities included
  - Full `bug-fixing-mode.mdc` with comprehensive bug workflow
  - All template files including `task-index-feature-template.json`
  - Complete utility files like `commit-rules.mdc`
  - Enhanced templates with latest improvements

### 🔧 Technical Improvements
- Added `axios` dependency for HTTP requests
- Implemented `downloadWithRetry()` method with configurable retry attempts
- Updated file mapping to use GitHub raw URLs
- Added comprehensive test script (`test-installer.js`) for verification
- Enhanced error messages and user experience

### 🧪 Testing
- Added `npm run test:installer` script for automated testing
- Comprehensive verification of downloaded content
- File content validation to ensure proper downloads
- Automated cleanup and test isolation

### 📚 Documentation
- Updated README with enhanced installer benefits
- Highlighted GitHub integration advantages in installation section
- Added reliable installation notes and troubleshooting

## [0.2.0] - 2025-06-26

### 🚀 Added
- **Bug Fixing Workflow**: Comprehensive bug tracking and resolution system
  - Automatic Bug-Fixing Mode activation for critical issues
  - Structured bug reporting with severity levels (blocker, critical, major, minor)
  - Emergency hotfix protocol for blocker-severity bugs
  - Bug tracking structure with `bugs/` directory and templates
  - Integration with Git workflow for bug branches and commits

- **Enhanced Mode Detection**: Improved deterministic mode detection logic
  - More accurate identification of the appropriate mode
  - Better context understanding for mode switching
  - Enhanced master orchestrator with refined detection algorithms

- **Unified Commit Rules**: Standardized Git workflow across all modes
  - Consistent commit message formatting
  - Proper branch naming conventions
  - Structured commit descriptions with fixes and testing information

### 🔧 Improved
- **Master Orchestrator**: Enhanced mode detection logic for better accuracy
- **Commit Rules**: Updated description for standardized Git workflow integration
- **Documentation**: Added comprehensive bug fixing workflow documentation

### 📚 Documentation
- Added detailed Bug Fixing Workflow section to README
- Documented emergency hotfix protocol
- Added bug severity levels and response times
- Included bug tracking structure examples

### 🏗️ Technical Changes
- Enhanced core orchestration rules for better mode detection
- Improved context-aware loading for bug fixing scenarios
- Added support for automatic bug-fixing mode prioritization

## [0.1.0] - 2025-01-14

### 🚀 Initial Release
- Complete NPX installer for Cursor Rules Agent
- AI-Driven Development Workflow System
- Knowledge-aware and deterministic architecture
- Enhanced MCP Tools integration
- Comprehensive documentation and setup guides 