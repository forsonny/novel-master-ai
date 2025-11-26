Remove a chapter permanently from the project.

Arguments: $ARGUMENTS (chapter ID)

Delete a chapter and handle all its relationships properly.

## Chapter Removal

Permanently removes a chapter while maintaining project integrity.

## Argument Parsing

- "remove chapter 5"
- "delete 5"
- "5" → remove chapter 5
- Can include "-y" for auto-confirm

## Execution

```bash
novel-master remove-task --id=<id> [-y]
```

## Pre-Removal Analysis

1. **Chapter Details**
   - Current status
   - Work completed
   - Time invested
   - Associated data

2. **Relationship Check**
   - Chapters that depend on this
   - Dependencies this chapter has
   - Scenes that will be removed
   - Blocking implications

3. **Impact Assessment**
   ```
   Chapter Removal Impact
   ━━━━━━━━━━━━━━━━━━
   Chapter: #5 "The Confrontation" (in-progress)
   Status: 60% complete (~8 hours work)
   
   Will affect:
   - 3 chapters depend on this (will be blocked)
   - Has 4 scenes (will be deleted)
   - Part of critical story path
   
   ⚠️  This action cannot be undone
   ```

## Smart Warnings

- Warn if chapter is in-progress
- Show dependent chapters that will be blocked
- Highlight if part of critical story path
- Note any completed work being lost

## Removal Process

1. Show comprehensive impact
2. Require confirmation (unless -y)
3. Update dependent chapter references
4. Remove chapter and scenes
5. Clean up orphaned dependencies
6. Log removal with timestamp

## Alternative Actions

Suggest before deletion:
- Mark as cancelled instead
- Convert to documentation
- Archive chapter data
- Transfer work to another chapter

## Post-Removal

- List affected chapters
- Show broken dependencies
- Update project statistics
- Suggest dependency fixes
- Recalculate timeline

## Example Flows

```
/novelmaster:remove-task 5
→ Chapter #5 is in-progress with 8 hours logged
→ 3 other chapters depend on this
→ Suggestion: Mark as cancelled instead?
Remove anyway? (y/n)

/novelmaster:remove-task 5 -y
→ Removed: Chapter #5 and 4 scenes
→ Updated: 3 chapter dependencies
→ Warning: Chapters #7, #8, #9 now have missing dependency
→ Run /novelmaster:fix-dependencies to resolve
```

## Safety Features

- Confirmation required
- Impact preview
- Removal logging
- Suggest alternatives
- No cascade delete of dependents
