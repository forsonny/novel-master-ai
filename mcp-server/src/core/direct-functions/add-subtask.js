/**
 * Direct function wrapper for adding a beat/scene to an existing chapter
 */

import { addSubtask } from '../../../../scripts/modules/task-manager.js';
import {
	enableSilentMode,
	disableSilentMode
} from '../../../../scripts/modules/utils.js';

/**
 * Add a beat/scene to an existing chapter
 * @param {Object} args - Function arguments
 * @param {string} args.tasksJsonPath - Explicit path to the tasks.json file.
 * @param {string} args.id - Parent chapter ID
 * @param {string} [args.taskId] - Existing chapter ID to convert to beat (optional)
 * @param {string} [args.title] - Title for new beat/scene (when creating a new beat)
 * @param {string} [args.description] - Description for new beat/scene
 * @param {string} [args.details] - Narrative details (POV, emotional beats, sensory cues, research hooks)
 * @param {string} [args.status] - Status for new beat (default: 'pending')
 * @param {string} [args.dependencies] - Comma-separated list of prerequisite beat/chapter IDs
 * @param {boolean} [args.skipGenerate] - Skip regenerating manuscript files
 * @param {string} [args.projectRoot] - Project root directory
 * @param {string} [args.tag] - Tag context (outline, draft, revision) for the chapter
 * @param {Object} log - Logger object
 * @returns {Promise<{success: boolean, data?: Object, error?: string}>}
 */
export async function addSubtaskDirect(args, log) {
	// Destructure expected args
	const {
		tasksJsonPath,
		id,
		taskId,
		title,
		description,
		details,
		status,
		dependencies: dependenciesStr,
		skipGenerate,
		projectRoot,
		tag
	} = args;
	try {
		log.info(`Adding subtask with args: ${JSON.stringify(args)}`);

		// Check if tasksJsonPath was provided
		if (!tasksJsonPath) {
			log.error('addSubtaskDirect called without tasksJsonPath');
			return {
				success: false,
				error: {
					code: 'MISSING_ARGUMENT',
					message: 'Tasks file path is required to add a beat/scene'
				}
			};
		}

		if (!id) {
			return {
				success: false,
				error: {
					code: 'INPUT_VALIDATION_ERROR',
					message: 'Parent chapter ID is required'
				}
			};
		}

		// Either taskId or title must be provided
		if (!taskId && !title) {
			return {
				success: false,
				error: {
					code: 'INPUT_VALIDATION_ERROR',
					message: 'Either provide an existing chapter ID to convert to a beat, or provide a title for a new beat/scene'
				}
			};
		}

		// Use provided path
		const tasksPath = tasksJsonPath;

		// Parse dependencies if provided
		let dependencies = [];
		if (dependenciesStr) {
			dependencies = dependenciesStr.split(',').map((depId) => {
				// Handle both regular IDs and dot notation
				return depId.includes('.') ? depId.trim() : parseInt(depId.trim(), 10);
			});
		}

		// Convert existingTaskId to a number if provided
		const existingTaskId = taskId ? parseInt(taskId, 10) : null;

		// Convert parent ID to a number
		const parentId = parseInt(id, 10);

		// Determine if we should generate files
		const generateFiles = !skipGenerate;

		// Enable silent mode to prevent console logs from interfering with JSON response
		enableSilentMode();

		const context = { projectRoot, tag };

		// Case 1: Convert existing chapter to beat
		if (existingTaskId) {
			log.info(`Converting chapter ${existingTaskId} to a beat within chapter ${parentId}`);
			const result = await addSubtask(
				tasksPath,
				parentId,
				existingTaskId,
				null,
				generateFiles,
				context
			);

			// Restore normal logging
			disableSilentMode();

			return {
				success: true,
				data: {
					message: `Chapter ${existingTaskId} successfully converted to a beat within chapter ${parentId}`,
					subtask: result
				}
			};
		}
		// Case 2: Create new beat/scene
		else {
			log.info(`Creating new beat/scene for chapter ${parentId}`);

			const newSubtaskData = {
				title: title,
				description: description || '',
				details: details || '',
				status: status || 'pending',
				dependencies: dependencies
			};

			const result = await addSubtask(
				tasksPath,
				parentId,
				null,
				newSubtaskData,
				generateFiles,
				context
			);

			// Restore normal logging
			disableSilentMode();

			return {
				success: true,
				data: {
					message: `New beat/scene ${parentId}.${result.id} successfully created`,
					subtask: result
				}
			};
		}
	} catch (error) {
		// Make sure to restore normal logging even if there's an error
		disableSilentMode();

		log.error(`Error in addSubtaskDirect: ${error.message}`);
		return {
			success: false,
			error: {
				code: 'CORE_FUNCTION_ERROR',
				message: error.message
			}
		};
	}
}
