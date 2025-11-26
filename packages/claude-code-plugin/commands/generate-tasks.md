Generate individual chapter files from tasks.json.

## Manuscript File Generation

Creates separate markdown files for each chapter, perfect for AI agents or documentation.

## Execution

```bash
novel-master generate
```

## What It Creates

For each chapter, generates a file like `chapter-001.md`:

```
# Chapter 1: The Beginning

**Chapter ID:** 1  
**Status:** pending  
**Priority:** high  
**Dependencies:** []  
**Created:** 2024-01-15  
**Complexity:** 7

## Description
Introduce the protagonist in their ordinary world, establish the setting, and hint at the coming conflict.

## Details
- POV: First person, Protagonist
- Setting: Small coastal town, present day
- Emotional beat: Contentment turning to unease
- Research hooks: Coastal town architecture, fishing industry

## Continuity/Pacing Strategy
- Establish protagonist's voice and worldview
- Set up the inciting incident
- Pacing: Slow build, atmospheric
- Character consistency: Maintain protagonist's established personality

## Scenes
1.1 Opening: Protagonist's morning routine (pending)
1.2 Discovery: Finding the mysterious object (pending)
1.3 Reaction: Protagonist's initial response (pending)
1.4 Hook: First hint of larger conflict (pending)
```

## File Organization

Creates structure:
```
.novelmaster/
└── manuscript/
    ├── chapters/
    │   ├── chapter-001.md
    │   ├── chapter-002.md
    │   ├── chapter-003.md
    │   └── ...
    ├── compiled/
    │   └── manuscript-draft.md
    └── manuscript-summary.json
```

## Smart Features

1. **Consistent Formatting**
   - Standardized structure
   - Clear sections
   - AI-readable format
   - Markdown compatible

2. **Contextual Information**
   - Full chapter details
   - Related chapter references
   - Progress indicators
   - Drafting notes

3. **Incremental Updates**
   - Only regenerate changed chapters
   - Preserve custom additions
   - Track generation timestamp
   - Version control friendly

## Use Cases

- **AI Context**: Provide chapter context to AI assistants
- **Documentation**: Standalone chapter documentation
- **Archival**: Chapter history preservation
- **Sharing**: Send specific chapters to beta readers
- **Review**: Easier chapter review process

## Generation Options

Based on arguments:
- Filter by status
- Include/exclude completed
- Custom templates
- Different formats (md, txt)

## Post-Generation

```
Manuscript File Generation Complete
━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated: 45 chapter files
Location: .novelmaster/manuscript/chapters/
Total size: 156 KB

New files: 5
Updated files: 12
Unchanged: 28

Ready for:
- AI agent consumption
- Version control
- Beta reader distribution
```

## Integration Benefits

- Git-trackable chapter history
- Easy chapter sharing
- AI tool compatibility
- Offline chapter access
- Backup redundancy
