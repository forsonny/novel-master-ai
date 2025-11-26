Export chapters to README.md with professional formatting.

Arguments: $ARGUMENTS

Generate a well-formatted README with current chapter information.

## README Synchronization

Creates or updates README.md with beautifully formatted chapter information.

## Argument Parsing

Optional filters:
- "pending" → Only pending chapters
- "with-subtasks" → Include scene details
- "by-priority" → Group by priority
- "story-arc" → Current story arc only

## Execution

```bash
novel-master sync-readme [--with-subtasks] [--status=<status>]
```

## README Generation

### 1. **Project Header**
```markdown
# Project Name

## 📋 Chapter Progress

Last Updated: 2024-01-15 10:30 AM

### Summary
- Total Chapters: 45
- Completed: 15 (33%)
- In Progress: 5 (11%)
- Pending: 25 (56%)
```

### 2. **Chapter Sections**
Organized by status or priority:
- Progress indicators
- Chapter descriptions
- Dependencies noted
- Time estimates

### 3. **Visual Elements**
- Progress bars
- Status badges
- Priority indicators
- Completion checkmarks

## Smart Features

1. **Intelligent Grouping**
   - By story arc
   - By act/milestone
   - By assigned writer
   - By priority

2. **Progress Tracking**
   - Overall completion
   - Story arc progress
   - Word count indication
   - Time tracking

3. **Formatting Options**
   - GitHub-flavored markdown
   - Chapter checkboxes
   - Collapsible sections
   - Table format available

## Example Output

```markdown
## 🚀 Current Story Arc

### In Progress
- [ ] 🔄 #5 **Chapter 5: The Confrontation** (60% complete)
  - Dependencies: Chapter 3 (Setup ✅)
  - Scenes: 4 (2 completed)
  - Est: 8h / Spent: 5h

### Pending (High Priority)
- [ ] ⚡ #8 **Chapter 8: The Revelation**
  - Blocked by: #5
  - Complexity: High
  - Est: 12h
```

## Customization

Based on arguments:
- Include/exclude sections
- Detail level control
- Custom grouping
- Filter by criteria

## Post-Sync

After generation:
1. Show diff preview
2. Backup existing README
3. Write new content
4. Commit reminder
5. Update timestamp

## Integration

Works well with:
- Git workflows
- CI/CD pipelines
- Project documentation
- Team updates
- Beta reader reports
