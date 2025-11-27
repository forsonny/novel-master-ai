---
"novel-master-ai": patch
---

Add missing CLI commands and fix research prompt error

- Added `list` (alias: `ls`) command for displaying all tasks with filtering
- Added `show <id>` command for viewing task details
- Added `set-status` command for updating task status
- Added `next` command for showing recommended next task
- Fixed `--no-followup` flag handling in research command
- Fixed research prompt parameter validation error
