# Narrative Testing Guide

This document describes the narrative-specific testing approach for Novel Master, including test fixtures, test patterns, and validation criteria for novel writing workflows.

## Overview

Novel Master's testing suite includes specialized tests for narrative workflows that validate:
- NRD parsing into story structures
- Chapter expansion into scenes with narrative metadata
- Narrative-specific complexity analysis (pacing, POV distribution, tension curves)
- Manuscript generation with narrative content
- End-to-end novel workflow (NRD → parse → expand → draft → revision)

## Test Fixtures

### Narrative Fixtures

Located in `tests/fixtures/`:

1. **`sample-nrd.txt`** - Complete NRD for "The Last Codex" (science fiction novel)
   - Includes all required NRD sections (premise, act structure, character roster, POV plan, world rules, themes)
   - Used for testing NRD parsing and validation
   - Represents a realistic novel project structure

2. **`sample-narrative-tasks.js`** - Narrative task data structures
   - `sampleNarrativeTasks` - Full novel structure with acts, chapters, and scenes
   - `taggedNarrativeTasks` - Tagged task structure for outline phase
   - `narrativeTasksWithScenes` - Draft phase tasks with scene-level detail
   - Includes narrative metadata (POV, tension level, emotional beats, word count targets)

3. **`sample-narrative-claude-response.js`** - Mock AI responses
   - `sampleNarrativeClaudeResponse` - Mock response for NRD parsing
   - `sampleSceneExpansionResponse` - Mock response for scene expansion
   - Includes narrative metadata in responses

## Test Categories

### 1. End-to-End Workflow Tests

**File:** `tests/integration/novel-workflow-e2e.test.js`

Tests the complete pipeline:
- NRD → Parse into story structure
- Expand chapters into scenes
- Generate manuscript files
- Draft scenes with prose
- Mark scenes as done
- Validate narrative metadata throughout

**Key Validations:**
- Tasks include narrative metadata (POV, tension level, emotional beats)
- Scenes are properly structured with narrative context
- Manuscript files are generated with correct format
- Draft content is preserved between regenerations

### 2. Narrative Complexity Analysis Tests

**File:** `tests/unit/narrative-complexity-analysis.test.js`

Tests narrative-specific complexity metrics:
- Pacing density analysis (scenes per act, pacing balance)
- POV distribution (character chapter counts, balance)
- Tension curve analysis (tension progression through acts)
- Emotional beat distribution
- Plot density and arc development

**Key Validations:**
- Complexity analysis produces narrative insights (not just technical metrics)
- Identifies chapters needing expansion based on pacing
- Analyzes POV balance for multi-POV novels
- Tracks character arc development

### 3. Manuscript Generation Tests

**File:** `tests/unit/manuscript-generation-narrative.test.js`

Tests manuscript file generation:
- Chapter file creation from narrative tasks
- Scene sections within chapters
- Narrative metadata inclusion (POV, tension, emotional beats)
- Draft content preservation between markers
- Compiled manuscript generation
- Manuscript summary with narrative metrics

**Key Validations:**
- Valid markdown format
- Narrative metadata present in files
- Scene structure correctly formatted
- Draft content preserved
- Summary includes word counts and completion status

## Test Patterns

### Testing Narrative Metadata

When testing narrative functionality, verify that narrative metadata is present:

```javascript
expect(task.metadata).toBeDefined();
expect(task.metadata.pov).toBeDefined();
expect(task.metadata.tensionLevel).toBeDefined();
expect(task.metadata.emotionalBeat).toBeDefined();
```

### Testing Pacing Analysis

Validate that complexity analysis produces narrative insights:

```javascript
expect(analysis.data.pacingDensity).toBeDefined();
expect(analysis.data.povDistribution).toBeDefined();
expect(analysis.data.tensionCurve).toBeDefined();
```

### Testing Manuscript Generation

Verify narrative content in generated files:

```javascript
const content = fs.readFileSync(chapterFile, 'utf-8');
expect(content).toContain('POV');
expect(content).toContain('Tension Level');
expect(content).toContain('Emotional Beat');
```

## Running Narrative Tests

### Run All Narrative Tests

```bash
npm test -- narrative
```

### Run Specific Test Suites

```bash
# End-to-end workflow
npm test -- novel-workflow-e2e

# Complexity analysis
npm test -- narrative-complexity-analysis

# Manuscript generation
npm test -- manuscript-generation-narrative
```

## Validation Criteria

### NRD Parsing

- ✅ Tasks include narrative metadata
- ✅ Story structure matches NRD (acts, chapters)
- ✅ Character information preserved
- ✅ World rules reflected in task details

### Chapter Expansion

- ✅ Scenes include narrative metadata
- ✅ Scene count appropriate for chapter length
- ✅ POV consistency maintained
- ✅ Emotional beats distributed appropriately

### Complexity Analysis

- ✅ Produces pacing insights (not just technical metrics)
- ✅ Analyzes POV distribution
- ✅ Identifies pacing issues
- ✅ Tracks character arc development

### Manuscript Generation

- ✅ Valid markdown format
- ✅ Narrative metadata included
- ✅ Scene structure correct
- ✅ Draft content preserved
- ✅ Summary includes narrative metrics

## Future Test Additions

Planned test additions:
- NRD validation tests (validate_nrd tool)
- NRD compliance tests (validate_nrd_compliance tool)
- Scene quality validation tests (validate_scene_quality tool)
- Tag comparison tests (compare_tags tool)
- Workflow cost estimation tests (estimate_workflow_cost tool)

## Contributing

When adding new narrative tests:
1. Use narrative fixtures from `tests/fixtures/`
2. Include narrative metadata in test data
3. Validate narrative-specific outputs
4. Document test purpose and validation criteria
5. Follow existing test patterns

