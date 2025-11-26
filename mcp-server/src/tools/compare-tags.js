/**
 * tools/compare-tags.js
 * Tool to compare two tags to measure improvement
 */

import { z } from 'zod';
import {
	handleApiResult,
	withNormalizedProjectRoot,
	createErrorResponse
} from './utils.js';
import { compareTagsDirect } from '../core/direct-functions/compare-tags.js';

/**
 * Register the compare_tags tool
 * @param {Object} server - FastMCP server instance
 */
export function registerCompareTagsTool(server) {
	server.addTool({
		name: 'compare_tags',
		description:
			'Compare two tags to measure improvement. Supports metrics: pacing, continuity, word_count, quality. Returns comparison report with improvement percentage and whether improvement threshold is met.',

		parameters: z.object({
			projectRoot: z
				.string()
				.describe('The directory of the project. Must be an absolute path.'),
			tag1: z.string().describe('First tag to compare (e.g., "draft")'),
			tag2: z
				.string()
				.describe('Second tag to compare (e.g., "rev-1")'),
			metric: z
				.enum(['pacing', 'continuity', 'word_count', 'quality'])
				.optional()
				.default('quality')
				.describe('Metric to compare (defaults to "quality")')
		}),

		execute: withNormalizedProjectRoot(async (args, { log, session }) => {
			try {
				const result = await compareTagsDirect(args, log, { session });
				return handleApiResult(
					result,
					log,
					'Error comparing tags',
					undefined,
					args.projectRoot
				);
			} catch (error) {
				log.error(`Error in compare_tags: ${error.message}`);
				return createErrorResponse(
					`Failed to compare tags: ${error.message}`
				);
			}
		})
	});
}

