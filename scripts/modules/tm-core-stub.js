/**
 * @tm/core local stub
 * Provides stub exports to replace @tm/core imports for standalone CLI usage.
 * This avoids module resolution issues when the package is installed globally.
 */

import { dirname, join, resolve, parse, sep } from 'node:path';
import { existsSync } from 'node:fs';

// Validated providers array
export const VALIDATED_PROVIDERS = [
	'anthropic',
	'openai',
	'google',
	'perplexity',
	'xai',
	'mistral',
	'groq'
];

// Custom providers object
export const CUSTOM_PROVIDERS = {
	AZURE: 'azure',
	VERTEX: 'vertex',
	BEDROCK: 'bedrock',
	OPENROUTER: 'openrouter',
	OLLAMA: 'ollama',
	LMSTUDIO: 'lmstudio',
	GROK_CLI: 'grok-cli',
	GEMINI_CLI: 'gemini-cli',
	CODEX_CLI: 'codex-cli',
	CLAUDE_CODE: 'claude-code',
	ZAI: 'zai',
	ZAI_CODING: 'zai-coding'
};

export const CUSTOM_PROVIDERS_ARRAY = Object.values(CUSTOM_PROVIDERS);

export const ALL_PROVIDERS = [...VALIDATED_PROVIDERS, ...CUSTOM_PROVIDERS_ARRAY];

// TmCore stub - returns a minimal interface for task operations
export const createTmCore = (options = {}) => {
	// This is a stub - actual implementations are in the legacy scripts
	return {
		getTasks: async () => [],
		getTask: async () => null,
		addTask: async () => null,
		updateTask: async () => null,
		deleteTask: async () => false
	};
};

const NOVELMASTER_PROJECT_MARKERS = [
	'.novelmaster',
	'.novelmaster/config.json',
	'.novelmaster/tasks/tasks.json',
	'.novelmasterconfig'
];

const OTHER_PROJECT_MARKERS = [
	'tasks/tasks.json',
	'tasks.json',
	'.git',
	'package.json'
];

// findProjectRoot implementation
export const findProjectRoot = (startDir = process.cwd()) => {
	let currentDir = resolve(startDir);
	const rootDir = parse(currentDir).root;
	const maxDepth = 50;
	let depth = 0;

	// First pass: Look for Novel Master markers
	let searchDir = currentDir;
	while (depth < maxDepth) {
		for (const marker of NOVELMASTER_PROJECT_MARKERS) {
			const markerPath = join(searchDir, marker);
			try {
				if (existsSync(markerPath)) {
					return searchDir;
				}
			} catch {
				continue;
			}
		}
		if (searchDir === rootDir) break;
		const parentDir = dirname(searchDir);
		if (parentDir === searchDir) break;
		searchDir = parentDir;
		depth++;
	}

	// Second pass: Other project markers
	currentDir = resolve(startDir);
	depth = 0;
	while (depth < maxDepth) {
		for (const marker of OTHER_PROJECT_MARKERS) {
			const markerPath = join(currentDir, marker);
			try {
				if (existsSync(markerPath)) {
					return currentDir;
				}
			} catch {
				continue;
			}
		}
		if (currentDir === rootDir) break;
		const parentDir = dirname(currentDir);
		if (parentDir === currentDir) break;
		currentDir = parentDir;
		depth++;
	}

	return process.cwd();
};

// normalizeProjectRoot implementation
export const normalizeProjectRoot = (projectRoot) => {
	if (!projectRoot) return projectRoot || '';
	const projectRootStr = String(projectRoot);
	const segments = projectRootStr.split(sep);
	const novelmasterIndex = segments.findIndex(
		(segment) => segment === '.novelmaster'
	);
	if (novelmasterIndex !== -1) {
		const normalizedSegments = segments.slice(0, novelmasterIndex);
		return normalizedSegments.join(sep) || sep;
	}
	return projectRootStr;
};

