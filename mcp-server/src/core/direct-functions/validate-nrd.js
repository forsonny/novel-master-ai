/**
 * validate-nrd.js
 * Direct function implementation for validating NRD completeness
 */

import path from 'path';
import fs from 'fs';
import { resolvePrdPath } from '../utils/path-utils.js';
import { PRD_FILE, NOVELMASTER_REPORTS_DIR } from '../../../../src/constants/paths.js';

/**
 * Required sections for NRD validation
 */
const REQUIRED_SECTIONS = [
	{
		name: 'premise',
		keywords: ['premise', 'concept', 'core story', 'story concept', 'main idea'],
		description: 'Core story concept'
	},
	{
		name: 'act structure',
		keywords: [
			'act structure',
			'three-act',
			'act i',
			'act ii',
			'act iii',
			'act 1',
			'act 2',
			'act 3',
			'structure',
			'outline'
		],
		description: 'Three-act or alternative structure'
	},
	{
		name: 'character roster',
		keywords: [
			'character',
			'characters',
			'protagonist',
			'antagonist',
			'cast',
			'roster',
			'main characters'
		],
		description: 'Main characters with basic details'
	},
	{
		name: 'POV plan',
		keywords: [
			'pov',
			'point of view',
			'perspective',
			'narrator',
			'viewpoint',
			'narration'
		],
		description: 'Point of view strategy'
	},
	{
		name: 'world rules',
		keywords: [
			'world',
			'setting',
			'rules',
			'magic system',
			'technology',
			'universe',
			'worldbuilding',
			'lore'
		],
		description: 'Setting, magic system, technology, etc.'
	},
	{
		name: 'themes',
		keywords: ['theme', 'themes', 'motif', 'motifs', 'message', 'meaning'],
		description: 'Central themes and motifs'
	}
];

/**
 * Check if a section is present in the NRD content
 * @param {string} content - NRD content
 * @param {Object} section - Section definition with name and keywords
 * @returns {Object} - { found: boolean, confidence: number, location: string }
 */
function checkSection(content, section) {
	const lowerContent = content.toLowerCase();
	const sectionNameLower = section.name.toLowerCase();

	// Check for explicit section headers
	const headerPatterns = [
		new RegExp(`^#+\\s*${sectionNameLower}`, 'mi'),
		new RegExp(`^##+\\s*${sectionNameLower}`, 'mi'),
		new RegExp(`^\\*+\\s*${sectionNameLower}`, 'mi'),
		new RegExp(`^${sectionNameLower}:`, 'mi')
	];

	let found = false;
	let confidence = 0;
	let location = '';

	// Check for section headers
	for (const pattern of headerPatterns) {
		const match = content.match(pattern);
		if (match) {
			found = true;
			confidence = 0.9;
			location = `Found section header: ${match[0]}`;
			break;
		}
	}

	// Check for keywords if not found by header
	if (!found) {
		let keywordMatches = 0;
		for (const keyword of section.keywords) {
			const keywordPattern = new RegExp(`\\b${keyword}\\b`, 'gi');
			const matches = content.match(keywordPattern);
			if (matches) {
				keywordMatches += matches.length;
			}
		}

		// If multiple keywords found, likely the section exists
		if (keywordMatches >= 2) {
			found = true;
			confidence = Math.min(0.7, keywordMatches * 0.1);
			location = `Found ${keywordMatches} keyword matches`;
		} else if (keywordMatches === 1) {
			// Single keyword match - lower confidence
			found = true;
			confidence = 0.4;
			location = `Found 1 keyword match`;
		}
	}

	return { found, confidence, location };
}

/**
 * Validate NRD completeness
 * @param {Object} args - Arguments
 * @param {string} args.projectRoot - Project root path
 * @param {string} [args.nrdPath] - Path to NRD file (defaults to standard path)
 * @param {string} [args.output] - Output path for validation report
 * @param {Object} log - Logger object
 * @param {Object} context - Additional context
 * @returns {Promise<Object>} - Result object with validation data
 */
export async function validateNRDDirect(args, log, context = {}) {
	const { projectRoot, nrdPath, output } = args;
	const { session } = context;

	try {
		// Resolve NRD path
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

		// Check if NRD file exists
		if (!fs.existsSync(resolvedNrdPath)) {
			return {
				success: false,
				error: {
					code: 'FILE_NOT_FOUND',
					message: `NRD file not found at: ${resolvedNrdPath}`
				}
			};
		}

		// Read NRD content
		const nrdContent = fs.readFileSync(resolvedNrdPath, 'utf-8');
		if (!nrdContent || nrdContent.trim().length === 0) {
			return {
				success: false,
				error: {
					code: 'FILE_EMPTY',
					message: 'NRD file is empty'
				}
			};
		}

		// Validate each required section
		const sectionsFound = {};
		const missingSections = [];
		const recommendations = [];

		for (const section of REQUIRED_SECTIONS) {
			const checkResult = checkSection(nrdContent, section);
			sectionsFound[section.name] = {
				found: checkResult.found,
				confidence: checkResult.confidence,
				location: checkResult.location,
				description: section.description
			};

			if (!checkResult.found || checkResult.confidence < 0.5) {
				missingSections.push(section.name);
				recommendations.push(
					`Add a "${section.name}" section with ${section.description}`
				);
			} else if (checkResult.confidence < 0.7) {
				recommendations.push(
					`Consider expanding the "${section.name}" section for better clarity`
				);
			}
		}

		const complete = missingSections.length === 0;

		// Generate validation report
		const validationReport = {
			complete,
			missingSections,
			recommendations,
			sectionsFound,
			nrdPath: resolvedNrdPath,
			validatedAt: new Date().toISOString()
		};

		// Save report if output path specified
		if (output) {
			const outputPath = path.isAbsolute(output)
				? output
				: path.resolve(projectRoot, output);

			// Ensure reports directory exists
			const reportsDir = path.dirname(outputPath);
			if (!fs.existsSync(reportsDir)) {
				fs.mkdirSync(reportsDir, { recursive: true });
			}

			fs.writeFileSync(
				outputPath,
				JSON.stringify(validationReport, null, 2),
				'utf-8'
			);
			log.info(`Validation report saved to: ${outputPath}`);
		} else {
			// Save to default location
			const defaultOutputPath = path.resolve(
				projectRoot,
				NOVELMASTER_REPORTS_DIR,
				'nrd-validation.json'
			);
			const reportsDir = path.dirname(defaultOutputPath);
			if (!fs.existsSync(reportsDir)) {
				fs.mkdirSync(reportsDir, { recursive: true });
			}
			fs.writeFileSync(
				defaultOutputPath,
				JSON.stringify(validationReport, null, 2),
				'utf-8'
			);
			log.info(`Validation report saved to: ${defaultOutputPath}`);
		}

		log.info(
			`NRD validation ${complete ? 'passed' : 'failed'}. Missing sections: ${missingSections.length}`
		);

		return {
			success: true,
			data: validationReport
		};
	} catch (error) {
		log.error(`Error validating NRD: ${error.message}`);
		return {
			success: false,
			error: {
				code: 'VALIDATION_ERROR',
				message: `Failed to validate NRD: ${error.message}`,
				details: error.stack
			}
		};
	}
}

