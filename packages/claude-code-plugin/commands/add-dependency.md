Add a dependency between chapters.

Arguments: $ARGUMENTS

Parse the chapter IDs to establish dependency relationship.

## Adding Dependencies

Creates a dependency where one chapter must be completed before another can start.

## Argument Parsing

Parse natural language or IDs:
- "make 5 depend on 3" → chapter 5 depends on chapter 3
- "5 needs 3" → chapter 5 depends on chapter 3
- "5 3" → chapter 5 depends on chapter 3
- "5 after 3" → chapter 5 depends on chapter 3

## Execution

```bash
novel-master add-dependency --id=<chapter-id> --depends-on=<dependency-id>
```

## Validation

Before adding:
1. **Verify both chapters exist**
2. **Check for circular dependencies**
3. **Ensure dependency makes logical sense**
4. **Warn if creating complex chains**

## Smart Features

- Detect if dependency already exists
- Suggest related dependencies
- Show impact on chapter flow
- Update chapter priorities if needed

## Post-Addition

After adding dependency:
1. Show updated dependency graph
2. Identify any newly blocked chapters
3. Suggest chapter order changes
4. Update project timeline

## Example Flows

```
/novelmaster:add-dependency 5 needs 3
→ Chapter #5 now depends on Chapter #3
→ Chapter #5 is now blocked until #3 completes
→ Suggested: Also consider if #5 needs #4
```
