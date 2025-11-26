Remove a dependency between chapters.

Arguments: $ARGUMENTS

Parse the chapter IDs to remove dependency relationship.

## Removing Dependencies

Removes a dependency relationship, potentially unblocking chapters.

## Argument Parsing

Parse natural language or IDs:
- "remove dependency between 5 and 3"
- "5 no longer needs 3"
- "unblock 5 from 3"
- "5 3" → remove dependency of 5 on 3

## Execution

```bash
novel-master remove-dependency --id=<chapter-id> --depends-on=<dependency-id>
```

## Pre-Removal Checks

1. **Verify dependency exists**
2. **Check impact on chapter flow**
3. **Warn if it breaks logical sequence**
4. **Show what will be unblocked**

## Smart Analysis

Before removing:
- Show why dependency might have existed
- Check if removal makes chapters executable
- Verify no critical path disruption
- Suggest alternative dependencies

## Post-Removal

After removing:
1. Show updated chapter status
2. List newly unblocked chapters
3. Update project timeline
4. Suggest next actions

## Safety Features

- Confirm if removing critical dependency
- Show chapters that become immediately actionable
- Warn about potential issues
- Keep removal history

## Example

```
/novelmaster:remove-dependency 5 from 3
→ Removed: Chapter #5 no longer depends on #3
→ Chapter #5 is now UNBLOCKED and ready to start
→ Warning: Consider if #5 still needs #2 completed first
```
