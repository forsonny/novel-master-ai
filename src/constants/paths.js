/**
 * Path constants for Novel Master application
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

// Novel Master NRD (Novel Requirements Document) file paths
export const NRD_FILE = '.novelmaster/docs/nrd.txt';
export const LEGACY_PRD_FILE = 'scripts/prd.txt';
export const PRD_FILE = NRD_FILE;

// Novel Master template files
export const EXAMPLE_NRD_FILE = '.novelmaster/templates/example_nrd.md';
export const EXAMPLE_NRD_ALT_FILE = '.novelmaster/templates/example_nrd_epic.md';
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
 * Project markers used to identify a novel-master project root
 * These files/directories indicate that a directory is a Novel Master project
 */
export const PROJECT_MARKERS = [
	'.novelmaster', // New novelmaster directory
	LEGACY_CONFIG_FILE, // .novelmasterconfig
	'tasks.json', // Generic tasks file
	LEGACY_TASKS_FILE, // tasks/tasks.json (legacy location)
	NOVELMASTER_TASKS_FILE, // .novelmaster/tasks/tasks.json (new location)
	'.git', // Git repository
	'.svn' // SVN repository
];
