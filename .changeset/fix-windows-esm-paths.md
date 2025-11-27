---
"novel-master-ai": patch
---

Fix Windows ESM module loading error (ERR_UNSUPPORTED_ESM_URL_SCHEME)

- Inlined findProjectRoot function in dev.js to avoid problematic @tm/core import during bundling
- Updated tsdown config to copy source directories to dist folder
- Created JavaScript stub files for workspace packages (@tm/cli, @tm/core, @tm/bridge, @tm/ai-sdk-provider-grok-cli) to enable runtime resolution
- Updated package.json exports for workspace packages to use dist stubs
- Added workspace package dist directories to npm files field for proper publishing

