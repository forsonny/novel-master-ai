Quick initialization with auto-confirmation.

Arguments: $ARGUMENTS

Initialize a Novel Master project without prompts, accepting all defaults.

## Quick Setup

```bash
novel-master init -y
```

## What It Does

1. Creates `.novelmaster/` directory structure
2. Initializes empty `tasks.json`
3. Sets up default configuration
4. Uses directory name as project name
5. Skips all confirmation prompts

## Smart Defaults

- Project name: Current directory name
- Description: "Novel Master Project"
- Model config: Existing environment vars
- Chapter structure: Standard format

## Next Steps

After quick init:
1. Configure AI models if needed:
   ```
   /novelmaster:models/setup
   ```

2. Parse NRD if available:
   ```
   /novelmaster:parse-prd <file>
   ```

3. Or create first chapter:
   ```
   /novelmaster:add-task create initial chapter
   ```

Perfect for rapid project setup!
