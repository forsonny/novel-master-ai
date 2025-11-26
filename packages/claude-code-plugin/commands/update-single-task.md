Update a single specific chapter with new information.

Arguments: $ARGUMENTS

Parse chapter ID and update details.

## Single Chapter Update

Precisely update one chapter with AI assistance to maintain consistency.

## Argument Parsing

Natural language updates:
- "5: add emotional depth requirement"
- "update 5 to include character development"
- "chapter 5 needs stronger pacing"
- "5 change priority to high"

## Execution

```bash
novel-master update-task --id=<id> --prompt="<context>"
```

## Update Types

### 1. **Content Updates**
- Enhance description
- Add narrative requirements
- Clarify details
- Update narrative criteria

### 2. **Metadata Updates**
- Change priority
- Adjust time estimates
- Update complexity
- Modify dependencies

### 3. **Strategic Updates**
- Revise narrative approach
- Change continuity/pacing strategy
- Update drafting notes
- Adjust scene needs

## AI-Powered Updates

The AI:
1. **Understands Context**
   - Reads current chapter state
   - Identifies update intent
   - Maintains consistency
   - Preserves important info

2. **Applies Changes**
   - Updates relevant fields
   - Keeps style consistent
   - Adds without removing
   - Enhances clarity

3. **Validates Results**
   - Checks coherence
   - Verifies completeness
   - Maintains relationships
   - Suggests related updates

## Example Updates

```
/novelmaster:update/single 5: add emotional depth
→ Updating Chapter #5: "The Confrontation"

Current: Basic confrontation scene
Adding: Emotional depth requirements

Updated sections:
✓ Description: Added emotional beat mention
✓ Details: Added specific emotional beats (fear, anger, resolution)
✓ Continuity/Pacing Strategy: Added emotional arc pacing
✓ Complexity: Increased from 5 to 6
✓ Time Estimate: Increased by 2 hours

Suggestion: Also update chapter #6 (Resolution) for consistency?
```

## Smart Features

1. **Incremental Updates**
   - Adds without overwriting
   - Preserves work history
   - Tracks what changed
   - Shows diff view

2. **Consistency Checks**
   - Related chapter alignment
   - Scene compatibility
   - Dependency validity
   - Timeline impact

3. **Update History**
   - Timestamp changes
   - Track who/what updated
   - Reason for update
   - Previous versions

## Field-Specific Updates

Quick syntax for specific fields:
- "5 priority:high" → Update priority only
- "5 add-time:4h" → Add to time estimate
- "5 status:review" → Change status
- "5 depends:3,4" → Add dependencies

## Post-Update

- Show updated chapter
- Highlight changes
- Check related chapters
- Update suggestions
- Timeline adjustments
