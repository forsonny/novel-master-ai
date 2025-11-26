Check if Novel Master is installed and install it if needed.

This command helps you get Novel Master set up globally on your system.

## Detection and Installation Process

1. **Check Current Installation**
   ```bash
   # Check if novel-master command exists
   which novel-master || echo "Novel Master not found"
   
   # Check npm global packages
   npm list -g novel-master-ai
   ```

2. **System Requirements Check**
   ```bash
   # Verify Node.js is installed
   node --version
   
   # Verify npm is installed  
   npm --version
   
   # Check Node version (need 16+)
   ```

3. **Install Novel Master Globally**
   If not installed, run:
   ```bash
   npm install -g novel-master-ai
   ```

4. **Verify Installation**
   ```bash
   # Check version
   novel-master --version
   
   # Verify command is available
   which novel-master
   ```

5. **Initial Setup**
   ```bash
   # Initialize in current directory
   novel-master init
   ```

6. **Configure AI Provider**
   Ensure you have at least one AI provider API key set:
   ```bash
   # Check current configuration
   novel-master models --status
   
   # If no API keys found, guide setup
   echo "You'll need at least one API key:"
   echo "- ANTHROPIC_API_KEY for Claude"
   echo "- OPENAI_API_KEY for GPT models"
   echo "- PERPLEXITY_API_KEY for research"
   echo ""
   echo "Set them in your shell profile or .env file"
   ```

7. **Quick Test**
   ```bash
   # Create a test NRD
   echo "# My Novel\n\n## Act 1\n- Chapter 1: Opening scene" > test-nrd.txt
   
   # Try parsing it
   novel-master parse-prd test-nrd.txt -n 3
   ```

## Troubleshooting

If installation fails:

**Permission Errors:**
```bash
# Try with sudo (macOS/Linux)
sudo npm install -g novel-master-ai

# Or fix npm permissions
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

**Network Issues:**
```bash
# Use different registry
npm install -g novel-master-ai --registry https://registry.npmjs.org/
```

**Node Version Issues:**
```bash
# Install Node 18+ via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

## Success Confirmation

Once installed, you should see:
```
✅ Novel Master v0.16.2 (or higher) installed
✅ Command 'novel-master' available globally
✅ AI provider configured
✅ Ready to use slash commands!

Try: /project:novel-master:init your-nrd.md
```

## Next Steps

After installation:
1. Run `/project:utils:check-health` to verify setup
2. Configure AI providers with `/project:novel-master:models`
3. Start using Novel Master commands!
