/**
 * tools/validate-nrd-compliance.js
 * Tool to validate NRD compliance
 */

import { z } from 'zod';
import {
	handleApiResult,
	withNormalizedProjectRoot,
	createErrorResponse
} from './utils.js';
import { validateNRDComplianceDirect } from '../core/direct-functions/validate-nrd-compliance.js';
import { PRD_FILE } from '../../../src/constants/paths.js';

/**
 * Register the validate_nrd_compliance tool
 * @param {Object} server - FastMCP server instance
 */
export function registerValidateNRDComplianceTool(server) {
	server.addTool({
		name: 'validate_nrd_compliance',
		description:
			'Check if manuscript complies with NRD requirements. Validates character consistency, world rules adherence, theme presence, POV plan compliance, and act structure alignment. Returns compliance report with deviations and recommendations.',

		parameters: z.object({
			projectRoot: z
				.string()
				.describe('The directory of the project. Must be an absolute path.'),
			nrdPath: z
				.string()
				.optional()
				.describe(`Path to NRD file (defaults to ${PRD_FILE} if not specified)`),
			tag: z
				.string()
				.describe('Tag context to validate compliance for (e.g., "rev-1")')
		}),

		execute: withNormalizedProjectRoot(async (args, { log, session }) => {
			try {
				const result = await validateNRDComplianceDirect(args, log, {
					session
				});
				return handleApiResult(
					result,
					log,
					'Error validating NRD compliance',
					undefined,
					args.projectRoot
				);
			} catch (error) {
				log.error(`Error in validate_nrd_compliance: ${error.message}`);
				return createErrorResponse(
					`Failed to validate NRD compliance: ${error.message}`
				);
			}
		})
	});
}

