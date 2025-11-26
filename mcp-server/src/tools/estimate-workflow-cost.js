/**
 * tools/estimate-workflow-cost.js
 * Tool to estimate workflow cost
 */

import { z } from 'zod';
import {
	handleApiResult,
	withNormalizedProjectRoot,
	createErrorResponse
} from './utils.js';
import { estimateWorkflowCostDirect } from '../core/direct-functions/estimate-workflow-cost.js';

/**
 * Register the estimate_workflow_cost tool
 * @param {Object} server - FastMCP server instance
 */
export function registerEstimateWorkflowCostTool(server) {
	server.addTool({
		name: 'estimate_workflow_cost',
		description:
			'Estimate total cost for workflow execution. Provides cost breakdown by phase with detailed assumptions. Useful for planning and budget management.',

		parameters: z.object({
			projectRoot: z
				.string()
				.describe('The directory of the project. Must be an absolute path.'),
			phases: z
				.array(z.string())
				.optional()
				.default(['parse', 'expand', 'draft', 'revise'])
				.describe('Phases to estimate costs for'),
			estimatedScenes: z
				.number()
				.optional()
				.default(50)
				.describe('Estimated number of scenes'),
			estimatedWords: z
				.number()
				.optional()
				.default(80000)
				.describe('Estimated total word count'),
			modelPreferences: z
				.record(z.any())
				.optional()
				.describe('Model preferences per phase (optional)')
		}),

		execute: withNormalizedProjectRoot(async (args, { log, session }) => {
			try {
				const result = await estimateWorkflowCostDirect(args, log, {
					session
				});
				return handleApiResult(
					result,
					log,
					'Error estimating workflow cost',
					undefined,
					args.projectRoot
				);
			} catch (error) {
				log.error(`Error in estimate_workflow_cost: ${error.message}`);
				return createErrorResponse(
					`Failed to estimate workflow cost: ${error.message}`
				);
			}
		})
	});
}

