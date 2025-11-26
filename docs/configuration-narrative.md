# Novel Master Configuration Guide

This guide explains how to configure Novel Master for optimal novel development workflows, including narrative-specific settings, model preferences, and writing-focused defaults.

## Configuration File Location

Novel Master stores configuration in `.novelmaster/config.json` in your project root. This file is created automatically when you run `novel-master init` or can be created manually.

## Configuration Structure

```json
{
  "models": {
    "main": "claude-3-5-sonnet-20241022",
    "research": "claude-3-5-sonnet-20241022",
    "fallback": "claude-3-5-sonnet-20241022"
  },
  "parameters": {
    "temperature": 0.7,
    "maxTokens": 4000
  },
  "narrative": {
    "defaultNumTasks": 12,
    "defaultSubtaskCount": 6,
    "targetWordCount": 80000,
    "autoRegenerateManuscript": false
  },
  "logging": {
    "level": "info"
  }
}
```

## Narrative-Specific Settings

### `narrative.defaultNumTasks`

**Default**: `12`  
**Description**: Default number of top-level tasks (acts/chapters) to generate when parsing an NRD.

**Narrative Context**: 
- For a typical novel (80k-100k words), 12-15 chapters is common
- For shorter works (50k-70k words), 8-10 chapters may be appropriate
- For epic novels (120k+ words), 18-24 chapters may be needed

**Example**:
```json
{
  "narrative": {
    "defaultNumTasks": 15
  }
}
```

### `narrative.defaultSubtaskCount`

**Default**: `6`  
**Description**: Default number of scenes/beats to generate when expanding a chapter.

**Narrative Context**:
- Most chapters contain 4-8 scenes
- Action-heavy chapters may have more scenes (8-12)
- Introspective chapters may have fewer (3-5)

**Example**:
```json
{
  "narrative": {
    "defaultSubtaskCount": 5
  }
}
```

### `narrative.targetWordCount`

**Default**: `null`  
**Description**: Global target word count for the entire novel.

**Narrative Context**:
- Commercial fiction: 70,000-100,000 words
- Literary fiction: 60,000-90,000 words
- Epic fantasy: 100,000-150,000 words
- Young adult: 50,000-80,000 words

**Example**:
```json
{
  "narrative": {
    "targetWordCount": 90000
  }
}
```

**Usage**: This target is used in:
- Manuscript summary calculations
- Progress tracking
- Chapter word count recommendations

### `narrative.autoRegenerateManuscript`

**Default**: `false`  
**Description**: Automatically regenerate manuscript files when tasks are updated.

**When to Enable**:
- During active drafting when you want immediate file sync
- When working with external editors who need updated files

**When to Disable**:
- During planning/outlining phase
- When you prefer manual control over when files regenerate

**Example**:
```json
{
  "narrative": {
    "autoRegenerateManuscript": true
  }
}
```

## Model Configuration for Narrative Writing

### Recommended Models for Creative Writing

Different models excel at different aspects of novel writing:

#### Main Model (Task Generation, Updates)

**Best for**: Generating story structure, expanding chapters, updating narrative context

**Recommended**:
- `claude-3-5-sonnet-20241022` - Excellent for creative writing, understands narrative structure
- `claude-3-opus-20240229` - Strong for complex narrative development
- `gpt-4-turbo` - Good alternative with strong creative capabilities

**Configuration**:
```json
{
  "models": {
    "main": "claude-3-5-sonnet-20241022"
  }
}
```

#### Research Model (Worldbuilding, Genre Research)

**Best for**: Research queries, worldbuilding, genre conventions, factual accuracy

**Recommended**:
- `claude-3-5-sonnet-20241022` - Good balance of creativity and accuracy
- `gpt-4-turbo` - Strong research capabilities
- Models with web access (if available) for current information

**Configuration**:
```json
{
  "models": {
    "research": "claude-3-5-sonnet-20241022"
  }
}
```

#### Fallback Model

**Best for**: Backup when primary model is unavailable

**Recommended**: Use a reliable, always-available model

**Configuration**:
```json
{
  "models": {
    "fallback": "claude-3-5-sonnet-20241022"
  }
}
```

### Temperature Settings for Narrative Work

**Temperature** controls creativity vs. consistency:

- **0.5-0.7** (Recommended): Balanced creativity and consistency
  - Good for: Most narrative tasks, character development, scene expansion
- **0.8-1.0**: Higher creativity
  - Good for: Brainstorming, experimental prose, first drafts
- **0.3-0.5**: Lower creativity, more consistent
  - Good for: Revisions, continuity checks, technical accuracy

**Example**:
```json
{
  "parameters": {
    "temperature": 0.7
  }
}
```

### Max Tokens for Narrative Context

**Max Tokens** determines how much context the AI can process:

- **4000-8000**: Standard for most narrative tasks
  - Good for: Chapter expansion, task updates, research queries
- **8000-16000**: For complex analysis
  - Good for: Complexity analysis, full manuscript reviews
- **2000-4000**: For quick operations
  - Good for: Simple updates, status changes

**Example**:
```json
{
  "parameters": {
    "maxTokens": 4000
  }
}
```

## Genre-Specific Configurations

### Fantasy Novel Configuration

```json
{
  "narrative": {
    "defaultNumTasks": 18,
    "defaultSubtaskCount": 7,
    "targetWordCount": 120000
  },
  "parameters": {
    "temperature": 0.7
  }
}
```

**Rationale**: Epic fantasy typically has more chapters, more scenes per chapter, and higher word counts.

### Thriller Novel Configuration

```json
{
  "narrative": {
    "defaultNumTasks": 25,
    "defaultSubtaskCount": 4,
    "targetWordCount": 85000
  },
  "parameters": {
    "temperature": 0.6
  }
}
```

**Rationale**: Thrillers often have shorter chapters (more chapters total), fewer scenes per chapter (tighter pacing), and moderate word counts.

### Literary Fiction Configuration

```json
{
  "narrative": {
    "defaultNumTasks": 12,
    "defaultSubtaskCount": 3,
    "targetWordCount": 75000
  },
  "parameters": {
    "temperature": 0.8
  }
}
```

**Rationale**: Literary fiction may have fewer, longer scenes, more focus on prose quality, and slightly higher temperature for creative expression.

## Environment Variables

While most configuration is in `config.json`, API keys and sensitive settings use environment variables:

### Required API Keys

Set these in your `.env` file or `.cursor/mcp.json`:

```bash
# For Claude models
ANTHROPIC_API_KEY=your_key_here

# For OpenAI models
OPENAI_API_KEY=your_key_here

# For research capabilities
PERPLEXITY_API_KEY=your_key_here
```

### Optional Environment Variables

```bash
# Debug mode
NOVELMASTER_DEBUG=true

# Project root override
NOVELMASTER_PROJECT_ROOT=/path/to/project
```

## Configuration Management

### Viewing Current Configuration

```bash
novel-master models
```

### Updating Configuration

#### Via CLI

```bash
# Set main model
novel-master models --set-main claude-3-5-sonnet-20241022

# Interactive setup
novel-master models --setup
```

#### Via MCP Tool

```javascript
// In Cursor or other MCP client
await mcp.callTool('models', {
  setMain: 'claude-3-5-sonnet-20241022'
});
```

#### Manual Editing

You can edit `.novelmaster/config.json` directly, but be careful to maintain valid JSON structure.

## Best Practices

### 1. Start with Defaults

Begin with default settings and adjust based on your workflow needs.

### 2. Match Configuration to Genre

Use genre-appropriate defaults for word counts, chapter counts, and scene counts.

### 3. Adjust Temperature by Phase

- **Outlining**: Higher temperature (0.8) for creative brainstorming
- **Drafting**: Medium temperature (0.7) for balanced creativity
- **Revision**: Lower temperature (0.6) for consistency

### 4. Use Research Model for Accuracy

Always use the research model for:
- Worldbuilding questions
- Historical accuracy
- Scientific concepts
- Genre conventions

### 5. Monitor Word Count Progress

Regularly check manuscript summary to ensure you're on track:
```bash
novel-master generate --tag=draft
# Check .novelmaster/manuscript/manuscript-summary.json
```

## Troubleshooting

### Configuration Not Applied

1. Verify file location: `.novelmaster/config.json` in project root
2. Check JSON syntax is valid
3. Restart MCP server if using MCP tools

### Model Not Available

1. Verify API key is set correctly
2. Check model ID spelling
3. Ensure you have access to the model

### Word Count Tracking Not Working

1. Ensure `generate` command is run regularly
2. Check that manuscript files exist
3. Verify word count utilities are functioning

---

For more information:
- [Command Reference](./command-reference.md)
- [Task Structure](./task-structure.md)
- [Development Workflow](../.cursor/rules/dev_workflow.mdc)

