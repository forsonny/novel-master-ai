Expand all pending chapters that need scenes.

## Bulk Chapter Expansion

Intelligently expands all chapters that would benefit from breakdown.

## Execution

```bash
novel-master expand --all
```

## Smart Selection

Only expands chapters that:
- Are marked as pending
- Have high complexity (>5)
- Lack existing scenes
- Would benefit from breakdown

## Expansion Process

1. **Analysis Phase**
   - Identify expansion candidates
   - Group related chapters
   - Plan expansion strategy

2. **Batch Processing**
   - Expand chapters in logical order
   - Maintain consistency
   - Preserve relationships
   - Optimize for parallelism

3. **Quality Control**
   - Ensure scene quality
   - Avoid over-decomposition
   - Maintain chapter coherence
   - Update dependencies

## Options

- Add `force` to expand all regardless of complexity
- Add `research` for enhanced AI analysis

## Results

After bulk expansion:
- Summary of chapters expanded
- New scene count
- Updated complexity metrics
- Suggested chapter order
