Execute a pipeline of commands based on a specification.

Arguments: $ARGUMENTS

## Command Pipeline Execution

Parse pipeline specification from arguments. Supported formats:

### Simple Pipeline
`init → expand-all → story-arc-plan`

### Conditional Pipeline  
`status → if:pending>10 → story-arc-plan → else → next`

### Iterative Pipeline
`for:pending-chapters → expand → complexity-check`

### Smart Pipeline Patterns

**1. Project Setup Pipeline**
```
init [nrd] → 
expand-all → 
complexity-report → 
story-arc-plan → 
show first-arc
```

**2. Daily Writing Pipeline**
```
standup →
if:in-progress → continue →
else → next → start
```

**3. Chapter Completion Pipeline**
```
complete [id] →
git-commit →
if:blocked-chapters-freed → show-freed →
next
```

**4. Quality Check Pipeline**
```
list in-progress →
for:each → check-idle-time →
if:idle>1day → prompt-update
```

### Pipeline Features

**Variables**
- Store results: `status → $count=pending-count`
- Use in conditions: `if:$count>10`
- Pass between commands: `expand $high-priority-chapters`

**Error Handling**
- On failure: `try:complete → catch:show-blockers`
- Skip on error: `optional:continuity-check`
- Retry logic: `retry:3:commit`

**Parallel Execution**
- Parallel branches: `[analyze | continuity-check | pacing-check]`
- Join results: `parallel → join:report`

### Execution Flow

1. Parse pipeline specification
2. Validate command sequence
3. Execute with state passing
4. Handle conditions and loops
5. Aggregate results
6. Show summary

This enables complex workflows like:
`parse-prd → expand-all → filter:complex>70 → assign:senior → story-arc-plan:weighted`
