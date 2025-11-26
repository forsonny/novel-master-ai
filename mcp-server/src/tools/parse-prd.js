/**
 * tools/parse-prd.js
 * Tool to parse NRD (Novel Requirements Document) and generate story arcs/chapters
 */

import { z } from 'zod';
import {
	handleApiResult,
	withNormalizedProjectRoot,
	createErrorResponse,
	checkProgressCapability
} from './utils.js';
import { parsePRDDirect } from '../core/novel-master-core.js';
import {
	PRD_FILE,
	NOVELMASTER_DOCS_DIR,
	NOVELMASTER_TASKS_FILE
} from '../../../src/constants/paths.js';
import { resolveTag } from '../../../scripts/modules/utils.js';

/**
 * Register the parse_prd tool
 * @param {Object} server - FastMCP server instance
 */
export function registerParsePRDTool(server) {
	server.addTool({
		name: 'parse_prd',
		description: `Parse a Novel Requirements Document (NRD) text file to automatically generate story arcs and chapter tasks. Reinitializing the project is not necessary to run this tool. It is recommended to run parse-prd after initializing the project and placing nrd.txt inside ${NOVELMASTER_DOCS_DIR}.`,

		parameters: z.object({
			input: z
				.string()
				.optional()
				.default(PRD_FILE)
				.describe('Absolute path to the NRD document file (.txt, .md, etc.)'),
			projectRoot: z
				.string()
				.describe('The directory of the project. Must be an absolute path.'),
			tag: z.string().optional().describe('Tag context to operate on'),
			output: z
				.string()
				.optional()
				.describe(
					`Output path for tasks.json file (default: ${NOVELMASTER_TASKS_FILE})`
				),
			numTasks: z
				.string()
				.optional()
				.describe(
					'Approximate number of top-level narrative tasks (acts/chapters) to generate (default: 10). Set to 0 to let Novel Master scale output based on NRD complexity. Avoid values above 50 due to context limits.'
				),
			force: z
				.boolean()
				.optional()
				.default(false)
				.describe('Overwrite existing output file without prompting.'),
			research: z
				.boolean()
				.optional()
				.describe(
					'Enable worldbuilding / genre research mode for more detailed narrative guidance. Requires appropriate API key.'
				),
			append: z
				.boolean()
				.optional()
				.describe('Append generated tasks to existing file.')
		}),
		execute: withNormalizedProjectRoot(
			async (args, { log, session, reportProgress }) => {
				try {
					const resolvedTag = resolveTag({
						projectRoot: args.projectRoot,
						tag: args.tag
					});
					const progressCapability = checkProgressCapability(
						reportProgress,
						log
					);
					const result = await parsePRDDirect(
						{
							...args,
							tag: resolvedTag
						},
						log,
						{ session, reportProgress: progressCapability }
					);
					return handleApiResult(
						result,
						log,
						'Error parsing NRD',
						undefined,
						args.projectRoot
					);
				} catch (error) {
					log.error(`Error in parse_prd: ${error.message}`);
					return createErrorResponse(`Failed to parse NRD: ${error.message}`);
				}
			}
		)
	});
}
