/**
 * tools/generate.js
 * Tool to generate individual task files from tasks.json
 */

import { z } from 'zod';
import {
	handleApiResult,
	createErrorResponse,
	withNormalizedProjectRoot
} from './utils.js';
import { generateTaskFilesDirect } from '../core/novel-master-core.js';
import { findTasksPath } from '../core/utils/path-utils.js';
import { resolveTag } from '../../../scripts/modules/utils.js';
import path from 'path';
import { NOVELMASTER_MANUSCRIPT_DIR } from '../../../src/constants/paths.js';

/**
 * Register the generate tool with the MCP server
 * @param {Object} server - FastMCP server instance
 */
export function registerGenerateTool(server) {
	server.addTool({
		name: 'generate',
		description:
			'Generate chapter/scene markdown files plus compiled manuscripts from tasks.json',
		parameters: z.object({
			file: z.string().optional().describe('Absolute path to the tasks file'),
			output: z
				.string()
				.optional()
				.describe(
					'Output directory (default: .novelmaster/manuscript inside the project)'
				),
			projectRoot: z
				.string()
				.describe('The directory of the project. Must be an absolute path.'),
			tag: z.string().optional().describe('Tag context to operate on'),
			format: z
				.enum(['md', 'txt'])
				.optional()
				.default('md')
				.describe(
					'Export format for compiled manuscript: "md" (markdown) or "txt" (plain text). Default: "md"'
				)
		}),
		execute: withNormalizedProjectRoot(async (args, { log, session }) => {
			try {
				log.info(`Generating task files with args: ${JSON.stringify(args)}`);

				const resolvedTag = resolveTag({
					projectRoot: args.projectRoot,
					tag: args.tag
				});
				// Use args.projectRoot directly (guaranteed by withNormalizedProjectRoot)
				let tasksJsonPath;
				try {
					tasksJsonPath = findTasksPath(
						{ projectRoot: args.projectRoot, file: args.file },
						log
					);
				} catch (error) {
					log.error(`Error finding tasks.json: ${error.message}`);
					return createErrorResponse(
						`Failed to find tasks.json: ${error.message}`
					);
				}

				const defaultOutputDir = path.join(
					args.projectRoot,
					NOVELMASTER_MANUSCRIPT_DIR
				);
				const outputDir = args.output
					? path.resolve(args.projectRoot, args.output)
					: defaultOutputDir;

				const result = await generateTaskFilesDirect(
					{
						tasksJsonPath: tasksJsonPath,
						outputDir: outputDir,
						projectRoot: args.projectRoot,
						tag: resolvedTag,
						format: args.format || 'md'
					},
					log,
					{ session }
				);

				if (result.success) {
					log.info(`Successfully generated task files: ${result.data.message}`);
				} else {
					log.error(
						`Failed to generate task files: ${result.error?.message || 'Unknown error'}`
					);
				}

				return handleApiResult(
					result,
					log,
					'Error generating task files',
					undefined,
					args.projectRoot
				);
			} catch (error) {
				log.error(`Error in generate tool: ${error.message}`);
				return createErrorResponse(error.message);
			}
		})
	});
}
