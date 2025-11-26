/**
 * set-task-status.js
 * Direct function implementation for setting chapter/scene/beat status
 */

import { setTaskStatus } from '../../../../scripts/modules/task-manager.js';
import {
	enableSilentMode,
	disableSilentMode,
	isSilentMode
} from '../../../../scripts/modules/utils.js';
import { nextTaskDirect } from './next-task.js';
/**
 * Direct function wrapper for setting chapter/scene/beat status with error handling.
 *
 * @param {Object} args - Command arguments containing id, status, tasksJsonPath, and projectRoot.
 * @param {string} args.id - The ID of the chapter/scene/beat to update (e.g., '12' or '12.3').
 * @param {string} args.status - The new status to set (pending, in-progress, draft, revision, done, deferred).
 * @param {string} args.tasksJsonPath - Path to the tasks.json file.
 * @param {string} args.projectRoot - Project root path (for MCP/env fallback)
 * @param {string} args.tag - Tag context (outline, draft, revision) for the task (optional)
 * @param {Object} log - Logger object.
 * @param {Object} context - Additional context (session)
 * @returns {Promise<Object>} - Result object with success status and data/error information.
 */
export async function setTaskStatusDirect(args, log, context = {}) {
	// Destructure expected args, including the resolved tasksJsonPath and projectRoot
	const { tasksJsonPath, id, status, complexityReportPath, projectRoot, tag } =
		args;
	const { session } = context;
	try {
		log.info(`Setting task status with args: ${JSON.stringify(args)}`);

		// Check if tasksJsonPath was provided
		if (!tasksJsonPath) {
			const errorMessage = 'tasksJsonPath is required but was not provided.';
			log.error(errorMessage);
			return {
				success: false,
				error: { code: 'MISSING_ARGUMENT', message: errorMessage }
			};
		}

		// Check required parameters (id and status)
		if (!id) {
			const errorMessage =
				'No chapter/scene ID specified. Please provide a chapter or beat ID to update (e.g., "12" or "12.3").';
			log.error(errorMessage);
			return {
				success: false,
				error: { code: 'MISSING_TASK_ID', message: errorMessage }
			};
		}

		if (!status) {
			const errorMessage =
				'No status specified. Please provide a new status value (pending, in-progress, draft, revision, done, deferred).';
			log.error(errorMessage);
			return {
				success: false,
				error: { code: 'MISSING_STATUS', message: errorMessage }
			};
		}

		// Use the provided path
		const tasksPath = tasksJsonPath;

		// Execute core setTaskStatus function
		const taskId = id;
		const newStatus = status;

		log.info(`Setting chapter/scene ${taskId} status to "${newStatus}"`);

		// Call the core function with proper silent mode handling
		enableSilentMode(); // Enable silent mode before calling core function
		try {
			// Call the core function
			await setTaskStatus(tasksPath, taskId, newStatus, {
				mcpLog: log,
				projectRoot,
				session,
				tag
			});

			log.info(`Successfully set chapter/scene ${taskId} status to ${newStatus}`);

			// Return success data
			const result = {
				success: true,
				data: {
					message: `Successfully updated chapter/scene ${taskId} status to "${newStatus}"`,
					taskId,
					status: newStatus,
					tasksPath: tasksPath // Return the path used
				}
			};

			// If the chapter/scene was completed, attempt to fetch the next one
			if (result.data.status === 'done') {
				try {
					log.info(`Attempting to fetch next chapter/scene after ${taskId}`);
					const nextResult = await nextTaskDirect(
						{
							tasksJsonPath: tasksJsonPath,
							reportPath: complexityReportPath,
							projectRoot: projectRoot,
							tag
						},
						log,
						{ session }
					);

					if (nextResult.success) {
						log.info(
							`Successfully retrieved next task: ${nextResult.data.nextTask}`
						);
						result.data = {
							...result.data,
							nextTask: nextResult.data.nextTask,
							isNextSubtask: nextResult.data.isSubtask,
							nextSteps: nextResult.data.nextSteps
						};
					} else {
						log.warn(
							`Failed to retrieve next task: ${nextResult.error?.message || 'Unknown error'}`
						);
					}
				} catch (nextErr) {
					log.error(`Error retrieving next task: ${nextErr.message}`);
				}
			}

			return result;
		} catch (error) {
			log.error(`Error setting task status: ${error.message}`);
			return {
				success: false,
				error: {
					code: 'SET_STATUS_ERROR',
					message: error.message || 'Unknown error setting task status'
				}
			};
		} finally {
			// ALWAYS restore normal logging in finally block
			disableSilentMode();
		}
	} catch (error) {
		// Ensure silent mode is disabled if there was an uncaught error in the outer try block
		if (isSilentMode()) {
			disableSilentMode();
		}

		log.error(`Error setting task status: ${error.message}`);
		return {
			success: false,
			error: {
				code: 'SET_STATUS_ERROR',
				message: error.message || 'Unknown error setting task status'
			}
		};
	}
}
