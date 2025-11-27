/**
 * @tm/cli local stub
 * Provides stub exports to replace @tm/cli imports for standalone CLI usage.
 */

import chalk from 'chalk';
import inquirer from 'inquirer';
import boxen from 'boxen';
import {
	getAvailableModels,
	getMainModelId,
	getResearchModelId,
	getFallbackModelId,
	getMainProvider,
	getResearchProvider,
	getFallbackProvider
} from './config-manager.js';
import { setModel } from './task-manager/models.js';

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

/**
 * Build prompt choices for model selection
 * @param {string} role - The role to build choices for (main, research, fallback)
 * @param {Object} currentModels - Current model configuration
 * @param {boolean} allowSkip - Whether to allow skipping this selection
 * @returns {Array} Array of choices for inquirer
 */
function buildPromptChoices(role, currentModels, allowSkip = false) {
	const availableModels = getAvailableModels();
	const choices = [];

	// Group models by provider
	const modelsByProvider = {};
	availableModels.forEach((model) => {
		// Filter models by allowed roles
		if (model.allowed_roles && !model.allowed_roles.includes(role)) {
			return;
		}
		if (!modelsByProvider[model.provider]) {
			modelsByProvider[model.provider] = [];
		}
		modelsByProvider[model.provider].push(model);
	});

	// Add current model indicator
	const currentModel = currentModels[role];
	const currentModelId = currentModel?.modelId;

	// Build choices grouped by provider
	const providerOrder = [
		'anthropic',
		'google',
		'openai',
		'perplexity',
		'xai',
		'groq',
		'openrouter',
		'ollama'
	];

	// Sort providers
	const sortedProviders = Object.keys(modelsByProvider).sort((a, b) => {
		const aIndex = providerOrder.indexOf(a);
		const bIndex = providerOrder.indexOf(b);
		if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
		if (aIndex === -1) return 1;
		if (bIndex === -1) return -1;
		return aIndex - bIndex;
	});

	// Add "Keep current" option if there's a current model
	if (currentModelId) {
		choices.push({
			name: chalk.green(`✓ Keep current: ${currentModel.provider}:${currentModelId}`),
			value: '__KEEP_CURRENT__'
		});
		choices.push(new inquirer.Separator());
	}

	// Add models grouped by provider
	for (const provider of sortedProviders) {
		const models = modelsByProvider[provider];
		if (models.length === 0) continue;

		choices.push(new inquirer.Separator(chalk.cyan(`── ${provider.toUpperCase()} ──`)));

		models.forEach((model) => {
			const isCurrent = model.id === currentModelId && model.provider === currentModel?.provider;
			const costInfo = model.cost_per_1m_tokens
				? ` ($${model.cost_per_1m_tokens.input}/${model.cost_per_1m_tokens.output} per 1M tokens)`
				: '';
			const sweInfo = model.swe_score ? ` [SWE: ${model.swe_score}]` : '';
			
			let displayName = `${model.name || model.id}${costInfo}${sweInfo}`;
			if (isCurrent) {
				displayName = chalk.green(`✓ ${displayName} (current)`);
			}

			choices.push({
				name: displayName,
				value: { modelId: model.id, provider: model.provider }
			});
		});
	}

	// Add custom model options
	choices.push(new inquirer.Separator(chalk.yellow('── CUSTOM MODELS ──')));
	choices.push({
		name: 'Enter custom Ollama model ID',
		value: '__CUSTOM_OLLAMA__'
	});
	choices.push({
		name: 'Enter custom OpenRouter model ID',
		value: '__CUSTOM_OPENROUTER__'
	});

	// Add skip option for fallback
	if (allowSkip) {
		choices.push(new inquirer.Separator());
		choices.push({
			name: chalk.gray('Skip (use default fallback)'),
			value: '__SKIP__'
		});
	}

	// Add cancel option
	choices.push(new inquirer.Separator());
	choices.push({
		name: chalk.red('Cancel setup'),
		value: '__CANCEL__'
	});

	return choices;
}

/**
 * Prompt for a model selection
 * @param {string} role - The role to select for
 * @param {Array} choices - The choices to present
 * @returns {Promise<string|Object>} The selected model or action
 */
async function promptForModel(role, choices) {
	const roleDescriptions = {
		main: 'Primary model for outline generation, chapter planning, and drafting',
		research: 'Model for research-backed operations (worldbuilding, fact-checking)',
		fallback: 'Backup model if the primary fails'
	};

	console.log(
		boxen(
			chalk.bold(`Select ${role.toUpperCase()} model`) +
				'\n\n' +
				chalk.gray(roleDescriptions[role]),
			{
				padding: 0.5,
				margin: { top: 0.5, bottom: 0.5 },
				borderStyle: 'round',
				borderColor: 'blue'
			}
		)
	);

	const { selection } = await inquirer.prompt([
		{
			type: 'list',
			name: 'selection',
			message: `Choose ${role} model:`,
			choices: choices,
			pageSize: 15,
			loop: false
		}
	]);

	// Handle custom model input
	if (selection === '__CUSTOM_OLLAMA__') {
		const { customModelId } = await inquirer.prompt([
			{
				type: 'input',
				name: 'customModelId',
				message: 'Enter Ollama model ID:',
				validate: (input) => input.trim() ? true : 'Model ID cannot be empty'
			}
		]);
		return { modelId: customModelId.trim(), provider: 'ollama' };
	}

	if (selection === '__CUSTOM_OPENROUTER__') {
		const { customModelId } = await inquirer.prompt([
			{
				type: 'input',
				name: 'customModelId',
				message: 'Enter OpenRouter model ID:',
				validate: (input) => input.trim() ? true : 'Model ID cannot be empty'
			}
		]);
		return { modelId: customModelId.trim(), provider: 'openrouter' };
	}

	return selection;
}

/**
 * Handle setting a model for a role
 * @param {string} role - The role to set
 * @param {Object|string} modelSelection - The selected model or action
 * @param {Object|null} currentModel - The current model configuration
 * @param {string} projectRoot - The project root path
 * @returns {Promise<{success: boolean, modified: boolean}>}
 */
async function handleSetModel(role, modelSelection, currentModel, projectRoot) {
	// Handle keep current
	if (modelSelection === '__KEEP_CURRENT__') {
		console.log(chalk.gray(`Keeping current ${role} model.`));
		return { success: true, modified: false };
	}

	// Handle skip
	if (modelSelection === '__SKIP__') {
		console.log(chalk.gray(`Skipping ${role} model configuration.`));
		return { success: true, modified: false };
	}

	// Set the new model
	const { modelId, provider } = modelSelection;

	// Check if it's actually different from current
	if (currentModel && currentModel.modelId === modelId && currentModel.provider === provider) {
		console.log(chalk.gray(`${role} model unchanged.`));
		return { success: true, modified: false };
	}

	try {
		const result = await setModel(role, modelId, {
			projectRoot,
			providerHint: provider
		});

		if (result.success) {
			console.log(chalk.green(`✓ ${role} model set to ${provider}:${modelId}`));
			return { success: true, modified: true };
		} else {
			console.error(chalk.red(`✗ Failed to set ${role} model: ${result.error?.message || 'Unknown error'}`));
			return { success: false, modified: false };
		}
	} catch (error) {
		console.error(chalk.red(`✗ Error setting ${role} model: ${error.message}`));
		return { success: false, modified: false };
	}
}

/**
 * Display setup introduction
 */
function displaySetupIntro() {
	console.log(
		boxen(
			chalk.bold.cyan('Novel Master AI Model Setup') +
				'\n\n' +
				chalk.white('Configure the AI models used by Novel Master for different tasks:') +
				'\n\n' +
				chalk.yellow('• Main:') +
				chalk.gray(' Primary model for outline generation and drafting') +
				'\n' +
				chalk.yellow('• Research:') +
				chalk.gray(' Model for research-backed operations (worldbuilding, facts)') +
				'\n' +
				chalk.yellow('• Fallback:') +
				chalk.gray(' Backup model if the primary fails') +
				'\n\n' +
				chalk.gray('Use arrow keys to navigate, Enter to select.'),
			{
				padding: 1,
				margin: { top: 1, bottom: 1 },
				borderStyle: 'double',
				borderColor: 'cyan',
				title: '🤖 AI Configuration',
				titleAlignment: 'center'
			}
		)
	);
}

/**
 * Run interactive model setup
 * @param {string} projectRoot - The project root path
 * @returns {Promise<boolean>} True if setup completed successfully
 */
export const runInteractiveSetup = async (projectRoot) => {
	if (!projectRoot) {
		console.error(
			chalk.red('Error: Could not determine project root for interactive setup.')
		);
		return false;
	}

	// Get current configuration
	const currentModels = {
		main: null,
		research: null,
		fallback: null
	};

	try {
		const mainModelId = getMainModelId(projectRoot);
		const mainProvider = getMainProvider(projectRoot);
		if (mainModelId && mainProvider) {
			currentModels.main = { modelId: mainModelId, provider: mainProvider };
		}

		const researchModelId = getResearchModelId(projectRoot);
		const researchProvider = getResearchProvider(projectRoot);
		if (researchModelId && researchProvider) {
			currentModels.research = { modelId: researchModelId, provider: researchProvider };
		}

		const fallbackModelId = getFallbackModelId(projectRoot);
		const fallbackProvider = getFallbackProvider(projectRoot);
		if (fallbackModelId && fallbackProvider) {
			currentModels.fallback = { modelId: fallbackModelId, provider: fallbackProvider };
		}
	} catch (error) {
		console.warn(chalk.yellow(`Warning: Could not load current configuration: ${error.message}`));
	}

	// Build prompt choices for each role
	const mainChoices = buildPromptChoices('main', currentModels);
	const researchChoices = buildPromptChoices('research', currentModels);
	const fallbackChoices = buildPromptChoices('fallback', currentModels, true);

	// Display intro
	displaySetupIntro();

	// Prompt for main model
	const mainSelection = await promptForModel('main', mainChoices);
	if (mainSelection === '__CANCEL__') {
		console.log(chalk.yellow('\nSetup cancelled.'));
		return false;
	}

	// Prompt for research model
	const researchSelection = await promptForModel('research', researchChoices);
	if (researchSelection === '__CANCEL__') {
		console.log(chalk.yellow('\nSetup cancelled.'));
		return false;
	}

	// Prompt for fallback model
	const fallbackSelection = await promptForModel('fallback', fallbackChoices);
	if (fallbackSelection === '__CANCEL__') {
		console.log(chalk.yellow('\nSetup cancelled.'));
		return false;
	}

	// Apply all model selections
	console.log(chalk.blue('\n📝 Applying configuration...\n'));

	let setupSuccess = true;
	let configModified = false;

	const mainResult = await handleSetModel('main', mainSelection, currentModels.main, projectRoot);
	if (!mainResult.success) setupSuccess = false;
	if (mainResult.modified) configModified = true;

	const researchResult = await handleSetModel('research', researchSelection, currentModels.research, projectRoot);
	if (!researchResult.success) setupSuccess = false;
	if (researchResult.modified) configModified = true;

	const fallbackResult = await handleSetModel('fallback', fallbackSelection, currentModels.fallback, projectRoot);
	if (!fallbackResult.success) setupSuccess = false;
	if (fallbackResult.modified) configModified = true;

	// Display final status
	if (setupSuccess) {
		if (configModified) {
			console.log(
				boxen(
					chalk.green.bold('✓ Model configuration saved successfully!') +
						'\n\n' +
						chalk.gray('Your AI model preferences have been saved to:') +
						'\n' +
						chalk.cyan('.novelmaster/config.json') +
						'\n\n' +
						chalk.gray('Run ') +
						chalk.yellow('novel-master models') +
						chalk.gray(' to view your current configuration.'),
					{
						padding: 1,
						margin: { top: 1 },
						borderStyle: 'round',
						borderColor: 'green'
					}
				)
			);
		} else {
			console.log(chalk.gray('\nNo changes made to configuration.'));
		}
	} else {
		console.log(
			chalk.yellow('\n⚠️  Some model configurations may not have been saved. Please check the errors above.')
		);
	}

	return setupSuccess;
};

// UI namespace stub
export const ui = {
	displayBanner: () => {},
	displayTask: () => {},
	displayTasks: () => {},
	formatStatus: (status) => status
};

