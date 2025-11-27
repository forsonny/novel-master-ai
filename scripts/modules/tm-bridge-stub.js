/**
 * @tm/bridge local stub
 * Provides stub exports to replace @tm/bridge imports for standalone CLI usage.
 * The stub functions return null to allow fallback to local operations.
 */

// Helper to create stub functions that silently return null
const createStubFunction = (name) => async (...args) => {
	// Silent - just return null to fall back to local operation
	return null;
};

// Update bridge
export const tryUpdateViaRemote = createStubFunction('tryUpdateViaRemote');

// Expand bridge
export const tryExpandViaRemote = createStubFunction('tryExpandViaRemote');

// Tag bridge
export const tryAddTagViaRemote = createStubFunction('tryAddTagViaRemote');
export const tryListTagsViaRemote = createStubFunction('tryListTagsViaRemote');
export const tryUseTagViaRemote = createStubFunction('tryUseTagViaRemote');

// Other exports
export const createBridgeContext = createStubFunction('createBridgeContext');
export const tryDeleteTagViaRemote = createStubFunction('tryDeleteTagViaRemote');
export const tryRenameTagViaRemote = createStubFunction('tryRenameTagViaRemote');
export const tryCopyTagViaRemote = createStubFunction('tryCopyTagViaRemote');

