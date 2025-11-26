/**
 * compare-tags.js
 * Direct function implementation for comparing tags
 */

import path from 'path';
import fs from 'fs';
import { readJSON } from '../../../../scripts/modules/utils.js';
import { resolveTag } from '../../../../scripts/modules/utils.js';
import { NOVELMASTER_TASKS_FILE } from '../../../../src/constants/paths.js';
import { countWords, parseWordCountTarget, calculateWordCountStats } from '../../../../scripts/modules/utils/word-count.js';

/**
 * Calculate metrics for a tag
 * @param {Array} tasks - Tasks for the tag
 * @returns {Object} - Metrics object
 */
function calculateTagMetrics(tasks) {
	if (!tasks || tasks.length === 0) {
		return {
			wordCount: 0,
			taskCount: 0,
			completedCount: 0,
			averageWordCount: 0,
			completionRate: 0
		};
	}

	let totalWords = 0;
	let completedTasks = 0;
	let totalTargetWords = 0;

	for (const task of tasks) {
		const taskWords = countWords(task.details || '');
		totalWords += taskWords;

		if (task.status === 'done' || task.status === 'completed') {
			completedTasks++;
		}

		const targetWords = parseWordCountTarget(task.metadata?.wordCountTarget);
		if (targetWords) {
			totalTargetWords += targetWords;
		}

		// Include subtasks
		if (task.subtasks) {
			for (const subtask of task.subtasks) {
				const subtaskWords = countWords(subtask.details || '');
				totalWords += subtaskWords;

				if (subtask.status === 'done' || subtask.status === 'completed') {
					completedTasks++;
				}

				const subtaskTarget = parseWordCountTarget(subtask.metadata?.wordCountTarget);
				if (subtaskTarget) {
					totalTargetWords += subtaskTarget;
				}
			}
		}
	}

	const totalTasks = tasks.length + tasks.reduce((sum, t) => sum + (t.subtasks?.length || 0), 0);
	const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
	const averageWordCount = tasks.length > 0 ? Math.round(totalWords / tasks.length) : 0;

	return {
		wordCount: totalWords,
		taskCount: tasks.length,
		completedCount: completedTasks,
		averageWordCount,
		completionRate: Math.round(completionRate),
		targetWordCount: totalTargetWords
	};
}

/**
 * Compare two tags
 * @param {Object} args - Arguments
 * @param {string} args.projectRoot - Project root path
 * @param {string} args.tag1 - First tag to compare
 * @param {string} args.tag2 - Second tag to compare
 * @param {string} [args.metric] - Metric to compare (pacing, continuity, word_count, quality)
 * @param {Object} log - Logger object
 * @param {Object} context - Additional context
 * @returns {Promise<Object>} - Result object with comparison data
 */
export async function compareTagsDirect(args, log, context = {}) {
	const { projectRoot, tag1, tag2, metric = 'quality' } = args;

	try {
		if (!tag1 || !tag2) {
			return {
				success: false,
				error: {
					code: 'MISSING_ARGUMENT',
					message: 'Both tag1 and tag2 are required'
				}
			};
		}

		const resolvedTag1 = resolveTag({
			projectRoot,
			tag: tag1
		});

		const resolvedTag2 = resolveTag({
			projectRoot,
			tag: tag2
		});

		// Load tasks for both tags
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

		const tasksData1 = readJSON(tasksPath, projectRoot, resolvedTag1);
		const tasks1 = tasksData1?.tasks || [];

		const tasksData2 = readJSON(tasksPath, projectRoot, resolvedTag2);
		const tasks2 = tasksData2?.tasks || [];

		// Calculate metrics for both tags
		const metrics1 = calculateTagMetrics(tasks1);
		const metrics2 = calculateTagMetrics(tasks2);

		// Calculate improvement based on metric
		let improvement = 0;
		let improved = false;

		switch (metric) {
			case 'word_count':
				if (metrics1.wordCount > 0) {
					improvement = ((metrics2.wordCount - metrics1.wordCount) / metrics1.wordCount) * 100;
				}
				improved = metrics2.wordCount >= metrics1.wordCount;
				break;

			case 'pacing':
				// Pacing improvement: higher completion rate and better word count distribution
				const pacing1 = metrics1.completionRate;
				const pacing2 = metrics2.completionRate;
				if (pacing1 > 0) {
					improvement = ((pacing2 - pacing1) / pacing1) * 100;
				}
				improved = pacing2 >= pacing1;
				break;

			case 'continuity':
				// Continuity: based on task count consistency (more tasks = better continuity tracking)
				if (metrics1.taskCount > 0) {
					improvement = ((metrics2.taskCount - metrics1.taskCount) / metrics1.taskCount) * 100;
				}
				improved = metrics2.taskCount >= metrics1.taskCount;
				break;

			case 'quality':
			default:
				// Overall quality: combination of completion rate and word count
				const quality1 = (metrics1.completionRate + (metrics1.wordCount > 0 ? 50 : 0)) / 2;
				const quality2 = (metrics2.completionRate + (metrics2.wordCount > 0 ? 50 : 0)) / 2;
				if (quality1 > 0) {
					improvement = ((quality2 - quality1) / quality1) * 100;
				}
				improved = quality2 >= quality1;
				break;
		}

		const comparisonReport = {
			improvement: Math.round(improvement * 100) / 100,
			improved,
			metric,
			metric1: metrics1,
			metric2: metrics2,
			tag1: resolvedTag1,
			tag2: resolvedTag2,
			comparedAt: new Date().toISOString()
		};

		log.info(
			`Tag comparison: ${resolvedTag1} vs ${resolvedTag2}. Improvement: ${improvement.toFixed(2)}%`
		);

		return {
			success: true,
			data: comparisonReport
		};
	} catch (error) {
		log.error(`Error comparing tags: ${error.message}`);
		return {
			success: false,
			error: {
				code: 'COMPARISON_ERROR',
				message: `Failed to compare tags: ${error.message}`,
				details: error.stack
			}
		};
	}
}

