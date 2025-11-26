/**
 * update-tasks.js
 * Direct function implementation for batch-updating chapters/scenes based on new narrative context
 */

import path from 'path';
import { updateTasks } from '../../../../scripts/modules/task-manager.js';
import { createLogWrapper } from '../../tools/utils.js';
import {
	enableSilentMode,
	disableSilentMode
} from '../../../../scripts/modules/utils.js';

/**
 * Direct function wrapper for batch-updating chapters/scenes based on new narrative context.
 * Updates all chapters/scenes with ID >= from when story direction changes.
 *
 * @param {Object} args - Command arguments containing projectRoot, from, prompt, research options.
 * @param {string} args.from - The starting chapter/scene ID to update (inclusive). All chapters with ID >= from will be updated.
 * @param {string} args.prompt - The narrative context to apply (tone shifts, POV changes, new stakes, lore updates).
 * @param {boolean} args.research - Whether to use research mode for lore/genre-aware updates.
 * @param {string} args.tasksJsonPath - Path to the tasks.json file.
 * @param {string} args.projectRoot - Project root path (for MCP/env fallback)
 * @param {string} args.tag - Tag context (outline, draft, revision) for the task (optional)
 * @param {Object} log - Logger object.
 * @param {Object} context - Context object containing session data.
 * @returns {Promise<Object>} - Result object with success status and data/error information.
 */
export async function updateTasksDirect(args, log, context = {}) {
	const { session } = context;
	const { from, prompt, research, tasksJsonPath, projectRoot, tag } = args;

	// Create the standard logger wrapper
	const logWrapper = createLogWrapper(log);

	// --- Input Validation ---
	if (!projectRoot) {
		logWrapper.error('updateTasksDirect requires a projectRoot argument.');
		return {
			success: false,
			error: {
				code: 'MISSING_ARGUMENT',
				message: 'projectRoot is required.'
			}
		};
	}

	if (!from) {
		logWrapper.error('updateTasksDirect called without from ID');
		return {
			success: false,
			error: {
				code: 'MISSING_ARGUMENT',
				message: 'Starting chapter/scene ID (from) is required. All chapters with ID >= from will be updated.'
			}
		};
	}

	if (!prompt) {
		logWrapper.error('updateTasksDirect called without prompt');
		return {
			success: false,
			error: {
				code: 'MISSING_ARGUMENT',
				message: 'Narrative context prompt is required (describe the new story direction: tone, POV, stakes, lore changes)'
			}
		};
	}

	logWrapper.info(
		`Batch-updating chapters/scenes via direct function. From: ${from}, Research: ${research}, File: ${tasksJsonPath}, ProjectRoot: ${projectRoot}`
	);

	enableSilentMode(); // Enable silent mode
	try {
		// Call the core updateTasks function
		const result = await updateTasks(
			tasksJsonPath,
			from,
			prompt,
			research,
			{
				session,
				mcpLog: logWrapper,
				projectRoot,
				tag
			},
			'json'
		);

		if (result && result.success && Array.isArray(result.updatedTasks)) {
			logWrapper.success(
				`Successfully updated ${result.updatedTasks.length} chapters/scenes.`
			);
			return {
				success: true,
				data: {
					message: `Successfully updated ${result.updatedTasks.length} chapters/scenes with new narrative context.`,
					tasksPath: tasksJsonPath,
					updatedCount: result.updatedTasks.length,
					telemetryData: result.telemetryData,
					tagInfo: result.tagInfo
				}
			};
		} else {
			// Handle case where core function didn't return expected success structure
			logWrapper.error(
				'Core updateTasks function did not return a successful structure.'
			);
			return {
				success: false,
				error: {
					code: 'CORE_FUNCTION_ERROR',
					message:
						result?.message ||
						'Core function failed to update chapters/scenes or returned unexpected result.'
				}
			};
		}
	} catch (error) {
		logWrapper.error(`Error executing core updateTasks: ${error.message}`);
		return {
			success: false,
			error: {
				code: 'UPDATE_TASKS_CORE_ERROR',
				message: error.message || 'Unknown error updating chapters/scenes'
			}
		};
	} finally {
		disableSilentMode(); // Ensure silent mode is disabled
	}
}
