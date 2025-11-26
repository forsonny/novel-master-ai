Clear all scenes from a specific chapter.

Arguments: $ARGUMENTS (chapter ID)

Remove all scenes from a parent chapter at once.

## Clearing Scenes

Bulk removal of all scenes from a parent chapter.

## Execution

```bash
novel-master clear-subtasks --id=<chapter-id>
```

## Pre-Clear Analysis

1. **Scene Summary**
   - Number of scenes
   - Completion status of each
   - Work already done
   - Dependencies affected

2. **Impact Assessment**
   - Data that will be lost
   - Dependencies to be removed
   - Effect on project timeline
   - Parent chapter implications

## Confirmation Required

```
Clear Scenes Confirmation
━━━━━━━━━━━━━━━━━━━━━━━━━
Parent Chapter: #5 "The Confrontation"
Scenes to remove: 4
- #5.1 "Opening tension" (done)
- #5.2 "Rising conflict" (in-progress)
- #5.3 "Climax scene" (pending)
- #5.4 "Resolution" (pending)

⚠️  This will permanently delete all scene data
Continue? (y/n)
```

## Smart Features

- Option to convert to standalone chapters
- Backup scene data before clearing
- Preserve completed work history
- Update parent chapter appropriately

## Process

1. List all scenes for confirmation
2. Check for in-progress work
3. Remove all scenes
4. Update parent chapter
5. Clean up dependencies

## Alternative Options

Suggest alternatives:
- Convert important scenes to chapters
- Keep completed scenes
- Archive instead of delete
- Export scene data first

## Post-Clear

- Show updated parent chapter
- Recalculate time estimates
- Update chapter complexity
- Suggest next steps

## Example

```
/novelmaster:clear-subtasks 5
→ Found 4 scenes to remove
→ Warning: Scene #5.2 is in-progress
→ Cleared all scenes from chapter #5
→ Updated parent chapter estimates
→ Suggestion: Consider re-expanding with better breakdown
```
