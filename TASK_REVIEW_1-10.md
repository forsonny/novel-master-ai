# Comprehensive Review: Tasks 1-10 Gap Analysis

## Executive Summary

This document reviews tasks 1-10 from the Novel Master conversion plan to identify gaps, incomplete implementations, and areas that were overlooked or not fully addressed.

---

## Task 1: Core Package Identity & Branding

### ✅ Completed
- Package name updated to `novel-master-ai`
- Description updated to novel-writing context
- Keywords include: novel, writing, manuscript, story, fiction
- Bin commands: `novel-master`, `novel-master-mcp`, `novel-master-ai`
- Repository URLs updated to `claude-novel-master`
- Executables renamed in dist/

### ⚠️ Gaps & Issues

1. **Internal Package References Still Use `@tm/*`**
   - **Location**: `package.json` devDependencies
   - **Issue**: Still references `@tm/ai-sdk-provider-grok-cli`, `@tm/cli`, `@tm/core`
   - **Impact**: Inconsistent branding, potential confusion
   - **Recommendation**: Consider renaming to `@nm/*` or `@novel-master/*` for consistency

2. **Build Script References**
   - **Location**: `package.json` line 23: `"build:build-config": "npm run build -w @tm/build-config"`
   - **Issue**: Still references `@tm/build-config`
   - **Recommendation**: Update to match new package naming scheme

3. **TypeScript/Code References**
   - **Location**: Multiple files import from `@tm/core`
   - **Example**: `scripts/modules/config-manager.js` imports `ALL_PROVIDERS`, `CUSTOM_PROVIDERS` from `@tm/core`
   - **Issue**: Internal code still references old package names
   - **Recommendation**: Either keep `@tm/*` as internal convention (document it) or migrate fully

4. **Extension Config Interface**
   - **Location**: `apps/extension/src/utils/configManager.ts`
   - **Issue**: Interface named `TaskMasterConfig` instead of `NovelMasterConfig`
   - **Recommendation**: Rename for consistency

---

## Task 2: Domain Reframing & Terminology

### ✅ Completed
- Path constants updated: `NOVELMASTER_DIR`, `NOVELMASTER_TASKS_FILE`, etc.
- Folder renamed: `.taskmaster/` → `.novelmaster/`
- NRD terminology used in prompts and docs
- Most user-facing strings updated

### ⚠️ Gaps & Issues

1. **Extensive "TaskMaster" References in Code Comments**
   - **Location**: Throughout codebase, especially `scripts/modules/commands.js`
   - **Issue**: Hundreds of comments still say "Initialize TaskMaster", "TaskMaster.getCurrentTag()", etc.
   - **Examples**:
     - Line 189: `// Initialize TaskMaster`
     - Line 323: `// Initialize TaskMaster`
     - Line 424: `// Initialize TaskMaster`
   - **Impact**: Confusing for developers, inconsistent branding
   - **Recommendation**: Global find/replace: "TaskMaster" → "NovelMaster" in comments

2. **Function Names Still Reference TaskMaster**
   - **Location**: `mcp-server/src/tools/utils.js`
   - **Issue**: Function named `executeTaskMasterCommand` (line 336)
   - **Recommendation**: Rename to `executeNovelMasterCommand`

3. **Error Class Names**
   - **Location**: `packages/tm-core/src/modules/config/services/runtime-state-manager.service.ts`
   - **Issue**: Uses `TaskMasterError` class
   - **Recommendation**: Rename to `NovelMasterError` or keep as internal if `@tm/core` is internal convention

4. **Extension Config Section**
   - **Location**: `apps/extension/src/utils/notificationPreferences.ts` line 46
   - **Issue**: `configSection = 'taskMasterKanban'`
   - **Recommendation**: Update to `novelMasterKanban`

5. **Kiro Hooks Still Reference "TM"**
   - **Location**: `.kiro/hooks/tm-task-dependency-auto-progression.kiro.hook`
   - **Issue**: Hook name and description say "[TM] Task Dependency Auto-Progression"
   - **Recommendation**: Update to "[NM]" or "[Novel Master]"

6. **Deprecated Comments**
   - **Location**: `scripts/modules/utils.js` line 1458
   - **Issue**: Comment says `@deprecated Use TaskMaster.getCurrentTag() instead`
   - **Recommendation**: Update to `NovelMaster.getCurrentTag()`

---

## Task 3: Task Model & Template Adaptation

### ✅ Completed
- Schema files updated with narrative metadata (POV, tension, timeline)
- NRD templates created for multiple genres (fantasy, thriller, literary, epic)
- Templates exist in both `.novelmaster/templates/` and `assets/templates/`
- Schema includes: `pov`, `timeline`, `tensionLevel`, `emotionalBeat`, `wordCountTarget`, etc.

### ⚠️ Gaps & Issues

1. **Missing Fantasy Template in `.novelmaster/templates/`**
   - **Location**: `assets/templates/example_nrd_fantasy.md` exists but not in `.novelmaster/templates/`
   - **Issue**: Template exists in assets but not in the user-facing templates directory
   - **Recommendation**: Copy `example_nrd_fantasy.md` to `.novelmaster/templates/`

2. **Schema Documentation Not Updated**
   - **Location**: `docs/task-structure.md` and `apps/docs/capabilities/task-structure.mdx`
   - **Issue**: Documentation shows narrative examples but may not fully explain all new metadata fields
   - **Recommendation**: Add comprehensive documentation for:
     - `metadata.pov` usage
     - `metadata.tensionLevel` (1-10 scale)
     - `metadata.timeline` format
     - `metadata.emotionalBeat` examples
     - `metadata.sensoryNotes` purpose
     - `metadata.researchHook` usage

3. **Tasks.json Structure Commentary**
   - **Location**: Need to check if `tasks.json` has inline comments explaining narrative structure
   - **Issue**: May still have coding-focused comments
   - **Recommendation**: Add narrative-focused comments in generated `tasks.json` files

4. **Complexity Report Samples**
   - **Location**: `.novelmaster/reports/` directory
   - **Issue**: No sample narrative complexity reports provided
   - **Recommendation**: Create sample reports showing pacing analysis, POV distribution, tension curves

---

## Task 4: AI Prompt System Overhaul

### ✅ Completed
- All prompt files updated with narrative terminology
- `parse-prd.json` → parses NRDs into story arcs/chapters
- `expand-task.json` → expands chapters into scenes/beats
- `update-*.json` → narrative context updates
- `research.json` → worldbuilding/genre research
- `analyze-complexity.json` → plot/pacing complexity

### ⚠️ Gaps & Issues

1. **Prompt Template Schema Validation**
   - **Location**: `src/prompts/schemas/prompt-template.schema.json`
   - **Issue**: Need to verify schema validates narrative-specific parameters
   - **Recommendation**: Review schema to ensure it supports all narrative metadata fields

2. **Prompt Manager Customization**
   - **Location**: `scripts/modules/prompt-manager.js` (if exists)
   - **Issue**: Task mentions updating this file but need to verify it handles narrative-specific customization
   - **Recommendation**: Verify narrative context is properly injected into prompts

3. **System Prompt Narrative Focus**
   - **Location**: All prompt JSON files
   - **Issue**: Need to verify system prompts fully reason about narrative elements (three-act structure, character development, tension curves) instead of code
   - **Recommendation**: Review system prompts in each JSON file to ensure they're fully narrative-focused

4. **Metadata Suggestions in Prompts**
   - **Location**: Prompt output schemas
   - **Issue**: Task mentions "Add narrative metadata suggestions (POV, timeline, tension level) in prompt outputs"
   - **Recommendation**: Verify prompts explicitly instruct AI to include these metadata fields in responses

---

## Task 5: MCP Tool & CLI Command Adaptation

### ✅ Completed
- MCP tool descriptions updated (e.g., `parse_prd` tool description)
- CLI commands updated (e.g., `generate` command description)
- Tool examples show chapter planning, character arc tracking

### ⚠️ Gaps & Issues

1. **All 39 Direct Functions Need Review**
   - **Location**: `mcp-server/src/core/direct-functions/` (39 files)
   - **Issue**: Task says "Update all 39 direct functions... to use narrative terminology"
   - **Recommendation**: Audit each file to ensure:
     - Function names use narrative terms
     - Comments use narrative terminology
     - Error messages reference narrative concepts
     - Log messages use narrative language

2. **MCP Tool Descriptions Consistency**
   - **Location**: All files in `mcp-server/src/tools/`
   - **Issue**: Need to verify ALL tools have narrative-focused descriptions
   - **Recommendation**: Review each tool file to ensure descriptions emphasize:
     - Chapter/scene planning
     - Character arc tracking
     - Worldbuilding research
     - Manuscript generation
     - Narrative complexity analysis

3. **CLI Command Examples**
   - **Location**: `scripts/modules/commands.js` command descriptions
   - **Issue**: Some commands may still have coding examples
   - **Recommendation**: Ensure all command examples show:
     - Chapter planning workflows
     - Scene expansion
     - Character consistency checks
     - Manuscript generation

4. **Research Tool Emphasis**
   - **Location**: `mcp-server/src/tools/research.js` (if exists)
   - **Issue**: Task says "Ensure research tools emphasize lore gathering, genre research, writing techniques"
   - **Recommendation**: Verify research tool prioritizes:
     - Worldbuilding research
     - Genre conventions
     - Writing techniques
     - Character development methods
     - Over code/technical research

5. **Complexity Analysis Output Formatting**
   - **Location**: `scripts/modules/task-manager/analyze-task-complexity.js`
   - **Issue**: Task says "Adapt complexity analysis output formatting to discuss plot/pacing complexity"
   - **Recommendation**: Verify output discusses:
     - Plot complexity
     - Pacing density
     - Arc intricacy
     - POV load
     - Tension curves
     - Not code complexity metrics

---

## Task 6: Cursor Rules & Agent Guidance

### ✅ Completed
- `taskmaster.mdc` updated with Novel Master references
- `dev_workflow.mdc` mentions Novel Master workflows

### ⚠️ Gaps & Issues

1. **Missing Cursor Rules Files**
   - **Location**: `.cursor/rules/` directory
   - **Issue**: Plan mentions multiple `.cursor/rules/*.mdc` files but only found:
     - `assets/rules/taskmaster.mdc`
     - `assets/rules/dev_workflow.mdc`
     - `assets/rules/cursor_rules.mdc`
     - `assets/rules/self_improve.mdc`
     - `assets/rules/taskmaster_hooks_workflow.mdc`
   - **Missing files mentioned in plan**:
     - `git_workflow.mdc` → manuscript versioning, draft branches
     - `test_workflow.mdc` → narrative testing (continuity checks, pacing analysis)
     - `tasks.mdc` → story arc/chapter/scene task patterns
     - `tags.mdc` → tag conventions for novel workflows
     - `ai_services.mdc` → narrative-focused AI service usage
     - `context_gathering.mdc` → context patterns for fiction writing
   - **Recommendation**: Create these missing rule files with narrative focus

2. **Existing Rules Need Narrative Reframing**
   - **Location**: `assets/rules/dev_workflow.mdc`
   - **Issue**: Still contains software development workflow language
   - **Example**: Line 9 says "manage software development projects"
   - **Recommendation**: Rewrite to focus on:
     - Novel development workflow
     - Drafting, revising, beta feedback
     - Manuscript versioning
     - Narrative testing

3. **Git Workflow Rules Missing**
   - **Location**: Should be `.cursor/rules/git_workflow.mdc` or `assets/rules/git_workflow.mdc`
   - **Issue**: Plan specifies "manuscript versioning, draft branches, revision tracking"
   - **Recommendation**: Create file covering:
     - How to version manuscripts
     - Branch naming for drafts (draft-v1, draft-v2, beta-feedback)
     - Revision tracking strategies
     - Merge strategies for manuscript revisions

4. **Test Workflow Rules Missing**
   - **Location**: Should be `.cursor/rules/test_workflow.mdc`
   - **Issue**: Plan specifies "narrative testing (continuity checks, pacing analysis, character consistency)"
   - **Recommendation**: Create file covering:
     - Continuity validation workflows
     - Pacing analysis procedures
     - Character voice consistency checks
     - Timeline validation
     - POV balance analysis

5. **Tags Rules Missing**
   - **Location**: Found `.cursor/rules/tasks.mdc` but need to verify `tags.mdc`
   - **Issue**: Plan specifies tag conventions for novel workflows
   - **Recommendation**: Create/update `tags.mdc` with:
     - `outline` tag usage
     - `draft` tag usage
     - `rev-1`, `rev-2` revision tags
     - `beta-feedback` tag
     - `character-<name>` POV tags
     - `timeline-<period>` tags

---

## Task 7: Configuration & State Management

### ✅ Completed
- Config uses `.novelmaster/config.json` (with legacy `.novelmasterconfig` support)
- `targetWordCount` added to global config
- `autoRegenerateManuscript` config option exists
- State management tracks manuscript progress

### ⚠️ Gaps & Issues

1. **Config Naming Decision Not Documented**
   - **Location**: Documentation
   - **Issue**: Plan says "Decide config naming scheme (keep `.taskmasterconfig` vs rename)"
   - **Status**: Decision made (`.novelmaster/config.json`) but may not be fully documented
   - **Recommendation**: Document the decision and migration path clearly

2. **Narrative Defaults Not Fully Configured**
   - **Location**: `scripts/modules/config-manager.js` DEFAULTS
   - **Issue**: Plan says "Update `.novelmaster/config.json` defaults for narrative projects (model preferences, research focus)"
   - **Current**: Defaults exist but may not be narrative-optimized
   - **Recommendation**: Review defaults to ensure they're optimized for:
     - Novel writing workflows
     - Research focus on worldbuilding/genre
     - Appropriate model selection for narrative tasks

3. **Environment Variable Examples**
   - **Location**: `assets/env.example`
   - **Issue**: Plan says "Update environment variable examples for fiction-writing contexts"
   - **Recommendation**: Verify examples show:
     - Novel project setup
     - Narrative-focused API usage
     - Manuscript generation workflows

4. **Default Priorities/Subtask Counts**
   - **Location**: `scripts/modules/config-manager.js` DEFAULTS
   - **Issue**: Plan says "Adjust default priorities/subtask counts for narrative workflows"
   - **Current**: `defaultNumTasks: 10`, `defaultSubtasks: 5`
   - **Recommendation**: Consider if these are appropriate for:
     - Chapter counts (10 chapters is reasonable)
     - Scenes per chapter (5 scenes per chapter is reasonable)
     - But document why these defaults work for novels

5. **State.json Structure**
   - **Location**: `src/constants/paths.js` defines `NOVELMASTER_STATE_FILE`
   - **Issue**: Plan says "Update state.json structure to track manuscript progress (word counts, chapter completion)"
   - **Recommendation**: Verify state.json tracks:
     - Word counts per chapter
     - Chapter completion status
     - Overall manuscript progress
     - Revision pass tracking

---

## Task 8: Core Logic Adaptation

### ✅ Completed
- `parse-prd/` updated for narrative structure
- `expand-task.js` expands chapters with scene/beat logic
- `analyze-task-complexity.js` assesses plot/pacing
- `generate-task-files.js` generates chapter/scene files
- Word count utilities exist in `scripts/modules/utils/word-count.js`

### ⚠️ Gaps & Issues

1. **Tag Management for Draft/Revision Workflows**
   - **Location**: Tag management functions
   - **Issue**: Plan says "Tag management adapted for draft/revision workflows"
   - **Recommendation**: Verify tag system supports:
     - Draft phase tags
     - Revision pass tags (rev-1, rev-2)
     - Beta feedback tags
     - POV-specific tags

2. **UI Display Narrative Information**
   - **Location**: `scripts/modules/ui.js`
   - **Issue**: Plan says "Update `scripts/modules/ui.js` to display narrative-specific information (word counts, chapter status)"
   - **Current**: Line 44 shows `wordCountTarget: 'Word Count Target'`
   - **Recommendation**: Verify UI displays:
     - Word counts prominently
     - Chapter completion status
     - POV distribution
     - Tension level indicators
     - Timeline markers

3. **Research Tool Worldbuilding Focus**
   - **Location**: `scripts/modules/task-manager/research.js`
   - **Issue**: Plan says "`research.js` → worldbuilding and genre research"
   - **Recommendation**: Verify research tool:
     - Prioritizes worldbuilding queries
     - Focuses on genre conventions
     - Provides writing technique guidance
     - Over technical/code research

4. **Parse PRD Narrative Structure Awareness**
   - **Location**: `scripts/modules/task-manager/parse-prd/`
   - **Issue**: Plan says "parse NRDs with narrative structure awareness"
   - **Recommendation**: Verify parser:
     - Recognizes three-act structure
     - Identifies character arcs
     - Understands chapter/scene relationships
     - Maps story beats

---

## Task 9: Documentation & Onboarding

### ✅ Completed
- Tutorial docs exist (`docs/tutorial.md`)
- Sample NRDs for different genres exist
- MCP onboarding docs mention Novel Master
- Configuration docs exist (`docs/configuration-narrative.md`)

### ⚠️ Gaps & Issues

1. **Quickstart/Tutorial Narrative Focus**
   - **Location**: `docs/tutorial.md`
   - **Issue**: Plan says "Refresh quickstart/tutorial docs to walk through creating an NRD, parsing into story arcs, expanding chapters, tracking manuscript progress"
   - **Recommendation**: Verify tutorial:
     - Starts with NRD creation
     - Shows parsing into story arcs (not code tasks)
     - Demonstrates chapter expansion
     - Tracks manuscript progress
     - Uses narrative examples throughout

2. **Advanced Workflows Documentation**
   - **Location**: `docs/advanced-workflows.md` (if exists)
   - **Issue**: Plan says "Highlight advanced workflows (tags for draft vs. revision, character POV isolation, timeline management)"
   - **Recommendation**: Create/update advanced workflows doc covering:
     - Tag strategies for drafts/revisions
     - POV isolation techniques
     - Timeline management
     - Multi-POV novel workflows
     - Revision pass workflows

3. **Sample NRDs Location**
   - **Location**: Templates exist in both `.novelmaster/templates/` and `assets/templates/`
   - **Issue**: Some templates may be missing from user-facing directory
   - **Recommendation**: Ensure all genre templates are in `.novelmaster/templates/`:
     - ✅ `example_nrd.md` (generic)
     - ✅ `example_nrd_epic.md`
     - ✅ `example_nrd_literary.md`
     - ✅ `example_nrd_thriller.md`
     - ❌ `example_nrd_fantasy.md` (exists in assets but not in `.novelmaster/templates/`)

4. **Config Documentation**
   - **Location**: `docs/configuration-narrative.md`
   - **Issue**: Plan says "Document how `.novelmaster/config.json` should be configured for novel development"
   - **Recommendation**: Verify config doc explains:
     - Narrative-specific settings
     - Word count targets
     - Model selection for narrative tasks
     - Research focus configuration
     - Auto-regenerate manuscript setting

5. **MCP Onboarding Docs**
   - **Location**: MCP-related documentation
   - **Issue**: Plan says "Update MCP onboarding docs: Cursor one-click link, `.cursor/mcp.json` samples, server naming, CLI install instructions referencing Novel Master"
   - **Recommendation**: Verify docs include:
     - Cursor integration instructions
     - `.cursor/mcp.json` example with Novel Master
     - Server naming conventions
     - CLI installation for Novel Master (not Task Master)

---

## Task 10: Manuscript Generation & File Integration

### ✅ Completed
- `generate` MCP tool creates chapter/scene markdown files
- Maps parent tasks → chapter files
- Maps subtasks → scene sections
- Manuscript compilation exists (merges chapters into single file)
- Word count tracking implemented
- File sync exists (auto-regenerate on task updates via config)

### ⚠️ Gaps & Issues

1. **File Sync Implementation**
   - **Location**: `scripts/modules/task-manager/update-task-by-id.js` and `update-subtask-by-id.js`
   - **Status**: ✅ Implemented (lines 536-548 and 373-385)
   - **Issue**: Only works if `autoRegenerateManuscript` config is enabled
   - **Recommendation**: Document this feature clearly and consider making it default for narrative workflows

2. **Word Count Utilities Location**
   - **Location**: ✅ Exists at `scripts/modules/utils/word-count.js`
   - **Status**: Complete
   - **Recommendation**: None - this is done

3. **Manuscript File Structure**
   - **Location**: `scripts/modules/task-manager/generate-task-files.js`
   - **Issue**: Plan says "Map parent tasks → chapter files (e.g., `.novelmaster/manuscript/chapter-01.md`), subtasks → scene sections within chapters"
   - **Current**: Generates files in `.novelmaster/manuscript/<tag>/chapters/`
   - **Recommendation**: Verify file naming matches plan:
     - Chapter files named `chapter-01.md`, `chapter-02.md`, etc.
     - Scene sections properly marked within chapters
     - Draft sections clearly identified

4. **Manuscript Compilation Format**
   - **Location**: `scripts/modules/task-manager/generate-task-files.js` lines 356-405
   - **Status**: ✅ Supports both `md` and `txt` formats
   - **Recommendation**: Verify compiled manuscript:
     - Has proper chapter numbering
     - Includes all chapters in order
     - Preserves scene structure
     - Maintains draft content

5. **Progress Metadata Tracking**
   - **Location**: `scripts/modules/task-manager/generate-task-files.js`
   - **Issue**: Plan says "Track word counts, writing goals, and progress metadata in task details/config"
   - **Current**: ✅ Word counts tracked in task metadata
   - **Recommendation**: Verify progress metadata includes:
     - Word count targets
     - Current word counts
     - Completion percentages
     - Chapter status

---

## Summary of Critical Gaps

### High Priority
1. **Task 2**: Hundreds of "TaskMaster" references in code comments need updating
2. **Task 6**: Missing Cursor rules files (`git_workflow.mdc`, `test_workflow.mdc`, `tags.mdc`, etc.)
3. **Task 5**: Need to audit all 39 direct functions for narrative terminology
4. **Task 3**: Missing fantasy template in `.novelmaster/templates/`

### Medium Priority
5. **Task 1**: Internal package references still use `@tm/*` naming
6. **Task 4**: Need to verify prompt system prompts are fully narrative-focused
7. **Task 9**: Advanced workflows documentation may be incomplete
8. **Task 7**: Narrative defaults may need optimization

### Low Priority
9. **Task 8**: UI display may need enhancement for narrative information
10. **Task 10**: File naming conventions may need verification

---

## Recommendations

1. **Create a systematic review checklist** for each task to ensure nothing is missed
2. **Run global find/replace** for "TaskMaster" → "NovelMaster" in comments (with care)
3. **Create missing Cursor rules files** with narrative focus
4. **Audit all MCP tools and direct functions** for narrative terminology
5. **Complete template migration** to `.novelmaster/templates/`
6. **Document advanced workflows** for novel-specific use cases
7. **Review and optimize defaults** for narrative workflows
8. **Verify all prompt system prompts** are fully narrative-focused

---

## Next Steps

1. Prioritize high-priority gaps
2. Create tickets/issues for each gap
3. Assign ownership for systematic fixes
4. Set up review process to prevent future gaps
5. Consider automated checks for terminology consistency

