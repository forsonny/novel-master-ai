/**
 * update-subtask-by-id.js
 * Direct function implementation for appending narrative notes to a specific beat/scene
 */

import { updateSubtaskById } from '../../../../scripts/modules/task-manager.js';
import {
	enableSilentMode,
	disableSilentMode,
	isSilentMode
} from '../../../../scripts/modules/utils.js';
import { createLogWrapper } from '../../tools/utils.js';

/**
 * Direct function wrapper for appending narrative notes to a beat/scene with error handling.
 *
 * @param {Object} args - Command arguments containing id, prompt, useResearch, tasksJsonPath, and projectRoot.
 * @param {string} args.tasksJsonPath - Explicit path to the tasks.json file.
 * @param {string} args.id - Beat/scene ID in format "chapterId.beatId" (e.g., "5.2").
 * @param {string} args.prompt - Narrative notes to append (research findings, revision notes, sensory inspiration, editorial feedback).
 * @param {boolean} [args.research] - Whether to use research role for lore/genre-aware context before appending.
 * @param {string} [args.projectRoot] - Project root path.
 * @param {string} [args.tag] - Tag context (outline, draft, revision) for the beat (optional)
 * @param {Object} log - Logger object.
 * @param {Object} context - Context object containing session data.
 * @returns {Promise<Object>} - Result object with success status and data/error information.
 */
export async function updateSubtaskByIdDirect(args, log, context = {}) {
	const { session } = context;
	// Destructure expected args, including projectRoot
	const { tasksJsonPath, id, prompt, research, projectRoot, tag } = args;

	const logWrapper = createLogWrapper(log);

	try {
		logWrapper.info(
			`Updating beat/scene by ID via direct function. ID: ${id}, ProjectRoot: ${projectRoot}`
		);

		// Check if tasksJsonPath was provided
		if (!tasksJsonPath) {
			const errorMessage = 'Tasks file path is required to update a beat/scene.';
			logWrapper.error(errorMessage);
			return {
				success: false,
				error: { code: 'MISSING_ARGUMENT', message: errorMessage }
			};
		}

		// Basic validation for ID format (e.g., '5.2')
		if (!id || typeof id !== 'string' || !id.includes('.')) {
			const errorMessage =
				'Invalid beat/scene ID format. Must be in format "chapterId.beatId" (e.g., "5.2").';
			logWrapper.error(errorMessage);
			return {
				success: false,
				error: { code: 'INVALID_SUBTASK_ID', message: errorMessage }
			};
		}

		if (!prompt) {
			const errorMessage =
				'No narrative notes provided. Please provide notes to append (research findings, revision notes, sensory inspiration, etc.).';
			logWrapper.error(errorMessage);
			return {
				success: false,
				error: { code: 'MISSING_PROMPT', message: errorMessage }
			};
		}

		// Validate subtask ID format
		const subtaskId = id;
		if (typeof subtaskId !== 'string' && typeof subtaskId !== 'number') {
			const errorMessage = `Invalid subtask ID type: ${typeof subtaskId}. Subtask ID must be a string or number.`;
			log.error(errorMessage);
			return {
				success: false,
				error: { code: 'INVALID_SUBTASK_ID_TYPE', message: errorMessage }
			};
		}

		const subtaskIdStr = String(subtaskId);
		if (!subtaskIdStr.includes('.')) {
			const errorMessage = `Invalid subtask ID format: ${subtaskIdStr}. Subtask ID must be in format "parentId.subtaskId" (e.g., "5.2").`;
			log.error(errorMessage);
			return {
				success: false,
				error: { code: 'INVALID_SUBTASK_ID_FORMAT', message: errorMessage }
			};
		}

		// Use the provided path
		const tasksPath = tasksJsonPath;
		const useResearch = research === true;

		log.info(
			`Appending narrative notes to beat/scene ${subtaskIdStr} with research: ${useResearch}`
		);

		const wasSilent = isSilentMode();
		if (!wasSilent) {
			enableSilentMode();
		}

		try {
			// Call legacy script which handles both API and file storage via bridge
			const coreResult = await updateSubtaskById(
				tasksPath,
				subtaskIdStr,
				prompt,
				useResearch,
				{
					mcpLog: logWrapper,
					session,
					projectRoot,
					tag,
					commandName: 'update-subtask',
					outputType: 'mcp'
				},
				'json'
			);

			if (!coreResult || coreResult.updatedSubtask === null) {
				const message = `Subtask ${id} or its parent task not found.`;
				logWrapper.error(message);
				return {
					success: false,
					error: { code: 'SUBTASK_NOT_FOUND', message: message }
				};
			}

			const parentId = subtaskIdStr.split('.')[0];
			const successMessage = `Successfully updated subtask with ID ${subtaskIdStr}`;
			logWrapper.success(successMessage);
			return {
				success: true,
				data: {
					message: `Successfully updated subtask with ID ${subtaskIdStr}`,
					subtaskId: subtaskIdStr,
					parentId: parentId,
					subtask: coreResult.updatedSubtask,
					tasksPath,
					useResearch,
					telemetryData: coreResult.telemetryData,
					tagInfo: coreResult.tagInfo
				}
			};
		} catch (error) {
			logWrapper.error(`Error updating subtask by ID: ${error.message}`);
			return {
				success: false,
				error: {
					code: 'UPDATE_SUBTASK_CORE_ERROR',
					message: error.message || 'Unknown error updating subtask'
				}
			};
		} finally {
			if (!wasSilent && isSilentMode()) {
				disableSilentMode();
			}
		}
	} catch (error) {
		logWrapper.error(
			`Setup error in updateSubtaskByIdDirect: ${error.message}`
		);
		if (isSilentMode()) disableSilentMode();
		return {
			success: false,
			error: {
				code: 'DIRECT_FUNCTION_SETUP_ERROR',
				message: error.message || 'Unknown setup error'
			}
		};
	}
}
