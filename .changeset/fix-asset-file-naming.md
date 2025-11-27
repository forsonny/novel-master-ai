---
"novel-master-ai": patch
---

Fix asset file naming mismatch that caused "Assets directory not found" errors during init

- Renamed `assets/rules/taskmaster.mdc` to `novelmaster.mdc` to match code expectations
- Renamed `assets/rules/taskmaster_hooks_workflow.mdc` to `novelmaster_hooks_workflow.mdc`
- This fixes the init command failing with errors like:
  - "Assets directory not found. This is likely a packaging issue."
  - "Source file not found: env.example"
  - "Source file not found: config.json"
  - "Source file not found: rules/novelmaster.mdc"

