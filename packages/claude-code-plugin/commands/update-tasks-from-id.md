Update multiple chapters starting from a specific ID.

Arguments: $ARGUMENTS

Parse starting chapter ID and update context.

## Bulk Chapter Updates

Update multiple related chapters based on new requirements or context changes.

## Argument Parsing

- "from 5: add emotional depth requirements"
- "5 onwards: update character arcs"
- "starting at 5: change to use new POV"

## Execution

```bash
novel-master update --from=<id> --prompt="<context>"
```

## Update Process

### 1. **Chapter Selection**
Starting from specified ID:
- Include the chapter itself
- Include all dependent chapters
- Include related scenes
- Smart boundary detection

### 2. **Context Application**
AI analyzes the update context and:
- Identifies what needs changing
- Maintains consistency
- Preserves completed work
- Updates related information

### 3. **Intelligent Updates**
- Modify descriptions appropriately
- Update continuity/pacing strategies
- Adjust time estimates
- Revise dependencies if needed

## Smart Features

1. **Scope Detection**
   - Find natural chapter groupings
   - Identify related story arcs
   - Stop at logical boundaries
   - Avoid over-updating

2. **Consistency Maintenance**
   - Keep naming conventions
   - Preserve relationships
   - Update cross-references
   - Maintain narrative flow

3. **Change Preview**
   ```
   Bulk Update Preview
   ━━━━━━━━━━━━━━━━━━
   Starting from: Chapter #5
   Chapters to update: 8 chapters + 12 scenes
   
   Context: "add emotional depth requirements"
   
   Changes will include:
   - Add emotional beat sections to descriptions
   - Update continuity/pacing strategies for emotional arcs
   - Add emotional development scenes where needed
   - Adjust time estimates (+20% average)
   
   Continue? (y/n)
   ```

## Example Updates

```
/novelmaster:update/from-id 5: change POV to first person
→ Analyzing impact starting from chapter #5
→ Found 6 related chapters to update
→ Updates will maintain consistency
→ Preview changes? (y/n)

Applied updates:
✓ Chapter #5: Updated POV references
✓ Chapter #6: Changed narrative approach
✓ Chapter #7: Updated character voice notes
✓ Chapter #8: Revised continuity strategy
✓ Chapter #9: Updated drafting steps
✓ Chapter #12: Changed character development notes
```

## Safety Features

- Preview all changes
- Selective confirmation
- Rollback capability
- Change logging
- Validation checks

## Post-Update

- Summary of changes
- Consistency verification
- Suggest review chapters
- Update timeline if needed
