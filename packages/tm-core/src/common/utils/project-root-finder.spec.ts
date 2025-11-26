/**
 * @fileoverview Tests for project root finder utilities
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import {
	findProjectRoot,
	normalizeProjectRoot
} from './project-root-finder.js';

describe('findProjectRoot', () => {
	let tempDir: string;
	let originalCwd: string;

	beforeEach(() => {
		// Save original working directory
		originalCwd = process.cwd();
		// Create a temporary directory for testing
		tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tm-test-'));
	});

	afterEach(() => {
		// Restore original working directory
		process.chdir(originalCwd);
		// Clean up temp directory
		if (fs.existsSync(tempDir)) {
			fs.rmSync(tempDir, { recursive: true, force: true });
		}
	});

	describe('Novel Master marker detection', () => {
		it('should find .novelmaster directory in current directory', () => {
			const novelmasterDir = path.join(tempDir, '.novelmaster');
			fs.mkdirSync(novelmasterDir);

			const result = findProjectRoot(tempDir);
			expect(result).toBe(tempDir);
		});

		it('should find .novelmaster directory in parent directory', () => {
			const parentDir = tempDir;
			const childDir = path.join(tempDir, 'child');
			const novelmasterDir = path.join(parentDir, '.novelmaster');

			fs.mkdirSync(novelmasterDir);
			fs.mkdirSync(childDir);

			const result = findProjectRoot(childDir);
			expect(result).toBe(parentDir);
		});

		it('should find .novelmaster/config.json marker', () => {
			const configDir = path.join(tempDir, '.novelmaster');
			fs.mkdirSync(configDir);
			fs.writeFileSync(path.join(configDir, 'config.json'), '{}');

			const result = findProjectRoot(tempDir);
			expect(result).toBe(tempDir);
		});

		it('should find .novelmaster/tasks/tasks.json marker', () => {
			const tasksDir = path.join(tempDir, '.novelmaster', 'tasks');
			fs.mkdirSync(tasksDir, { recursive: true });
			fs.writeFileSync(path.join(tasksDir, 'tasks.json'), '{}');

			const result = findProjectRoot(tempDir);
			expect(result).toBe(tempDir);
		});

		it('should find .novelmasterconfig (legacy) marker', () => {
			fs.writeFileSync(path.join(tempDir, '.novelmasterconfig'), '{}');

			const result = findProjectRoot(tempDir);
			expect(result).toBe(tempDir);
		});
	});

	describe('Monorepo behavior - Novel Master markers take precedence', () => {
		it('should find .novelmaster in parent when starting from apps subdirectory', () => {
			// Simulate exact user scenario:
			// /project/.novelmaster exists
			// Starting from /project/apps
			const projectRoot = tempDir;
			const appsDir = path.join(tempDir, 'apps');
			const novelmasterDir = path.join(projectRoot, '.novelmaster');

			fs.mkdirSync(novelmasterDir);
			fs.mkdirSync(appsDir);

			// When called from apps directory
			const result = findProjectRoot(appsDir);
			// Should return project root (one level up)
			expect(result).toBe(projectRoot);
		});

		it('should prioritize .novelmaster in parent over .git in child', () => {
			// Create structure: /parent/.novelmaster and /parent/child/.git
			const parentDir = tempDir;
			const childDir = path.join(tempDir, 'child');
			const gitDir = path.join(childDir, '.git');
			const novelmasterDir = path.join(parentDir, '.novelmaster');

			fs.mkdirSync(novelmasterDir);
			fs.mkdirSync(childDir);
			fs.mkdirSync(gitDir);

			// When called from child directory
			const result = findProjectRoot(childDir);
			// Should return parent (with .novelmaster), not child (with .git)
			expect(result).toBe(parentDir);
		});

		it('should prioritize .novelmaster in grandparent over package.json in child', () => {
			// Create structure: /grandparent/.novelmaster and /grandparent/parent/child/package.json
			const grandparentDir = tempDir;
			const parentDir = path.join(tempDir, 'parent');
			const childDir = path.join(parentDir, 'child');
			const novelmasterDir = path.join(grandparentDir, '.novelmaster');

			fs.mkdirSync(novelmasterDir);
			fs.mkdirSync(parentDir);
			fs.mkdirSync(childDir);
			fs.writeFileSync(path.join(childDir, 'package.json'), '{}');

			const result = findProjectRoot(childDir);
			expect(result).toBe(grandparentDir);
		});

		it('should prioritize .novelmaster over multiple other project markers', () => {
			// Create structure with many markers
			const parentDir = tempDir;
			const childDir = path.join(tempDir, 'packages', 'my-package');
			const novelmasterDir = path.join(parentDir, '.novelmaster');

			fs.mkdirSync(novelmasterDir);
			fs.mkdirSync(childDir, { recursive: true });

			// Add multiple other project markers in child
			fs.mkdirSync(path.join(childDir, '.git'));
			fs.writeFileSync(path.join(childDir, 'package.json'), '{}');
			fs.writeFileSync(path.join(childDir, 'go.mod'), '');
			fs.writeFileSync(path.join(childDir, 'Cargo.toml'), '');

			const result = findProjectRoot(childDir);
			// Should still return parent with .novelmaster
			expect(result).toBe(parentDir);
		});
	});

	describe('Other project marker detection (when no Novel Master markers)', () => {
		it('should find .git directory', () => {
			const gitDir = path.join(tempDir, '.git');
			fs.mkdirSync(gitDir);

			const result = findProjectRoot(tempDir);
			expect(result).toBe(tempDir);
		});

		it('should find package.json', () => {
			fs.writeFileSync(path.join(tempDir, 'package.json'), '{}');

			const result = findProjectRoot(tempDir);
			expect(result).toBe(tempDir);
		});

		it('should find go.mod', () => {
			fs.writeFileSync(path.join(tempDir, 'go.mod'), '');

			const result = findProjectRoot(tempDir);
			expect(result).toBe(tempDir);
		});

		it('should find Cargo.toml (Rust)', () => {
			fs.writeFileSync(path.join(tempDir, 'Cargo.toml'), '');

			const result = findProjectRoot(tempDir);
			expect(result).toBe(tempDir);
		});

		it('should find pyproject.toml (Python)', () => {
			fs.writeFileSync(path.join(tempDir, 'pyproject.toml'), '');

			const result = findProjectRoot(tempDir);
			expect(result).toBe(tempDir);
		});
	});

	describe('Edge cases', () => {
		it('should return current directory if no markers found', () => {
			const result = findProjectRoot(tempDir);
			// Should fall back to process.cwd()
			expect(result).toBe(process.cwd());
		});

		it('should handle permission errors gracefully', () => {
			// This test is hard to implement portably, but the function should handle it
			const result = findProjectRoot(tempDir);
			expect(typeof result).toBe('string');
		});

		it('should not traverse more than 50 levels', () => {
			// Create a deep directory structure
			let deepDir = tempDir;
			for (let i = 0; i < 60; i++) {
				deepDir = path.join(deepDir, `level${i}`);
			}
			// Don't actually create it, just test the function doesn't hang
			const result = findProjectRoot(deepDir);
			expect(typeof result).toBe('string');
		});

		it('should handle being called from filesystem root', () => {
			const rootDir = path.parse(tempDir).root;
			const result = findProjectRoot(rootDir);
			expect(typeof result).toBe('string');
		});
	});
});

describe('normalizeProjectRoot', () => {
	it('should remove .novelmaster from path', () => {
		const result = normalizeProjectRoot('/project/.novelmaster');
		expect(result).toBe('/project');
	});

	it('should remove .novelmaster/subdirectory from path', () => {
		const result = normalizeProjectRoot('/project/.novelmaster/tasks');
		expect(result).toBe('/project');
	});

	it('should return unchanged path if no .novelmaster', () => {
		const result = normalizeProjectRoot('/project/src');
		expect(result).toBe('/project/src');
	});

	it('should handle paths with native separators', () => {
		// Use native path separators for the test
		const testPath = ['project', '.novelmaster', 'tasks'].join(path.sep);
		const expectedPath = 'project';
		const result = normalizeProjectRoot(testPath);
		expect(result).toBe(expectedPath);
	});

	it('should handle empty string', () => {
		const result = normalizeProjectRoot('');
		expect(result).toBe('');
	});

	it('should handle null', () => {
		const result = normalizeProjectRoot(null);
		expect(result).toBe('');
	});

	it('should handle undefined', () => {
		const result = normalizeProjectRoot(undefined);
		expect(result).toBe('');
	});

	it('should handle root .novelmaster', () => {
		const sep = path.sep;
		const result = normalizeProjectRoot(`${sep}.novelmaster`);
		expect(result).toBe(sep);
	});
});
