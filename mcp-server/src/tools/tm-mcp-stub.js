/**
 * @tm/mcp local stub
 * Provides stub exports to replace @tm/mcp imports for standalone usage.
 * These are placeholder registration functions for TypeScript tools
 * that aren't compiled yet.
 */

import logger from '../logger.js';

// Helper to create stub registration function
const createStubRegistration = (toolName) => {
	return (server) => {
		logger.debug(
			`[tm-mcp-stub] ${toolName} registration stub called - tool not available`
		);
		// Don't register anything - stub is just a placeholder
	};
};

// Autopilot tools
export const registerAutopilotStartTool = createStubRegistration(
	'autopilot_start'
);
export const registerAutopilotResumeTool = createStubRegistration(
	'autopilot_resume'
);
export const registerAutopilotNextTool =
	createStubRegistration('autopilot_next');
export const registerAutopilotStatusTool = createStubRegistration(
	'autopilot_status'
);
export const registerAutopilotCompleteTool = createStubRegistration(
	'autopilot_complete'
);
export const registerAutopilotCommitTool = createStubRegistration(
	'autopilot_commit'
);
export const registerAutopilotFinalizeTool = createStubRegistration(
	'autopilot_finalize'
);
export const registerAutopilotAbortTool = createStubRegistration(
	'autopilot_abort'
);

// Task tools - these likely have legacy JS equivalents
export const registerGetTasksTool = createStubRegistration('get_tasks');
export const registerGetTaskTool = createStubRegistration('get_task');

