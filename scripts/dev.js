#!/usr/bin/env node

/**
 * dev.js
 * Novel Master CLI - AI-driven development task management
 *
 * This is the refactored entry point that uses the modular architecture.
 * It imports functionality from the modules directory and provides a CLI.
 */

import { join, dirname, resolve, parse } from 'node:path';
import { existsSync } from 'node:fs';
import dotenv from 'dotenv';

/**
 * Project markers to detect Novel Master and general project roots
 * Inlined to avoid bundling issues with @tm/core on Windows
 */
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
	'.svn',
	'package.json',
	'yarn.lock',
	'package-lock.json',
	'pnpm-lock.yaml',
	'Cargo.toml',
	'go.mod',
	'pyproject.toml',
	'requirements.txt',
	'Gemfile',
	'composer.json'
];

/**
 * Find project root by searching for marker files
 * Inlined from @tm/core to avoid Windows bundling path issues
 */
function findProjectRoot(startDir = process.cwd()) {
	let currentDir = resolve(startDir);
	const rootDir = parse(currentDir).root;
	const maxDepth = 50;
	let depth = 0;

	// First pass: Look for Novel Master markers
	let searchDir = currentDir;
	depth = 0;

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

	// Second pass: Look for other project markers
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
}

// Store the original working directory
// This is needed for commands that take relative paths as arguments
const originalCwd = process.cwd();

// Find project root for .env loading
// We don't change the working directory to avoid breaking relative path logic
const projectRoot = findProjectRoot();

// Load .env from project root without changing cwd
dotenv.config({ path: join(projectRoot, '.env') });

// Make original cwd available to commands that need it
process.env.NOVELMASTER_ORIGINAL_CWD = originalCwd;

// Debug logging
if (process.env.DEBUG === '1') {
	console.error('DEBUG - dev.js received args:', process.argv.slice(2));
}

// Import and run CLI
// Note: Using static import - dotenv.config() above runs at module initialization time
// which happens before any import side effects due to how we structure the build
import { runCLI } from './modules/commands.js';

// Run the CLI with the process arguments
runCLI(process.argv);
