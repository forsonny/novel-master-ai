/**
 * @tm/bridge dist stub
 * This is a stub file to allow imports when TypeScript compilation isn't available.
 * The actual functionality requires proper TypeScript compilation.
 */

// Export stub functions that warn and return null/false
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

// Other potential exports
export const createBridgeContext = createStubFunction('createBridgeContext');
export const tryDeleteTagViaRemote = createStubFunction('tryDeleteTagViaRemote');
export const tryRenameTagViaRemote = createStubFunction('tryRenameTagViaRemote');
export const tryCopyTagViaRemote = createStubFunction('tryCopyTagViaRemote');

