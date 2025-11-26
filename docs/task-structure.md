# Task Structure

Tasks in Novel Master follow a specific format designed to provide comprehensive information for both humans and AI assistants.

## Task Fields in tasks.json

Tasks in tasks.json have the following structure:

- `id`: Unique identifier for the task (Example: `1`)
- `title`: Brief, descriptive title of the task (Example: `"Chapter 1: The Arrival"`)
- `description`: Concise description of what the task involves (Example: `"Introduce the protagonist in their ordinary world, establish the setting, and hint at the coming conflict."`)
- `status`: Current state of the task (Example: `"pending"`, `"done"`, `"deferred"`)
- `dependencies`: IDs of tasks that must be completed before this task (Example: `[1, 2]`)
  - Dependencies are displayed with status indicators (✅ for completed, ⏱️ for pending)
  - This helps quickly identify which prerequisite chapters/scenes are blocking work
- `priority`: Importance level of the task (Example: `"high"`, `"medium"`, `"low"`)
- `details`: In-depth scene development instructions (Example: `"POV: First person, Protagonist. Setting: Small coastal town, present day. Emotional beat: Contentment turning to unease. Research hooks: Coastal town architecture, fishing industry."`)
- `testStrategy`: Continuity/pacing validation approach (Example: `"Review timeline consistency, verify POV voice matches established character, check pacing against target word count."`)
- `subtasks`: List of smaller, more specific scenes/beats that make up the main task (Example: `[{"id": 1, "title": "Opening: Protagonist's morning routine", ...}]`)

## Task File Format

Individual task files follow this format:

```
# Task ID: <id>
# Title: <title>
# Status: <status>
# Dependencies: <comma-separated list of dependency IDs>
# Priority: <priority>
# Description: <brief description>
# Details:
<detailed scene development notes>

# Test Strategy:
<continuity/pacing validation approach>
```

## Features in Detail

### Analyzing Task Complexity

The `analyze-complexity` command:

- Analyzes each task using AI to assess its narrative complexity (pacing, POV load, plot density) on a scale of 1-10
- Recommends optimal number of subtasks (scenes/beats) based on configured DEFAULT_SUBTASKS
- Generates tailored prompts for expanding each chapter into scenes
- Creates a comprehensive JSON report with ready-to-use commands
- Saves the report to .novelmaster/reports/task-complexity-report.json by default

The generated report contains:

- Complexity analysis for each task (pacing, plot density, POV load scored 1-10)
- Recommended number of subtasks (scenes/beats) based on complexity
- AI-generated expansion prompts customized for each chapter
- Ready-to-run expansion commands directly within each task analysis

### Viewing Complexity Report

The `complexity-report` command:

- Displays a formatted, easy-to-read version of the complexity analysis report
- Shows tasks organized by complexity score (highest to lowest)
- Provides complexity distribution statistics (low, medium, high)
- Highlights tasks recommended for expansion based on threshold score
- Includes ready-to-use expansion commands for each complex task
- If no report exists, offers to generate one on the spot

### Smart Task Expansion

The `expand` command automatically checks for and uses the complexity report:

When a complexity report exists:

- Tasks are automatically expanded using the recommended subtask count and prompts
- When expanding all tasks, they're processed in order of complexity (highest first)
- Research-backed generation is preserved from the complexity analysis
- You can still override recommendations with explicit command-line options

Example workflow:

```bash
# Generate the complexity analysis report with research capabilities
novel-master analyze-complexity --research

# Review the report in a readable format
novel-master complexity-report

# Expand tasks using the optimized recommendations
novel-master expand --id=8
# or expand all tasks
novel-master expand --all
```

### Finding the Next Task

The `next` command:

- Identifies tasks that are pending/in-progress and have all dependencies satisfied
- Prioritizes tasks by priority level, dependency count, and task ID
- Displays comprehensive information about the selected task:
  - Basic task details (ID, title, priority, dependencies)
  - Scene development details
  - Subtasks/scenes (if they exist)
- Provides contextual suggested actions:
  - Command to mark the task as in-progress
  - Command to mark the task as done
  - Commands for working with subtasks/scenes

### Viewing Specific Task Details

The `show` command:

- Displays comprehensive details about a specific task or subtask
- Shows task status, priority, dependencies, and detailed scene development notes
- For parent tasks (chapters), displays all subtasks (scenes) and their status
- For subtasks (scenes), shows parent task (chapter) relationship
- Provides contextual action suggestions based on the task's state
- Works with both regular tasks and subtasks (using the format taskId.subtaskId)

## Best Practices for AI-Driven Novel Development

1. **Start with a detailed NRD**: The more detailed your Novel Requirements Document (NRD), the better the generated story structure will be.

2. **Review generated tasks**: After parsing the NRD, review the tasks to ensure they make sense and have appropriate narrative dependencies.

3. **Analyze task complexity**: Use the complexity analysis feature to identify which chapters should be broken down into scenes/beats.

4. **Follow the dependency chain**: Always respect task dependencies - the Cursor agent will help with this to maintain proper story flow.

5. **Update as you go**: If your story direction diverges from the plan, use the update command to keep future tasks aligned with your current narrative approach.

6. **Break down complex tasks**: Use the expand command to break down complex chapters into manageable scenes/beats.

7. **Regenerate manuscript files**: After any updates to tasks.json, regenerate the manuscript files to keep them in sync.

8. **Communicate context to the agent**: When asking the Cursor agent to help with a task, provide context about what you're trying to achieve in the story.

9. **Validate dependencies**: Periodically run the validate-dependencies command to check for invalid or circular dependencies in your story structure.

# Task Structure Documentation

Novel Master uses a structured JSON format to organize and manage tasks. As of version 0.16.2, Novel Master introduces **Tagged Task Lists** for multi-context task management while maintaining full backward compatibility.

## Tagged Task Lists System

Novel Master now organizes tasks into separate contexts called **tags**. This enables working across multiple contexts such as different branches, environments, or project phases without conflicts.

### Data Structure Overview

**Tagged Format (Current)**:

```json
{
  "outline": {
    "tasks": [
      { "id": 1, "title": "Chapter 1: The Arrival", "status": "pending", ... }
    ]
  },
  "draft": {
    "tasks": [
      { "id": 1, "title": "Chapter 1: The Arrival", "status": "in-progress", ... }
    ]
  }
}
```

**Legacy Format (Automatically Migrated)**:

```json
{
  "tasks": [
    { "id": 1, "title": "Chapter 1: The Arrival", "status": "pending", ... }
  ]
}
```

### Tag-based Task Lists (v0.17+) and Compatibility

- **Seamless Migration**: Existing `tasks.json` files are automatically migrated to use a "master" tag
- **Zero Disruption**: All existing commands continue to work exactly as before
- **Backward Compatibility**: Existing workflows remain unchanged
- **Silent Process**: Migration happens transparently on first use with a friendly notification

## Core Task Properties

Each task within a tag context contains the following properties:

### Required Properties

- **`id`** (number): Unique identifier within the tag context

  ```json
  "id": 1
  ```

- **`title`** (string): Brief, descriptive title

  ```json
  "title": "Chapter 1: The Arrival"
  ```

- **`description`** (string): Concise summary of what the task involves

  ```json
  "description": "Introduce the protagonist in their ordinary world, establish the setting, and hint at the coming conflict"
  ```

- **`status`** (string): Current state of the task
  - Valid values: `"pending"`, `"in-progress"`, `"done"`, `"review"`, `"deferred"`, `"cancelled"`
  ```json
  "status": "pending"
  ```

### Optional Properties

- **`dependencies`** (array): IDs of prerequisite tasks that must be completed first

  ```json
  "dependencies": [2, 3]
  ```

- **`priority`** (string): Importance level

  - Valid values: `"high"`, `"medium"`, `"low"`
  - Default: `"medium"`

  ```json
  "priority": "high"
  ```

- **`details`** (string): In-depth scene development instructions

  ```json
  "details": "POV: First person, Protagonist. Setting: Small coastal town, present day. Emotional beat: Contentment turning to unease. Research hooks: Coastal town architecture, fishing industry."
  ```

- **`testStrategy`** (string): Continuity/pacing validation approach

  ```json
  "testStrategy": "Review timeline consistency, verify POV voice matches established character, check pacing against target word count"
  ```

- **`subtasks`** (array): List of smaller, more specific scenes/beats
  ```json
  "subtasks": [
    {
      "id": 1,
      "title": "Opening: Protagonist's morning routine",
      "description": "Set up OAuth configuration",
      "status": "pending",
      "dependencies": [],
      "details": "Configure GitHub OAuth app and store credentials"
    }
  ]
  ```

## Subtask Structure

Subtasks follow a similar structure to main tasks but with some differences:

### Subtask Properties

- **`id`** (number): Unique identifier within the parent task
- **`title`** (string): Brief, descriptive title
- **`description`** (string): Concise summary of the subtask
- **`status`** (string): Current state (same values as main tasks)
- **`dependencies`** (array): Can reference other subtasks or main task IDs
- **`details`** (string): Implementation instructions and notes

### Subtask Example

```json
{
  "id": 2,
  "title": "Handle OAuth callback",
  "description": "Process the OAuth callback and extract user data",
  "status": "pending",
  "dependencies": [1],
  "details": "Parse callback parameters, exchange code for token, fetch user profile"
}
```

## Complete Example

Here's a complete example showing the tagged task structure:

```json
{
  "master": {
    "tasks": [
      {
        "id": 1,
        "title": "Setup Express Server",
        "description": "Initialize and configure Express.js server with middleware",
        "status": "done",
        "dependencies": [],
        "priority": "high",
        "details": "Create Express app with CORS, body parser, and error handling",
        "testStrategy": "Start server and verify health check endpoint responds",
        "subtasks": [
          {
            "id": 1,
            "title": "Initialize npm project",
            "description": "Set up package.json and install dependencies",
            "status": "done",
            "dependencies": [],
            "details": "Run npm init, install express, cors, body-parser"
          },
          {
            "id": 2,
            "title": "Configure middleware",
            "description": "Set up CORS and body parsing middleware",
            "status": "done",
            "dependencies": [1],
            "details": "Add app.use() calls for cors() and express.json()"
          }
        ]
      },
      {
        "id": 2,
        "title": "Implement user authentication",
        "description": "Create secure authentication system",
        "status": "pending",
        "dependencies": [1],
        "priority": "high",
        "details": "Use JWT tokens for session management",
        "testStrategy": "Test login/logout flow with valid and invalid credentials",
        "subtasks": []
      }
    ]
  },
  "feature-auth": {
    "tasks": [
      {
        "id": 1,
        "title": "OAuth Integration",
        "description": "Add OAuth authentication support",
        "status": "pending",
        "dependencies": [],
        "priority": "medium",
        "details": "Integrate with GitHub OAuth for user authentication",
        "testStrategy": "Test OAuth flow with GitHub account",
        "subtasks": []
      }
    ]
  }
}
```

## Tag Context Management

### Current Tag Resolution

Novel Master automatically determines the current tag context based on:

1. **State Configuration**: Current tag stored in `.novelmaster/state.json`
2. **Default Fallback**: "master" tag when no context is specified
3. **Future Enhancement**: Git branch-based tag switching (Part 2)

### Tag Isolation

- **Context Separation**: Tasks in different tags are completely isolated
- **Independent Numbering**: Each tag has its own task ID sequence starting from 1
- **Parallel Development**: Multiple team members can work on separate tags without conflicts

## Data Validation

Novel Master validates the following aspects of task data:

### Required Validations

- **Unique IDs**: Task IDs must be unique within each tag context
- **Valid Status**: Status values must be from the allowed set
- **Dependency References**: Dependencies must reference existing task IDs within the same tag
- **Subtask IDs**: Subtask IDs must be unique within their parent task

### Optional Validations

- **Circular Dependencies**: System detects and prevents circular dependency chains
- **Priority Values**: Priority must be one of the allowed values if specified
- **Data Types**: All properties must match their expected data types

## File Generation

Novel Master can generate individual markdown files for each task based on the JSON structure. These files include:

- **Task Overview**: ID, title, status, dependencies
- **Tag Context**: Which tag the task belongs to
- **Implementation Details**: Full task details and test strategy
- **Subtask Breakdown**: All subtasks with their current status
- **Dependency Status**: Visual indicators showing which dependencies are complete

## Migration Process

When Novel Master encounters a legacy format `tasks.json` file:

1. **Detection**: Automatically detects `{"tasks": [...]}` format
2. **Transformation**: Converts to `{"master": {"tasks": [...]}}` format
3. **Configuration**: Updates `.novelmaster/config.json` with tagged system settings
4. **State Creation**: Creates `.novelmaster/state.json` for tag management
5. **Notification**: Shows one-time friendly notice about the new system
6. **Preservation**: All existing task data is preserved exactly as-is

## Best Practices

### Task Organization

- **Logical Grouping**: Use tags to group related tasks (e.g., by feature, branch, or milestone)
- **Clear Titles**: Use descriptive titles that explain the task's purpose
- **Proper Dependencies**: Define dependencies to ensure correct execution order
- **Detailed Instructions**: Include sufficient detail in the `details` field for implementation

### Tag Management

- **Meaningful Names**: Use descriptive tag names that reflect their purpose
- **Consistent Naming**: Establish naming conventions for tags (e.g., branch names, feature names)
- **Context Switching**: Be aware of which tag context you're working in
- **Isolation Benefits**: Leverage tag isolation to prevent merge conflicts

### Subtask Design

- **Granular Tasks**: Break down complex tasks into manageable subtasks
- **Clear Dependencies**: Define subtask dependencies to show implementation order
- **Implementation Notes**: Use subtask details to track progress and decisions
- **Status Tracking**: Keep subtask status updated as work progresses
