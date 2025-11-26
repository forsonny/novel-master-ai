Cancel a chapter permanently.

Arguments: $ARGUMENTS (chapter ID)

## Cancelling a Chapter

This status indicates a chapter is no longer needed and won't be completed.

## Valid Reasons for Cancellation

- Story requirements changed
- Chapter deprecated
- Duplicate of another chapter
- Strategic pivot
- Narrative approach invalidated

## Pre-Cancellation Checks

1. Confirm no critical dependencies
2. Check for partial drafting
3. Verify cancellation rationale
4. Document lessons learned

## Execution

```bash
novel-master set-status --id=$ARGUMENTS --status=cancelled
```

## Cancellation Impact

When cancelling:
1. **Dependency Updates**
   - Notify dependent chapters
   - Update project scope
   - Recalculate timelines

2. **Clean-up Actions**
   - Remove related branches
   - Archive any work done
   - Update documentation
   - Close related issues

3. **Learning Capture**
   - Document why cancelled
   - Note what was learned
   - Update estimation models
   - Prevent future duplicates

## Historical Preservation

- Keep for reference
- Tag with cancellation reason
- Link to replacement if any
- Maintain audit trail
