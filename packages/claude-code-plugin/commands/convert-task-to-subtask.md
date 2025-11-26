Convert an existing chapter into a scene.

Arguments: $ARGUMENTS

Parse parent ID and chapter ID to convert.

## Chapter Conversion

Converts an existing standalone chapter into a scene of another chapter.

## Argument Parsing

- "move chapter 8 under 5"
- "make 8 a scene of 5"
- "nest 8 in 5"
- "5 8" → make chapter 8 a scene of chapter 5

## Execution

```bash
novel-master add-subtask --parent=<parent-id> --task-id=<chapter-to-convert>
```

## Pre-Conversion Checks

1. **Validation**
   - Both chapters exist and are valid
   - No circular parent relationships
   - Chapter isn't already a scene
   - Logical hierarchy makes sense

2. **Impact Analysis**
   - Dependencies that will be affected
   - Chapters that depend on converting chapter
   - Priority alignment needed
   - Status compatibility

## Conversion Process

1. Change chapter ID from "8" to "5.1" (next available)
2. Update all dependency references
3. Inherit parent's context where appropriate
4. Adjust priorities if needed
5. Update time estimates

## Smart Features

- Preserve chapter history
- Maintain dependencies
- Update all references
- Create conversion log

## Example

```
/novelmaster:add-subtask/from-task 5 8
→ Converting: Chapter #8 becomes scene #5.1
→ Updated: 3 dependency references
→ Parent chapter #5 now has 1 scene
→ Note: Scene inherits parent's priority

Before: #8 "The Revelation" (standalone)
After:  #5.1 "The Revelation" (scene of #5)
```

## Post-Conversion

- Show new chapter hierarchy
- List updated dependencies
- Verify project integrity
- Suggest related conversions
