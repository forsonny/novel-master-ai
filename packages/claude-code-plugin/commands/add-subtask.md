Add a scene to a parent chapter.

Arguments: $ARGUMENTS

Parse arguments to create a new scene or convert existing chapter.

## Adding Scenes

Creates scenes to break down complex parent chapters into manageable pieces.

## Argument Parsing

Flexible natural language:
- "add scene to 5: opening confrontation"
- "break down 5 with: setup, conflict, resolution"
- "scene for 5: emotional climax"
- "5: character revelation" → adds scene to chapter 5

## Execution Modes

### 1. Create New Scene
```bash
novel-master add-subtask --parent=<id> --title="<title>" --description="<desc>"
```

### 2. Convert Existing Chapter
```bash
novel-master add-subtask --parent=<id> --task-id=<existing-id>
```

## Smart Features

1. **Automatic Scene Generation**
   - If title contains "and" or commas, create multiple
   - Suggest common scene patterns
   - Inherit parent's context

2. **Intelligent Defaults**
   - Priority based on parent
   - Appropriate time estimates
   - Logical dependencies between scenes

3. **Validation**
   - Check parent chapter complexity
   - Warn if too many scenes
   - Ensure scene makes sense

## Creation Process

1. Parse parent chapter context
2. Generate scene with ID like "5.1"
3. Set appropriate defaults
4. Link to parent chapter
5. Update parent's time estimate

## Example Flows

```
/novelmaster:add-subtask to 5: opening confrontation scene
→ Created scene #5.1: "opening confrontation scene"
→ Parent chapter #5 now has 1 scene
→ Suggested next scenes: rising tension, climax, resolution

/novelmaster:add-subtask 5: setup, conflict, resolution
→ Created 3 scenes:
  #5.1: setup
  #5.2: conflict  
  #5.3: resolution
```

## Post-Creation

- Show updated chapter hierarchy
- Suggest logical next scenes
- Update complexity estimates
- Recommend scene order
