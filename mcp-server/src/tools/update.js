/**
 * tools/update.js
 * Tool to update tasks based on new context/prompt
 */

import { z } from 'zod';
import {
	handleApiResult,
	createErrorResponse,
	withNormalizedProjectRoot
} from './utils.js';
import { updateTasksDirect } from '../core/novel-master-core.js';
import { findTasksPath } from '../core/utils/path-utils.js';
import { resolveTag } from '../../../scripts/modules/utils.js';

/**
 * Register the update tool with the MCP server
 * @param {Object} server - FastMCP server instance
 */
export function registerUpdateTool(server) {
	server.addTool({
		name: 'update',
		description:
			"Update upcoming outline items (ID >= --from) when the story direction changes. Use 'update_task' for a single beat or 'update_subtask' for progress notes.",
		parameters: z.object({
			from: z
				.string()
				.describe(
					'First chapter/scene ID to update (inclusive). IMPORTANT: This tool uses --from, not --id.'
				),
			prompt: z
				.string()
				.describe('Explain the new story context to apply (tone, POV, stakes, lore).'),
			research: z
				.boolean()
				.optional()
				.describe('Enable lore/genre-aware updates'),
			file: z
				.string()
				.optional()
				.describe('Path to the tasks file relative to project root'),
			projectRoot: z
				.string()
				.optional()
				.describe(
					'The directory of the project. (Optional, usually from session)'
				),
			tag: z.string().optional().describe('Tag context to operate on')
		}),
		execute: withNormalizedProjectRoot(async (args, { log, session }) => {
			const toolName = 'update';
			const { from, prompt, research, file, projectRoot, tag } = args;

			const resolvedTag = resolveTag({
				projectRoot: args.projectRoot,
				tag: args.tag
			});

			try {
				log.info(
					`Executing ${toolName} tool with normalized root: ${projectRoot}`
				);

				let tasksJsonPath;
				try {
					tasksJsonPath = findTasksPath({ projectRoot, file }, log);
					log.info(`${toolName}: Resolved tasks path: ${tasksJsonPath}`);
				} catch (error) {
					log.error(`${toolName}: Error finding tasks.json: ${error.message}`);
					return createErrorResponse(
						`Failed to find tasks.json within project root '${projectRoot}': ${error.message}`
					);
				}

				const result = await updateTasksDirect(
					{
						tasksJsonPath: tasksJsonPath,
						from: from,
						prompt: prompt,
						research: research,
						projectRoot: projectRoot,
						tag: resolvedTag
					},
					log,
					{ session }
				);

				log.info(
					`${toolName}: Direct function result: success=${result.success}`
				);
				return handleApiResult(
					result,
					log,
					'Error updating tasks',
					undefined,
					args.projectRoot
				);
			} catch (error) {
				log.error(
					`Critical error in ${toolName} tool execute: ${error.message}`
				);
				return createErrorResponse(
					`Internal tool error (${toolName}): ${error.message}`
				);
			}
		})
	});
}
