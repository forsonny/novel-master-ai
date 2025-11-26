/**
 * tools/validate-nrd.js
 * Tool to validate NRD completeness
 */

import { z } from 'zod';
import {
	handleApiResult,
	withNormalizedProjectRoot,
	createErrorResponse
} from './utils.js';
import { validateNRDDirect } from '../core/direct-functions/validate-nrd.js';
import { PRD_FILE, NOVELMASTER_REPORTS_DIR } from '../../../src/constants/paths.js';

/**
 * Register the validate_nrd tool
 * @param {Object} server - FastMCP server instance
 */
export function registerValidateNRDTool(server) {
	server.addTool({
		name: 'validate_nrd',
		description:
			'Validate Novel Requirements Document (NRD) completeness against required sections. Checks for premise, act structure, character roster, POV plan, world rules, and themes. Returns validation report with missing sections and recommendations.',

		parameters: z.object({
			projectRoot: z
				.string()
				.describe('The directory of the project. Must be an absolute path.'),
			nrdPath: z
				.string()
				.optional()
				.describe(
					`Path to NRD file (defaults to ${PRD_FILE} if not specified)`
				),
			output: z
				.string()
				.optional()
				.describe(
					`Output path for validation report (defaults to ${NOVELMASTER_REPORTS_DIR}/nrd-validation.json)`
				)
		}),

		execute: withNormalizedProjectRoot(async (args, { log, session }) => {
			try {
				const result = await validateNRDDirect(args, log, { session });
				return handleApiResult(
					result,
					log,
					'Error validating NRD',
					undefined,
					args.projectRoot
				);
			} catch (error) {
				log.error(`Error in validate_nrd: ${error.message}`);
				return createErrorResponse(
					`Failed to validate NRD: ${error.message}`
				);
			}
		})
	});
}

