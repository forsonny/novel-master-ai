Validate all chapter dependencies for issues.

## Dependency Validation

Comprehensive check for dependency problems across the entire project.

## Execution

```bash
novel-master validate-dependencies
```

## Validation Checks

1. **Circular Dependencies**
   - A depends on B, B depends on A
   - Complex circular chains
   - Self-dependencies

2. **Missing Dependencies**
   - References to non-existent chapters
   - Deleted chapter references
   - Invalid chapter IDs

3. **Logical Issues**
   - Completed chapters depending on pending
   - Cancelled chapters in dependency chains
   - Impossible sequences

4. **Complexity Warnings**
   - Over-complex dependency chains
   - Too many dependencies per chapter
   - Bottleneck chapters

## Smart Analysis

The validation provides:
- Visual dependency graph
- Critical path analysis
- Bottleneck identification
- Suggested optimizations

## Report Format

```
Dependency Validation Report
━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ No circular dependencies found
⚠️  2 warnings found:
   - Chapter #23 has 7 dependencies (consider breaking down)
   - Chapter #45 blocks 5 other chapters (potential bottleneck)
❌ 1 error found:
   - Chapter #67 depends on deleted chapter #66

Critical Path: #1 → #5 → #23 → #45 → #50 (15 days)
```

## Actionable Output

For each issue found:
- Clear description
- Impact assessment
- Suggested fix
- Command to resolve

## Next Steps

After validation:
- Run `/novelmaster:fix-dependencies` to auto-fix
- Manually adjust problematic dependencies
- Rerun to verify fixes
