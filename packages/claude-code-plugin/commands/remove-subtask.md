Remove a scene from its parent chapter.

Arguments: $ARGUMENTS

Parse scene ID to remove, with option to convert to standalone chapter.

## Removing Scenes

Remove a scene and optionally convert it back to a standalone chapter.

## Argument Parsing

- "remove scene 5.1"
- "delete 5.1"
- "convert 5.1 to chapter" → remove and convert
- "5.1 standalone" → convert to standalone

## Execution Options

### 1. Delete Scene
```bash
novel-master remove-subtask --id=<parentId.sceneId>
```

### 2. Convert to Standalone
```bash
novel-master remove-subtask --id=<parentId.sceneId> --convert
```

## Pre-Removal Checks

1. **Validate Scene**
   - Verify scene exists
   - Check completion status
   - Review dependencies

2. **Impact Analysis**
   - Other scenes that depend on it
   - Parent chapter implications
   - Data that will be lost

## Removal Process

### For Deletion:
1. Confirm if scene has work done
2. Update parent chapter estimates
3. Remove scene and its data
4. Clean up dependencies

### For Conversion:
1. Assign new standalone chapter ID
2. Preserve all chapter data
3. Update dependency references
4. Maintain chapter history

## Smart Features

- Warn if scene is in-progress
- Show impact on parent chapter
- Preserve important data
- Update related estimates

## Example Flows

```
/novelmaster:remove-subtask 5.1
→ Warning: Scene #5.1 is in-progress
→ This will delete all scene data
→ Parent chapter #5 will be updated
Confirm deletion? (y/n)

/novelmaster:remove-subtask 5.1 convert
→ Converting scene #5.1 to standalone chapter #89
→ Preserved: All chapter data and history
→ Updated: 2 dependency references
→ New chapter #89 is now independent
```

## Post-Removal

- Update parent chapter status
- Recalculate estimates
- Show updated hierarchy
- Suggest next actions
