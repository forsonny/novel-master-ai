Update chapters with intelligent field detection and bulk operations.

Arguments: $ARGUMENTS

## Intelligent Chapter Updates

Parse arguments to determine update intent and execute smartly.

### 1. **Natural Language Processing**

Understand update requests like:
- "mark 23 as done" → Update status to done
- "increase priority of 45" → Set priority to high
- "add dependency on 12 to chapter 34" → Add dependency
- "chapters 20-25 need review" → Bulk status update
- "all Act 2 chapters high priority" → Pattern-based update

### 2. **Smart Field Detection**

Automatically detect what to update:
- Status keywords: done, complete, start, pause, review
- Priority changes: urgent, high, low, deprioritize
- Dependency updates: depends on, blocks, after
- Assignment: assign to, owner, responsible
- Time: estimate, spent, deadline

### 3. **Bulk Operations**

Support for multiple chapter updates:
```
Examples:
- "complete chapters 12, 15, 18"
- "all pending Act 2 chapters to in-progress"
- "increase priority for chapters blocking 45"
- "defer all worldbuilding chapters"
```

### 4. **Contextual Validation**

Before updating, check:
- Status transitions are valid
- Dependencies don't create cycles
- Priority changes make sense
- Bulk updates won't break project flow

Show preview:
```
Update Preview:
─────────────────
Chapters to update: #23, #24, #25
Change: status → in-progress
Impact: Will unblock chapters #30, #31
Warning: Chapter #24 has unmet dependencies
```

### 5. **Smart Suggestions**

Based on update:
- Completing chapter? → Show newly unblocked chapters
- Changing priority? → Show impact on story arc
- Adding dependency? → Check for conflicts
- Bulk update? → Show summary of changes

### 6. **Workflow Integration**

After updates:
- Auto-update dependent chapter states
- Trigger status recalculation
- Update story arc/milestone progress
- Log changes with context

Result: Flexible, intelligent chapter updates with safety checks.
