/**
 * validate-nrd-compliance.js
 * Direct function implementation for validating NRD compliance
 */

import path from 'path';
import fs from 'fs';
import { readJSON, findTaskById } from '../../../../scripts/modules/utils.js';
import { resolveTag } from '../../../../scripts/modules/utils.js';
import { resolvePrdPath } from '../utils/path-utils.js';
import { PRD_FILE, NOVELMASTER_TASKS_FILE } from '../../../../src/constants/paths.js';
import { countWords } from '../../../../scripts/modules/utils/word-count.js';

/**
 * Extract character names from NRD
 * @param {string} nrdContent - NRD content
 * @returns {Array<string>} - List of character names
 */
function extractCharacters(nrdContent) {
	const characters = [];
	const characterSection = nrdContent.match(
		/#+\s*character[s]?[^#]*/i
	);
	if (characterSection) {
		// Extract character names (basic pattern matching)
		const namePattern = /[-*]\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g;
		let match;
		while ((match = namePattern.exec(characterSection[0])) !== null) {
			characters.push(match[1].trim());
		}
	}
	return characters;
}

/**
 * Extract world rules from NRD
 * @param {string} nrdContent - NRD content
 * @returns {Array<string>} - List of world rules
 */
function extractWorldRules(nrdContent) {
	const rules = [];
	const worldSection = nrdContent.match(/#+\s*world[^#]*/i);
	if (worldSection) {
		// Extract rules (basic pattern matching)
		const rulePattern = /[-*]\s*(.+)/g;
		let match;
		while ((match = rulePattern.exec(worldSection[0])) !== null) {
			const rule = match[1].trim();
			if (rule.length > 10) {
				rules.push(rule);
			}
		}
	}
	return rules;
}

/**
 * Extract themes from NRD
 * @param {string} nrdContent - NRD content
 * @returns {Array<string>} - List of themes
 */
function extractThemes(nrdContent) {
	const themes = [];
	const themeSection = nrdContent.match(/#+\s*theme[s]?[^#]*/i);
	if (themeSection) {
		const themePattern = /[-*]\s*(.+)/g;
		let match;
		while ((match = themePattern.exec(themeSection[0])) !== null) {
			themes.push(match[1].trim());
		}
	}
	return themes;
}

/**
 * Check character consistency
 * @param {Array} tasks - All tasks
 * @param {Array<string>} nrdCharacters - Characters from NRD
 * @returns {Array<Object>} - List of deviations
 */
function checkCharacterConsistency(tasks, nrdCharacters) {
	const deviations = [];
	const foundCharacters = new Set();

	// Collect character mentions from tasks
	for (const task of tasks) {
		const content = (task.details || '').toLowerCase();
		for (const char of nrdCharacters) {
			if (content.includes(char.toLowerCase())) {
				foundCharacters.add(char);
			}
		}

		// Check subtasks
		if (task.subtasks) {
			for (const subtask of task.subtasks) {
				const subContent = (subtask.details || '').toLowerCase();
				for (const char of nrdCharacters) {
					if (subContent.includes(char.toLowerCase())) {
						foundCharacters.add(char);
					}
				}
			}
		}
	}

	// Check for characters in NRD but not in manuscript
	for (const char of nrdCharacters) {
		if (!foundCharacters.has(char)) {
			deviations.push({
				type: 'missing_character',
				character: char,
				issue: `Character "${char}" from NRD not found in manuscript`
			});
		}
	}

	return deviations;
}

/**
 * Validate NRD compliance
 * @param {Object} args - Arguments
 * @param {string} args.projectRoot - Project root path
 * @param {string} [args.nrdPath] - Path to NRD file
 * @param {string} args.tag - Tag context to validate
 * @param {Object} log - Logger object
 * @param {Object} context - Additional context
 * @returns {Promise<Object>} - Result object with compliance data
 */
export async function validateNRDComplianceDirect(args, log, context = {}) {
	const { projectRoot, nrdPath, tag } = args;
	const { session } = context;

	try {
		if (!tag) {
			return {
				success: false,
				error: {
					code: 'MISSING_ARGUMENT',
					message: 'Tag is required for compliance validation'
				}
			};
		}

		const resolvedTag = resolveTag({
			projectRoot,
			tag
		});

		// Load NRD
		let resolvedNrdPath;
		if (nrdPath) {
			try {
				resolvedNrdPath = resolvePrdPath({ input: nrdPath, projectRoot }, session);
			} catch (error) {
				return {
					success: false,
					error: {
						code: 'FILE_NOT_FOUND',
						message: `NRD file not found: ${error.message}`
					}
				};
			}
		} else {
			resolvedNrdPath = path.resolve(projectRoot, PRD_FILE);
		}

		if (!fs.existsSync(resolvedNrdPath)) {
			return {
				success: false,
				error: {
					code: 'FILE_NOT_FOUND',
					message: `NRD file not found at: ${resolvedNrdPath}`
				}
			};
		}

		const nrdContent = fs.readFileSync(resolvedNrdPath, 'utf-8');

		// Load tasks
		const tasksPath = path.resolve(projectRoot, NOVELMASTER_TASKS_FILE);
		if (!fs.existsSync(tasksPath)) {
			return {
				success: false,
				error: {
					code: 'FILE_NOT_FOUND',
					message: `Tasks file not found at: ${tasksPath}`
				}
			};
		}

		const tasksData = readJSON(tasksPath, projectRoot, resolvedTag);
		const tasks = tasksData?.tasks || [];

		// Extract NRD elements
		const nrdCharacters = extractCharacters(nrdContent);
		const nrdWorldRules = extractWorldRules(nrdContent);
		const nrdThemes = extractThemes(nrdContent);

		// Check compliance
		const deviations = [];

		// Character consistency
		const characterDeviations = checkCharacterConsistency(tasks, nrdCharacters);
		deviations.push(...characterDeviations);

		// Basic structure check - count chapters vs expected
		const actStructureMatch = nrdContent.match(/act\s+(i|1|ii|2|iii|3)/gi);
		if (actStructureMatch && tasks.length > 0) {
			const expectedActs = actStructureMatch.length;
			// Rough check - if we have significantly fewer tasks than expected acts
			if (tasks.length < expectedActs / 2) {
				deviations.push({
					type: 'structure_mismatch',
					issue: `NRD suggests ${expectedActs} acts but only ${tasks.length} chapters found`
				});
			}
		}

		// Calculate compliance score
		const totalChecks = nrdCharacters.length + (nrdWorldRules.length > 0 ? 1 : 0) + (nrdThemes.length > 0 ? 1 : 0) + 1; // +1 for structure
		const passedChecks = totalChecks - deviations.length;
		const complianceScore = totalChecks > 0 ? Math.round((passedChecks / totalChecks) * 100) : 100;

		const compliant = complianceScore >= 90;

		// Generate recommendations
		const recommendations = [];
		if (characterDeviations.length > 0) {
			recommendations.push('Ensure all characters from NRD appear in the manuscript');
		}
		if (deviations.some(d => d.type === 'structure_mismatch')) {
			recommendations.push('Review chapter structure to match NRD act structure');
		}
		if (complianceScore < 90) {
			recommendations.push('Review manuscript for alignment with NRD requirements');
		}

		const complianceReport = {
			compliant,
			deviations,
			complianceScore,
			recommendations,
			tag: resolvedTag,
			validatedAt: new Date().toISOString(),
			summary: {
				totalDeviations: deviations.length,
				characterDeviations: characterDeviations.length,
				structureDeviations: deviations.filter(d => d.type === 'structure_mismatch').length
			}
		};

		log.info(
			`NRD compliance validation ${compliant ? 'passed' : 'failed'}. Score: ${complianceScore}/100`
		);

		return {
			success: true,
			data: complianceReport
		};
	} catch (error) {
		log.error(`Error validating NRD compliance: ${error.message}`);
		return {
			success: false,
			error: {
				code: 'VALIDATION_ERROR',
				message: `Failed to validate NRD compliance: ${error.message}`,
				details: error.stack
			}
		};
	}
}

