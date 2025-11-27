import { defineConfig } from 'tsdown';
import { baseConfig, mergeConfig } from '@tm/build-config';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env file explicitly with absolute path
config({ path: resolve(process.cwd(), '.env') });

// Get all TM_PUBLIC_* env variables for build-time injection
const getBuildTimeEnvs = () => {
	const envs: Record<string, string> = {};

	// Inject package.json version at build time
	try {
		const packageJson = JSON.parse(
			require('fs').readFileSync('package.json', 'utf8')
		);
		envs['TM_PUBLIC_VERSION'] = packageJson.version || 'unknown';
	} catch (error) {
		console.warn('Could not read package.json version during build:', error);
		envs['TM_PUBLIC_VERSION'] = 'unknown';
	}

	for (const [key, value] of Object.entries(process.env)) {
		if (key.startsWith('TM_PUBLIC_')) {
			envs[key] = value || '';
		}
	}

	return envs;
};

export default defineConfig(
	mergeConfig(baseConfig, {
		entry: {
			'novel-master': 'scripts/dev.js',
			'mcp-server': 'mcp-server/server.js'
		},
		outDir: 'dist',
		copy: ['assets', 'scripts', 'mcp-server', 'src', 'package.json'],
		ignoreWatch: ['node_modules', 'dist', 'tests', 'apps/extension'],
		// Only externalize npm packages (not @tm/* or relative imports)
		// This overrides the base config's external setting
		external: [
			// Externalize bare npm imports (no @ prefix, no . or / prefix)
			/^(?![@./])(?!node:)[a-zA-Z]/
		],
		// Force bundling of our workspace packages
		noExternal: [/^@tm\//],
		env: getBuildTimeEnvs()
	})
);
