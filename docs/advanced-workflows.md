# Advanced Novel Master Workflows

This guide covers advanced workflows for managing complex novel projects using Novel Master's tag system, multi-pass revisions, and specialized narrative techniques.

## Table of Contents

1. [Multi-Tag Workflow Strategies](#multi-tag-workflow-strategies)
2. [Character-Specific Revision Passes](#character-specific-revision-passes)
3. [Timeline Management Across Multiple Acts](#timeline-management-across-multiple-acts)
4. [Beta Feedback Integration](#beta-feedback-integration)
5. [POV Isolation and Management](#pov-isolation-and-management)
6. [Worldbuilding Consistency Passes](#worldbuilding-consistency-passes)

---

## Multi-Tag Workflow Strategies

Novel Master's tag system allows you to maintain separate, isolated task lists for different phases of your novel development. Here are proven strategies for organizing your work:

### Standard Progression: Outline → Draft → Revision

The most common workflow uses three primary tags:

1. **`outline`** - Structural planning and story arc development
2. **`draft`** - First-pass prose writing
3. **`rev-1`**, **`rev-2`**, etc. - Sequential revision passes

#### Workflow Example

```bash
# 1. Parse NRD into outline tag
novel-master parse-prd docs/nrd.txt --tag=outline --num-tasks=12

# 2. Expand chapters into scenes
novel-master expand --all --tag=outline --research

# 3. Generate manuscript files for drafting
novel-master generate --tag=draft

# 4. After drafting, create first revision tag
novel-master add-tag rev-1 --copy-from-current

# 5. Work on revisions in rev-1 tag
novel-master generate --tag=rev-1
```

### Parallel Development: Multiple Storylines

For novels with multiple POV characters or parallel storylines:

```bash
# Create separate tags for each storyline
novel-master add-tag storyline-a --description="Main protagonist's arc"
novel-master add-tag storyline-b --description="Secondary character's arc"

# Parse NRD sections into appropriate tags
novel-master parse-prd docs/nrd-storyline-a.txt --tag=storyline-a
novel-master parse-prd docs/nrd-storyline-b.txt --tag=storyline-b

# Work on each storyline independently
novel-master use-tag storyline-a
novel-master expand --id=5 --tag=storyline-a
```

### Experimental Branches

Test major structural changes without affecting your main work:

```bash
# Create experimental tag
novel-master add-tag experiment-new-ending --copy-from-current

# Make changes in experimental tag
novel-master update --from=20 --tag=experiment-new-ending \
  --prompt="New ending: protagonist sacrifices themselves"

# Compare results, then either:
# - Merge changes back to main tag
# - Delete experimental tag if unsatisfactory
novel-master delete-tag experiment-new-ending
```

---

## Character-Specific Revision Passes

For multi-POV novels, create focused revision passes for each character's arc:

### Creating Character Tags

```bash
# Create character-specific revision tags
novel-master add-tag rev-1-character-mina \
  --description="First revision focusing on Mina's POV consistency"
novel-master add-tag rev-1-character-lena \
  --description="First revision focusing on Lena's POV consistency"
```

### Character Arc Isolation Workflow

1. **Identify Character-Specific Tasks**
   ```bash
   # List all tasks to find character-specific chapters
   novel-master list --tag=draft --with-subtasks
   ```

2. **Create Focused Revision Tasks**
   - Use `add-task` to create revision tasks in the character tag
   - Focus on POV voice, character consistency, and arc development
   - Example: "Review all Mina POV chapters for voice consistency"

3. **Work Through Character Pass**
   ```bash
   novel-master use-tag rev-1-character-mina
   # Review and update tasks specific to this character
   novel-master update-task --id=5 --tag=rev-1-character-mina \
     --prompt="Tighten Mina's internal monologue, ensure voice matches established patterns"
   ```

4. **Merge Back to Main Revision**
   - After character pass is complete, merge insights back to main `rev-1` tag
   - Use `update-task` to apply character-specific improvements

### Character Tag Naming Convention

Use consistent naming: `rev-<number>-character-<name>`

Examples:
- `rev-1-character-mina`
- `rev-2-character-lena`
- `rev-1-character-protagonist`

---

## Timeline Management Across Multiple Acts

For novels spanning long time periods or multiple timelines:

### Timeline Tag Strategy

```bash
# Create timeline-specific tags
novel-master add-tag timeline-act-1 \
  --description="Act I: Arrival and discovery (Days 1-30)"
novel-master add-tag timeline-act-2 \
  --description="Act II: Confrontation (Days 31-60)"
novel-master add-tag timeline-act-3 \
  --description="Act III: Resolution (Days 61-90)"
```

### Timeline Consistency Workflow

1. **Establish Timeline in NRD**
   - Include specific dates, time jumps, and duration markers
   - Note seasonal changes, holidays, or significant events

2. **Parse with Timeline Awareness**
   ```bash
   novel-master parse-prd docs/nrd.txt --tag=timeline-act-1
   ```

3. **Add Timeline Metadata to Tasks**
   - Use task `details` field to note timeline information
   - Example: "Timeline: Day 15, three days after arrival. Season: Late autumn."

4. **Timeline Review Pass**
   ```bash
   novel-master add-tag timeline-review \
     --description="Continuity check for timeline consistency"
   
   # Create review tasks
   novel-master add-task \
     --title="Review Act I timeline consistency" \
     --tag=timeline-review \
     --details="Verify: day counts, seasonal progression, event sequencing"
   ```

5. **Use Research Tool for Timeline Validation**
   ```bash
   novel-master research \
     "Verify timeline: If Act I starts on October 1st and spans 30 days, what date does Act II begin?" \
     --id=12,13,14 \
     --tag=timeline-act-1
   ```

---

## Beta Feedback Integration

Systematically incorporate reader feedback into your revision process:

### Beta Feedback Workflow

1. **Create Beta Feedback Tag**
   ```bash
   novel-master add-tag beta-feedback-round-1 \
     --description="Reader feedback from first beta reading round"
   ```

2. **Document Feedback as Tasks**
   ```bash
   # Create tasks for each major feedback point
   novel-master add-task \
     --title="Beta feedback: Chapter 5 pacing too slow" \
     --tag=beta-feedback-round-1 \
     --details="Reader: Sarah. Issue: Chapter 5 drags, needs tension. Suggestion: Add conflict earlier in chapter."
   ```

3. **Link Feedback to Specific Chapters**
   ```bash
   # Update the relevant chapter task
   novel-master update-task \
     --id=5 \
     --tag=beta-feedback-round-1 \
     --append \
     --prompt="Beta feedback: Pacing issue. Reader suggests adding conflict in opening scene."
   ```

4. **Create Revision Tasks from Feedback**
   ```bash
   # In your main revision tag, create tasks to address feedback
   novel-master add-task \
     --title="Address beta feedback: Chapter 5 pacing" \
     --tag=rev-2 \
     --dependencies=5 \
     --details="Incorporate Sarah's feedback: add conflict in opening scene, tighten middle section"
   ```

5. **Track Feedback Resolution**
   - Mark feedback tasks as `done` when addressed
   - Use `update-subtask` to log resolution details
   - Example: "Fixed pacing by adding confrontation in opening scene. Beta reader approved."

---

## POV Isolation and Management

For novels with multiple points of view, maintain POV consistency:

### POV Tag Strategy

```bash
# Create POV-specific tags
novel-master add-tag pov-mina \
  --description="All chapters/scenes from Mina's POV"
novel-master add-tag pov-lena \
  --description="All chapters/scenes from Lena's POV"
```

### POV Consistency Workflow

1. **Identify POV Distribution**
   ```bash
   # List all tasks and identify POV
   novel-master list --tag=draft --with-subtasks
   # Manually note which chapters are which POV
   ```

2. **Create POV-Specific Review Tasks**
   ```bash
   novel-master add-task \
     --title="POV consistency review: Mina chapters" \
     --tag=pov-mina \
     --details="Review all Mina POV chapters for: voice consistency, knowledge limits, perspective accuracy"
   ```

3. **Use Tags to Filter POV Work**
   ```bash
   # Work only on Mina's chapters
   novel-master use-tag pov-mina
   novel-master list --tag=pov-mina
   ```

4. **POV Voice Documentation**
   - Use task `details` to document POV voice characteristics
   - Example: "Mina's POV: First person, present tense. Voice: Analytical, slightly anxious. Knowledge: Limited to her experience."

5. **POV Research for Authenticity**
   ```bash
   novel-master research \
     "What would a 25-year-old astrophysicist notice and think about in a space station?" \
     --id=7,8,9 \
     --tag=pov-mina \
     --save-to=7
   ```

---

## Worldbuilding Consistency Passes

Maintain consistency in your fictional world across the entire manuscript:

### Worldbuilding Tag Strategy

```bash
# Create worldbuilding-specific tags
novel-master add-tag worldbuilding-magic-system \
  --description="Review magic system consistency"
novel-master add-tag worldbuilding-technology \
  --description="Review technology and world rules consistency"
```

### Worldbuilding Review Workflow

1. **Document World Rules in NRD**
   - Create a separate worldbuilding document
   - Include: magic system rules, technology limitations, social structures

2. **Create Worldbuilding Review Tasks**
   ```bash
   novel-master add-task \
     --title="Magic system consistency review" \
     --tag=worldbuilding-magic-system \
     --details="Verify: spell costs, power limits, magic sources match established rules"
   ```

3. **Use Research Tool for Worldbuilding**
   ```bash
   novel-master research \
     "Review all instances of magic use in chapters 1-10. Verify they follow established rules: magic costs energy, limited to 3 spells per day, requires verbal component." \
     --id=1,2,3,4,5,6,7,8,9,10 \
     --tag=worldbuilding-magic-system
   ```

4. **Track Worldbuilding Issues**
   - Use `add-subtask` to document specific inconsistencies found
   - Example: "Chapter 5: Character uses 4 spells but limit is 3. Need to fix."

5. **Create Fix Tasks**
   ```bash
   novel-master add-task \
     --title="Fix magic system inconsistency: Chapter 5" \
     --tag=rev-2 \
     --dependencies=5 \
     --details="Reduce spell count from 4 to 3, or establish exception rule"
   ```

---

## Best Practices

### Tag Naming Conventions

Use consistent, descriptive tag names:
- **Phase tags**: `outline`, `draft`, `rev-1`, `rev-2`
- **Character tags**: `character-<name>`, `pov-<name>`
- **Timeline tags**: `timeline-<period>`, `act-<number>`
- **Focus tags**: `worldbuilding-<topic>`, `beta-feedback-<round>`

### Tag Organization Tips

1. **Keep Tags Focused**: Each tag should have a clear, single purpose
2. **Document Tag Purpose**: Use tag descriptions to explain what each tag is for
3. **Regular Cleanup**: Delete experimental tags that didn't work out
4. **Tag Hierarchy**: Use naming to show relationships (e.g., `rev-1-character-mina`)

### Workflow Efficiency

1. **Batch Operations**: Use `expand_all` and `update` to work on multiple tasks at once
2. **Research Integration**: Use `research` tool before major revisions to gather context
3. **Progress Tracking**: Regularly run `generate` to update word counts and progress
4. **Complexity Analysis**: Use `analyze-complexity` before expanding to identify overloaded chapters

---

## Advanced Examples

### Multi-POV Epic Fantasy Workflow

```bash
# 1. Parse main outline
novel-master parse-prd docs/nrd-main.txt --tag=outline

# 2. Create character-specific outlines
novel-master add-tag outline-character-a
novel-master add-tag outline-character-b
novel-master add-tag outline-character-c

# 3. Expand main outline
novel-master expand --all --tag=outline

# 4. Generate draft files
novel-master generate --tag=draft

# 5. After first draft, create character revision passes
novel-master add-tag rev-1-character-a --copy-from-current
novel-master add-tag rev-1-character-b --copy-from-current
novel-master add-tag rev-1-character-c --copy-from-current

# 6. Work through each character pass
novel-master use-tag rev-1-character-a
# ... work on character A revisions ...

# 7. Merge insights back to main revision
novel-master use-tag rev-1
# Apply character-specific improvements
```

### Literary Fiction Revision Workflow

```bash
# 1. Initial draft
novel-master generate --tag=draft

# 2. Thematic revision pass
novel-master add-tag rev-1-themes \
  --description="Focus on thematic coherence and development"

# 3. Prose revision pass
novel-master add-tag rev-2-prose \
  --description="Line-level prose refinement"

# 4. Final polish
novel-master add-tag rev-3-final \
  --description="Final polish and consistency check"
```

---

For more information, see:
- [Tag Management Guide](../.cursor/rules/tags.mdc)
- [Development Workflow](../.cursor/rules/dev_workflow.mdc)
- [Task Structure Documentation](./task-structure.md)

