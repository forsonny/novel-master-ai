Parse an NRD document to generate chapters.

Arguments: $ARGUMENTS (NRD file path)

## Intelligent NRD Parsing

Analyzes your Novel Requirements Document and generates a complete chapter breakdown.

## Execution

```bash
novel-master parse-prd --input=$ARGUMENTS
```

## Parsing Process

1. **Document Analysis**
   - Extract key narrative requirements
   - Identify story arcs and character development
   - Detect story dependencies
   - Estimate narrative complexity

2. **Chapter Generation**
   - Create 10-15 chapters by default
   - Include drafting chapters
   - Add revision chapters
   - Include character development chapters
   - Set logical story dependencies

3. **Smart Enhancements**
   - Group related story arcs
   - Set appropriate priorities
   - Add narrative requirements
   - Include continuity/pacing strategies

## Options

Parse arguments for modifiers:
- Number after filename → `--num-tasks` (target chapter count)
- `research` → Use research mode for worldbuilding
- `comprehensive` → Generate more chapters

## Post-Generation

After parsing:
1. Display chapter summary
2. Show story dependency graph
3. Suggest chapter expansion for complex arcs
4. Recommend story arc planning
