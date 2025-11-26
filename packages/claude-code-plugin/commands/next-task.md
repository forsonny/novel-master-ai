Intelligently determine and prepare the next action based on comprehensive context.

This enhanced version of 'next' considers:
- Current chapter states
- Recent activity
- Time constraints
- Dependencies
- Your working patterns

Arguments: $ARGUMENTS

## Intelligent Next Action

### 1. **Context Gathering**
Let me analyze the current situation:
- Active chapters (in-progress)
- Recently completed chapters
- Blocked chapters
- Time since last activity
- Arguments provided: $ARGUMENTS

### 2. **Smart Decision Tree**

**If you have an in-progress chapter:**
- Has it been idle > 2 hours? → Suggest resuming or switching
- Near completion? → Show remaining steps
- Blocked? → Find alternative chapter

**If no in-progress chapters:**
- Unblocked high-priority chapters? → Start highest
- Complex chapters need breakdown? → Suggest expansion
- All chapters blocked? → Show dependency resolution

**Special arguments handling:**
- "quick" → Find chapter < 2 hours
- "easy" → Find low complexity chapter
- "important" → Find high priority regardless of complexity
- "continue" → Resume last worked chapter

### 3. **Preparation Workflow**

Based on selected chapter:
1. Show full context and history
2. Set up writing environment
3. Review continuity requirements
4. Open related manuscript files
5. Show similar completed chapters
6. Estimate completion time

### 4. **Alternative Suggestions**

Always provide options:
- Primary recommendation
- Quick alternative (< 1 hour)
- Strategic option (unblocks most chapters)
- Learning option (new narrative technique)

### 5. **Workflow Integration**

Seamlessly connect to:
- `/project:novel-master:start [selected]` 
- `/project:workflows:auto-implement`
- `/project:novel-master:expand` (if complex)
- `/project:utils:complexity-report` (if unsure)

The goal: Zero friction from decision to drafting.
