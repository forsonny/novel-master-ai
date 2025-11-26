/**
 * update-task-by-id.js
 * Direct function implementation for updating a single chapter/scene by ID with new narrative information
 */

import { updateTaskById } from '../../../../scripts/modules/task-manager.js';
import {
	enableSilentMode,
	disableSilentMode,
	isSilentMode
} from '../../../../scripts/modules/utils.js';
import { createLogWrapper } from '../../tools/utils.js';
import { findTasksPath } from '../utils/path-utils.js';

/**
 * Direct function wrapper for updating a chapter/scene by ID with error handling.
 *
 * @param {Object} args - Command arguments containing id, prompt, useResearch, tasksJsonPath, and projectRoot.
 * @param {string} args.tasksJsonPath - Explicit path to the tasks.json file.
 * @param {string} args.id - Chapter/scene ID (or beat ID like "1.2").
 * @param {string} args.prompt - New narrative context (tone shift, POV change, stakes, lore updates).
 * @param {boolean} [args.research] - Whether to use research role for lore/genre-aware updates.
 * @param {boolean} [args.append] - Whether to append timestamped notes instead of full update (good for progress logs).
 * @param {string} [args.projectRoot] - Project root path.
 * @param {string} [args.tag] - Tag context (outline, draft, revision) for the chapter (optional)
 * @param {Object} log - Logger object.
 * @param {Object} context - Context object containing session data.
 * @returns {Promise<Object>} - Result object with success status and data/error information.
 */
export async function updateTaskByIdDirect(args, log, context = {}) {
	const { session } = context;
	// Destructure expected args, including projectRoot
	const { tasksJsonPath, id, prompt, research, append, projectRoot, tag } =
		args;

	const logWrapper = createLogWrapper(log);

	try {
		logWrapper.info(
			`Updating chapter/scene by ID via direct function. ID: ${id}, ProjectRoot: ${projectRoot}`
		);

		// Check required parameters (id and prompt)
		if (!id) {
			const errorMessage =
				'No chapter/scene ID specified. Please provide a chapter or beat ID to update (e.g., "12" or "12.3").';
			logWrapper.error(errorMessage);
			return {
				success: false,
				error: { code: 'INPUT_VALIDATION_ERROR', message: errorMessage }
			};
		}

		if (!prompt) {
			const errorMessage =
				'No narrative context provided. Please provide a prompt describing the new story direction (tone, POV, stakes, lore changes).';
			logWrapper.error(errorMessage);
			return {
				success: false,
				error: { code: 'INPUT_VALIDATION_ERROR', message: errorMessage }
			};
		}

		// Parse taskId - handle numeric, alphanumeric, and subtask IDs
		let taskId;
		if (typeof id === 'string') {
			// Keep ID as string - supports numeric (1, 2), alphanumeric (TAS-49, JIRA-123), and subtask IDs (1.2, TAS-49.1)
			taskId = id;
		} else if (typeof id === 'number') {
			// Convert number to string for consistency
			taskId = String(id);
		} else {
			const errorMessage = `Invalid task ID type: ${typeof id}. Task ID must be a string or number.`;
			logWrapper.error(errorMessage);
			return {
				success: false,
				error: { code: 'INPUT_VALIDATION_ERROR', message: errorMessage }
			};
		}

		// Resolve tasks.json path - use provided or find it
		const tasksPath =
			tasksJsonPath ||
			findTasksPath({ projectRoot, file: args.file }, logWrapper);
		if (!tasksPath) {
			const errorMessage = 'tasks.json path could not be resolved.';
			logWrapper.error(errorMessage);
			return {
				success: false,
				error: { code: 'INPUT_VALIDATION_ERROR', message: errorMessage }
			};
		}

		// Get research flag
		const useResearch = research === true;

		logWrapper.info(
			`Updating chapter/scene ${taskId} with narrative context "${prompt}" and research: ${useResearch}`
		);

		const wasSilent = isSilentMode();
		if (!wasSilent) {
			enableSilentMode();
		}

		try {
			// Call legacy script which handles both API and file storage via bridge
			const coreResult = await updateTaskById(
				tasksPath,
				taskId,
				prompt,
				useResearch,
				{
					mcpLog: logWrapper,
					session,
					projectRoot,
					tag,
					commandName: 'update-task',
					outputType: 'mcp'
				},
				'json',
				append || false
			);

			// Check if the core function returned null or an object without success
			if (!coreResult || coreResult.updatedTask === null) {
				const message = `Chapter/scene ${taskId} was not updated (likely already completed).`;
				logWrapper.info(message);
				return {
					success: true,
					data: {
						message: message,
						taskId: taskId,
						updated: false,
						telemetryData: coreResult?.telemetryData,
						tagInfo: coreResult?.tagInfo
					}
				};
			}

			const successMessage = `Successfully updated chapter/scene ${taskId} with new narrative context`;
			logWrapper.info(successMessage);
			return {
				success: true,
				data: {
					message: successMessage,
					taskId: taskId,
					tasksPath: tasksPath,
					useResearch: useResearch,
					updated: true,
					updatedTask: coreResult.updatedTask,
					telemetryData: coreResult.telemetryData,
					tagInfo: coreResult.tagInfo
				}
			};
		} catch (error) {
			logWrapper.error(`Error updating chapter/scene: ${error.message}`);
			return {
				success: false,
				error: {
					code: 'UPDATE_TASK_CORE_ERROR',
					message: error.message || 'Unknown error updating chapter/scene'
				}
			};
		} finally {
			if (!wasSilent && isSilentMode()) {
				disableSilentMode();
			}
		}
	} catch (error) {
		logWrapper.error(`Setup error in updateTaskByIdDirect: ${error.message}`);
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
