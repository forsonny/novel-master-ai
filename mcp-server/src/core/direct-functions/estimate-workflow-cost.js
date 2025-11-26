/**
 * estimate-workflow-cost.js
 * Direct function implementation for estimating workflow cost
 */

/**
 * Default cost estimates per operation (in USD)
 * These are rough estimates based on typical token usage
 */
const OPERATION_COSTS = {
	parse: {
		baseTokens: 2000,
		outputTokens: 5000,
		costPer1kTokens: 0.01
	},
	expand: {
		baseTokens: 1500,
		outputTokens: 3000,
		costPer1kTokens: 0.01
	},
	draft: {
		baseTokens: 2000,
		outputTokens: 4000,
		costPer1kTokens: 0.015
	},
	revise: {
		baseTokens: 3000,
		outputTokens: 5000,
		costPer1kTokens: 0.015
	},
	research: {
		baseTokens: 1000,
		outputTokens: 2000,
		costPer1kTokens: 0.005
	},
	analyze: {
		baseTokens: 2000,
		outputTokens: 3000,
		costPer1kTokens: 0.01
	},
	validate: {
		baseTokens: 1000,
		outputTokens: 1500,
		costPer1kTokens: 0.01
	}
};

/**
 * Estimate cost for a single operation
 * @param {string} operationType - Type of operation
 * @param {number} multiplier - Multiplier for operation (e.g., number of scenes)
 * @returns {number} - Estimated cost in USD
 */
function estimateOperationCost(operationType, multiplier = 1) {
	const costs = OPERATION_COSTS[operationType] || OPERATION_COSTS.draft;
	const totalInputTokens = costs.baseTokens * multiplier;
	const totalOutputTokens = costs.outputTokens * multiplier;

	const inputCost = (totalInputTokens / 1000) * costs.costPer1kTokens;
	const outputCost = (totalOutputTokens / 1000) * costs.costPer1kTokens;

	return inputCost + outputCost;
}

/**
 * Estimate workflow cost
 * @param {Object} args - Arguments
 * @param {string} args.projectRoot - Project root path
 * @param {Array<string>} [args.phases] - Phases to estimate (defaults to all)
 * @param {number} [args.estimatedScenes] - Estimated number of scenes
 * @param {number} [args.estimatedWords] - Estimated total word count
 * @param {Object} [args.modelPreferences] - Model preferences per phase
 * @param {Object} log - Logger object
 * @param {Object} context - Additional context
 * @returns {Promise<Object>} - Result object with cost estimation
 */
export async function estimateWorkflowCostDirect(args, log, context = {}) {
	const {
		projectRoot,
		phases = ['parse', 'expand', 'draft', 'revise'],
		estimatedScenes = 50,
		estimatedWords = 80000,
		modelPreferences = {}
	} = args;

	try {
		const phaseCosts = {};
		const breakdown = [];
		let totalEstimatedCost = 0;

		// Estimate costs for each phase
		for (const phase of phases) {
			let phaseCost = 0;
			let phaseOperations = [];

			switch (phase) {
				case 'parse':
					phaseCost = estimateOperationCost('parse', 1);
					phaseOperations.push({
						operation: 'parse_prd',
						estimatedCost: phaseCost,
						assumptions: ['Single NRD parse operation']
					});
					break;

				case 'expand':
					// Estimate based on number of chapters (roughly estimatedScenes / 5)
					const estimatedChapters = Math.ceil(estimatedScenes / 5);
					phaseCost = estimateOperationCost('expand', estimatedChapters);
					phaseOperations.push({
						operation: 'expand_task',
						count: estimatedChapters,
						estimatedCost: phaseCost,
						assumptions: [`${estimatedChapters} chapters to expand`]
					});
					break;

				case 'draft':
					// Estimate based on number of scenes
					phaseCost = estimateOperationCost('draft', estimatedScenes);
					phaseOperations.push({
						operation: 'update_subtask',
						count: estimatedScenes,
						estimatedCost: phaseCost,
						assumptions: [`${estimatedScenes} scenes to draft`]
					});
					break;

				case 'revise':
					// Estimate based on number of chapters and revision passes
					const revisionPasses = 2; // Assume 2 revision passes
					const revisedChapters = Math.ceil(estimatedScenes / 5);
					phaseCost = estimateOperationCost('revise', revisedChapters * revisionPasses);
					phaseOperations.push({
						operation: 'update_task (revision)',
						count: revisedChapters * revisionPasses,
						estimatedCost: phaseCost,
						assumptions: [
							`${revisedChapters} chapters × ${revisionPasses} revision passes`
						]
					});
					break;

				case 'research':
					// Estimate research operations (typically 10-20 per project)
					const researchQueries = 15;
					phaseCost = estimateOperationCost('research', researchQueries);
					phaseOperations.push({
						operation: 'research',
						count: researchQueries,
						estimatedCost: phaseCost,
						assumptions: [`${researchQueries} research queries`]
					});
					break;

				case 'analyze':
					// Estimate complexity analysis (typically 2-3 per project)
					const analysisRuns = 3;
					phaseCost = estimateOperationCost('analyze', analysisRuns);
					phaseOperations.push({
						operation: 'analyze_project_complexity',
						count: analysisRuns,
						estimatedCost: phaseCost,
						assumptions: [`${analysisRuns} complexity analysis runs`]
					});
					break;

				case 'validate':
					// Estimate validation operations
					const validationRuns = estimatedScenes + 5; // Scene validations + NRD validation
					phaseCost = estimateOperationCost('validate', validationRuns);
					phaseOperations.push({
						operation: 'validate operations',
						count: validationRuns,
						estimatedCost: phaseCost,
						assumptions: [`${validationRuns} validation operations`]
					});
					break;
			}

			phaseCosts[phase] = phaseCost;
			breakdown.push(...phaseOperations);
			totalEstimatedCost += phaseCost;
		}

		// Generate assumptions list
		const assumptions = [
			`Estimated ${estimatedScenes} scenes`,
			`Estimated ${estimatedWords.toLocaleString()} total words`,
			`Cost estimates based on average token usage`,
			'Model costs may vary based on provider and model selection',
			'Actual costs may differ based on content complexity',
			'Research and validation costs are estimates'
		];

		if (Object.keys(modelPreferences).length > 0) {
			assumptions.push('Model preferences provided may affect costs');
		}

		const costEstimate = {
			totalEstimatedCost: Math.round(totalEstimatedCost * 100) / 100,
			phaseCosts,
			breakdown,
			assumptions,
			estimatedScenes,
			estimatedWords,
			phases
		};

		log.info(
			`Workflow cost estimate: $${costEstimate.totalEstimatedCost.toFixed(2)} for ${phases.join(', ')} phases`
		);

		return {
			success: true,
			data: costEstimate
		};
	} catch (error) {
		log.error(`Error estimating workflow cost: ${error.message}`);
		return {
			success: false,
			error: {
				code: 'ESTIMATION_ERROR',
				message: `Failed to estimate workflow cost: ${error.message}`,
				details: error.stack
			}
		};
	}
}

