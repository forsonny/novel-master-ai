/**
 * remove-dependency.js
 * Direct function implementation for removing a narrative dependency
 */

import { removeDependency } from '../../../../scripts/modules/dependency-manager.js';
import {
	enableSilentMode,
	disableSilentMode
} from '../../../../scripts/modules/utils.js';

/**
 * Remove a narrative dependency (prerequisite relationship) from a chapter/scene
 * @param {Object} args - Function arguments
 * @param {string} args.tasksJsonPath - Explicit path to the tasks.json file.
 * @param {string|number} args.id - Chapter/scene ID to remove dependency from (e.g., "12" or "12.3")
 * @param {string|number} args.dependsOn - Chapter/scene ID to remove as a prerequisite
 * @param {string} args.projectRoot - Project root path (for MCP/env fallback)
 * @param {string} args.tag - Tag context (outline, draft, revision) for the task (optional)
 * @param {Object} log - Logger object
 * @returns {Promise<{success: boolean, data?: Object, error?: {code: string, message: string}}>}
 */
export async function removeDependencyDirect(args, log) {
	// Destructure expected args
	const { tasksJsonPath, id, dependsOn, projectRoot, tag } = args;
	try {
		log.info(`Removing dependency with args: ${JSON.stringify(args)}`);

		// Check if tasksJsonPath was provided
		if (!tasksJsonPath) {
			log.error('removeDependencyDirect called without tasksJsonPath');
			return {
				success: false,
				error: {
					code: 'MISSING_ARGUMENT',
					message: 'Tasks file path is required to remove a narrative dependency'
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
			`Removing narrative dependency: chapter/scene ${taskId} no longer depends on ${dependencyId}`
		);

		// Enable silent mode to prevent console logs from interfering with JSON response
		enableSilentMode();

		// Call the core function using the provided tasksPath
		await removeDependency(tasksPath, taskId, dependencyId, {
			projectRoot,
			tag
		});

		// Restore normal logging
		disableSilentMode();

		return {
			success: true,
			data: {
				message: `Successfully removed narrative dependency: Chapter/scene ${taskId} no longer depends on ${dependencyId}`,
				taskId: taskId,
				dependencyId: dependencyId
			}
		};
	} catch (error) {
		// Make sure to restore normal logging even if there's an error
		disableSilentMode();

		log.error(`Error in removeDependencyDirect: ${error.message}`);
		return {
			success: false,
			error: {
				code: 'CORE_FUNCTION_ERROR',
				message: error.message
			}
		};
	}
}
