# MCP Onboarding Guide

This guide will help you set up Novel Master as an MCP server in your editor (Cursor, VS Code, or other MCP-compatible clients).

## Quick Setup (Cursor)

1. **Install Novel Master globally** (if not already installed):
   ```bash
   npm install -g novel-master-ai
   ```

2. **Open Cursor Settings** → Navigate to MCP section

3. **Add Novel Master MCP Server**:
   - Click "Add New MCP Server"
   - Configure with:
     - **Name**: `novel-master-ai`
     - **Type**: Command
     - **Command**: `npx`
     - **Args**: `["-y", "novel-master-ai"]`

4. **Add API Keys** in the `env` section:
   ```jsonc
   {
     "mcpServers": {
       "novel-master-ai": {
         "command": "npx",
         "args": ["-y", "novel-master-ai"],
         "env": {
           "ANTHROPIC_API_KEY": "YOUR_ANTHROPIC_KEY",
           "PERPLEXITY_API_KEY": "YOUR_PERPLEXITY_KEY",
           "OPENAI_API_KEY": "YOUR_OPENAI_KEY"
         }
       }
     }
   }
   ```

5. **Restart Cursor** to load the MCP server

6. **Initialize your project**:
   ```
   Can you please initialize novel-master-ai into my project?
   ```

## Manual Configuration (`.cursor/mcp.json`)

If you prefer to edit the configuration file directly:

1. **Create or edit** `.cursor/mcp.json` in your project root (or user settings)

2. **Add the Novel Master configuration**:
   ```jsonc
   {
     "mcpServers": {
       "novel-master-ai": {
         "command": "npx",
         "args": ["-y", "novel-master-ai"],
         "env": {
           "ANTHROPIC_API_KEY": "YOUR_ANTHROPIC_KEY",
           "PERPLEXITY_API_KEY": "YOUR_PERPLEXITY_KEY",
           "OPENAI_API_KEY": "YOUR_OPENAI_KEY",
           "GOOGLE_API_KEY": "YOUR_GOOGLE_KEY",
           "MISTRAL_API_KEY": "YOUR_MISTRAL_KEY",
           "OPENROUTER_API_KEY": "YOUR_OPENROUTER_KEY",
           "XAI_API_KEY": "YOUR_XAI_KEY",
           "AZURE_OPENAI_API_KEY": "YOUR_AZURE_KEY",
           "NOVEL_MASTER_TOOLS": "standard"
         }
       }
     }
   }
   ```

3. **Important Notes**:
   - Add `.cursor/mcp.json` to your `.gitignore` to avoid committing API keys
   - Only include API keys for providers you plan to use
   - `NOVEL_MASTER_TOOLS` controls which tools are loaded (see [Configuration Guide](configuration.md) for options)

## VS Code Setup

1. **Install the MCP extension** (if using VS Code with MCP support)

2. **Configure in `.vscode/mcp.json`**:
   ```jsonc
   {
     "servers": {
       "novel-master-ai": {
         "command": "npx",
         "args": ["-y", "novel-master-ai"],
         "cwd": "${workspaceFolder}",
         "env": {
           "ANTHROPIC_API_KEY": "${env:ANTHROPIC_API_KEY}",
           "PERPLEXITY_API_KEY": "${env:PERPLEXITY_API_KEY}",
           "NOVEL_MASTER_TOOLS": "standard"
         }
       }
     }
   }
   ```

## Verification

After setup, verify the MCP server is working:

1. **Open your editor's AI chat**

2. **Ask the AI to use Novel Master tools**:
   ```
   Can you list the available Novel Master tools?
   ```

3. **Try a simple command**:
   ```
   Can you initialize Novel Master in this project?
   ```

4. **Check for errors** in your editor's MCP output/logs

## Common Issues

### MCP Server Not Loading

- **Check Node.js version**: Novel Master requires Node.js 18+
- **Verify installation**: Run `npx -y novel-master-ai --version` in terminal
- **Check API keys**: Ensure at least one API key is configured
- **Review logs**: Check your editor's MCP output panel for error messages

### Tools Not Available

- **Check `NOVEL_MASTER_TOOLS`**: Ensure it's set to `all`, `standard`, or `core` (or a custom list)
- **Restart editor**: MCP servers load on editor startup
- **Verify MCP connection**: Check that the server shows as "connected" in your editor

### API Key Errors

- **Verify keys are correct**: Test keys directly with provider APIs
- **Check environment variables**: Ensure keys are set in the `env` section of your MCP config
- **For CLI usage**: API keys must also be in `.env` file (separate from MCP config)

## Next Steps

Once MCP is set up:

1. **Read the [Tutorial](tutorial.md)** for a complete walkthrough
2. **Check [Examples](examples.md)** for common interaction patterns
3. **Review [Configuration](configuration.md)** for advanced settings
4. **Explore [Command Reference](command-reference.md)** for all available commands

## One-Click Setup (Future)

We're working on a one-click setup link for Cursor. When available, you'll be able to click a link that automatically configures Novel Master in your Cursor settings.

For now, use the manual setup steps above.

