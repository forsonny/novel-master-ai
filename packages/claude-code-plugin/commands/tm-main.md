# Novel Master Command Reference

Comprehensive command structure for Novel Master integration with Claude Code.

## Command Organization

Commands are organized hierarchically to match Novel Master's CLI structure while providing enhanced Claude Code integration.

## Project Setup & Configuration

### `/novelmaster:init`
- `init-project` - Initialize new project (handles NRD files intelligently)
- `init-project-quick` - Quick setup with auto-confirmation (-y flag)

### `/novelmaster:models`
- `view-models` - View current AI model configuration
- `setup-models` - Interactive model configuration
- `set-main` - Set primary generation model
- `set-research` - Set research model
- `set-fallback` - Set fallback model

## Story Arc Generation

### `/novelmaster:parse-prd`
- `parse-prd` - Generate chapters from NRD document (accepts NRD files)
- `parse-prd-with-research` - Enhanced parsing with research mode

### `/novelmaster:generate`
- `generate-tasks` - Create individual chapter files from tasks.json

## Chapter/Scene Management

### `/novelmaster:list`
- `list-tasks` - Smart listing with natural language filters
- `list-tasks-with-subtasks` - Include scenes in hierarchical view
- `list-tasks-by-status` - Filter by specific status

### `/novelmaster:set-status`
- `to-pending` - Reset chapter to pending
- `to-in-progress` - Start working on chapter
- `to-done` - Mark chapter complete
- `to-review` - Submit for review
- `to-deferred` - Defer chapter
- `to-cancelled` - Cancel chapter

### `/novelmaster:sync-readme`
- `sync-readme` - Export chapters to README.md with formatting

### `/novelmaster:update`
- `update-task` - Update chapters with natural language
- `update-tasks-from-id` - Update multiple chapters from a starting point
- `update-single-task` - Update specific chapter

### `/novelmaster:add-task`
- `add-task` - Add new chapter with AI assistance

### `/novelmaster:remove-task`
- `remove-task` - Remove chapter with confirmation

## Scene Management

### `/novelmaster:add-subtask`
- `add-subtask` - Add new scene to parent chapter
- `convert-task-to-subtask` - Convert existing chapter to scene

### `/novelmaster:remove-subtask`
- `remove-subtask` - Remove scene (with optional conversion)

### `/novelmaster:clear-subtasks`
- `clear-subtasks` - Clear scenes from specific chapter
- `clear-all-subtasks` - Clear all scenes globally

## Narrative Analysis & Breakdown

### `/novelmaster:analyze-complexity`
- `analyze-complexity` - Analyze and generate expansion recommendations

### `/novelmaster:complexity-report`
- `complexity-report` - Display complexity analysis report

### `/novelmaster:expand`
- `expand-task` - Break down specific chapter
- `expand-all-tasks` - Expand all eligible chapters
- `with-research` - Enhanced expansion

## Chapter Navigation

### `/novelmaster:next`
- `next-task` - Intelligent next chapter recommendation

### `/novelmaster:show`
- `show-task` - Display detailed chapter information

### `/novelmaster:status`
- `project-status` - Comprehensive project dashboard

## Story Dependency Management

### `/novelmaster:add-dependency`
- `add-dependency` - Add chapter dependency

### `/novelmaster:remove-dependency`
- `remove-dependency` - Remove chapter dependency

### `/novelmaster:validate-dependencies`
- `validate-dependencies` - Check for dependency issues

### `/novelmaster:fix-dependencies`
- `fix-dependencies` - Automatically fix dependency problems

## Workflows & Automation

### `/novelmaster:workflows`
- `smart-workflow` - Context-aware intelligent workflow execution
- `command-pipeline` - Chain multiple commands together
- `auto-implement-tasks` - Advanced auto-drafting with prose generation

## Utilities

### `/novelmaster:utils`
- `analyze-project` - Deep project analysis and insights

### `/novelmaster:setup`
- `install-novelmaster` - Comprehensive installation guide
- `quick-install-novelmaster` - One-line global installation

## Usage Patterns

### Natural Language
Most commands accept natural language arguments:
```
/novelmaster:add-task create Chapter 5: The Revelation
/novelmaster:update mark all Act 2 chapters as high priority
/novelmaster:list show blocked chapters
```

### ID-Based Commands
Commands requiring IDs intelligently parse from $ARGUMENTS:
```
/novelmaster:show 45
/novelmaster:expand 23
/novelmaster:set-status/to-done 67
```

### Smart Defaults
Commands provide intelligent defaults and suggestions based on context.
