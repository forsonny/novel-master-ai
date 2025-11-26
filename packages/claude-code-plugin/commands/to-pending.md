Set a chapter's status to pending.

Arguments: $ARGUMENTS (chapter ID)

## Setting Chapter to Pending

This moves a chapter back to the pending state, useful for:
- Resetting erroneously started chapters
- Deferring work that was prematurely begun
- Reorganizing story arc priorities

## Execution

```bash
novel-master set-status --id=$ARGUMENTS --status=pending
```

## Validation

Before setting to pending:
- Warn if chapter is currently in-progress
- Check if this will block other chapters
- Suggest documenting why it's being reset
- Preserve any work already done

## Smart Actions

After setting to pending:
- Update story arc planning if needed
- Notify about freed resources
- Suggest priority reassessment
- Log the status change with context
