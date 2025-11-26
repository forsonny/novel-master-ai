/**
 * tools/add-subtask.js
 * Tool for adding subtasks to existing tasks
 */

import { z } from 'zod';
import {
	handleApiResult,
	createErrorResponse,
	withNormalizedProjectRoot
} from './utils.js';
import { addSubtaskDirect } from '../core/novel-master-core.js';
import { findTasksPath } from '../core/utils/path-utils.js';
import { resolveTag } from '../../../scripts/modules/utils.js';

/**
 * Register the addSubtask tool with the MCP server
 * @param {Object} server - FastMCP server instance
 */
export function registerAddSubtaskTool(server) {
	server.addTool({
		name: 'add_subtask',
		description:
			'Add a beat/subscene beneath an existing chapter/scene task or convert an existing task into a beat.',
		parameters: z.object({
			id: z.string().describe('Parent chapter/scene ID (required)'),
			taskId: z
				.string()
				.optional()
				.describe('Existing task ID to convert into a beat'),
			title: z
				.string()
				.optional()
				.describe('Title for the new beat (e.g., "Beat 3 – Rooftop Chase")'),
			description: z
				.string()
				.optional()
				.describe('Description for the new beat (summary of action/emotion)'),
			details: z
				.string()
				.optional()
				.describe('Sensory cues, POV notes, or research hooks for the beat'),
			status: z
				.string()
				.optional()
				.describe("Status for the new beat (default: 'pending')"),
			dependencies: z
				.string()
				.optional()
				.describe(
					'Comma-separated list of prerequisite beats/arcs for the new beat'
				),
			file: z
				.string()
				.optional()
				.describe(
					'Absolute path to the tasks file (default: tasks/tasks.json)'
				),
			skipGenerate: z
				.boolean()
				.optional()
				.describe('Skip regenerating chapter Markdown files'),
			projectRoot: z
				.string()
				.describe('The directory of the project. Must be an absolute path.'),
			tag: z.string().optional().describe('Tag context to operate on')
		}),
		execute: withNormalizedProjectRoot(async (args, { log, session }) => {
			try {
				const resolvedTag = resolveTag({
					projectRoot: args.projectRoot,
					tag: args.tag
				});
				log.info(`Adding subtask with args: ${JSON.stringify(args)}`);

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

				const result = await addSubtaskDirect(
					{
						tasksJsonPath: tasksJsonPath,
						id: args.id,
						taskId: args.taskId,
						title: args.title,
						description: args.description,
						details: args.details,
						status: args.status,
						dependencies: args.dependencies,
						skipGenerate: args.skipGenerate,
						projectRoot: args.projectRoot,
						tag: resolvedTag
					},
					log,
					{ session }
				);

				if (result.success) {
					log.info(`Subtask added successfully: ${result.data.message}`);
				} else {
					log.error(`Failed to add subtask: ${result.error.message}`);
				}

				return handleApiResult(
					result,
					log,
					'Error adding subtask',
					undefined,
					args.projectRoot
				);
			} catch (error) {
				log.error(`Error in addSubtask tool: ${error.message}`);
				return createErrorResponse(error.message);
			}
		})
	});
}
