/**
 * @fileoverview Path constants for Novel Master Core
 * Defines all file paths and directory structure constants
 */

// .novelmaster directory structure paths
export const NOVELMASTER_DIR = '.novelmaster';
export const NOVELMASTER_TASKS_DIR = '.novelmaster/tasks';
export const NOVELMASTER_DOCS_DIR = '.novelmaster/docs';
export const NOVELMASTER_REPORTS_DIR = '.novelmaster/reports';
export const NOVELMASTER_TEMPLATES_DIR = '.novelmaster/templates';
export const NOVELMASTER_MANUSCRIPT_DIR = '.novelmaster/manuscript';

// Novel Master configuration files
export const NOVELMASTER_CONFIG_FILE = '.novelmaster/config.json';
export const NOVELMASTER_STATE_FILE = '.novelmaster/state.json';

export const LEGACY_CONFIG_FILE = '.novelmasterconfig';

// Novel Master report files
export const COMPLEXITY_REPORT_FILE =
	'.novelmaster/reports/task-complexity-report.json';
export const LEGACY_COMPLEXITY_REPORT_FILE =
	'scripts/task-complexity-report.json';

// Novel Master NRD file paths
export const NRD_FILE = '.novelmaster/docs/nrd.txt';
export const PRD_FILE = NRD_FILE;
export const LEGACY_PRD_FILE = 'scripts/prd.txt';

// Novel Master template files
export const EXAMPLE_NRD_FILE = '.novelmaster/templates/example_nrd.md';
export const EXAMPLE_PRD_FILE = EXAMPLE_NRD_FILE;
export const LEGACY_EXAMPLE_PRD_FILE = 'scripts/example_prd.txt';

// Novel Master task file paths
export const NOVELMASTER_TASKS_FILE = '.novelmaster/tasks/tasks.json';
export const LEGACY_TASKS_FILE = 'tasks/tasks.json';

// General project files (not Novel Master specific but commonly used)
export const ENV_EXAMPLE_FILE = '.env.example';
export const GITIGNORE_FILE = '.gitignore';

// Task file naming pattern
export const TASK_FILE_PREFIX = 'task_';
export const TASK_FILE_EXTENSION = '.txt';

/**
 * Novel Master specific markers (absolute highest priority)
 * ONLY truly Novel Master-specific markers that uniquely identify a Novel Master project
 */
export const NOVELMASTER_PROJECT_MARKERS = [
	'.novelmaster', // Novel Master directory
	NOVELMASTER_CONFIG_FILE, // .novelmaster/config.json
	NOVELMASTER_TASKS_FILE, // .novelmaster/tasks/tasks.json
	LEGACY_CONFIG_FILE // .novelmasterconfig (legacy but still Novel Master-specific)
] as const;

/**
 * Other project markers (only checked if no Novel Master markers found)
 * Includes generic task files that could belong to any task runner/build system
 */
export const OTHER_PROJECT_MARKERS = [
	LEGACY_TASKS_FILE, // tasks/tasks.json (NOT Novel Master-specific)
	'tasks.json', // Generic tasks file (NOT Novel Master-specific)
	'.git', // Git repository
	'.svn', // SVN repository
	'package.json', // Node.js project
	'yarn.lock', // Yarn project
	'package-lock.json', // npm project
	'pnpm-lock.yaml', // pnpm project
	'Cargo.toml', // Rust project
	'go.mod', // Go project
	'pyproject.toml', // Python project
	'requirements.txt', // Python project
	'Gemfile', // Ruby project
	'composer.json' // PHP project
] as const;

/**
 * All project markers combined (for backward compatibility)
 * @deprecated Use NOVELMASTER_PROJECT_MARKERS and OTHER_PROJECT_MARKERS separately
 */
export const PROJECT_MARKERS = [
	...NOVELMASTER_PROJECT_MARKERS,
	...OTHER_PROJECT_MARKERS
] as const;
