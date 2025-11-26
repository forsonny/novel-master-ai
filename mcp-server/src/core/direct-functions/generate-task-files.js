/**
 * generate-task-files.js
 * Direct function implementation for generating manuscript files (chapters, scenes, compiled manuscript) from tasks.json
 */

import { generateTaskFiles } from '../../../../scripts/modules/task-manager.js';
import {
	enableSilentMode,
	disableSilentMode
} from '../../../../scripts/modules/utils.js';

/**
 * Direct function wrapper for generating manuscript files (chapter markdown, compiled manuscript, summary) with error handling.
 *
 * @param {Object} args - Command arguments containing tasksJsonPath and outputDir.
 * @param {string} args.tasksJsonPath - Path to the tasks.json file.
	 * @param {string} args.outputDir - Path to the output directory (default: .novelmaster/manuscript/<tag>).
	 * @param {string} args.projectRoot - Project root path (for MCP/env fallback)
	 * @param {string} args.tag - Tag context (outline, draft, revision) for the manuscript (optional)
	 * @param {string} [args.format='md'] - Export format for compiled manuscript: 'md' (markdown) or 'txt' (plain text)
	 * @param {Object} log - Logger object.
 * @returns {Promise<Object>} - Result object with success status and data/error information.
 */
export async function generateTaskFilesDirect(args, log) {
	// Destructure expected args
	const { tasksJsonPath, outputDir, projectRoot, tag, format = 'md' } = args;
	try {
		log.info(`Generating task files with args: ${JSON.stringify(args)}`);

		// Check if paths were provided
		if (!tasksJsonPath) {
			const errorMessage = 'Tasks file path is required to generate manuscript files.';
			log.error(errorMessage);
			return {
				success: false,
				error: { code: 'MISSING_ARGUMENT', message: errorMessage }
			};
		}
		// outputDir is optional - will use default .novelmaster/manuscript/<tag> if not provided
		if (!outputDir) {
			log.info('No output directory specified, using default manuscript directory');
		}

		// Use the provided paths
		const tasksPath = tasksJsonPath;
		const resolvedOutputDir = outputDir;

		log.info(`Generating manuscript files from ${tasksPath} to ${resolvedOutputDir || 'default location'}`);

		let generationResult;
		try {
			enableSilentMode();

			generationResult = generateTaskFiles(tasksPath, resolvedOutputDir, {
				projectRoot,
				tag,
				format,
				mcpLog: log
			});

			disableSilentMode();
		} catch (genError) {
			disableSilentMode();

			log.error(`Error generating manuscript files: ${genError.message}`);
			return {
				success: false,
				error: { code: 'GENERATE_FILES_ERROR', message: genError.message }
			};
		}

		return {
			success: true,
			data: {
				message: `Successfully generated manuscript assets (chapters, compiled manuscript, summary) for tag '${tag}'`,
				tasksPath,
				outputDir: resolvedOutputDir,
				result: generationResult
			}
		};
	} catch (error) {
		// Make sure to restore normal logging if an outer error occurs
		disableSilentMode();

		log.error(`Error generating manuscript files: ${error.message}`);
		return {
			success: false,
			error: {
				code: 'GENERATE_TASKS_ERROR',
				message: error.message || 'Unknown error generating manuscript files'
			}
		};
	}
}
