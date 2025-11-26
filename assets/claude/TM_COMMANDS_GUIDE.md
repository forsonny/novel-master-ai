# Novel Master Commands for Claude Code

Complete guide to using Novel Master through Claude Code's slash commands.

## Overview

All Novel Master functionality is available through the `/project:tm/` namespace with natural language support and intelligent features.

## Quick Start

```bash
# Install Novel Master
/project:tm/setup/quick-install

# Initialize project
/project:tm/init/quick

# Parse requirements
/project:tm/parse-prd nrd.md

# Start working
/project:tm/next
```

## Command Structure

Commands are organized hierarchically to match Novel Master's CLI:
- Main commands at `/project:tm/[command]`
- Subcommands for specific operations `/project:tm/[command]/[subcommand]`
- Natural language arguments accepted throughout

## Complete Command Reference

### Setup & Configuration
- `/project:tm/setup/install` - Full installation guide
- `/project:tm/setup/quick-install` - One-line install
- `/project:tm/init` - Initialize project
- `/project:tm/init/quick` - Quick init with -y
- `/project:tm/models` - View AI config
- `/project:tm/models/setup` - Configure AI

### Story Arc Generation
- `/project:tm/parse-prd` - Generate from NRD (accepts NRD files)
- `/project:tm/parse-prd/with-research` - Enhanced parsing
- `/project:tm/generate` - Create manuscript files

### Chapter/Scene Management
- `/project:tm/list` - List with natural language filters
- `/project:tm/list/with-subtasks` - Hierarchical view
- `/project:tm/list/by-status <status>` - Filter by status
- `/project:tm/show <id>` - Chapter details
- `/project:tm/add-task` - Create chapter
- `/project:tm/update` - Update chapters
- `/project:tm/remove-task` - Delete chapter

### Status Management
- `/project:tm/set-status/to-pending <id>`
- `/project:tm/set-status/to-in-progress <id>`
- `/project:tm/set-status/to-done <id>`
- `/project:tm/set-status/to-review <id>`
- `/project:tm/set-status/to-deferred <id>`
- `/project:tm/set-status/to-cancelled <id>`

### Narrative Analysis
- `/project:tm/analyze-complexity` - AI analysis
- `/project:tm/complexity-report` - View report
- `/project:tm/expand <id>` - Break down chapter
- `/project:tm/expand/all` - Expand all complex

### Dependencies
- `/project:tm/add-dependency` - Add dependency
- `/project:tm/remove-dependency` - Remove dependency
- `/project:tm/validate-dependencies` - Check issues
- `/project:tm/fix-dependencies` - Auto-fix

### Workflows
- `/project:tm/workflows/smart-flow` - Adaptive workflows
- `/project:tm/workflows/pipeline` - Chain commands
- `/project:tm/workflows/auto-implement` - AI drafting

### Utilities
- `/project:tm/status` - Project dashboard
- `/project:tm/next` - Next chapter recommendation
- `/project:tm/utils/analyze` - Project analysis
- `/project:tm/learn` - Interactive help

## Key Features

### Natural Language Support
All commands understand natural language:
```
/project:tm/list pending high priority
/project:tm/update mark 23 as done
/project:tm/add-task create Chapter 5: The Revelation
```

### Smart Context
Commands analyze project state and provide intelligent suggestions based on:
- Current chapter status
- Story dependencies
- Writing patterns
- Project phase

### Visual Enhancements
- Progress bars and indicators
- Status badges
- Organized displays
- Clear hierarchies

## Common Workflows

### Daily Writing
```
/project:tm/workflows/smart-flow morning
/project:tm/next
/project:tm/set-status/to-in-progress <id>
/project:tm/set-status/to-done <id>
```

### Chapter Breakdown
```
/project:tm/show <id>
/project:tm/expand <id>
/project:tm/list/with-subtasks
```

### Story Arc Planning
```
/project:tm/analyze-complexity
/project:tm/workflows/pipeline init → expand/all → status
```

## Migration from Old Commands

| Old | New |
|-----|-----|
| `/project:novel-master:list` | `/project:tm/list` |
| `/project:novel-master:complete` | `/project:tm/set-status/to-done` |
| `/project:workflows:auto-implement` | `/project:tm/workflows/auto-implement` |

## Tips

1. Use `/project:tm/` + Tab for command discovery
2. Natural language is supported everywhere
3. Commands provide smart defaults
4. Chain commands for automation
5. Check `/project:tm/learn` for interactive help
