import { initializeProject } from '../../../../scripts/init.js'; // Import core function and its logger if needed separately
import {
	enableSilentMode,
	disableSilentMode
	// isSilentMode // Not used directly here
} from '../../../../scripts/modules/utils.js';
import os from 'os'; // Import os module for home directory check
import { RULE_PROFILES } from '../../../../src/constants/profiles.js';
import { convertAllRulesToProfileRules } from '../../../../src/utils/rule-transformer.js';

/**
 * Direct function wrapper for initializing a project.
 * Derives target directory from session, sets CWD, and calls core init logic.
 * @param {object} args - Arguments containing initialization options (addAliases, initGit, storeTasksInGit, skipInstall, yes, projectRoot, rules)
 * @param {object} log - The FastMCP logger instance.
 * @param {object} context - The context object, must contain { session }.
 * @returns {Promise<{success: boolean, data?: any, error?: {code: string, message: string}}>} - Standard result object.
 */
export async function initializeProjectDirect(args, log, context = {}) {
	const { session } = context; // Keep session if core logic needs it
	const homeDir = os.homedir();

	log.info(`Args received in direct function: ${JSON.stringify(args)}`);

	// --- Determine Target Directory ---
	// TRUST the projectRoot passed from the tool layer via args
	// The HOF in the tool layer already normalized and validated it came from a reliable source (args or session)
	const targetDirectory = args.projectRoot;

	// --- Validate the targetDirectory (basic sanity checks) ---
	if (
		!targetDirectory ||
		typeof targetDirectory !== 'string' || // Ensure it's a string
		targetDirectory === '/' ||
		targetDirectory === homeDir
	) {
		log.error(
			`Invalid target directory received from tool layer: '${targetDirectory}'`
		);
		return {
			success: false,
			error: {
				code: 'INVALID_TARGET_DIRECTORY',
				message: `Cannot initialize project: Invalid target directory '${targetDirectory}' received. Please ensure a valid workspace/folder is open or specified.`,
				details: `Received args.projectRoot: ${args.projectRoot}` // Show what was received
			}
		};
	}

	// --- Proceed with validated targetDirectory ---
	log.info(`Validated target directory for initialization: ${targetDirectory}`);

	const originalCwd = process.cwd();
	let resultData;
	let success = false;
	let errorResult = null;

	log.info(
		`Temporarily changing CWD to ${targetDirectory} for initialization.`
	);
	process.chdir(targetDirectory); // Change CWD to the HOF-provided root

	enableSilentMode();
	try {
		// Construct options ONLY from the relevant flags in args
		// The core initializeProject operates in the current CWD, which we just set
		const options = {
			addAliases: args.addAliases,
			initGit: args.initGit,
			storeTasksInGit: args.storeTasksInGit,
			skipInstall: args.skipInstall,
			yes: true // Force yes mode
		};

		// Handle rules option with MCP-specific defaults
		if (Array.isArray(args.rules) && args.rules.length > 0) {
			options.rules = args.rules;
			options.rulesExplicitlyProvided = true;
			log.info(`Including rules: ${args.rules.join(', ')}`);
		} else {
			// For MCP initialization, default to Cursor profile only
			options.rules = ['cursor'];
			options.rulesExplicitlyProvided = true;
			log.info(`No rule profiles specified, defaulting to: Cursor`);
		}

		log.info(`Initializing project with options: ${JSON.stringify(options)}`);
		const result = await initializeProject(options); // Call core logic

		resultData = {
			message: 'Novel Master project initialized successfully.',
			next_step:
				'Now that the project is initialized, the next step is to create story arcs and chapters by parsing an NRD (Novel Requirements Document). This will create the tasks folder and the initial chapter files (tasks folder will be created when parse-prd is run). The parse-prd tool will require an nrd.txt file as input (typically found in .novelmaster/docs/ directory). You can create an nrd.txt file by asking the user about their novel idea, and then using the .novelmaster/templates/example_nrd.md file as a template to generate an nrd.txt file in .novelmaster/docs/. You may skip all of this if the user already has an nrd.txt file. You can THEN use the parse-prd tool to create the story arcs and chapters. So: step 1 after initialization is to create an nrd.txt file in .novelmaster/docs/nrd.txt or confirm the user already has one. Step 2 is to use the parse-prd tool to create the chapters. Do not bother looking for tasks after initialization, just use the parse-prd tool to create the chapters after creating an nrd.txt from which to parse the story structure. You do NOT need to reinitialize the project to parse-prd.',
			...result
		};
		success = true;
		log.info(
			`Project initialization completed successfully in ${targetDirectory}.`
		);
	} catch (error) {
		log.error(`Core initializeProject failed: ${error.message}`);
		errorResult = {
			code: 'INITIALIZATION_FAILED',
			message: `Core project initialization failed: ${error.message}`,
			details: error.stack
		};
		success = false;
	} finally {
		disableSilentMode();
		log.info(`Restoring original CWD: ${originalCwd}`);
		process.chdir(originalCwd);
	}

	if (success) {
		return { success: true, data: resultData };
	} else {
		return { success: false, error: errorResult };
	}
}
