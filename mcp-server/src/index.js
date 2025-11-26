import { FastMCP } from 'fastmcp';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import fs from 'fs';
import logger from './logger.js';
import {
	registerNovelMasterTools,
	getToolsConfiguration
} from './tools/index.js';
import ProviderRegistry from '../../src/provider-registry/index.js';
import { MCPProvider } from './providers/mcp-provider.js';
import packageJson from '../../package.json' with { type: 'json' };

dotenv.config();

// Constants
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Main MCP server class that integrates with Novel Master
 */
class NovelMasterMCPServer {
	constructor() {
		this.options = {
			name: 'Novel Master MCP Server',
			version: packageJson.version
		};

		this.server = new FastMCP(this.options);
		this.initialized = false;

		this.init = this.init.bind(this);
		this.start = this.start.bind(this);
		this.stop = this.stop.bind(this);

		this.logger = logger;
	}

	/**
	 * Initialize the MCP server with necessary tools and routes
	 */
	async init() {
		if (this.initialized) return;

		const normalizedToolMode = getToolsConfiguration();

		this.logger.info('Novel Master MCP Server starting...');
		this.logger.info(`Tool mode configuration: ${normalizedToolMode}`);

		const registrationResult = registerNovelMasterTools(
			this.server,
			normalizedToolMode
		);

		this.logger.info(
			`Normalized tool mode: ${registrationResult.normalizedMode}`
		);
		this.logger.info(
			`Registered ${registrationResult.registeredTools.length} tools successfully`
		);

		if (registrationResult.registeredTools.length > 0) {
			this.logger.debug(
				`Registered tools: ${registrationResult.registeredTools.join(', ')}`
			);
		}

		if (registrationResult.failedTools.length > 0) {
			this.logger.warn(
				`Failed to register ${registrationResult.failedTools.length} tools: ${registrationResult.failedTools.join(', ')}`
			);
		}

		// Register novel-writing reference materials as MCP resources
		this.registerNovelWritingResources();

		this.initialized = true;

		return this;
	}

	/**
	 * Register novel-writing reference materials as MCP resources
	 * These resources expose narrative documentation to Cursor and other MCP clients
	 */
	registerNovelWritingResources() {
		const contextDir = path.resolve(__dirname, '../../context');

		// NRD Schema Reference
		this.server.addResource({
			uri: 'novelmaster://reference/nrd-schema',
			name: 'NRD Schema Reference',
			description:
				'Complete NRD schema with required sections, validation rules, and best practices',
			mimeType: 'text/plain',
			async load() {
				const filePath = path.join(contextDir, 'nrd-schema-reference.txt');
				try {
					const content = fs.readFileSync(filePath, 'utf-8');
					return { text: content };
				} catch (error) {
					return { text: `Error loading NRD schema reference: ${error.message}` };
				}
			}
		});

		// Genre Best Practices
		this.server.addResource({
			uri: 'novelmaster://reference/genre-best-practices',
			name: 'Genre Best Practices',
			description:
				'Genre-specific conventions, pacing guidelines, and research needs for Fantasy, SF, Thriller, Literary Fiction, Romance, Mystery, Horror, and YA',
			mimeType: 'text/plain',
			async load() {
				const filePath = path.join(contextDir, 'genre-best-practices.txt');
				try {
					const content = fs.readFileSync(filePath, 'utf-8');
					return { text: content };
				} catch (error) {
					return {
						text: `Error loading genre best practices: ${error.message}`
					};
				}
			}
		});

		// Narrative Techniques Reference
		this.server.addResource({
			uri: 'novelmaster://reference/narrative-techniques',
			name: 'Narrative Techniques Reference',
			description:
				"Story structures (Three-Act, Hero's Journey, Save the Cat), POV techniques, pacing strategies, character development, and revision techniques",
			mimeType: 'text/plain',
			async load() {
				const filePath = path.join(
					contextDir,
					'narrative-techniques-reference.txt'
				);
				try {
					const content = fs.readFileSync(filePath, 'utf-8');
					return { text: content };
				} catch (error) {
					return {
						text: `Error loading narrative techniques reference: ${error.message}`
					};
				}
			}
		});

		// Outline Templates Guide
		this.server.addResource({
			uri: 'novelmaster://reference/outline-templates',
			name: 'Outline Templates Guide',
			description:
				'Outline templates and patterns for different story structures, scene breakdowns, and outline best practices',
			mimeType: 'text/plain',
			async load() {
				const filePath = path.join(contextDir, 'outline-templates-guide.txt');
				try {
					const content = fs.readFileSync(filePath, 'utf-8');
					return { text: content };
				} catch (error) {
					return {
						text: `Error loading outline templates guide: ${error.message}`
					};
				}
			}
		});

		this.logger.info('Registered 4 novel-writing reference resources');
	}

	/**
	 * Start the MCP server
	 */
	async start() {
		if (!this.initialized) {
			await this.init();
		}

		this.server.on('connect', (event) => {
			event.session.server.sendLoggingMessage({
				data: {
					context: event.session.context,
					message: `MCP Server connected: ${event.session.name}`
				},
				level: 'info'
			});
			this.registerRemoteProvider(event.session);
		});

		// Start the FastMCP server with increased timeout
		await this.server.start({
			transportType: 'stdio',
			timeout: 120000 // 2 minutes timeout (in milliseconds)
		});

		return this;
	}

	/**
	 * Register both MCP providers with the provider registry
	 */
	registerRemoteProvider(session) {
		// Check if the server has at least one session
		if (session) {
			// Make sure session has required capabilities
			if (!session.clientCapabilities || !session.clientCapabilities.sampling) {
				session.server.sendLoggingMessage({
					data: {
						context: session.context,
						message: `MCP session missing required sampling capabilities, providers not registered`
					},
					level: 'info'
				});
				return;
			}

			// Register MCP provider with the Provider Registry

			// Register the unified MCP provider
			const mcpProvider = new MCPProvider();
			mcpProvider.setSession(session);

			// Register provider with the registry
			const providerRegistry = ProviderRegistry.getInstance();
			providerRegistry.registerProvider('mcp', mcpProvider);

			session.server.sendLoggingMessage({
				data: {
					context: session.context,
					message: `MCP Server connected`
				},
				level: 'info'
			});
		} else {
			session.server.sendLoggingMessage({
				data: {
					context: session.context,
					message: `No MCP sessions available, providers not registered`
				},
				level: 'warn'
			});
		}
	}

	/**
	 * Stop the MCP server
	 */
	async stop() {
		if (this.server) {
			await this.server.stop();
		}
	}
}

export default NovelMasterMCPServer;
