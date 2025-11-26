/**
 * validate-dependencies.js
 * Direct function implementation for validating narrative dependencies (prerequisite relationships)
 */

import { validateDependenciesCommand } from '../../../../scripts/modules/dependency-manager.js';
import {
	enableSilentMode,
	disableSilentMode
} from '../../../../scripts/modules/utils.js';
import fs from 'fs';

/**
 * Validate narrative dependencies (prerequisite relationships) in tasks.json
 * Checks for circular references, missing prerequisites, and invalid dependency chains.
 * @param {Object} args - Function arguments
 * @param {string} args.tasksJsonPath - Explicit path to the tasks.json file.
 * @param {string} args.projectRoot - Project root path (for MCP/env fallback)
 * @param {string} args.tag - Tag context (outline, draft, revision) for the task (optional)
 * @param {Object} log - Logger object
 * @returns {Promise<{success: boolean, data?: Object, error?: {code: string, message: string}}>}
 */
export async function validateDependenciesDirect(args, log) {
	// Destructure the explicit tasksJsonPath
	const { tasksJsonPath, projectRoot, tag } = args;

	if (!tasksJsonPath) {
		log.error('validateDependenciesDirect called without tasksJsonPath');
		return {
			success: false,
			error: {
				code: 'MISSING_ARGUMENT',
				message: 'Tasks file path is required to validate narrative dependencies'
			}
		};
	}

	try {
		log.info(`Validating narrative dependencies in chapters: ${tasksJsonPath}`);

		// Use the provided tasksJsonPath
		const tasksPath = tasksJsonPath;

		// Verify the file exists
		if (!fs.existsSync(tasksPath)) {
			return {
				success: false,
				error: {
					code: 'FILE_NOT_FOUND',
					message: `Tasks file not found at ${tasksPath}`
				}
			};
		}

		// Enable silent mode to prevent console logs from interfering with JSON response
		enableSilentMode();

		const options = { projectRoot, tag };
		// Call the original command function using the provided tasksPath
		await validateDependenciesCommand(tasksPath, options);

		// Restore normal logging
		disableSilentMode();

		return {
			success: true,
			data: {
				message: 'Narrative dependencies validated successfully (no circular references or missing prerequisites found)',
				tasksPath
			}
		};
	} catch (error) {
		// Make sure to restore normal logging even if there's an error
		disableSilentMode();

		log.error(`Error validating dependencies: ${error.message}`);
		return {
			success: false,
			error: {
				code: 'VALIDATION_ERROR',
				message: error.message
			}
		};
	}
}
