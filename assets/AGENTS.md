# Novel Master AI - Agent Integration Guide

## Essential Commands

### Core Workflow Commands

```bash
# Project Setup
novel-master init                                    # Initialize Novel Master in current project
novel-master parse-prd .novelmaster/docs/nrd.md       # Generate chapters from NRD document
novel-master models --setup                        # Configure AI models interactively

# Daily Writing Workflow
novel-master list                                   # Show all chapters with status
novel-master next                                   # Get next available chapter to work on
novel-master show <id>                             # View detailed chapter information (e.g., novel-master show 1.2)
novel-master set-status --id=<id> --status=done    # Mark chapter complete

# Chapter/Scene Management
novel-master add-task --prompt="description" --research        # Add new chapter with AI assistance
novel-master expand --id=<id> --research --force              # Break chapter into scenes
novel-master update-task --id=<id> --prompt="changes"         # Update specific chapter
novel-master update --from=<id> --prompt="changes"            # Update multiple chapters from ID onwards
novel-master update-subtask --id=<id> --prompt="notes"        # Add drafting notes to scene

# Analysis & Planning
novel-master analyze-complexity --research          # Analyze narrative complexity
novel-master complexity-report                      # View complexity analysis
novel-master expand --all --research               # Expand all eligible chapters

# Dependencies & Organization
novel-master add-dependency --id=<id> --depends-on=<id>       # Add chapter dependency
novel-master move --from=<id> --to=<id>                       # Reorganize chapter hierarchy
novel-master validate-dependencies                            # Check for dependency issues
novel-master generate                                         # Generate manuscript files (usually auto-called)
```

## Key Files & Project Structure

### Core Files

- `.novelmaster/tasks/tasks.json` - Main chapter data file (auto-managed)
- `.novelmaster/config.json` - AI model configuration (use `novel-master models` to modify)
- `.novelmaster/docs/nrd.md` - Novel Requirements Document for parsing (`.md` extension recommended for better editor support)
- `.novelmaster/manuscript/chapters/chapter-###.md` - Individual chapter files (auto-generated from tasks.json)
- `.env` - API keys for CLI usage

**NRD File Format:** While both `.txt` and `.md` extensions work, **`.md` is recommended** because:
- Markdown syntax highlighting in editors improves readability
- Proper rendering when previewing in VS Code, GitHub, or other tools
- Better collaboration through formatted documentation

### Claude Code Integration Files

- `CLAUDE.md` - Auto-loaded context for Claude Code (this file)
- `.claude/settings.json` - Claude Code tool allowlist and preferences
- `.claude/commands/` - Custom slash commands for repeated workflows
- `.mcp.json` - MCP server configuration (project-specific)

### Directory Structure

```
project/
├── .novelmaster/
│   ├── tasks/              # Chapter data directory
│   │   ├── tasks.json      # Main chapter database
│   ├── manuscript/         # Generated manuscript files
│   │   ├── chapters/       # Individual chapter files
│   │   │   ├── chapter-001.md
│   │   │   └── chapter-002.md
│   │   ├── compiled/       # Compiled manuscript
│   │   │   └── manuscript-draft.md
│   │   └── manuscript-summary.json
│   ├── docs/              # Documentation directory
│   │   ├── nrd.md         # Novel requirements (.md recommended)
│   ├── reports/           # Analysis reports directory
│   │   └── task-complexity-report.json
│   ├── templates/         # Template files
│   │   └── example_nrd.md  # Example NRD template (.md recommended)
│   └── config.json        # AI models & settings
├── .claude/
│   ├── settings.json      # Claude Code configuration
│   └── commands/         # Custom slash commands
├── .env                  # API keys
├── .mcp.json            # MCP configuration
└── CLAUDE.md            # This file - auto-loaded by Claude Code
```

## MCP Integration

Novel Master provides an MCP server that Claude Code can connect to. Configure in `.mcp.json`:

```json
{
  "mcpServers": {
    "novel-master-ai": {
      "command": "npx",
      "args": ["-y", "novel-master-ai"],
      "env": {
        "ANTHROPIC_API_KEY": "your_key_here",
        "PERPLEXITY_API_KEY": "your_key_here",
        "OPENAI_API_KEY": "OPENAI_API_KEY_HERE",
        "GOOGLE_API_KEY": "GOOGLE_API_KEY_HERE",
        "XAI_API_KEY": "XAI_API_KEY_HERE",
        "OPENROUTER_API_KEY": "OPENROUTER_API_KEY_HERE",
        "MISTRAL_API_KEY": "MISTRAL_API_KEY_HERE",
        "AZURE_OPENAI_API_KEY": "AZURE_OPENAI_API_KEY_HERE",
        "OLLAMA_API_KEY": "OLLAMA_API_KEY_HERE"
      }
    }
  }
}
```

### Essential MCP Tools

```javascript
help; // = shows available novelmaster commands
// Project setup
initialize_project; // = novel-master init
parse_prd; // = novel-master parse-prd (accepts NRD files)

// Daily workflow
get_tasks; // = novel-master list
next_task; // = novel-master next
get_task; // = novel-master show <id>
set_task_status; // = novel-master set-status

// Chapter management
add_task; // = novel-master add-task
expand_task; // = novel-master expand
update_task; // = novel-master update-task
update_subtask; // = novel-master update-subtask
update; // = novel-master update

// Analysis
analyze_project_complexity; // = novel-master analyze-complexity
complexity_report; // = novel-master complexity-report
```

## Claude Code Workflow Integration

### Standard Novel Writing Workflow

#### 1. Project Initialization

```bash
# Initialize Novel Master
novel-master init

# Create or obtain NRD, then parse it (use .md extension for better editor support)
novel-master parse-prd .novelmaster/docs/nrd.md

# Analyze complexity and expand chapters
novel-master analyze-complexity --research
novel-master expand --all --research
```

If chapters already exist, another NRD can be parsed (with new information only!) using parse-prd with --append flag. This will add the generated chapters to the existing list of chapters.

#### 2. Daily Writing Loop

```bash
# Start each session
novel-master next                           # Find next available chapter
novel-master show <id>                     # Review chapter details

# During drafting, add narrative context to the chapters and scenes
novel-master update-subtask --id=<id> --prompt="drafting notes..."

# Complete chapters
novel-master set-status --id=<id> --status=done
```

#### 3. Multi-Claude Workflows

For complex novels, use multiple Claude Code sessions:

```bash
# Terminal 1: Main drafting
cd project && claude

# Terminal 2: Revision and continuity checks
cd project-revision-worktree && claude

# Terminal 3: Character arc development
cd project-character-worktree && claude
```

### Custom Slash Commands

Create `.claude/commands/novelmaster-next.md`:

```markdown
Find the next available Novel Master chapter and show its details.

Steps:

1. Run `novel-master next` to get the next chapter
2. If a chapter is available, run `novel-master show <id>` for full details
3. Provide a summary of what needs to be drafted
4. Suggest the first drafting step
```

Create `.claude/commands/novelmaster-complete.md`:

```markdown
Complete a Novel Master chapter: $ARGUMENTS

Steps:

1. Review the current chapter with `novel-master show $ARGUMENTS`
2. Verify all drafting is complete
3. Run any continuity/pacing checks related to this chapter
4. Mark as complete: `novel-master set-status --id=$ARGUMENTS --status=done`
5. Show the next available chapter with `novel-master next`
```

## Tool Allowlist Recommendations

Add to `.claude/settings.json`:

```json
{
  "allowedTools": [
    "Edit",
    "Bash(novel-master *)",
    "Bash(git commit:*)",
    "Bash(git add:*)",
    "Bash(npm run *)",
    "mcp__novel_master_ai__*"
  ]
}
```

## Configuration & Setup

### API Keys Required

At least **one** of these API keys must be configured:

- `ANTHROPIC_API_KEY` (Claude models) - **Recommended**
- `PERPLEXITY_API_KEY` (Research features) - **Highly recommended**
- `OPENAI_API_KEY` (GPT models)
- `GOOGLE_API_KEY` (Gemini models)
- `MISTRAL_API_KEY` (Mistral models)
- `OPENROUTER_API_KEY` (Multiple models)
- `XAI_API_KEY` (Grok models)

An API key is required for any provider used across any of the 3 roles defined in the `models` command.

### Model Configuration

```bash
# Interactive setup (recommended)
novel-master models --setup

# Set specific models
novel-master models --set-main claude-3-5-sonnet-20241022
novel-master models --set-research perplexity-llama-3.1-sonar-large-128k-online
novel-master models --set-fallback gpt-4o-mini
```

## Chapter Structure & IDs

### Chapter ID Format

- Main chapters: `1`, `2`, `3`, etc.
- Scenes: `1.1`, `1.2`, `2.1`, etc.
- Sub-scenes: `1.1.1`, `1.1.2`, etc.

### Chapter Status Values

- `pending` - Ready to work on
- `in-progress` - Currently being drafted
- `done` - Completed and verified
- `deferred` - Postponed
- `cancelled` - No longer needed
- `blocked` - Waiting on external factors

### Chapter Fields

```json
{
  "id": "1.2",
  "title": "Chapter 2: The Discovery",
  "description": "Protagonist finds the ancient map in the abandoned library",
  "status": "pending",
  "priority": "high",
  "dependencies": ["1.1"],
  "details": "POV: First person, Protagonist. Setting: Abandoned library, midnight. Emotional beat: Curiosity turning to fear as the map reveals hidden dangers. Research hooks: Historical map-making techniques, library architecture.",
  "testStrategy": "Continuity check: Verify timeline matches Chapter 1. Pacing: Ensure tension builds gradually. Character consistency: Maintain protagonist's voice established in Chapter 1.",
  "subtasks": []
}
```

## Claude Code Best Practices with Novel Master

### Context Management

- Use `/clear` between different chapters to maintain focus
- This CLAUDE.md file is automatically loaded for context
- Use `novel-master show <id>` to pull specific chapter context when needed

### Iterative Drafting

1. `novel-master show <scene-id>` - Understand narrative requirements
2. Review previous chapters and plan narrative approach
3. `novel-master update-subtask --id=<id> --prompt="detailed narrative plan"` - Log plan
4. `novel-master set-status --id=<id> --status=in-progress` - Start drafting
5. Draft prose following logged narrative plan
6. `novel-master update-subtask --id=<id> --prompt="what worked/didn't work in the narrative"` - Log progress
7. `novel-master set-status --id=<id> --status=done` - Complete chapter

### Complex Workflows with Checklists

For major story revisions or multi-chapter arcs:

1. Create a markdown NRD file describing the new changes: `touch story-revision-checklist.md` (nrds can be .txt or .md)
2. Use Novel Master to parse the new nrd with `novel-master parse-prd --append` (also available in MCP)
3. Use Novel Master to expand the newly generated chapters into scenes. Consider using `analyze-complexity` with the correct --to and --from IDs (the new ids) to identify the ideal scene counts for each chapter. Then expand them.
4. Work through items systematically, checking them off as completed
5. Use `novel-master update-subtask` to log progress on each chapter/scene and/or updating/researching them before/during drafting if getting stuck

### Git Integration

Novel Master works well with `gh` CLI:

```bash
# Create PR for completed chapter
gh pr create --title "Complete chapter 1.2: The Discovery" --body "Drafts Chapter 2 as specified in chapter 1.2"

# Reference chapter in commits
git commit -m "draft: complete Chapter 2 (chapter 1.2)"
```

### Parallel Development with Git Worktrees

```bash
# Create worktrees for parallel chapter development
git worktree add ../novel-act-2 feature/act-2
git worktree add ../novel-character-arc feature/character-arc-lena

# Run Claude Code in each worktree
cd ../novel-act-2 && claude    # Terminal 1: Act 2 drafting
cd ../novel-character-arc && claude     # Terminal 2: Character arc work
```

## Troubleshooting

### AI Commands Failing

```bash
# Check API keys are configured
cat .env                           # For CLI usage

# Verify model configuration
novel-master models

# Test with different model
novel-master models --set-fallback gpt-4o-mini
```

### MCP Connection Issues

- Check `.mcp.json` configuration
- Verify Node.js installation
- Use `--mcp-debug` flag when starting Claude Code
- Use CLI as fallback if MCP unavailable

### Manuscript File Sync Issues

```bash
# Regenerate manuscript files from tasks.json
novel-master generate

# Fix dependency issues
novel-master fix-dependencies
```

DO NOT RE-INITIALIZE. That will not do anything beyond re-adding the same Novel Master core files.

## Important Notes

### AI-Powered Operations

These commands make AI calls and may take up to a minute:

- `parse_prd` / `novel-master parse-prd` (accepts NRD files)
- `analyze_project_complexity` / `novel-master analyze-complexity`
- `expand_task` / `novel-master expand`
- `expand_all` / `novel-master expand --all`
- `add_task` / `novel-master add-task`
- `update` / `novel-master update`
- `update_task` / `novel-master update-task`
- `update_subtask` / `novel-master update-subtask`

### File Management

- Never manually edit `tasks.json` - use commands instead
- Never manually edit `.novelmaster/config.json` - use `novel-master models`
- Chapter markdown files in `manuscript/chapters/` are auto-generated
- Run `novel-master generate` after manual changes to tasks.json

### Claude Code Session Management

- Use `/clear` frequently to maintain focused context
- Create custom slash commands for repeated Novel Master workflows
- Configure tool allowlist to streamline permissions
- Use headless mode for automation: `claude -p "novel-master next"`

### Multi-Chapter Updates

- Use `update --from=<id>` to update multiple future chapters
- Use `update-task --id=<id>` for single chapter updates
- Use `update-subtask --id=<id>` for drafting notes

### Research Mode

- Add `--research` flag for research-based AI enhancement
- Requires a research model API key like Perplexity (`PERPLEXITY_API_KEY`) in environment
- Provides more informed chapter creation and updates
- Recommended for complex narrative research, worldbuilding, and historical accuracy

---

_This guide ensures Claude Code has immediate access to Novel Master's essential functionality for agentic novel writing workflows._
