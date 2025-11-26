Mark a chapter as completed.

Arguments: $ARGUMENTS (chapter ID)

## Completing a Chapter

This command validates chapter completion and updates project state intelligently.

## Pre-Completion Checks

1. Verify continuity/pacing strategy was followed
2. Check if all scenes are complete
3. Validate narrative requirements met
4. Ensure prose is committed

## Execution

```bash
novel-master set-status --id=$ARGUMENTS --status=done
```

## Post-Completion Actions

1. **Update Story Dependencies**
   - Identify newly unblocked chapters
   - Update story arc progress
   - Recalculate manuscript timeline

2. **Documentation**
   - Generate completion summary
   - Update CLAUDE.md with narrative learnings
   - Log drafting approach

3. **Next Steps**
   - Show newly available chapters
   - Suggest logical next chapter
   - Update writing velocity metrics

## Celebration & Learning

- Show impact of completion
- Display unblocked work
- Recognize achievement
- Capture narrative lessons learned
