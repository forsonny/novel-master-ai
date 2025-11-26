# Novel Automation Workflow

This document describes the complete end-to-end pipeline for AI agents to autonomously produce a finished novel using Novel Master. This workflow enables agents to move from a Novel Requirements Document (NRD) to a complete, polished manuscript with minimal human intervention.

## Overview

The automation loop consists of 10 main phases that can be executed sequentially or iteratively:

1. **NRD Input & Validation**
2. **NRD Parsing → Story Structure**
3. **Complexity Analysis**
4. **Chapter Expansion → Scene Breakdown**
5. **Worldbuilding Research**
6. **Manuscript Generation**
7. **Drafting & Iteration**
8. **Revision Management**
9. **Quality Control & Validation**
10. **Final Compilation**

---

## Phase 1: NRD Input & Validation

### Goal
Establish a complete Novel Requirements Document that serves as the foundation for all subsequent work, validated against required sections.

### Agent Actions
1. **Create or locate NRD file:**
   - Check for existing NRD in `.novelmaster/docs/nrd.txt` or `.novelmaster/docs/nrd.md`
   - If missing, prompt user or create from scratch using templates in `.novelmaster/templates/`
   - Use `example_nrd.md` for standard novels or `example_nrd_epic.md` for multi-arc epics

2. **Validate NRD completeness:**
   ```bash
   # Via MCP
   validate_nrd({
     projectRoot: "<project_root>",
     nrdPath: ".novelmaster/docs/nrd.txt",  # Optional, defaults to standard path
     output: ".novelmaster/reports/nrd-validation.json"  # Optional
   })
   ```
   
   - **Required sections checklist:**
     - Premise (core story concept)
     - Act structure (three-act or alternative structure)
     - Character roster (main characters with basic details)
     - POV plan (point of view strategy)
     - World rules (setting, magic system, technology, etc.)
     - Themes (central themes and motifs)
   
   - **If incomplete:**
     - Use `research` tool to gather missing information for each missing section
     - Update NRD file with research findings
     - Re-validate until all required sections are present

3. **Review validation report:**
   - Check `.novelmaster/reports/nrd-validation.json` for:
     - `complete: boolean` - Whether all required sections present
     - `missingSections: string[]` - List of missing sections
     - `recommendations: string[]` - Suggestions for completion
     - `sectionsFound: object` - Details of found sections

### Phase Gate
**Phase 1 complete when:** NRD validation report shows `complete: true` and all required sections are present.

### Tools Used
- `validate_nrd` MCP tool (for structured validation)
- File read/write operations
- `research` tool (for gathering missing information)

### Output
- Complete NRD file at `.novelmaster/docs/nrd.txt` or `.novelmaster/docs/nrd.md`
- Validation report at `.novelmaster/reports/nrd-validation.json`

---

## Phase 2: NRD Parsing → Story Structure

### Goal
Convert the NRD into a structured task hierarchy representing story arcs and chapters.

### Agent Actions
1. **Parse NRD into tasks:**
   ```bash
   # Via MCP
   parse_prd({
     input: ".novelmaster/docs/nrd.txt",
     projectRoot: "<project_root>",
     tag: "outline",
     numTasks: 0,  # Let Novel Master determine optimal count
     research: true  # Enable research mode for better structure
   })
   ```

2. **Verify task generation:**
   - Check that tasks.json was created/updated in `.novelmaster/tasks/tasks.json`
   - Verify tasks represent logical story units (acts, arcs, or chapters)
   - Ensure tasks have narrative metadata (POV hints, emotional beats, etc.)

3. **Review and adjust:**
   - If task count seems off, re-run with explicit `numTasks` parameter
   - Use `update_task` to refine any tasks that don't match NRD intent

### Tools Used
- `parse_prd` MCP tool
- `update_task` (if adjustments needed)

### Phase Gate
**Phase 2 complete when:** `tasks.json` exists with at least one task and all tasks have narrative metadata (POV hints, emotional beats, tension levels).

### Output
- `tasks.json` with top-level tasks representing story structure
- Tasks tagged with `outline` context
- Each task includes narrative metadata (POV hints, emotional beats, tension levels)

---

## Phase 3: Complexity Analysis

### Goal
Assess narrative complexity to identify chapters that need expansion and pacing issues.

### Agent Actions
1. **Run complexity analysis:**
   ```bash
   # Via MCP
   analyze_project_complexity({
     projectRoot: "<project_root>",
     tag: "outline",
     useResearch: true,
     file: ".novelmaster/reports/task-complexity-report.json"
   })
   ```

2. **Review complexity report:**
   - Identify chapters with high complexity (may need splitting)
   - Identify chapters with low complexity (may need expansion)
   - Note pacing recommendations
   - Note POV distribution issues

3. **Plan expansion strategy:**
   - Decide which chapters need scene-level breakdown
   - Determine optimal scene count per chapter based on complexity scores

### Tools Used
- `analyze_project_complexity` MCP tool
- File read operations (to review report)

### Phase Gate
**Phase 3 complete when:** Complexity report exists and expansion strategy is documented (in task details or notes).

### Output
- Complexity report at `.novelmaster/reports/task-complexity-report.json`
- Expansion plan (mental model or notes)

---

## Phase 4: Chapter Expansion → Scene Breakdown

### Goal
Break down chapters into detailed scenes/beats with POV, tension, and emotional guidance.

### Agent Actions
1. **Expand chapters into scenes:**
   
   **Option A: Expand all chapters**
   ```bash
   expand_all({
     projectRoot: "<project_root>",
     tag: "outline",
     useResearch: true,
     subtaskCount: 0  # Let Novel Master determine optimal scene count
   })
   ```
   
   **Option B: Expand specific chapters**
   ```bash
   expand_task({
     projectRoot: "<project_root>",
     tag: "outline",
     taskId: 5,  # Chapter ID
     subtaskCount: 6,  # Target scene count
     useResearch: true
   })
   ```

2. **Verify scene breakdown:**
   - Check that subtasks have narrative metadata (POV, tension level, emotional beat)
   - Ensure scenes have clear goals and outcomes
   - Verify scene dependencies make narrative sense

3. **Refine scenes as needed:**
   - Use `update_subtask` to adjust scene details
   - Use `add_subtask` if additional scenes are needed
   - Use `remove_subtask` if scenes are redundant

### Tools Used
- `expand_all` or `expand_task` MCP tools
- `update_subtask`, `add_subtask`, `remove_subtask` (for refinement)

### Phase Gate
**Phase 4 complete when:** All chapters have subtasks and all subtasks have narrative metadata (POV, tension level, emotional beat, timeline).

### Output
- Expanded tasks.json with scene-level subtasks
- All subtasks include narrative metadata (POV, tension level, emotional beat, timeline)

---

## Phase 5: Worldbuilding Research

### Goal
Gather research and worldbuilding information to inform drafting.

### Agent Actions
1. **Identify research needs:**
   - Review NRD for research topics
   - Review tasks for research hooks mentioned in details
   - Identify gaps in world knowledge

2. **Conduct research:**
   ```bash
   research({
     projectRoot: "<project_root>",
     query: "How do solar sails work in space?",
     taskIds: "5,7.2",  # Relevant chapter/scene IDs
     filePaths: ".novelmaster/docs/worldbuilding.md",
     saveToFile: true  # Save to .novelmaster/docs/research/
   })
   ```

3. **Integrate research:**
   - Update task details with research findings
   - Save research notes to `.novelmaster/docs/research/` for reference
   - Update worldbuilding documentation if needed

### Tools Used
- `research` MCP tool
- `update_task` / `update_subtask` (to integrate findings)

### Phase Gate
**Phase 5 complete when:** All identified research needs are addressed (optional phase, can be skipped if no research needed).

### Output
- Research notes in `.novelmaster/docs/research/`
- Updated task details with research insights

---

## Phase 6: Manuscript Generation

### Goal
Create chapter/scene markdown files from the task structure.

### Agent Actions
1. **Generate manuscript files:**
   ```bash
   generate({
     projectRoot: "<project_root>",
     tag: "draft",
     file: ".novelmaster/tasks/tasks.json",
     output: ".novelmaster/manuscript",
     compile: true,  # Create compiled manuscript
     format: "md"  # Markdown format
   })
   ```

2. **Verify generation:**
   - Check that chapter files exist in `.novelmaster/manuscript/draft/chapters/`
   - Verify compiled manuscript exists at `.novelmaster/manuscript/draft/compiled/manuscript-draft.md`
   - Check manuscript summary at `.novelmaster/manuscript/draft/manuscript-summary.json`

3. **Review structure:**
   - Ensure chapter files have proper structure
   - Verify scene sections are marked correctly
   - Check that draft sections are ready for writing

### Tools Used
- `generate` MCP tool

### Phase Gate
**Phase 6 complete when:** All chapter files exist and manuscript summary shows structure is ready for drafting.

### Output
- Chapter markdown files in `.novelmaster/manuscript/draft/chapters/` (e.g., `chapter-001.md`)
- Compiled manuscript at `.novelmaster/manuscript/draft/compiled/manuscript-draft.md`
- Manuscript summary at `.novelmaster/manuscript/draft/manuscript-summary.json` (word counts, targets, completion)

---

## Phase 7: Drafting & Iteration

### Goal
Write the actual prose for each scene, tracking progress and maintaining consistency with quality validation.

### Agent Actions
1. **Draft scenes systematically:**
   - Iterate through scenes in dependency order
   - **Check scene dependencies before writing:**
     ```bash
     # Ensure parent scene (5.2) is done before writing 5.3
     const parentScene = get_task({
       projectRoot: "<project_root>",
       id: "5.2",
       tag: "draft"
     });
     if (parentScene.status !== "done") {
       # Write parent scene first
     }
     ```
   
   - **Write scene prose:**
     ```bash
     update_subtask({
       projectRoot: "<project_root>",
       tag: "draft",
       id: "5.3",  # Scene ID
       prompt: "Write the scene prose following the scene details. Focus on [POV, tension, emotional beat]. Reference previous scenes for continuity.",
       append: true  # Append to existing content
     })
     ```

2. **Validate scene quality before marking done:**
   ```bash
   validate_scene_quality({
     projectRoot: "<project_root>",
     id: "5.3",
     tag: "draft"
   })
   ```
   
   - **Quality checks:**
     - Word count within target range (±20%)
     - Continuity with previous scenes (character consistency, timeline coherence)
     - Pacing appropriate for scene position
     - POV consistency maintained
     - Emotional beat achieved
   
   - **If quality meets criteria:**
     ```bash
     set_task_status({
       projectRoot: "<project_root>",
       tag: "draft",
       id: "5.3",
       status: "done"
     });
     ```
   
   - **If quality issues found:**
     ```bash
     update_subtask({
       projectRoot: "<project_root>",
       tag: "draft",
       id: "5.3",
       prompt: `Revise scene to address: ${sceneQuality.issues.join(", ")}`,
       append: false
     });
     ```

3. **Track progress:**
   - Use `set_task_status` to mark scenes as `in-progress`, `done`
   - Periodically run `generate` to sync manuscript files (every N scenes or after major milestones)
   - Review manuscript summary for word count progress

4. **Maintain consistency:**
   - **Continuity checking:** Use `research` tool for systematic continuity validation:
     ```bash
     research({
       projectRoot: "<project_root>",
       query: "Check continuity: Character Mina's eye color and height in scenes 3.1, 3.5, 5.2",
       taskIds: "3.1,3.5,5.2",
       saveToFile: true
     })
     ```
   - Reference previous scenes when writing new ones
   - Update character/world notes as story evolves

5. **Handle writer's block:**
   - Re-read previous scenes for context
   - Use `research` for inspiration on similar scenes
   - Re-analyze scene goals using `analyze_project_complexity`
   - Consider splitting scene or adjusting scene goals

6. **Progress tracking:**
   - Track word count progress via manuscript summary
   - Adjust targets if needed
   - Monitor cumulative word count

### Done Criteria
Scene is "done" when:
- Word count within target range
- Continuity validated with previous scenes
- Pacing appropriate
- POV consistent
- Emotional beat achieved

### Phase Gate
**Phase 7 complete when:** All scenes have status "done" and manuscript summary shows all word count targets met.

### Tools Used
- `update_subtask` (for writing prose)
- `get_task` (for dependency checking)
- `validate_scene_quality` (for quality validation)
- `set_task_status` (for progress tracking)
- `generate` (to sync manuscript files)
- `research` (for continuity and inspiration)

### Output
- Drafted prose in chapter files
- Updated task statuses
- Progress tracked in manuscript summary
- Quality validation reports

---

## Phase 8: Revision Management

### Goal
Manage multiple revision passes using tags to isolate different revision contexts, with conflict resolution and improvement tracking.

### Agent Actions
1. **Create revision tag (idempotent):**
   ```bash
   # If tag exists, operation succeeds without error (no-op or returns existing tag)
   add_tag({
     projectRoot: "<project_root>",
     tag: "rev-1",
     copyFrom: "draft"
   })
   ```

2. **Execute revisions:**
   ```bash
   update_task({
     projectRoot: "<project_root>",
     tag: "rev-1",
     id: 5,
     prompt: "Revise chapter for character consistency and pacing"
   })
   ```

3. **Track revision decisions:**
   ```bash
   update_task({
     projectRoot: "<project_root>",
     tag: "rev-1",
     id: 5,
     prompt: "Log revision: Changed Mina's motivation in scene 5.3 to align with character arc. Reason: Beta feedback indicated inconsistency.",
     append: true
   })
   ```

4. **Beta feedback integration with conflict resolution:**
   ```bash
   add_tag({
     projectRoot: "<project_root>",
     tag: "beta-feedback",
     copyFrom: "rev-1"
   })
   ```
   
   - **Handle conflicting feedback:**
     - If feedback conflicts (e.g., "too slow" vs "too fast"):
       1. Analyze feedback context and source credibility
       2. Check manuscript metrics (pacing analysis)
       3. Make decision based on majority or most credible source
       4. Document decision in task details
   
   ```bash
   update_task({
     projectRoot: "<project_root>",
     tag: "beta-feedback",
     id: 5,
     prompt: "Feedback conflict resolved: 2 readers said 'too slow', 1 said 'too fast'. Pacing analysis shows chapter is 15% slower than target. Decision: Tighten pacing by 10%. Reason: Majority feedback + metrics alignment.",
     append: true
   })
   ```

5. **Create focused revision tags:**
   - Use tags like `rev-1-character-mina` for specific passes
   - Isolate revision work by aspect (character, pacing, world-building)

6. **Validate revision improvements:**
   ```bash
   # Compare revision tag with previous tag
   compare_tags({
     projectRoot: "<project_root>",
     tag1: "draft",
     tag2: "rev-1",
     metric: "pacing"  # or "continuity", "word_count", "quality"
   })
   ```
   
   - If improvement < threshold, continue revising
   - Track improvement percentage and quality scores

### Conflict Resolution Strategy
- If feedback conflicts, analyze context and source credibility
- Check manuscript metrics (pacing, word count, complexity) for objective validation
- Make decision based on majority feedback or most credible source
- Document decision and reasoning in task details

### Phase Gate
**Phase 8 complete when:** All revision passes are done and revision decisions are documented.

### Tools Used
- `add_tag`, `copy_tag` (for revision contexts)
- `update_task`, `update_subtask` (for making changes)
- `compare_tags` (for improvement validation)
- `generate` (to create revision manuscript files)

### Output
- Multiple tagged revision contexts
- Revised manuscript files
- Feedback tracking with conflict resolution
- Improvement metrics

---

## Phase 9: Quality Control & Validation

### Goal
Perform comprehensive quality validation before final compilation to ensure manuscript meets all quality standards.

### Agent Actions
1. **Continuity validation:**
   ```bash
   research({
     projectRoot: "<project_root>",
     query: "Validate continuity: Check all character descriptions, timeline consistency, world rules across all chapters",
     taskIds: "all",
     saveToFile: true
   })
   ```

2. **Pacing validation:**
   ```bash
   analyze_project_complexity({
     projectRoot: "<project_root>",
     tag: "rev-1",  # or latest revision tag
     useResearch: false
   })
   ```

3. **NRD compliance check:**
   ```bash
   validate_nrd_compliance({
     projectRoot: "<project_root>",
     nrdPath: ".novelmaster/docs/nrd.txt",
     tag: "rev-1"
   })
   ```
   
   - Returns compliance report with:
     - `compliant: boolean` - Whether manuscript complies with NRD
     - `deviations: object[]` - List of deviations from NRD
     - `complianceScore: number` - Overall compliance score (0-100)
     - `recommendations: string[]` - Suggestions for alignment
   
   - **If compliance issues found:**
     ```bash
     for (const deviation of compliance.deviations) {
       await update_task({
         projectRoot: "<project_root>",
         tag: "rev-1",
         id: deviation.taskId,
         prompt: `Fix NRD compliance issue: ${deviation.issue}`,
         append: false
       });
     }
     ```

4. **Word count and structure validation:**
   ```bash
   const manuscriptSummary = read_manuscript_summary({
     projectRoot: "<project_root>",
     tag: "rev-1"
   });
   ```
   
   - Validate:
     - Word count within target range
     - All chapters complete
     - Structure matches NRD

5. **Address quality issues:**
   - Fix any continuity issues found
   - Adjust pacing if needed
   - Resolve NRD compliance deviations
   - Adjust word count if outside target range

### Phase Gate
**Phase 9 complete when:** All quality checks pass (continuity, pacing, NRD compliance ≥ 90%, word count, structure).

### Tools Used
- `research` (for continuity validation)
- `analyze_project_complexity` (for pacing validation)
- `validate_nrd_compliance` (for NRD compliance check)
- `read_manuscript_summary` (for word count and structure validation)
- `update_task` / `update_subtask` (to address issues)

### Output
- Quality validation reports
- Compliance report
- Updated manuscript (if issues addressed)

---

## Phase 10: Final Compilation

### Goal
Produce the final, polished manuscript ready for export or publication.

### Agent Actions
1. **Final manuscript generation:**
   ```bash
   generate({
     projectRoot: "<project_root>",
     tag: "release",  # Final tag
     compile: true,
     format: "md"  # or "txt" for plain text
   })
   ```

2. **Final validation:**
   ```bash
   const finalSummary = read_manuscript_summary({
     projectRoot: "<project_root>",
     tag: "release"
   });
   ```
   
   - Verify:
     - Word count meets target
     - All chapters complete
     - Quality metrics within acceptable ranges

3. **Export preparation:**
   - Review compiled manuscript for formatting
   - Ensure all chapters are complete
   - Verify manuscript summary shows completion

### Phase Gate
**Phase 10 complete when:** Final manuscript exists and all quality metrics are within acceptable ranges.

### Tools Used
- `generate` (final compilation)
- `read_manuscript_summary` (final validation)

### Output
- Final compiled manuscript at `.novelmaster/manuscript/release/compiled/manuscript-release.md`
- Complete manuscript summary

---

## Idempotency Guarantees

All MCP tools are designed to be **idempotent** and **re-runnable** for partial failure recovery. This means running the same operation multiple times with the same inputs produces the same result without side effects.

### Tool-Specific Idempotency

1. **`parse_prd` idempotency:**
   - Re-running with same inputs produces same task structure (deterministic)
   - `force: true` overwrites existing tasks safely
   - `append: true` adds to existing tasks without duplication
   - Implementation: Checks existing tasks before parsing, merges intelligently

2. **`expand_task` / `expand_all` idempotency:**
   - Re-running expands only missing subtasks (if `force: false`)
   - `force: true` clears existing subtasks before re-expansion
   - Implementation: Checks subtask existence, preserves IDs when possible

3. **`generate` idempotency:**
   - Re-running merges with existing draft content
   - Preserves user-written prose between `<!-- novel-master:draft:start -->` and `<!-- novel-master:draft:end -->` markers
   - Updates metadata sections without overwriting drafts
   - **Edge cases:**
     - **Corrupted markers:** If markers are missing or malformed, attempts to extract draft content from task details
     - **Manual edits outside markers:** Preserves manual edits, merges with auto-generated content
     - **Multiple draft versions:** Uses latest draft version, preserves previous in backup
     - **Marker conflicts:** Validates marker structure, repairs if possible, extracts content if not
   - Implementation: Extracts draft content before regeneration, re-inserts after, validates marker integrity

4. **`analyze_project_complexity` idempotency:**
   - Re-running updates existing report file
   - Can be run incrementally on specific tags
   - Implementation: Reads existing report, merges new analysis

5. **`update_task` / `update_subtask` idempotency:**
   - `append: true` appends to existing content
   - `append: false` replaces content (still idempotent - same input = same output)
   - Auto-regenerates manuscript if `autoRegenerateManuscript` config enabled
   - Implementation: Checks for existing content, handles append vs replace

6. **`research` idempotency:**
   - Re-running with same query returns cached results if available
   - Saves to same file paths (overwrites safely)
   - Implementation: Checks for existing research files, caches query results

7. **`add_tag` / `copy_tag` idempotency:**
   - Re-running with same tag name: if tag exists, operation succeeds without error (no-op or returns existing tag)
   - `copyFrom` operation: if source tag doesn't exist, operation fails gracefully
   - Implementation: Checks tag existence before creating, returns existing tag if present

8. **`set_task_status` idempotency:**
   - Re-running with same status is idempotent (same input = same output)
   - Status transitions are validated (can't go from "done" to "pending" without explicit override)
   - Implementation: Checks current status, only updates if different

9. **`remove_subtask` / `add_subtask` idempotency:**
   - `remove_subtask`: Re-running after removal is idempotent (no error if already removed)
   - `add_subtask`: Re-running with same subtask ID checks for existence, updates if exists, creates if not
   - Implementation: Checks subtask existence before operations

10. **`move_task` idempotency:**
    - Re-running move operation is idempotent (task already in target tag)
    - Implementation: Checks task location before moving

## Recovery Patterns

### Partial Failure Recovery

All MCP tools support recovery from partial failures:

1. **Parse failures:**
   - Re-run `parse_prd` with `force: true` to overwrite
   - Or use `append: true` to add to existing tasks
   - Check `tasks.json` for partial results before re-running

2. **Expansion failures:**
   - Re-run `expand_task` for specific chapters
   - Use `force: true` if expansion went wrong, then re-expand
   - Check subtask count matches expectations

3. **Generation failures:**
   - Re-run `generate` - it will merge with existing draft content
   - Draft sections between `<!-- novel-master:draft:start -->` markers are preserved
   - Check manuscript summary for completion status

4. **Drafting interruptions:**
   - Resume by checking `next_task` to see where to continue
   - Use `generate` to refresh manuscript files
   - Review manuscript summary for progress
   - Use `list` command to see task statuses

5. **Revision conflicts:**
   - Use `copy_tag` to create backup before major revisions
   - Use focused tags to isolate revision work
   - Compare tags using `list` with different tag contexts

6. **Corrupted tasks.json:**
   - Recovery: Restore from backup (`.novelmaster/tasks/tasks.json.backup`)
   - If no backup: Attempt to repair using JSON validation
   - If repair fails: Re-parse from NRD using `parse_prd` with `force: true`
   - Implementation: Auto-backup tasks.json before major operations

7. **Partial manuscript generation:**
   - Re-run `generate` - it will complete missing files
   - Check manuscript summary for completion status
   - Regenerate specific chapters if needed using tag filtering

8. **Version conflicts (manual edits vs auto-regeneration):**
   - Manual edits outside draft markers are preserved during regeneration
   - If conflicts detected: Agent should prompt for resolution or use merge strategy
   - Implementation: Detects manual edits, preserves them, merges with auto-generated content

9. **Lost draft content (corrupted markers):**
   - Recovery: Extract draft content from task details if markers are corrupted
   - Use `update_subtask` to restore content if task details are intact
   - If task details lost: Re-draft scene using scene metadata and context

10. **Tag corruption:**
    - Recovery: Validate tag structure, repair if possible
    - If repair fails: Recreate tag using `add_tag` with `copyFrom` if source exists
    - If source tag corrupted: Restore from backup or re-parse from NRD

11. **API failures and rate limiting:**
    - Retry strategy: Exponential backoff for transient failures
    - Rate limiting: Pause operations, wait for rate limit reset, resume
    - Timeout handling: Increase timeout for long operations, break into smaller chunks
    - Partial success: Save progress, resume from last successful operation

12. **Data integrity validation:**
    - Regular validation: Check tasks.json structure, tag consistency, manuscript file integrity
    - Recovery: Auto-repair common issues, restore from backup if needed
    - Implementation: Add validation utilities and auto-repair functions

## Long-Form Constraints & Strategies

### Per-Scene vs Per-Chapter Generation

- **Default strategy:** Generate per-chapter files (one file per top-level task)
- **For very long chapters (10k+ words):** Consider per-scene files or split chapters
- **For very short chapters (<1000 words):** Consider merging with adjacent chapter or expanding content
- **Implementation:** `generate` tool creates chapter files by default; can be extended to support per-scene mode
- **Agent guidance:** Use `analyze_project_complexity` to identify chapters needing splitting or merging

### Chapter Length Management

- **Oversized chapters (>150% of target word count):**
  - Strategy: Split chapter into multiple chapters or expand scene count
  - Use `expand_task` to add more scenes, then split parent task
  - Re-run `generate` to create separate chapter files

- **Undersized chapters (<50% of target word count):**
  - Strategy: Merge with adjacent chapter or expand content
  - Use `update_task` to expand chapter scope
  - Or merge chapters using tag operations

- **Pacing imbalance:**
  - If chapters vary significantly in length (>2x difference), agent should:
    1. Analyze pacing using `analyze_project_complexity`
    2. Adjust chapter lengths to normalize pacing
    3. Use `update_task` to expand short chapters or split long ones

- **Word count target adjustments:**
  - If manuscript is >20% over target: Tighten prose, remove redundant scenes
  - If manuscript is >20% under target: Expand scenes, add subplots, deepen character development
  - Agent should track cumulative word count and adjust targets dynamically

### Chunking Strategy for Long Novels (150k+ words)

- **Act-based chunking:** Work on one act at a time using tags (`draft-act1`, `draft-act2`)
- **Compile acts separately:** Generate manuscripts per act, then merge manually or via script
- **Implementation:** Tag system already supports this; document act-based workflow
- **Agent guidance:** Use `add_tag` to create act-specific contexts, expand chapters within each act

### Re-opening Scenes for Revision

- **Strategy 1:** Use `update_subtask` with `append: false` to rewrite scenes
- **Strategy 2:** Create focused revision tags (e.g., `rev-1-scene-5.3`) for specific scene work
- **Strategy 3:** Use `remove_subtask` then `add_subtask` to replace scenes entirely
- **Implementation:** All three strategies already supported; document best practices

## Cost Management & Telemetry

### Telemetry as Writing Session Cost

- **Track telemetry data:** All AI service calls return `telemetryData` with token usage, cost estimates
- **Cost estimation:** Agent can estimate total workflow cost before starting:
  ```bash
  estimate_workflow_cost({
    projectRoot: "<project_root>",
    phases: ["parse", "expand", "draft", "revise"],
    estimatedScenes: 50,
    estimatedWords: 80000
  })
  # Returns: estimated cost breakdown by phase
  ```

### Cost Management Strategies

- Use cheaper models for research (`research` tool)
- Use expensive models for drafting (`update_subtask` with prose generation)
- Batch operations when possible (e.g., `expand_all` vs multiple `expand_task` calls)
- Cache research results to avoid duplicate queries
- Use lower-cost models for initial drafts, higher-cost for revisions

### Budget Monitoring

- Agent tracks cumulative cost across workflow
- If budget limit reached, agent pauses and reports status
- Agent can resume from checkpoint after budget refresh

### Cost Optimization

- Group similar operations (e.g., expand multiple chapters in one batch)
- Reuse research results across scenes
- Use model selection based on task criticality
- **Implementation:** Telemetry already tracked in service responses; add cost aggregation utilities and budget monitoring
- **Agent guidance:** Monitor telemetry, adjust model selection based on task type, estimate costs before starting workflow

---

## Iteration Control & Stopping Criteria

### Preventing Infinite Loops

1. **Maximum Iteration Limits:**
   - **Scene drafting:** Maximum 3 revision attempts per scene before flagging for manual review
   - **Chapter revisions:** Maximum 5 revision passes per chapter
   - **Overall workflow:** Maximum 10 total revision cycles before requiring human intervention
   - **Research queries:** Maximum 20 research queries per phase to prevent cost overruns

2. **Stopping Criteria:**
   - **Scene quality:** Stop revising when quality score > 80% or 3 attempts reached
   - **Revision improvement:** Stop when improvement < 5% between revision passes
   - **Word count:** Stop adjusting when within ±5% of target
   - **Cost limits:** Stop workflow if budget exceeded (pause and report)

3. **"Good Enough" Thresholds:**
   - **Scene completion:** Quality score ≥ 75%, continuity validated, word count within range
   - **Chapter completion:** All scenes done, pacing acceptable, POV consistent
   - **Revision completion:** Improvement ≥ 10% or quality score ≥ 85%
   - **Manuscript completion:** All quality checks pass, NRD compliance ≥ 90%

4. **Iteration Tracking:**
   - Track iteration count per scene/chapter in task metadata
   - Log iteration history in task details
   - Report iteration statistics in manuscript summary
   - Alert when approaching iteration limits

## Error Codes & Handling Reference

### Standard Error Codes

1. **File Errors:**
   - `FILE_NOT_FOUND` - Required file missing
   - `FILE_CORRUPTED` - File structure invalid
   - `PERMISSION_DENIED` - File access denied
   - **Handling:** Check file existence, validate structure, check permissions

2. **Validation Errors:**
   - `VALIDATION_FAILED` - Quality check failed
   - `NRD_INCOMPLETE` - NRD missing required sections
   - `COMPLIANCE_VIOLATION` - Manuscript deviates from NRD
   - **Handling:** Report issues, provide recommendations, allow retry

3. **Dependency Errors:**
   - `DEPENDENCY_NOT_MET` - Prerequisite task incomplete
   - `CIRCULAR_DEPENDENCY` - Dependency cycle detected
   - **Handling:** Check dependencies, resolve cycles, enforce order

4. **API Errors:**
   - `API_RATE_LIMIT` - Rate limit exceeded
   - `API_TIMEOUT` - Request timeout
   - `API_ERROR` - General API failure
   - **Handling:** Retry with backoff, increase timeout, break into chunks

5. **Data Errors:**
   - `TAG_NOT_FOUND` - Tag doesn't exist
   - `TASK_NOT_FOUND` - Task ID invalid
   - `INVALID_STRUCTURE` - Data structure invalid
   - **Handling:** Validate inputs, check existence, repair structure

## Troubleshooting Guide

### Common Failure Scenarios

1. **NRD Validation Fails:**
   - **Symptom:** `validate_nrd` returns `complete: false`
   - **Solution:** Review `missingSections` in validation report, use `research` tool to gather missing information, update NRD file
   - **Prevention:** Use NRD templates, validate early in workflow

2. **Parse Produces No Tasks:**
   - **Symptom:** `parse_prd` completes but `tasks.json` is empty or has no tasks
   - **Solution:** Check NRD format, ensure NRD has sufficient detail, try with `research: true`, check logs for parsing errors
   - **Prevention:** Validate NRD before parsing, use structured NRD format

3. **Scene Quality Validation Fails Repeatedly:**
   - **Symptom:** `validate_scene_quality` fails after multiple attempts
   - **Solution:** Review quality issues, check if scene goals are too ambitious, consider splitting scene, flag for manual review after 3 attempts
   - **Prevention:** Set realistic scene goals, validate early in drafting

4. **Manuscript Generation Loses Draft Content:**
   - **Symptom:** Draft content missing after `generate` runs
   - **Solution:** Check for draft markers (`<!-- novel-master:draft:start -->`), restore from task details if markers corrupted, check backup files
   - **Prevention:** Regular backups, validate markers before regeneration

5. **Revision Conflicts (Conflicting Feedback):**
   - **Symptom:** Multiple beta readers provide conflicting feedback
   - **Solution:** Use conflict resolution strategy: analyze context, check metrics, make decision based on majority/credibility, document decision
   - **Prevention:** Establish feedback criteria, use structured feedback format

6. **NRD Compliance Issues:**
   - **Symptom:** `validate_nrd_compliance` shows low compliance score
   - **Solution:** Review deviations, update tasks to align with NRD, document intentional deviations
   - **Prevention:** Regular compliance checks during drafting, reference NRD when writing

7. **Tasks.json Corruption:**
   - **Symptom:** JSON parsing errors, invalid structure
   - **Solution:** Restore from backup, attempt JSON repair, re-parse from NRD if repair fails
   - **Prevention:** Regular backups, validate structure before operations

8. **API Rate Limiting:**
   - **Symptom:** API calls fail with rate limit errors
   - **Solution:** Implement exponential backoff, pause operations, wait for rate limit reset, resume from checkpoint
   - **Prevention:** Batch operations, use cheaper models for non-critical operations

9. **Word Count Drift:**
   - **Symptom:** Manuscript word count significantly over/under target
   - **Solution:** Adjust scene targets, tighten/expand prose, add/remove scenes, re-analyze pacing
   - **Prevention:** Regular word count monitoring, adjust targets dynamically

10. **Dependency Deadlock:**
    - **Symptom:** Circular dependencies prevent scene completion
    - **Solution:** Use `validate_dependencies` to detect cycles, use `fix_dependencies` to resolve, adjust scene order
    - **Prevention:** Plan dependencies carefully, validate before drafting

## Phase Gate Validation

Each phase has specific gate criteria that must be met before proceeding:

- **Phase 1:** NRD validation report shows `complete: true`
- **Phase 2:** `tasks.json` exists with at least one task and all tasks have narrative metadata
- **Phase 3:** Complexity report exists and expansion strategy is documented
- **Phase 4:** All chapters have subtasks and all subtasks have narrative metadata
- **Phase 5:** All identified research needs are addressed (optional phase)
- **Phase 6:** All chapter files exist and manuscript summary shows structure ready
- **Phase 7:** All scenes have status "done" and manuscript summary shows all word count targets met
- **Phase 8:** All revision passes are done and revision decisions are documented
- **Phase 9:** All quality checks pass (continuity, pacing, NRD compliance ≥ 90%, word count, structure)
- **Phase 10:** Final manuscript exists and all quality metrics are within acceptable ranges

**Agent guidance:** Validate phase gates before proceeding to next phase. If gate fails, address issues before continuing.

## Automation Checklist

Use this checklist to verify the automation loop is complete:

- [ ] NRD is complete and validated (Phase 1 gate passed)
- [ ] NRD parsed into story structure (Phase 2 gate passed)
- [ ] Complexity analysis completed and reviewed (Phase 3 gate passed)
- [ ] All chapters expanded into scenes (Phase 4 gate passed)
- [ ] Research completed for worldbuilding needs (Phase 5 gate passed, if applicable)
- [ ] Manuscript files generated (Phase 6 gate passed)
- [ ] All scenes drafted with quality validation (Phase 7 gate passed)
- [ ] Word count targets met
- [ ] At least one revision pass completed (Phase 8 gate passed)
- [ ] Beta feedback integrated (if applicable)
- [ ] Quality control validation passed (Phase 9 gate passed)
- [ ] Final manuscript compiled and reviewed (Phase 10 gate passed)

---

## Best Practices

1. **Tag Strategy:**
   - Use `outline` for structural work
   - Use `draft` for first-pass writing
   - Use `rev-1`, `rev-2`, etc. for revisions
   - Use focused tags like `rev-1-character-mina` for specific passes

2. **Progress Tracking:**
   - Regularly run `generate` to sync manuscript files
   - Review manuscript summary for progress metrics
   - Use `set_task_status` to track completion

3. **Consistency:**
   - Reference previous scenes when writing new ones
   - Use `research` tool for continuity checks
   - Update world/character notes as story evolves

4. **Iteration:**
   - Don't try to perfect in first draft
   - Use revision tags to refine
   - Accept that some scenes may need multiple passes

---

## Complete Automation Loop Example

Here's a complete example of how an agent might execute the full 10-phase automation loop:

```javascript
// ============================================
// Phase 1: NRD Validation
// ============================================
const nrdValidation = await validate_nrd({
  projectRoot: process.cwd(),
  nrdPath: ".novelmaster/docs/nrd.txt"
});

if (!nrdValidation.complete) {
  // Gather missing information
  for (const missing of nrdValidation.missingSections) {
    await research({
      projectRoot: process.cwd(),
      query: `Research requirements for NRD section: ${missing}`,
      saveToFile: true
    });
  }
  // Update NRD file with research findings
  // Re-validate until complete
}

// ============================================
// Phase 2: Parse NRD
// ============================================
await parse_prd({
  input: ".novelmaster/docs/nrd.txt",
  projectRoot: process.cwd(),
  tag: "outline",
  numTasks: 0,
  research: true
});

// Verify phase gate
const tasks = await readJSON(".novelmaster/tasks/tasks.json", process.cwd(), "outline");
if (!tasks.tasks || tasks.tasks.length === 0) {
  throw new Error("Phase 2 gate failed: No tasks generated");
}

// ============================================
// Phase 3: Complexity Analysis
// ============================================
await analyze_project_complexity({
  projectRoot: process.cwd(),
  tag: "outline",
  useResearch: true,
  file: ".novelmaster/reports/task-complexity-report.json"
});

// Review and plan expansion strategy
const complexityReport = await readJSON(".novelmaster/reports/task-complexity-report.json");
// Document expansion strategy in task details

// ============================================
// Phase 4: Expand Chapters
// ============================================
await expand_all({
  projectRoot: process.cwd(),
  tag: "outline",
  useResearch: true,
  subtaskCount: 0
});

// Verify all chapters have subtasks
for (const task of tasks.tasks) {
  if (!task.subtasks || task.subtasks.length === 0) {
    await expand_task({
      projectRoot: process.cwd(),
      tag: "outline",
      taskId: task.id,
      useResearch: true
    });
  }
}

// ============================================
// Phase 5: Research (Optional)
// ============================================
// Identify research needs from task details
const researchNeeds = extractResearchHooks(tasks);
for (const need of researchNeeds) {
  await research({
    projectRoot: process.cwd(),
    query: need.query,
    taskIds: need.taskIds,
    saveToFile: true
  });
}

// ============================================
// Phase 6: Generate Manuscript
// ============================================
await generate({
  projectRoot: process.cwd(),
  tag: "draft",
  compile: true,
  format: "md"
});

// ============================================
// Phase 7: Draft Scenes
// ============================================
const allScenes = getAllScenes(tasks);
let iterationCount = 0;
const MAX_ITERATIONS = 10;

for (const scene of allScenes) {
  // Check dependencies
  if (scene.dependencies && scene.dependencies.length > 0) {
    for (const depId of scene.dependencies) {
      const depScene = await get_task({
        projectRoot: process.cwd(),
        id: depId,
        tag: "draft"
      });
      if (depScene.status !== "done") {
        // Skip this scene, handle dependency first
        continue;
      }
    }
  }

  // Draft scene
  let sceneQuality;
  let attempts = 0;
  const MAX_ATTEMPTS = 3;

  do {
    await update_subtask({
      projectRoot: process.cwd(),
      tag: "draft",
      id: scene.id,
      prompt: `Write the scene prose. Focus on ${scene.metadata?.emotionalBeat || 'emotional impact'}.`,
      append: attempts === 0
    });

    sceneQuality = await validate_scene_quality({
      projectRoot: process.cwd(),
      id: scene.id,
      tag: "draft"
    });

    attempts++;
  } while (!sceneQuality.meetsCriteria && attempts < MAX_ATTEMPTS);

  if (sceneQuality.meetsCriteria) {
    await set_task_status({
      projectRoot: process.cwd(),
      tag: "draft",
      id: scene.id,
      status: "done"
    });
  } else {
    // Flag for manual review
    await update_subtask({
      projectRoot: process.cwd(),
      tag: "draft",
      id: scene.id,
      prompt: `FLAG: Scene requires manual review. Issues: ${sceneQuality.issues.join(", ")}`,
      append: true
    });
  }

  // Periodic manuscript sync
  if (iterationCount % 5 === 0) {
    await generate({
      projectRoot: process.cwd(),
      tag: "draft",
      compile: true
    });
  }
  iterationCount++;
}

// ============================================
// Phase 8: Revisions
// ============================================
await add_tag({
  projectRoot: process.cwd(),
  tag: "rev-1",
  copyFrom: "draft"
});

// Revision pass
for (const task of tasks.tasks) {
  await update_task({
    projectRoot: process.cwd(),
    tag: "rev-1",
    id: task.id,
    prompt: "Revise chapter for character consistency, pacing, and continuity"
  });
}

// Validate improvements
const improvement = await compare_tags({
  projectRoot: process.cwd(),
  tag1: "draft",
  tag2: "rev-1",
  metric: "quality"
});

if (improvement.improvement < 10) {
  // Continue revising if improvement insufficient
  await add_tag({
    projectRoot: process.cwd(),
    tag: "rev-2",
    copyFrom: "rev-1"
  });
  // Additional revision pass...
}

// ============================================
// Phase 9: Quality Control
// ============================================
// Continuity validation
await research({
  projectRoot: process.cwd(),
  query: "Validate continuity across all chapters",
  taskIds: "all",
  saveToFile: true
});

// Pacing validation
await analyze_project_complexity({
  projectRoot: process.cwd(),
  tag: "rev-1",
  useResearch: false
});

// NRD compliance
const compliance = await validate_nrd_compliance({
  projectRoot: process.cwd(),
  nrdPath: ".novelmaster/docs/nrd.txt",
  tag: "rev-1"
});

if (compliance.complianceScore < 90) {
  // Address compliance issues
  for (const deviation of compliance.deviations) {
    await update_task({
      projectRoot: process.cwd(),
      tag: "rev-1",
      id: deviation.taskId,
      prompt: `Fix NRD compliance issue: ${deviation.issue}`,
      append: false
    });
  }
}

// ============================================
// Phase 10: Final Compilation
// ============================================
await generate({
  projectRoot: process.cwd(),
  tag: "release",
  compile: true,
  format: "md"
});

// Final validation
const finalSummary = await read_manuscript_summary({
  projectRoot: process.cwd(),
  tag: "release"
});

console.log(`Workflow complete! Word count: ${finalSummary.totalWords}, Quality score: ${finalSummary.qualityScore}`);
```

---

This workflow enables fully autonomous novel production while maintaining quality and consistency. Agents can execute this loop with minimal human intervention, producing complete manuscripts ready for publication.

