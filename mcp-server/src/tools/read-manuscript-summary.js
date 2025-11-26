/**
 * tools/read-manuscript-summary.js
 * Tool to read manuscript summary for validation
 */

import { z } from 'zod';
import {
	handleApiResult,
	withNormalizedProjectRoot,
	createErrorResponse
} from './utils.js';
import { readManuscriptSummaryDirect } from '../core/direct-functions/read-manuscript-summary.js';

/**
 * Register the read_manuscript_summary tool
 * @param {Object} server - FastMCP server instance
 */
export function registerReadManuscriptSummaryTool(server) {
	server.addTool({
		name: 'read_manuscript_summary',
		description:
			'Read manuscript summary for a given tag. Returns word counts, targets, completion status, and chapter information. Use this to validate manuscript progress and check phase gates.',

		parameters: z.object({
			projectRoot: z
				.string()
				.describe('The directory of the project. Must be an absolute path.'),
			tag: z
				.string()
				.optional()
				.describe('Tag context to read summary for (defaults to current tag)')
		}),

		execute: withNormalizedProjectRoot(async (args, { log, session }) => {
			try {
				const result = await readManuscriptSummaryDirect(
					args,
					log,
					{ session }
				);
				return handleApiResult(
					result,
					log,
					'Error reading manuscript summary',
					undefined,
					args.projectRoot
				);
			} catch (error) {
				log.error(`Error in read_manuscript_summary: ${error.message}`);
				return createErrorResponse(
					`Failed to read manuscript summary: ${error.message}`
				);
			}
		})
	});
}

