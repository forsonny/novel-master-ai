/**
 * remove-subtask.js
 * Direct function implementation for removing a beat/scene from its parent chapter
 */

import { removeSubtask } from '../../../../scripts/modules/task-manager.js';
import {
	enableSilentMode,
	disableSilentMode
} from '../../../../scripts/modules/utils.js';

/**
 * Remove a beat/scene from its parent chapter
 * @param {Object} args - Function arguments
 * @param {string} args.tasksJsonPath - Explicit path to the tasks.json file.
 * @param {string} args.id - Beat/scene ID in format "chapterId.beatId" (e.g., "5.2") (required)
 * @param {boolean} [args.convert] - Whether to convert the beat to a standalone chapter
 * @param {boolean} [args.skipGenerate] - Skip regenerating manuscript files
 * @param {string} args.projectRoot - Project root path (for MCP/env fallback)
 * @param {string} args.tag - Tag context (outline, draft, revision) for the task (optional)
 * @param {Object} log - Logger object
 * @returns {Promise<{success: boolean, data?: Object, error?: {code: string, message: string}}>}
 */
export async function removeSubtaskDirect(args, log) {
	// Destructure expected args
	const { tasksJsonPath, id, convert, skipGenerate, projectRoot, tag } = args;
	try {
		// Enable silent mode to prevent console logs from interfering with JSON response
		enableSilentMode();

		log.info(`Removing subtask with args: ${JSON.stringify(args)}`);

		// Check if tasksJsonPath was provided
		if (!tasksJsonPath) {
			log.error('removeSubtaskDirect called without tasksJsonPath');
			disableSilentMode(); // Disable before returning
			return {
				success: false,
				error: {
					code: 'MISSING_ARGUMENT',
					message: 'Tasks file path is required to remove a beat/scene'
				}
			};
		}

		if (!id) {
			disableSilentMode(); // Disable before returning
			return {
				success: false,
				error: {
					code: 'INPUT_VALIDATION_ERROR',
					message:
						'Beat/scene ID is required and must be in format "chapterId.beatId" (e.g., "5.2")'
				}
			};
		}

		// Validate beat/scene ID format
		if (!id.includes('.')) {
			disableSilentMode(); // Disable before returning
			return {
				success: false,
				error: {
					code: 'INPUT_VALIDATION_ERROR',
					message: `Invalid beat/scene ID format: ${id}. Expected format: "chapterId.beatId" (e.g., "5.2")`
				}
			};
		}

		// Use provided path
		const tasksPath = tasksJsonPath;

		// Convert convertToTask to a boolean
		const convertToTask = convert === true;

		// Determine if we should generate files
		const generateFiles = !skipGenerate;

		log.info(
			`Removing beat/scene ${id} (convertToChapter: ${convertToTask}, generateFiles: ${generateFiles})`
		);

		// Use the provided tasksPath
		const result = await removeSubtask(
			tasksPath,
			id,
			convertToTask,
			generateFiles,
			{
				projectRoot,
				tag
			}
		);

		// Restore normal logging
		disableSilentMode();

		if (convertToTask && result) {
			// Return info about the converted chapter
			return {
				success: true,
				data: {
					message: `Beat/scene ${id} successfully converted to chapter #${result.id}`,
					task: result
				}
			};
		} else {
			// Return simple success message for deletion
			return {
				success: true,
				data: {
					message: `Beat/scene ${id} successfully removed`
				}
			};
		}
	} catch (error) {
		// Ensure silent mode is disabled even if an outer error occurs
		disableSilentMode();

		log.error(`Error in removeSubtaskDirect: ${error.message}`);
		return {
			success: false,
			error: {
				code: 'CORE_FUNCTION_ERROR',
				message: error.message
			}
		};
	}
}
