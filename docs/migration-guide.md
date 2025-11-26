# Migration Guide: New .novelmaster Directory Structure

## Overview

Novel Master v0.16.0 introduces a new `.novelmaster/` directory structure to keep your project directories clean and organized. This guide explains the benefits of the new structure and how to migrate existing projects.

## What's New

### Before (Legacy Structure)

```
your-project/
├── tasks/                    # Task files
│   ├── tasks.json
│   ├── task-1.txt
│   └── task-2.txt
├── scripts/                  # PRD and reports
│   ├── prd.txt
│   ├── example_prd.txt
│   └── task-complexity-report.json
├── .novelmasterconfig         # Configuration
└── ... (your project files)
```

### After (New Structure)

```
your-project/
├── .novelmaster/              # Consolidated Novel Master files
│   ├── config.json          # Configuration (was .novelmasterconfig)
│   ├── tasks/               # Task files
│   │   ├── tasks.json
│   │   ├── task-1.txt
│   │   └── task-2.txt
│   ├── docs/                # Project documentation
│   │   └── prd.txt
│   ├── reports/             # Generated reports
│   │   └── task-complexity-report.json
│   └── templates/           # Example/template files
│       └── example_prd.txt
└── ... (your project files)
```

## Benefits of the New Structure

✅ **Cleaner Project Root**: No more scattered Novel Master files  
✅ **Better Organization**: Logical separation of tasks, docs, reports, and templates  
✅ **Hidden by Default**: `.novelmaster/` directory is hidden from most file browsers  
✅ **Future-Proof**: Centralized location for Novel Master extensions  
✅ **Backward Compatible**: Existing projects continue to work until migrated

## Migration Options

### Option 1: Automatic Migration (Recommended)

Novel Master provides a built-in migration command that handles everything automatically:

#### CLI Migration

```bash
# Dry run to see what would be migrated
novel-master migrate --dry-run

# Perform the migration with backup
novel-master migrate --backup

# Force migration (overwrites existing files)
novel-master migrate --force

# Clean up legacy files after migration
novel-master migrate --cleanup
```

#### MCP Migration (Cursor/AI Editors)

Ask your AI assistant:

```
Please migrate my Novel Master project to the new .novelmaster directory structure
```

### Option 2: Manual Migration

If you prefer to migrate manually:

1. **Create the new directory structure:**

   ```bash
   mkdir -p .novelmaster/{tasks,docs,reports,templates}
   ```

2. **Move your files:**

   ```bash
   # Move tasks
   mv tasks/* .novelmaster/tasks/

   # Move configuration
   mv .novelmasterconfig .novelmaster/config.json

   # Move PRD and documentation
   mv scripts/prd.txt .novelmaster/docs/
   mv scripts/example_prd.txt .novelmaster/templates/

   # Move reports (if they exist)
   mv scripts/task-complexity-report.json .novelmaster/reports/ 2>/dev/null || true
   ```

3. **Clean up empty directories:**
   ```bash
   rmdir tasks scripts 2>/dev/null || true
   ```

## What Gets Migrated

The migration process handles these file types:

### Tasks Directory → `.novelmaster/tasks/`

- `tasks.json`
- Individual task text files (`.txt`)

### Scripts Directory → Multiple Destinations

- **PRD files** → `.novelmaster/docs/`
  - `prd.txt`, `requirements.txt`, etc.
- **Example/Template files** → `.novelmaster/templates/`
  - `example_prd.txt`, template files
- **Reports** → `.novelmaster/reports/`
  - `task-complexity-report.json`

### Configuration

- `.novelmasterconfig` → `.novelmaster/config.json`

## After Migration

Once migrated, Novel Master will:

✅ **Automatically use** the new directory structure  
✅ **Show deprecation warnings** when legacy files are detected  
✅ **Create new files** in the proper locations  
✅ **Fall back gracefully** to legacy locations if new ones don't exist

### Verification

After migration, verify everything works:

1. **List your tasks:**

   ```bash
   novel-master list
   ```

2. **Check your configuration:**

   ```bash
   novel-master models
   ```

3. **Generate new task files:**
   ```bash
   novel-master generate
   ```

## Troubleshooting

### Migration Issues

**Q: Migration says "no files to migrate"**  
A: Your project may already be using the new structure or have no Novel Master files to migrate.

**Q: Migration fails with permission errors**  
A: Ensure you have write permissions in your project directory.

**Q: Some files weren't migrated**  
A: Check the migration output - some files may not match the expected patterns. You can migrate these manually.

### Working with Legacy Projects

If you're working with an older project that hasn't been migrated:

- Novel Master will continue to work with the old structure
- You'll see deprecation warnings in the output
- New files will still be created in legacy locations
- Use the migration command when ready to upgrade

### New Project Initialization

New projects automatically use the new structure:

```bash
novel-master init  # Creates .novelmaster/ structure
```

## Path Changes for Developers

If you're developing tools or scripts that interact with Novel Master files:

### Configuration File

- **Old:** `.novelmasterconfig`
- **New:** `.novelmaster/config.json`
- **Fallback:** Novel Master checks both locations

### Tasks File

- **Old:** `tasks/tasks.json`
- **New:** `.novelmaster/tasks/tasks.json`
- **Fallback:** Novel Master checks both locations

### Reports

- **Old:** `scripts/task-complexity-report.json`
- **New:** `.novelmaster/reports/task-complexity-report.json`
- **Fallback:** Novel Master checks both locations

### PRD Files

- **Old:** `scripts/prd.txt`
- **New:** `.novelmaster/docs/prd.txt`
- **Fallback:** Novel Master checks both locations

## Need Help?

If you encounter issues during migration:

1. **Check the logs:** Add `--debug` flag for detailed output
2. **Backup first:** Always use `--backup` option for safety
3. **Test with dry-run:** Use `--dry-run` to preview changes
4. **Ask for help:** Use our Discord community or GitHub issues

---

_This migration guide applies to Novel Master v0.15.x and later. For older versions, please upgrade to the latest version first._
