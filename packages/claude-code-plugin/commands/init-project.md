Initialize a new Novel Master project.

Arguments: $ARGUMENTS

Parse arguments to determine initialization preferences.

## Initialization Process

1. **Parse Arguments**
   - NRD file path (if provided)
   - Project name
   - Auto-confirm flag (-y)

2. **Project Setup**
   ```bash
   novel-master init
   ```

3. **Smart Initialization**
   - Detect existing project files
   - Suggest project name from directory
   - Check for git repository
   - Verify AI provider configuration

## Configuration Options

Based on arguments:
- `quick` / `-y` → Skip confirmations
- `<file.md>` → Use as NRD after init
- `--name=<name>` → Set project name
- `--description=<desc>` → Set description

## Post-Initialization

After successful init:
1. Show project structure created
2. Verify AI models configured
3. Suggest next steps:
   - Parse NRD if available
   - Configure AI providers
   - Set up git hooks
   - Create first chapters

## Integration

If NRD file provided:
```
/novelmaster:init my-nrd.md
→ Automatically runs parse-prd after init
```
