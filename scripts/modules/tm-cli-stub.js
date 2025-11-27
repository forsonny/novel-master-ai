/**
 * @tm/cli local stub
 * Provides stub exports to replace @tm/cli imports for standalone CLI usage.
 */

import chalk from 'chalk';

// Command Registry stub - not used in the legacy CLI path
export const CommandRegistry = class {
	constructor() {}
	register() {}
	get() {
		return null;
	}
};

export const registerAllCommands = (program, options = {}) => {
	// Not used - legacy commands.js handles registration directly
};

export const registerCommandsByCategory = (program, categories, options = {}) => {
	// Not used - legacy commands.js handles registration directly
};

// Auto-update functions
export const checkForUpdate = async () => {
	// Return no update needed - actual update logic is in the CLI
	return {
		needsUpdate: false,
		currentVersion: '0.0.0',
		latestVersion: '0.0.0'
	};
};

export const performAutoUpdate = async () => false;

export const displayUpgradeNotification = () => {
	// No-op for stub
};

export const restartWithNewVersion = () => {
	// No-op for stub
};

// Error handling
export const displayError = (error, options = {}) => {
	const message = error?.message || String(error);
	console.error(chalk.red('Error:'), message);
	if (options.showStack && error?.stack) {
		console.error(chalk.gray(error.stack));
	}
};

// Interactive setup stub - points to the actual implementation
export const runInteractiveSetup = async (options = {}) => {
	// This should be called from the actual models setup
	// The stub just provides the export so imports don't fail
	console.warn(
		'[tm-cli] runInteractiveSetup stub called - use novel-master models --setup instead'
	);
	return {};
};

// UI namespace stub
export const ui = {
	displayBanner: () => {},
	displayTask: () => {},
	displayTasks: () => {},
	formatStatus: (status) => status
};

