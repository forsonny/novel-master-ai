Set a chapter's status to review.

Arguments: $ARGUMENTS (chapter ID)

## Marking Chapter for Review

This status indicates drafting is complete but needs verification before final approval.

## When to Use Review Status

- Prose complete but needs continuity check
- Drafting done but needs pacing validation
- Scene written but needs character consistency review
- Chapter complete but needs beta reader feedback

## Execution

```bash
novel-master set-status --id=$ARGUMENTS --status=review
```

## Review Preparation

When setting to review:
1. **Generate Review Checklist**
   - Link to manuscript file if applicable
   - Highlight key narrative changes
   - Note areas needing attention
   - Include continuity check results

2. **Documentation**
   - Update chapter with review notes
   - Link relevant manuscript files
   - Specify reviewers if known

3. **Smart Actions**
   - Create review reminders
   - Track review duration
   - Suggest reviewers based on expertise
   - Prepare revision plan if needed
