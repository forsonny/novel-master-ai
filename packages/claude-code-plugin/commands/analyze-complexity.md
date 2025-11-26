Analyze narrative complexity and generate expansion recommendations.

Arguments: $ARGUMENTS

Perform deep analysis of chapter complexity across the project.

## Complexity Analysis

Uses AI to analyze chapters and recommend which ones need breakdown.

## Execution Options

```bash
novel-master analyze-complexity [--research] [--threshold=5]
```

## Analysis Parameters

- `--research` → Use research AI for deeper analysis
- `--threshold=5` → Only flag chapters above complexity 5
- Default: Analyze all pending chapters

## Analysis Process

### 1. **Chapter Evaluation**
For each chapter, AI evaluates:
- Narrative complexity
- Time requirements
- Dependency complexity
- Risk factors
- Knowledge requirements

### 2. **Complexity Scoring**
Assigns score 1-10 based on:
- Pacing difficulty
- Character development challenges
- Continuity requirements
- Unknown factors
- Story arc risk

### 3. **Recommendations**
For complex chapters:
- Suggest expansion approach
- Recommend scene breakdown
- Identify risk areas
- Propose mitigation strategies

## Smart Analysis Features

1. **Pattern Recognition**
   - Similar chapter comparisons
   - Historical complexity accuracy
   - Writing velocity consideration
   - Genre-specific factors

2. **Contextual Factors**
   - Writer expertise
   - Available resources
   - Timeline constraints
   - Story criticality

3. **Risk Assessment**
   - Narrative risks
   - Timeline risks
   - Dependency risks
   - Knowledge gaps

## Output Format

```
Chapter Complexity Analysis Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

High Complexity Chapters (>7):
📍 #5 "The Climactic Confrontation" - Score: 9/10
   Factors: Multiple POVs, complex emotional arcs, timeline coordination
   Recommendation: Expand into 5-7 scenes
   Risks: Pacing, character consistency

📍 #12 "The Final Revelation" - Score: 8/10
   Factors: Plot thread resolution, character arc conclusions, emotional payoff
   Recommendation: Expand into 4-5 scenes
   Risks: Pacing, reader satisfaction

Medium Complexity Chapters (5-7):
📍 #23 "Character Development Arc" - Score: 6/10
   Consider expansion if timeline tight

Low Complexity Chapters (<5):
✅ 15 chapters - No expansion needed

Summary:
- Expand immediately: 2 chapters
- Consider expanding: 5 chapters
- Keep as-is: 15 chapters
```

## Actionable Output

For each high-complexity chapter:
1. Complexity score with reasoning
2. Specific expansion suggestions
3. Risk mitigation approaches
4. Recommended scene structure

## Integration

Results are:
- Saved to `.novelmaster/reports/complexity-analysis.md`
- Used by expand command
- Inform story arc planning
- Guide resource allocation

## Next Steps

After analysis:
```
/novelmaster:expand 5    # Expand specific chapter
/novelmaster:expand-all  # Expand all recommended
/novelmaster:complexity-report  # View detailed report
```
