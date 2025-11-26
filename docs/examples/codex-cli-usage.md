# Codex CLI Provider Usage Examples

This guide provides practical examples of using Novel Master with the Codex CLI provider.

## Prerequisites

Before using these examples, ensure you have:

```bash
# 1. Codex CLI installed
npm install -g @openai/codex

# 2. Authenticated with ChatGPT
codex login

# 3. Codex CLI configured as your provider
novel-master models --set-main gpt-5-codex --codex-cli
```

## Example 1: Basic Chapter Creation

Use Codex CLI to create chapters from a simple description:

```bash
# Add a chapter with AI-powered enhancement
novel-master add-task --prompt="Chapter 5: The Revelation - Protagonist discovers the truth about their past" --research
```

**What happens**:
1. Novel Master sends your prompt to GPT-5-Codex via the CLI
2. The AI analyzes your request and generates a detailed chapter outline
3. The chapter is added to your `.novelmaster/tasks/tasks.json`
4. OAuth credentials are automatically used (no API key needed)

## Example 2: Parsing a Novel Requirements Document

Create a comprehensive chapter list from an NRD:

```bash
# Create your NRD
cat > my-novel.txt <<EOF
# The Glass Orbit

## Story Overview
A science fiction novel about a space station engineer who discovers a conspiracy.

## Act Structure
- Act 1: Discovery (Chapters 1-5)
- Act 2: Investigation (Chapters 6-15)
- Act 3: Resolution (Chapters 16-20)

## Key Characters
- Protagonist: Engineer with trust issues
- Antagonist: Station commander hiding secrets
- Mentor: Retired engineer with knowledge

## World Rules
- Zero gravity environment
- Limited communication with Earth
- Resource scarcity creates tension
EOF

# Parse with Codex CLI
novel-master parse-prd my-novel.txt --num-tasks 20
```

**What happens**:
1. GPT-5-Codex reads and analyzes your NRD
2. Generates structured chapters with story dependencies
3. Creates scenes for complex chapters
4. Saves everything to `.novelmaster/tasks/`

## Example 3: Expanding Chapters with Research

Break down a complex chapter into detailed scenes:

```bash
# First, show your current chapters
novel-master list

# Expand a specific chapter (e.g., chapter 1.2)
novel-master expand --id=1.2 --research --force
```

**What happens**:
1. Codex CLI uses GPT-5 for research-level analysis
2. Breaks down the chapter into logical scenes
3. Adds narrative details and continuity/pacing strategies
4. Updates the chapter with story dependency information

## Example 4: Analyzing Narrative Complexity

Get AI-powered insights into your novel's chapter complexity:

```bash
# Analyze all chapters
novel-master analyze-complexity --research

# View the complexity report
novel-master complexity-report
```

**What happens**:
1. GPT-5 analyzes each chapter's scope and narrative requirements
2. Assigns complexity scores and estimates scene counts
3. Generates a detailed report
4. Saves to `.novelmaster/reports/task-complexity-report.json`

## Example 5: Using Custom Codex CLI Settings

Configure Codex CLI behavior for different commands:

```json
// In .novelmaster/config.json
{
  "models": {
    "main": {
      "provider": "codex-cli",
      "modelId": "gpt-5-codex",
      "maxTokens": 128000,
      "temperature": 0.2
    }
  },
  "codexCli": {
    "allowNpx": true,
    "approvalMode": "on-failure",
    "sandboxMode": "workspace-write",
    "commandSpecific": {
      "parse-prd": {
        "verbose": true,
        "approvalMode": "never"
      },
      "expand": {
        "sandboxMode": "read-only",
        "verbose": true
      }
    }
  }
}
```

```bash
# Now parse-prd runs with verbose output and no approvals
novel-master parse-prd nrd.txt

# Expand runs with read-only mode
novel-master expand --id=2.1
```

## Example 6: Workflow - Building a Novel End-to-End

Complete workflow from NRD to manuscript tracking:

```bash
# Step 1: Initialize project
novel-master init

# Step 2: Set up Codex CLI
novel-master models --set-main gpt-5-codex --codex-cli
novel-master models --set-fallback gpt-5 --codex-cli

# Step 3: Create NRD
cat > novel-nrd.txt <<EOF
# The Forgotten Station

A science fiction thriller about a space station engineer who uncovers a conspiracy.

## Act 1: Discovery
- Chapter 1: Ordinary world - Engineer's daily routine
- Chapter 2: Inciting incident - Discovery of anomaly
- Chapter 3: First plot point - Realization of conspiracy

## Act 2: Investigation
- Multiple chapters following the investigation
- Character development arcs
- Rising tension

## Act 3: Resolution
- Climax and resolution
- Character arcs conclude
EOF

# Step 4: Parse NRD into chapters
novel-master parse-prd novel-nrd.txt --num-tasks 20

# Step 5: Analyze complexity
novel-master analyze-complexity --research

# Step 6: Expand complex chapters
novel-master expand --all --research

# Step 7: Start drafting
novel-master next
# Shows: Chapter 1.1: Engineer's morning routine scene

# Step 8: Mark completed as you draft
novel-master set-status --id=1.1 --status=done

# Step 9: Continue to next chapter
novel-master next
```

## Example 7: Multi-Role Configuration

Use Codex CLI for main chapters, Perplexity for research:

```json
// In .novelmaster/config.json
{
  "models": {
    "main": {
      "provider": "codex-cli",
      "modelId": "gpt-5-codex",
      "maxTokens": 128000,
      "temperature": 0.2
    },
    "research": {
      "provider": "perplexity",
      "modelId": "sonar-pro",
      "maxTokens": 8700,
      "temperature": 0.1
    },
    "fallback": {
      "provider": "codex-cli",
      "modelId": "gpt-5",
      "maxTokens": 128000,
      "temperature": 0.2
    }
  }
}
```

```bash
# Main chapter operations use GPT-5-Codex
novel-master add-task --prompt="Chapter 10: The Confrontation"

# Research operations use Perplexity
novel-master analyze-complexity --research

# Fallback to GPT-5 if needed
novel-master expand --id=3.2 --force
```

## Example 8: Troubleshooting Common Issues

### Issue: Codex CLI not found

```bash
# Check if Codex is installed
codex --version

# If not found, install globally
npm install -g @openai/codex

# Or enable npx fallback in config
cat >> .novelmaster/config.json <<EOF
{
  "codexCli": {
    "allowNpx": true
  }
}
EOF
```

### Issue: Not authenticated

```bash
# Check auth status
codex
# Use /about command to see auth info

# Re-authenticate if needed
codex login
```

### Issue: Want more verbose output

```bash
# Enable verbose mode in config
cat >> .novelmaster/config.json <<EOF
{
  "codexCli": {
    "verbose": true
  }
}
EOF

# Or for specific commands
novel-master parse-prd my-nrd.txt
# (verbose output shows detailed Codex CLI interactions)
```

## Example 9: CI/CD Integration

Use Codex CLI in automated workflows:

```yaml
# .github/workflows/chapter-analysis.yml
name: Analyze Chapter Complexity

on:
  push:
    paths:
      - '.novelmaster/**'

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install Novel Master
        run: npm install -g novel-master-ai

      - name: Configure Codex CLI
        run: |
          npm install -g @openai/codex
          echo "${{ secrets.OPENAI_CODEX_API_KEY }}" > ~/.codex-auth
        env:
          OPENAI_CODEX_API_KEY: ${{ secrets.OPENAI_CODEX_API_KEY }}

      - name: Configure Novel Master
        run: |
          cat > .novelmaster/config.json <<EOF
          {
            "models": {
              "main": {
                "provider": "codex-cli",
                "modelId": "gpt-5"
              }
            },
            "codexCli": {
              "allowNpx": true,
              "skipGitRepoCheck": true,
              "approvalMode": "never",
              "fullAuto": true
            }
          }
          EOF

      - name: Analyze Complexity
        run: novel-master analyze-complexity --research

      - name: Upload Report
        uses: actions/upload-artifact@v3
        with:
          name: complexity-report
          path: .novelmaster/reports/task-complexity-report.json
```

## Best Practices

### 1. Use OAuth for Development

```bash
# For local development, use OAuth (no API key needed)
codex login
novel-master models --set-main gpt-5-codex --codex-cli
```

### 2. Configure Approval Modes Appropriately

```json
{
  "codexCli": {
    "approvalMode": "on-failure",  // Safe default
    "sandboxMode": "workspace-write"  // Restricts to project directory
  }
}
```

### 3. Use Command-Specific Settings

```json
{
  "codexCli": {
    "commandSpecific": {
      "parse-prd": {
        "approvalMode": "never",  // NRD parsing is safe
        "verbose": true
      },
      "expand": {
        "approvalMode": "on-request",  // More cautious for chapter expansion
        "verbose": false
      }
    }
  }
}
```

### 4. Leverage Manuscript Analysis

```json
{
  "global": {
    "enableCodebaseAnalysis": true  // Let Codex analyze your manuscript
  }
}
```

### 5. Handle Errors Gracefully

```bash
# Always configure a fallback model
novel-master models --set-fallback gpt-5 --codex-cli

# Or use a different provider as fallback
novel-master models --set-fallback claude-3-5-sonnet
```

## Next Steps

- Read the [Codex CLI Provider Documentation](../providers/codex-cli.md)
- Explore [Configuration Options](../configuration.md#codex-cli-provider)
- Check out [Command Reference](../command-reference.md)
- Learn about [Task Structure](../task-structure.md)

## Common Patterns

### Pattern: Daily Writing Workflow

```bash
# Morning: Review chapters
novel-master list

# Get next chapter
novel-master next

# Draft chapter...

# Update chapter with notes
novel-master update-subtask --id=2.3 --prompt="Drafted the confrontation scene, added emotional depth"

# Mark complete
novel-master set-status --id=2.3 --status=done

# Repeat
```

### Pattern: Story Arc Planning

```bash
# Write story arc spec
vim act-2-arc.txt

# Generate chapters
novel-master parse-prd act-2-arc.txt --num-tasks 10

# Analyze and expand
novel-master analyze-complexity --research
novel-master expand --all --research --force

# Review and adjust
novel-master list
```

### Pattern: Complexity-Based Planning

```bash
# Parse story arc requirements
novel-master parse-prd story-arc-requirements.txt

# Analyze complexity
novel-master analyze-complexity --research

# View report
novel-master complexity-report

# Adjust chapter estimates based on complexity scores
```

---

For more examples and advanced usage, see the [full documentation](https://docs.novel-master.dev).
