Start working on a chapter by setting its status to in-progress.

Arguments: $ARGUMENTS (chapter ID)

## Starting Work on Chapter

This command does more than just change status - it prepares your environment for productive work.

## Pre-Start Checks

1. Verify dependencies are met
2. Check if another chapter is already in-progress
3. Ensure chapter details are complete
4. Validate continuity/pacing strategy exists

## Execution

```bash
novel-master set-status --id=$ARGUMENTS --status=in-progress
```

## Environment Setup

After setting to in-progress:
1. Create/checkout appropriate git branch
2. Open relevant manuscript files
3. Set up continuity checkers if applicable
4. Display chapter details and narrative criteria
5. Show similar completed chapters for reference

## Smart Suggestions

- Estimated completion time based on complexity
- Related manuscript files from similar chapters
- Potential blockers to watch for
- Recommended first steps
