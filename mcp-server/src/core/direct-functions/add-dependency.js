/**
 * add-dependency.js
 * Direct function implementation for adding a narrative dependency (prerequisite chapter/scene)
 */

import { addDependency } from '../../../../scripts/modules/dependency-manager.js';
import {
	enableSilentMode,
	disableSilentMode
} from '../../../../scripts/modules/utils.js';

/**
 * Direct function wrapper for adding a narrative dependency (prerequisite chapter/scene) with error handling.
 *
 * @param {Object} args - Command arguments
 * @param {string} args.tasksJsonPath - Explicit path to the tasks.json file.
 * @param {string|number} args.id - Chapter/scene ID that will depend on another (e.g., "12" or "12.3")
 * @param {string|number} args.dependsOn - Chapter/scene ID that must be completed first (the prerequisite)
 * @param {string} args.tag - Tag context (outline, draft, revision) for the task (optional)
 * @param {string} args.projectRoot - Project root path (for MCP/env fallback)
 * @param {Object} log - Logger object
 * @returns {Promise<Object>} - Result object with success status and data/error information
 */
export async function addDependencyDirect(args, log) {
	// Destructure expected args
	const { tasksJsonPath, id, dependsOn, tag, projectRoot } = args;
	try {
		log.info(`Adding dependency with args: ${JSON.stringify(args)}`);

		// Check if tasksJsonPath was provided
		if (!tasksJsonPath) {
			log.error('addDependencyDirect called without tasksJsonPath');
			return {
				success: false,
				error: {
					code: 'MISSING_ARGUMENT',
					message: 'Tasks file path is required to add a narrative dependency'
				}
			};
		}

		// Validate required parameters
		if (!id) {
			return {
				success: false,
				error: {
					code: 'INPUT_VALIDATION_ERROR',
					message: 'Chapter/scene ID (id) is required (e.g., "12" or "12.3")'
				}
			};
		}

		if (!dependsOn) {
			return {
				success: false,
				error: {
					code: 'INPUT_VALIDATION_ERROR',
					message: 'Prerequisite chapter/scene ID (dependsOn) is required (e.g., "5" or "5.2")'
				}
			};
		}

		// Use provided path
		const tasksPath = tasksJsonPath;

		// Format IDs for the core function
		const taskId =
			id && id.includes && id.includes('.') ? id : parseInt(id, 10);
		const dependencyId =
			dependsOn && dependsOn.includes && dependsOn.includes('.')
				? dependsOn
				: parseInt(dependsOn, 10);

		log.info(
			`Adding narrative dependency: chapter/scene ${taskId} will depend on ${dependencyId}`
		);

		// Enable silent mode to prevent console logs from interfering with JSON response
		enableSilentMode();

		// Create context object
		const context = { projectRoot, tag };

		// Call the core function using the provided path
		await addDependency(tasksPath, taskId, dependencyId, context);

		// Restore normal logging
		disableSilentMode();

		return {
			success: true,
			data: {
				message: `Successfully added narrative dependency: Chapter/scene ${taskId} now depends on ${dependencyId}`,
				taskId: taskId,
				dependencyId: dependencyId
			}
		};
	} catch (error) {
		// Make sure to restore normal logging even if there's an error
		disableSilentMode();

		log.error(`Error in addDependencyDirect: ${error.message}`);
		return {
			success: false,
			error: {
				code: 'CORE_FUNCTION_ERROR',
				message: error.message
			}
		};
	}
}
