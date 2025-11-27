/**
 * @tm/ai-sdk-provider-grok-cli local stub
 * Provides stub exports to replace @tm/ai-sdk-provider-grok-cli imports.
 */

export const createGrokCli = (options = {}) => {
	console.warn(
		'[ai-sdk-provider-grok-cli] createGrokCli stub called - Grok CLI not available'
	);
	return (modelId) => ({
		modelId,
		provider: 'grok-cli',
		async doGenerate() {
			throw new Error('Grok CLI provider not available - stub only');
		},
		async doStream() {
			throw new Error('Grok CLI provider not available - stub only');
		}
	});
};

