/**
 * clear-subtasks.js
 * Direct function implementation for clearing beats/scenes from chapters
 */

import { clearSubtasks } from '../../../../scripts/modules/task-manager.js';
import {
	enableSilentMode,
	disableSilentMode,
	readJSON
} from '../../../../scripts/modules/utils.js';
import fs from 'fs';
import path from 'path';

/**
 * Clear beats/scenes from specified chapters
 * @param {Object} args - Function arguments
 * @param {string} args.tasksJsonPath - Explicit path to the tasks.json file.
 * @param {string} [args.id] - Chapter IDs (comma-separated) to clear beats from (e.g., "5" or "5,6,7")
 * @param {boolean} [args.all] - Clear beats from all chapters
 * @param {string} [args.tag] - Tag context (outline, draft, revision) to operate on (defaults to current active tag)
 * @param {string} [args.projectRoot] - Project root path (for MCP/env fallback)
 * @param {Object} log - Logger object
 * @returns {Promise<{success: boolean, data?: Object, error?: {code: string, message: string}}>}
 */
export async function clearSubtasksDirect(args, log) {
	// Destructure expected args
	const { tasksJsonPath, id, all, tag, projectRoot } = args;
	try {
		log.info(`Clearing subtasks with args: ${JSON.stringify(args)}`);

		// Check if tasksJsonPath was provided
		if (!tasksJsonPath) {
			log.error('clearSubtasksDirect called without tasksJsonPath');
			return {
				success: false,
				error: {
					code: 'MISSING_ARGUMENT',
					message: 'Tasks file path is required to clear beats/scenes'
				}
			};
		}

		// Either id or all must be provided
		if (!id && !all) {
			return {
				success: false,
				error: {
					code: 'INPUT_VALIDATION_ERROR',
					message:
						'Either provide chapter IDs with id parameter (e.g., "5" or "5,6,7") or use all parameter to clear beats from all chapters'
				}
			};
		}

		// Use provided path
		const tasksPath = tasksJsonPath;

		// Check if tasks.json exists
		if (!fs.existsSync(tasksPath)) {
			return {
				success: false,
				error: {
					code: 'FILE_NOT_FOUND_ERROR',
					message: `Tasks file not found at ${tasksPath}`
				}
			};
		}

		let taskIds;

		// Use readJSON which handles silent migration and tag resolution
		const data = readJSON(tasksPath, projectRoot, tag);

		if (!data || !data.tasks) {
			return {
				success: false,
				error: {
					code: 'INPUT_VALIDATION_ERROR',
					message: `No chapters found in tasks file: ${tasksPath}`
				}
			};
		}

		const currentTag = data.tag || tag;
		const tasks = data.tasks;

		// If all is specified, get all chapter IDs
		if (all) {
			log.info(`Clearing beats/scenes from all chapters in tag '${currentTag}'`);
			if (tasks.length === 0) {
				return {
					success: false,
					error: {
						code: 'INPUT_VALIDATION_ERROR',
						message: `No chapters found in tag context '${currentTag}'`
					}
				};
			}
			taskIds = tasks.map((t) => t.id).join(',');
		} else {
			// Use the provided chapter IDs
			taskIds = id;
		}

		log.info(`Clearing beats/scenes from chapters: ${taskIds} in tag '${currentTag}'`);

		// Enable silent mode to prevent console logs from interfering with JSON response
		enableSilentMode();

		// Call the core function
		clearSubtasks(tasksPath, taskIds, { projectRoot, tag: currentTag });

		// Restore normal logging
		disableSilentMode();

		// Read the updated data to provide a summary
		const updatedData = readJSON(tasksPath, projectRoot, currentTag);
		const taskIdArray = taskIds.split(',').map((id) => parseInt(id.trim(), 10));

		// Build a summary of what was done
		const clearedTasksCount = taskIdArray.length;
		const updatedTasks = updatedData.tasks || [];

		const taskSummary = taskIdArray.map((id) => {
			const task = updatedTasks.find((t) => t.id === id);
			return task ? { id, title: task.title } : { id, title: 'Task not found' };
		});

		return {
			success: true,
			data: {
				message: `Successfully cleared beats/scenes from ${clearedTasksCount} chapter(s) in tag '${currentTag}'`,
				tasksCleared: taskSummary,
				tag: currentTag
			}
		};
	} catch (error) {
		// Make sure to restore normal logging even if there's an error
		disableSilentMode();

		log.error(`Error in clearSubtasksDirect: ${error.message}`);
		return {
			success: false,
			error: {
				code: 'CORE_FUNCTION_ERROR',
				message: error.message
			}
		};
	}
}
