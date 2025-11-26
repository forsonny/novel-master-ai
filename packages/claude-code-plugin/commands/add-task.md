Add new chapters with intelligent parsing and context awareness.

Arguments: $ARGUMENTS

## Smart Chapter Addition

Parse natural language to create well-structured chapters.

### 1. **Input Understanding**

I'll intelligently parse your request:
- Natural language → Structured chapter
- Detect priority from keywords (urgent, critical, important)
- Infer dependencies from context
- Suggest complexity based on description
- Determine chapter type (action, character development, worldbuilding, transition)

### 2. **Smart Parsing Examples**

**"Add urgent chapter for the climactic confrontation"**
→ Title: The Climactic Confrontation
→ Priority: high
→ Type: action
→ Suggested complexity: high

**"Create chapter for character backstory after chapter 23 is done"**
→ Title: Character Backstory
→ Dependencies: [23]
→ Type: character development
→ Priority: medium

**"Need to develop worldbuilding chapter - depends on 12 and 15, high complexity"**
→ Title: Worldbuilding Chapter
→ Dependencies: [12, 15]
→ Complexity: high
→ Type: worldbuilding

### 3. **Context Enhancement**

Based on current project state:
- Suggest related existing chapters
- Warn about potential conflicts
- Recommend dependencies
- Propose scenes if complex

### 4. **Interactive Refinement**

```yaml
Chapter Preview:
─────────────
Title: [Extracted title]
Priority: [Inferred priority]
Dependencies: [Detected dependencies]
Complexity: [Estimated complexity]

Suggestions:
- Similar chapter #34 exists, consider as dependency?
- This seems complex, break into scenes?
- Chapters #45-47 work on same story arc
```

### 5. **Validation & Creation**

Before creating:
- Validate dependencies exist
- Check for duplicates
- Ensure logical ordering
- Verify chapter completeness

### 6. **Smart Defaults**

Intelligent defaults based on:
- Chapter type patterns
- Story conventions
- Historical data
- Current story arc/phase

Result: High-quality chapters from minimal input.
