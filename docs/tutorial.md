# Novel Master Tutorial

This tutorial guides you through using Novel Master to write a complete novel from concept to finished manuscript.

## Initial Setup

There are two ways to set up Novel Master: using MCP (recommended) or via npm installation.

### Option 1: Using MCP (Recommended)

MCP (Model Context Protocol) provides the easiest way to get started with Novel Master directly in your editor.

1. **Install the package**

```bash
npm i -g novel-master-ai
```

2. **Add the MCP config to your IDE/MCP Client** (Cursor is recommended, but it works with other clients):

```json
{
  "mcpServers": {
    "novel-master-ai": {
      "command": "npx",
      "args": ["-y", "novel-master-ai"],
      "env": {
        "ANTHROPIC_API_KEY": "YOUR_ANTHROPIC_API_KEY_HERE",
        "PERPLEXITY_API_KEY": "YOUR_PERPLEXITY_API_KEY_HERE",
        "OPENAI_API_KEY": "YOUR_OPENAI_KEY_HERE",
        "GOOGLE_API_KEY": "YOUR_GOOGLE_KEY_HERE",
        "MISTRAL_API_KEY": "YOUR_MISTRAL_KEY_HERE",
        "OPENROUTER_API_KEY": "YOUR_OPENROUTER_KEY_HERE",
        "XAI_API_KEY": "YOUR_XAI_KEY_HERE",
        "AZURE_OPENAI_API_KEY": "YOUR_AZURE_KEY_HERE"
      }
    }
  }
}
```

**IMPORTANT:** An API key is _required_ for each AI provider you plan on using. Run the `novel-master models` command to see your selected models and the status of your API keys across .env and mcp.json

**To use AI commands in CLI** you MUST have API keys in the .env file  
**To use AI commands in MCP** you MUST have API keys in the .cursor/mcp.json file (or MCP config equivalent)

We recommend having keys in both places and adding mcp.json to your gitignore so your API keys aren't checked into git.

3. **Enable the MCP** in your editor settings

4. **Prompt the AI** to initialize Novel Master:

```
Can you please initialize novel-master-ai into my project?
```

The AI will:

- Create necessary project structure
- Set up initial configuration files
- Guide you through the rest of the process

5. Place your NRD (Novel Requirements Document) in the `.novelmaster/docs/` directory (e.g., `.novelmaster/docs/nrd.txt`)

6. **Use natural language commands** to interact with Novel Master:

```
Can you parse my NRD at .novelmaster/docs/nrd.txt?
What's the next chapter I should work on?
Can you help me expand chapter 3 into scenes?
```

### Option 2: Manual Installation

If you prefer to use the command line interface directly:

```bash
# Install globally
npm install -g novel-master-ai

# OR install locally within your project
npm install novel-master-ai
```

Initialize a new project:

```bash
# If installed globally
novel-master init

# If installed locally
npx novel-master init
```

This will prompt you for project details and set up a new project with the necessary files and structure.

## Common Commands

After setting up Novel Master, you can use these commands (either via AI prompts or CLI):

```bash
# Parse an NRD and generate story arcs/chapters
novel-master parse-prd your-nrd.txt --tag outline

# List all chapters/scenes
novel-master list --tag outline

# Show the next chapter to work on
novel-master next --tag draft

# Expand a chapter into scenes/beats
novel-master expand --id=3 --num=5 --tag outline --research

# Generate manuscript files
novel-master generate --tag draft
```

## Setting up Cursor AI Integration

Novel Master is designed to work seamlessly with [Cursor AI](https://www.cursor.so/), providing a structured workflow for AI-driven novel writing.

### Using Cursor with MCP (Recommended)

If you've already set up Novel Master with MCP in Cursor, the integration is automatic. You can simply use natural language to interact with Novel Master:

```
What chapters are available to work on next?
Can you analyze the pacing of our story?
I'd like to expand chapter 4 into scenes. What does it involve?
```

### Manual Cursor Setup

If you're not using MCP, you can still set up Cursor integration:

1. After initializing your project, open it in Cursor
2. The `.cursor/rules/dev_workflow.mdc` file is automatically loaded by Cursor, providing the AI with knowledge about the novel development system
3. Place your NRD document in the `.novelmaster/docs/` directory (e.g., `.novelmaster/docs/nrd.txt`)
4. Open Cursor's AI chat and switch to Agent mode

### Alternative MCP Setup in Cursor

You can also set up the MCP server in Cursor settings:

1. Go to Cursor settings
2. Navigate to the MCP section
3. Click on "Add New MCP Server"
4. Configure with the following details:
   - Name: "Novel Master"
   - Type: "Command"
   - Command: "npx -y novel-master-ai"
5. Save the settings

Once configured, you can interact with Novel Master's novel management commands directly through Cursor's interface, providing a more integrated experience.

## Initial Story Planning

In Cursor's AI chat, instruct the agent to generate story arcs from your NRD:

```
Please use the novel-master parse-prd command to generate story arcs from my NRD. The NRD is located at .novelmaster/docs/nrd.txt.
```

The agent will execute:

```bash
novel-master parse-prd .novelmaster/docs/nrd.txt --tag outline
```

This will:

- Parse your NRD document
- Generate a structured `tasks.json` file with story arcs, chapters, dependencies, priorities, and narrative guidance
- The agent will understand this process due to the Cursor rules

### Generate Manuscript Chapter Files

Next, ask the agent to generate manuscript chapter files:

```
Please generate manuscript chapter files from tasks.json
```

The agent will execute:

```bash
novel-master generate --tag draft
```

This creates chapter markdown files in `.novelmaster/manuscript/chapters/` (e.g., `chapter-001.md`, `chapter-002.md`), making it easier to draft and revise specific chapters.

## AI-Driven Novel Writing Workflow

The Cursor agent is pre-configured (via the rules file) to follow this workflow:

### 1. Story Discovery and Selection

Ask the agent to list available chapters:

```
What chapters are available to work on next?
```

```
Can you show me chapters 1, 3, and 5 to understand their current status?
```

The agent will:

- Run `novel-master list` to see all chapters
- Run `novel-master next` to determine the next chapter to work on
- Run `novel-master show 1,3,5` to display multiple chapters with interactive options
- Analyze dependencies to determine which chapters are ready to be worked on
- Prioritize chapters based on priority level and ID order
- Suggest the next chapter(s) to draft

### 2. Chapter Expansion

When expanding a chapter into scenes, the agent will:

- Reference the chapter's details section for narrative specifics
- Consider dependencies on previous chapters
- Follow the story's pacing and structure
- Create appropriate scene beats based on the chapter's narrative goals

You can ask:

```
Let's expand chapter 3 into scenes. What does it involve?
```

### 2.1. Viewing Multiple Chapters

For efficient context gathering and batch operations:

```
Show me chapters 5, 7, and 9 so I can plan my narrative approach.
```

The agent will:

- Run `novel-master show 5,7,9` to display a compact summary table
- Show chapter status, priority, and progress indicators
- Provide an interactive action menu with batch operations
- Allow you to perform group actions like marking multiple chapters as in-progress

### 3. Narrative Verification

Before marking a chapter as complete, verify it according to:

- The chapter's specified continuity checks
- Pacing and tension goals
- Character arc progression
- Worldbuilding consistency

### 4. Chapter Completion

When a chapter is completed, tell the agent:

```
Chapter 3 is now complete. Please update its status.
```

The agent will execute:

```bash
novel-master set-status --id=3 --status=done
```

### 5. Handling Story Changes

If during writing, you discover that:

- The current approach differs significantly from what was planned
- Future chapters need to be modified due to current story choices
- New plot threads or character arcs have emerged

Tell the agent:

```
We've decided to change the POV structure. Can you update all future chapters (from ID 4) to reflect this change?
```

The agent will execute:

```bash
novel-master update --from=4 --prompt="Now we are using alternating first-person POV instead of third-person limited."
```

This will rewrite or re-scope subsequent chapters in tasks.json while preserving completed work.

### 6. Reorganizing Story Structure

If you need to reorganize your story structure:

```
I think scene 5.2 would fit better as part of chapter 7 instead. Can you move it there?
```

The agent will execute:

```bash
novel-master move --from=5.2 --to=7.3
```

You can reorganize chapters and scenes in various ways:

- Moving a standalone chapter to become a scene: `--from=5 --to=7`
- Moving a scene to become a standalone chapter: `--from=5.2 --to=7`
- Moving a scene to a different parent: `--from=5.2 --to=7.3`
- Reordering scenes within the same chapter: `--from=5.2 --to=5.4`
- Moving a chapter to a new ID position: `--from=5 --to=25` (even if chapter 25 doesn't exist yet)
- Moving multiple chapters at once: `--from=10,11,12 --to=16,17,18` (must have same number of IDs, Novel Master will look through each position)

When moving chapters to new IDs:

- The system automatically creates placeholder chapters for non-existent destination IDs
- This prevents accidental data loss during reorganization
- Any chapters that depend on moved chapters will have their dependencies updated
- When moving a parent chapter, all its scenes are automatically moved with it and renumbered

This is particularly useful as your story understanding evolves and you need to refine your narrative structure.

### 7. Breaking Down Complex Chapters

For complex chapters that need more granularity:

```
Chapter 5 seems complex. Can you break it down into scenes?
```

The agent will execute:

```bash
novel-master expand --id=5 --num=6 --tag outline
```

You can provide additional context:

```
Please break down chapter 5 with a focus on character development and emotional beats.
```

The agent will execute:

```bash
novel-master expand --id=5 --prompt="Focus on character development and emotional beats"
```

You can also expand all pending chapters:

```
Please break down all pending chapters into scenes.
```

The agent will execute:

```bash
novel-master expand --all --tag outline
```

For research-backed scene generation using the configured research model:

```
Please break down chapter 5 using research-backed generation for worldbuilding details.
```

The agent will execute:

```bash
novel-master expand --id=5 --research
```

## Example Cursor AI Interactions

### Starting a new novel

```
I've just initialized a new project with Novel Master. I have an NRD at .novelmaster/docs/nrd.txt.
Can you help me parse it and set up the initial story arcs?
```

### Working on chapters

```
What's the next chapter I should work on? Please consider dependencies and priorities.
```

### Expanding a specific chapter

```
I'd like to expand chapter 4 into scenes. Can you help me understand what needs to be done and how to approach it?
```

### Managing scenes

```
I need to regenerate the scenes for chapter 3 with a different approach. Can you help me clear and regenerate them?
```

### Handling story changes

```
We've decided to change the ending. Can you update all future chapters to reflect this change?
```

### Completing work

```
I've finished drafting chapter 2. All scenes are complete and the pacing feels right.
Please mark it as complete and tell me what I should work on next.
```

### Analyzing narrative complexity

```
Can you analyze the pacing and complexity of our chapters to help me understand which ones need to be broken down further?
```

### Viewing complexity report

```
Can you show me the complexity report in a more readable format?
```

### Research-Driven Writing

Novel Master includes a powerful research tool that provides fresh, up-to-date information beyond the AI's knowledge cutoff. This is particularly valuable for:

- **Worldbuilding research** – Historical accuracy, cultural details, scientific concepts
- **Genre conventions** – Understanding tropes, reader expectations, market trends
- **Writing techniques** – Narrative structure, pacing, character development

#### Getting Fresh Information

```
Research the latest best practices for writing science fiction worldbuilding.
```

(Agent runs: `novel-master research "Latest best practices for writing science fiction worldbuilding"`)

#### Research with Story Context

```
I'm working on chapter 15 which involves a heist scene. Can you research current best practices for writing heist sequences?
```

(Agent runs: `novel-master research "Best practices for writing heist sequences" --id=15 --files=.novelmaster/manuscript/chapters/chapter-015.md`)

#### Research Before Writing

```
Before I draft chapter 8 (which involves medieval combat), can you research the latest historical accuracy requirements for sword fighting scenes?
```

(Agent runs: `novel-master research "Historical accuracy for medieval sword fighting scenes" --id=8`)

#### Research and Update Pattern

```
Research the latest recommendations for writing multi-POV novels and update our POV structure chapter with the findings.
```

(Agent runs:

1. `novel-master research "Best practices for writing multi-POV novels" --id=12`
2. `novel-master update-subtask --id=12.3 --prompt="Updated with latest POV findings: [research results]"`)

### Research for Continuity

```
I'm having issues with timeline consistency in chapter 20. Can you research common timeline problems in novels and solutions?
```

(Agent runs: `novel-master research "Common timeline consistency problems in novels and solutions" --id=20 --files=.novelmaster/manuscript/chapters/chapter-020.md`)

### Research Genre Comparisons

```
We need to choose between first-person and third-person POV for our thriller. Can you research the current recommendations for our genre?
```

(Agent runs: `novel-master research "First-person vs third-person POV in thriller novels 2024" --tree`)

## Tag Management for Novel Workflows

### Creating Tags for Draft Phases

```
I'm starting work on the first draft. Can you create a matching task tag?
```

(Agent runs: `novel-master add-tag draft --description="First draft writing phase"`)

### Creating Named Tags

```
Create a new tag called 'rev-1' for our first revision pass.
```

(Agent runs: `novel-master add-tag rev-1 --description="First revision pass"`)

### Switching Tag Contexts

```
Switch to the 'draft' tag so I can work on first-draft chapters.
```

(Agent runs: `novel-master use-tag draft`)

### Copying Chapters Between Tags

```
I need to copy the current outline to a new 'draft' tag for writing.
```

(Agent runs: `novel-master add-tag draft --copy-from-current --description="First draft writing"`)

### Managing Multiple Contexts

```
Show me all available tags and their current status.
```

(Agent runs: `novel-master tags --show-metadata`)

### Tag Cleanup

```
I've finished the 'outline' phase and moved to draft. Can you clean up the outline tag?
```

(Agent runs: `novel-master delete-tag outline`)

### Working with Tag-Specific Chapters

```
List all chapters in the 'draft' tag context.
```

(Agent runs: `novel-master use-tag draft` then `novel-master list`)

### Phase-Based Writing Workflow

```
I'm switching to work on the 'rev-1' revision phase. Can you set up the chapter context for this?
```

(Agent runs:

1. `novel-master use-tag rev-1`
2. `novel-master list` to show chapters in the new context)

### Parallel Revision Development

```
I need to work on both character development and pacing simultaneously. How should I organize the chapters?
```

(Agent suggests and runs:

1. `novel-master add-tag rev-1-character --description="Character development revision"`
2. `novel-master add-tag rev-1-pacing --description="Pacing revision"`
3. `novel-master use-tag rev-1-character` to start with character work)

## Manuscript Generation

Once you have chapters and scenes defined, generate manuscript files:

```bash
novel-master generate --tag draft
```

This creates:

- Chapter markdown files in `.novelmaster/manuscript/chapters/` (e.g., `chapter-001.md`)
- Scene sections within each chapter file
- A manuscript summary in `.novelmaster/manuscript/manuscript-summary.json` (includes word counts, targets, and completion percentages)
- A compiled manuscript in `.novelmaster/manuscript/compiled/manuscript-draft.md`

You can then edit the chapter files directly, and Novel Master will preserve your draft text between the `<!-- novel-master:draft:start -->` and `<!-- novel-master:draft:end -->` markers.

### File Sync After Updates

**Important:** After updating tasks via `update_task`, `update_subtask`, or any other task modification command, run `generate` again to sync manuscript files with the latest changes:

```bash
# After updating a task
novel-master update-task --id=3 --prompt="Change POV to first person"
novel-master generate --tag draft  # Regenerate to sync manuscript files
```

This ensures that:
- Chapter metadata reflects the latest task details
- Word counts are recalculated from current draft content
- The manuscript summary shows up-to-date progress
- Compiled manuscript includes all latest changes

## Best Practices for AI-Driven Novel Writing

1. **Start with a detailed NRD**: The more detailed your NRD, the better the generated story arcs will be.

2. **Review generated chapters**: After parsing the NRD, review the chapters to ensure they make sense and have appropriate dependencies.

3. **Analyze narrative complexity**: Use the complexity analysis feature to identify which chapters should be broken down further.

4. **Follow the dependency chain**: Always respect chapter dependencies - the Cursor agent will help with this.

5. **Update as you go**: If your story diverges from the plan, use the update command to keep future chapters aligned with your current approach.

6. **Break down complex chapters**: Use the expand command to break down complex chapters into manageable scenes.

7. **Regenerate manuscript files**: After any updates to tasks.json, regenerate the manuscript files to keep them in sync.

8. **Communicate context to the agent**: When asking the Cursor agent to help with a chapter, provide context about what you're trying to achieve.

9. **Use tags for different phases**: Leverage tags to separate outline, draft, and revision phases.

10. **Research for accuracy**: Use the research tool for worldbuilding, historical accuracy, and genre conventions.
