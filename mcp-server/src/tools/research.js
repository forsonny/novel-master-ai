/**
 * tools/research.js
 * Tool to perform AI-powered research queries with project context
 */

import { z } from 'zod';
import {
	createErrorResponse,
	handleApiResult,
	withNormalizedProjectRoot
} from './utils.js';
import { researchDirect } from '../core/novel-master-core.js';
import { resolveTag } from '../../../scripts/modules/utils.js';

/**
 * Register the research tool with the MCP server
 * @param {Object} server - FastMCP server instance
 */
export function registerResearchTool(server) {
	server.addTool({
		name: 'research',
		description:
			'Run AI-assisted narrative research (worldbuilding, genre studies, continuity checks) grounded in your Novel Master tasks/files.',

		parameters: z.object({
			query: z
				.string()
				.describe(
					'Narrative research question (e.g., "How do solar sails work?" or "What noir tropes fit Chapter 12?")'
				),
			taskIds: z
				.string()
				.optional()
				.describe(
					'Comma-separated list of chapter/scene IDs for context (e.g., "5,7.2,8")'
				),
			filePaths: z
				.string()
				.optional()
				.describe(
					'Comma-separated manuscript or lore files for context (e.g., "manuscript/01-chapter.md,lore/technology.md")'
				),
			customContext: z
				.string()
				.optional()
				.describe(
					'Additional context (character arcs, tone goals, editorial notes) to include in the research'
				),
			includeProjectTree: z
				.boolean()
				.optional()
				.describe(
					'Include a tree of your project directories (useful for large lore bibles)'
				),
			detailLevel: z
				.enum(['low', 'medium', 'high'])
				.optional()
				.describe(
					'Detail level for the response (default: medium). Use high for deep dives, low for quick references.'
				),
			saveTo: z
				.string()
				.optional()
				.describe(
					'Automatically save research notes to a specific chapter/scene task ID (e.g., "12" or "12.3")'
				),
			saveToFile: z
				.boolean()
				.optional()
				.describe(
					'Also write the research transcript to `.novelmaster/docs/research/` for later reference'
				),
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
				log.info(
					`Starting research with query: "${args.query.substring(0, 100)}${args.query.length > 100 ? '...' : ''}"`
				);

				// Call the direct function
				const result = await researchDirect(
					{
						query: args.query,
						taskIds: args.taskIds,
						filePaths: args.filePaths,
						customContext: args.customContext,
						includeProjectTree: args.includeProjectTree || false,
						detailLevel: args.detailLevel || 'medium',
						saveTo: args.saveTo,
						saveToFile: args.saveToFile || false,
						projectRoot: args.projectRoot,
						tag: resolvedTag
					},
					log,
					{ session }
				);

				return handleApiResult(
					result,
					log,
					'Error performing research',
					undefined,
					args.projectRoot
				);
			} catch (error) {
				log.error(`Error in research tool: ${error.message}`);
				return createErrorResponse(error.message);
			}
		})
	});
}
