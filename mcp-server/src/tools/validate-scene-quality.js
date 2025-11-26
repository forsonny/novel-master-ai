/**
 * tools/validate-scene-quality.js
 * Tool to validate scene quality before marking as done
 */

import { z } from 'zod';
import {
	handleApiResult,
	withNormalizedProjectRoot,
	createErrorResponse
} from './utils.js';
import { validateSceneQualityDirect } from '../core/direct-functions/validate-scene-quality.js';

/**
 * Register the validate_scene_quality tool
 * @param {Object} server - FastMCP server instance
 */
export function registerValidateSceneQualityTool(server) {
	server.addTool({
		name: 'validate_scene_quality',
		description:
			'Validate scene quality before marking as "done". Checks word count within target range (±20%), continuity with previous scenes, pacing appropriateness, POV consistency, and emotional beat achievement. Returns quality report with issues and recommendations.',

		parameters: z.object({
			projectRoot: z
				.string()
				.describe('The directory of the project. Must be an absolute path.'),
			id: z
				.string()
				.describe('Scene ID (e.g., "5.3" for scene 3 of chapter 5)'),
			tag: z
				.string()
				.optional()
				.describe('Tag context to validate scene in (defaults to current tag)')
		}),

		execute: withNormalizedProjectRoot(async (args, { log, session }) => {
			try {
				const result = await validateSceneQualityDirect(args, log, {
					session
				});
				return handleApiResult(
					result,
					log,
					'Error validating scene quality',
					undefined,
					args.projectRoot
				);
			} catch (error) {
				log.error(`Error in validate_scene_quality: ${error.message}`);
				return createErrorResponse(
					`Failed to validate scene quality: ${error.message}`
				);
			}
		})
	});
}

