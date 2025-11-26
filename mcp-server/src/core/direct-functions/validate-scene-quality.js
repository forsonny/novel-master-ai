/**
 * validate-scene-quality.js
 * Direct function implementation for validating scene quality
 */

import path from 'path';
import fs from 'fs';
import { readJSON, findTaskById } from '../../../../scripts/modules/utils.js';
import { resolveTag } from '../../../../scripts/modules/utils.js';
import { NOVELMASTER_TASKS_FILE } from '../../../../src/constants/paths.js';
import { countWords, parseWordCountTarget } from '../../../../scripts/modules/utils/word-count.js';

/**
 * Validate scene quality
 * @param {Object} args - Arguments
 * @param {string} args.projectRoot - Project root path
 * @param {string} args.id - Scene ID (e.g., "5.3")
 * @param {string} [args.tag] - Tag context (defaults to current tag)
 * @param {Object} log - Logger object
 * @param {Object} context - Additional context
 * @returns {Promise<Object>} - Result object with quality validation data
 */
export async function validateSceneQualityDirect(args, log, context = {}) {
	const { projectRoot, id, tag } = args;

	try {
		if (!id) {
			return {
				success: false,
				error: {
					code: 'MISSING_ARGUMENT',
					message: 'Scene ID is required'
				}
			};
		}

		const resolvedTag = resolveTag({
			projectRoot,
			tag
		});

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

		// Find the scene
		const { task: scene } = findTaskById(tasks, id);
		if (!scene) {
			return {
				success: false,
				error: {
					code: 'TASK_NOT_FOUND',
					message: `Scene with ID ${id} not found in tag '${resolvedTag}'`
				}
			};
		}

		// Extract draft content from task details
		const draftContent = scene.details || '';
		const draftWordCount = countWords(draftContent);

		// Get word count target from metadata
		const targetWordCount = parseWordCountTarget(
			scene.metadata?.wordCountTarget
		);

		// Validate word count
		const wordCountIssues = [];
		let wordCountScore = 100;
		if (targetWordCount && targetWordCount > 0) {
			const percentage = (draftWordCount / targetWordCount) * 100;
			if (percentage < 80) {
				wordCountIssues.push(
					`Word count (${draftWordCount}) is ${Math.round(100 - percentage)}% below target (${targetWordCount})`
				);
				wordCountScore = Math.max(0, percentage);
			} else if (percentage > 120) {
				wordCountIssues.push(
					`Word count (${draftWordCount}) is ${Math.round(percentage - 100)}% above target (${targetWordCount})`
				);
				wordCountScore = Math.max(0, 120 - (percentage - 100));
			}
		} else if (draftWordCount === 0) {
			wordCountIssues.push('Scene has no draft content');
			wordCountScore = 0;
		}

		// Check POV consistency
		const povIssues = [];
		const expectedPOV = scene.metadata?.pov;
		if (expectedPOV && draftContent) {
			// Basic POV check - look for first-person indicators if POV is first person
			const lowerContent = draftContent.toLowerCase();
			if (expectedPOV.toLowerCase().includes('first') && !lowerContent.includes('i ') && !lowerContent.includes(' i ')) {
				povIssues.push('Expected first-person POV but no first-person indicators found');
			}
		}

		// Check for emotional beat
		const emotionalBeatIssues = [];
		const expectedBeat = scene.metadata?.emotionalBeat;
		if (expectedBeat && draftContent) {
			// Basic check - see if emotional beat keywords are mentioned
			const beatKeywords = expectedBeat.toLowerCase().split(/\s+/);
			const lowerContent = draftContent.toLowerCase();
			const foundKeywords = beatKeywords.filter(keyword => 
				lowerContent.includes(keyword) && keyword.length > 3
			);
			if (foundKeywords.length === 0 && beatKeywords.length > 0) {
				emotionalBeatIssues.push(
					`Expected emotional beat "${expectedBeat}" but no related keywords found in content`
				);
			}
		}

		// Check continuity with previous scenes (basic check)
		const continuityIssues = [];
		if (scene.dependencies && scene.dependencies.length > 0 && draftContent) {
			// Check if dependencies are referenced
			for (const depId of scene.dependencies) {
				const { task: depScene } = findTaskById(tasks, depId);
				if (depScene) {
					// Basic check - see if dependency scene title or key terms are mentioned
					const depTitle = depScene.title?.toLowerCase() || '';
					const depKeywords = depTitle.split(/\s+/).filter(w => w.length > 3);
					const lowerContent = draftContent.toLowerCase();
					const foundRefs = depKeywords.filter(keyword => lowerContent.includes(keyword));
					
					// This is a very basic check - in a real implementation, you'd use AI analysis
					if (foundRefs.length === 0 && depKeywords.length > 0) {
						continuityIssues.push(
							`No clear reference to previous scene ${depId} (${depScene.title})`
						);
					}
				}
			}
		}

		// Check pacing (basic check based on word count vs target)
		const pacingIssues = [];
		if (targetWordCount && draftWordCount > 0) {
			const ratio = draftWordCount / targetWordCount;
			// Very basic pacing check - scenes that are too short or too long relative to target
			if (ratio < 0.5) {
				pacingIssues.push('Scene is significantly shorter than target - may need expansion');
			} else if (ratio > 2.0) {
				pacingIssues.push('Scene is significantly longer than target - may need tightening');
			}
		}

		// Compile all issues
		const allIssues = [
			...wordCountIssues,
			...povIssues,
			...emotionalBeatIssues,
			...continuityIssues,
			...pacingIssues
		];

		// Calculate overall quality score
		const scores = {
			wordCount: wordCountScore,
			pov: povIssues.length === 0 ? 100 : 50,
			emotionalBeat: emotionalBeatIssues.length === 0 ? 100 : 50,
			continuity: continuityIssues.length === 0 ? 100 : Math.max(0, 100 - (continuityIssues.length * 25)),
			pacing: pacingIssues.length === 0 ? 100 : 50
		};

		const overallScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length;
		const meetsCriteria = overallScore >= 75 && allIssues.length === 0;

		// Generate recommendations
		const recommendations = [];
		if (wordCountIssues.length > 0) {
			if (draftWordCount < targetWordCount) {
				recommendations.push('Expand scene content to meet word count target');
			} else {
				recommendations.push('Tighten prose to meet word count target');
			}
		}
		if (povIssues.length > 0) {
			recommendations.push('Ensure POV consistency matches scene metadata');
		}
		if (emotionalBeatIssues.length > 0) {
			recommendations.push('Incorporate the expected emotional beat into the scene');
		}
		if (continuityIssues.length > 0) {
			recommendations.push('Add references to previous scenes for better continuity');
		}
		if (pacingIssues.length > 0) {
			recommendations.push('Adjust scene pacing to match target length');
		}

		const validationResult = {
			meetsCriteria,
			issues: allIssues,
			metrics: {
				wordCount: draftWordCount,
				targetWordCount: targetWordCount || null,
				wordCountPercentage: targetWordCount ? Math.round((draftWordCount / targetWordCount) * 100) : null,
				pacingScore: scores.pacing,
				continuityScore: scores.continuity,
				overallScore: Math.round(overallScore)
			},
			recommendations,
			scores
		};

		log.info(
			`Scene quality validation ${meetsCriteria ? 'passed' : 'failed'} for scene ${id}. Score: ${Math.round(overallScore)}/100`
		);

		return {
			success: true,
			data: validationResult
		};
	} catch (error) {
		log.error(`Error validating scene quality: ${error.message}`);
		return {
			success: false,
			error: {
				code: 'VALIDATION_ERROR',
				message: `Failed to validate scene quality: ${error.message}`,
				details: error.stack
			}
		};
	}
}

