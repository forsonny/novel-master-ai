/**
 * @tm/ai-sdk-provider-grok-cli dist stub
 * Provides stub exports when TypeScript compilation isn't available.
 */

export const createGrokCli = (options = {}) => {
  console.warn('[ai-sdk-provider-grok-cli] createGrokCli stub called - Grok CLI not available');
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

