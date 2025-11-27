/**
 * @tm/cli dist stub
 * Provides stub exports when TypeScript compilation isn't available.
 */

// Command Registry stub
export const CommandRegistry = class {
  constructor() {}
  register() {}
  get() { return null; }
};

export const registerAllCommands = (program, options = {}) => {
  console.warn('[tm-cli] registerAllCommands stub called');
};

export const registerCommandsByCategory = (program, categories, options = {}) => {
  console.warn('[tm-cli] registerCommandsByCategory stub called');
};

// Auto-update stubs
export const checkForUpdate = async () => ({ needsUpdate: false, currentVersion: '0.0.0', latestVersion: '0.0.0' });
export const performAutoUpdate = async () => false;
export const displayUpgradeNotification = () => {};
export const restartWithNewVersion = () => {};

// Error handling stubs
export const displayError = (error, options = {}) => {
  console.error('[Error]', error?.message || error);
};

// Interactive setup stub
export const runInteractiveSetup = async (options = {}) => {
  console.warn('[tm-cli] runInteractiveSetup stub called - interactive setup not available');
  return {};
};

// UI namespace stub
export const ui = {
  displayBanner: () => {},
  displayTask: () => {},
  displayTasks: () => {},
  formatStatus: (status) => status,
};
