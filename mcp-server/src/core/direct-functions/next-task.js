/**
 * next-task.js
 * Direct function implementation for finding the next chapter/scene/beat to work on
 */

import { findNextTask } from '../../../../scripts/modules/task-manager.js';
import {
	readJSON,
	readComplexityReport
} from '../../../../scripts/modules/utils.js';
import {
	enableSilentMode,
	disableSilentMode
} from '../../../../scripts/modules/utils.js';

/**
 * Direct function wrapper for finding the next chapter/scene/beat to work on with error handling and caching.
 *
 * @param {Object} args - Command arguments
 * @param {string} args.tasksJsonPath - Explicit path to the tasks.json file.
 * @param {string} args.reportPath - Path to the complexity/pacing report file.
 * @param {string} args.projectRoot - Project root path (for MCP/env fallback)
 * @param {string} args.tag - Tag context (outline, draft, revision) for the task (optional)
 * @param {Object} log - Logger object
 * @returns {Promise<Object>} - Next chapter/scene result { success: boolean, data?: any, error?: { code: string, message: string } }
 */
export async function nextTaskDirect(args, log, context = {}) {
	// Destructure expected args
	const { tasksJsonPath, reportPath, projectRoot, tag } = args;
	const { session } = context;

	if (!tasksJsonPath) {
		log.error('nextTaskDirect called without tasksJsonPath');
		return {
			success: false,
			error: {
				code: 'MISSING_ARGUMENT',
				message: 'Tasks file path is required to find the next chapter/scene'
			}
		};
	}

	// Define the action function to be executed on cache miss
	const coreNextTaskAction = async () => {
		try {
			// Enable silent mode to prevent console logs from interfering with JSON response
			enableSilentMode();

			log.info(`Finding next chapter/scene from ${tasksJsonPath}`);

			// Read tasks data using the provided path
			const data = readJSON(tasksJsonPath, projectRoot, tag);
			if (!data || !data.tasks) {
				disableSilentMode(); // Disable before return
				return {
					success: false,
					error: {
						code: 'INVALID_TASKS_FILE',
						message: `No valid chapters found in ${tasksJsonPath}`
					}
				};
			}

			// Read the complexity report
			const complexityReport = readComplexityReport(reportPath);

			// Find the next task
			const nextTask = findNextTask(data.tasks, complexityReport);

			if (!nextTask) {
				log.info(
					'No eligible next chapter/scene found. All chapters are either completed or have unsatisfied dependencies'
				);
				return {
					success: true,
					data: {
						message:
							'No eligible next chapter/scene found. All chapters are either completed or have unsatisfied dependencies',
						nextTask: null
					}
				};
			}

			// Check if it's a beat/scene (subtask)
			const isSubtask =
				typeof nextTask.id === 'string' && nextTask.id.includes('.');

			const taskOrSubtask = isSubtask ? 'beat/scene' : 'chapter';

			const additionalAdvice = isSubtask
				? 'Beats/scenes can be updated with timestamped narrative notes as you draft them. This is useful for tracking progress, marking milestones, and capturing insights (successful approaches or challenges encountered). Research can be used when updating the beat to collect worldbuilding facts, genre conventions, or continuity information. It is a good idea to get-task the parent chapter to collect the overall story context, and to get-task the beat to collect the specific scene details.'
				: 'Chapters can be updated to reflect changes in story direction, tone shifts, POV changes, or plot adjustments. Research can be used when updating the chapter to collect lore, genre conventions, or historical context. It is best to update beats/scenes as you draft them, and to update the chapter for more high-level changes that may affect pending scenes or the general narrative direction.';

			// Restore normal logging
			disableSilentMode();

			// Return the next chapter/scene data with the full tasks array for reference
			log.info(
				`Successfully found next ${taskOrSubtask} ${nextTask.id}: ${nextTask.title}. Is beat/scene: ${isSubtask}`
			);
			return {
				success: true,
				data: {
					nextTask,
					isSubtask,
					nextSteps: `When ready to work on the ${taskOrSubtask}, use set-status to set the status to "in-progress" ${additionalAdvice}`
				}
			};
		} catch (error) {
			// Make sure to restore normal logging even if there's an error
			disableSilentMode();

			log.error(`Error finding next chapter/scene: ${error.message}`);
			return {
				success: false,
				error: {
					code: 'CORE_FUNCTION_ERROR',
					message: error.message || 'Failed to find next chapter/scene'
				}
			};
		}
	};

	// Use the caching utility
	try {
		const result = await coreNextTaskAction();
		log.info('nextTaskDirect completed.');
		return result;
	} catch (error) {
		log.error(`Unexpected error during nextTask: ${error.message}`);
		return {
			success: false,
			error: {
				code: 'UNEXPECTED_ERROR',
				message: error.message
			}
		};
	}
}
