/**
 * copy-tag.js
 * Direct function implementation for copying a tag context (duplicates all chapters/scenes to a new tag)
 */

import { copyTag } from '../../../../scripts/modules/task-manager/tag-management.js';
import {
	enableSilentMode,
	disableSilentMode
} from '../../../../scripts/modules/utils.js';
import { createLogWrapper } from '../../tools/utils.js';

/**
 * Direct function wrapper for copying a tag context (duplicates all chapters/scenes to a new tag) with error handling.
 *
 * @param {Object} args - Command arguments
 * @param {string} args.sourceName - Name of the source tag context to copy from (e.g., "draft")
 * @param {string} args.targetName - Name of the new tag context to create (e.g., "draft-backup")
 * @param {string} [args.description] - Optional description for the new tag context
 * @param {string} [args.tasksJsonPath] - Path to the tasks.json file (resolved by tool)
 * @param {string} [args.projectRoot] - Project root path
 * @param {Object} log - Logger object
 * @param {Object} context - Additional context (session)
 * @returns {Promise<Object>} - Result object { success: boolean, data?: any, error?: { code: string, message: string } }
 */
export async function copyTagDirect(args, log, context = {}) {
	// Destructure expected args
	const { tasksJsonPath, sourceName, targetName, description, projectRoot } =
		args;
	const { session } = context;

	// Enable silent mode to prevent console logs from interfering with JSON response
	enableSilentMode();

	// Create logger wrapper using the utility
	const mcpLog = createLogWrapper(log);

	try {
		// Check if tasksJsonPath was provided
		if (!tasksJsonPath) {
			log.error('copyTagDirect called without tasksJsonPath');
			disableSilentMode();
			return {
				success: false,
				error: {
					code: 'MISSING_ARGUMENT',
					message: 'Tasks file path is required to copy a tag context'
				}
			};
		}

		// Check required parameters
		if (!sourceName || typeof sourceName !== 'string') {
			log.error('Missing required parameter: sourceName');
			disableSilentMode();
			return {
				success: false,
				error: {
					code: 'MISSING_PARAMETER',
					message: 'Source tag context name is required and must be a string (e.g., "draft")'
				}
			};
		}

		if (!targetName || typeof targetName !== 'string') {
			log.error('Missing required parameter: targetName');
			disableSilentMode();
			return {
				success: false,
				error: {
					code: 'MISSING_PARAMETER',
					message: 'Target tag context name is required and must be a string (e.g., "draft-backup")'
				}
			};
		}

		log.info(`Copying tag context from "${sourceName}" to "${targetName}" (duplicating all chapters/scenes)`);

		// Prepare options
		const options = {
			description
		};

		// Call the copyTag function
		const result = await copyTag(
			tasksJsonPath,
			sourceName,
			targetName,
			options,
			{
				session,
				mcpLog,
				projectRoot
			},
			'json' // outputFormat - use 'json' to suppress CLI UI
		);

		// Restore normal logging
		disableSilentMode();

		return {
			success: true,
			data: {
				sourceName: result.sourceName,
				targetName: result.targetName,
				copied: result.copied,
				chaptersCopied: result.tasksCopied,
				description: result.description,
				message: `Successfully copied tag context from "${result.sourceName}" to "${result.targetName}" (copied ${result.tasksCopied} chapter(s))`
			}
		};
	} catch (error) {
		// Make sure to restore normal logging even if there's an error
		disableSilentMode();

		log.error(`Error in copyTagDirect: ${error.message}`);
		return {
			success: false,
			error: {
				code: error.code || 'COPY_TAG_ERROR',
				message: error.message
			}
		};
	}
}
