/**
 * read-manuscript-summary.js
 * Direct function implementation for reading manuscript summary
 */

import path from 'path';
import fs from 'fs';
import { resolveTag } from '../../../../scripts/modules/utils.js';
import { NOVELMASTER_MANUSCRIPT_DIR } from '../../../../src/constants/paths.js';

/**
 * Read manuscript summary for a given tag
 * @param {Object} args - Arguments
 * @param {string} args.projectRoot - Project root path
 * @param {string} [args.tag] - Tag context (defaults to current tag)
 * @param {Object} log - Logger object
 * @param {Object} context - Additional context
 * @returns {Promise<Object>} - Result object with summary data
 */
export async function readManuscriptSummaryDirect(args, log, context = {}) {
	const { projectRoot, tag } = args;

	try {
		const resolvedTag = resolveTag({
			projectRoot,
			tag
		});

		// Construct path to manuscript summary
		const summaryPath = path.join(
			projectRoot,
			NOVELMASTER_MANUSCRIPT_DIR,
			resolvedTag,
			'manuscript-summary.json'
		);

		// Check if summary file exists
		if (!fs.existsSync(summaryPath)) {
			return {
				success: false,
				error: {
					code: 'FILE_NOT_FOUND',
					message: `Manuscript summary not found for tag '${resolvedTag}'. Run 'generate' command first to create manuscript files.`,
					path: summaryPath
				}
			};
		}

		// Read and parse summary file
		const summaryContent = fs.readFileSync(summaryPath, 'utf-8');
		const summaryData = JSON.parse(summaryContent);

		log.info(`Successfully read manuscript summary for tag '${resolvedTag}'`);

		return {
			success: true,
			data: {
				tag: resolvedTag,
				summaryPath,
				summary: summaryData
			}
		};
	} catch (error) {
		log.error(`Error reading manuscript summary: ${error.message}`);
		return {
			success: false,
			error: {
				code: 'READ_ERROR',
				message: `Failed to read manuscript summary: ${error.message}`,
				details: error.stack
			}
		};
	}
}

