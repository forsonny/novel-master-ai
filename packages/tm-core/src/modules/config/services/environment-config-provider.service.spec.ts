/**
 * @fileoverview Unit tests for EnvironmentConfigProvider service
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { EnvironmentConfigProvider } from './environment-config-provider.service.js';

describe('EnvironmentConfigProvider', () => {
	let provider: EnvironmentConfigProvider;
	const originalEnv = { ...process.env };

	beforeEach(() => {
		// Clear all NOVELMASTER_ env vars
		Object.keys(process.env).forEach((key) => {
			if (key.startsWith('NOVELMASTER_')) {
				delete process.env[key];
			}
		});
		provider = new EnvironmentConfigProvider();
	});

	afterEach(() => {
		// Restore original environment
		process.env = { ...originalEnv };
	});

	describe('loadConfig', () => {
		it('should load configuration from environment variables', () => {
			process.env.NOVELMASTER_STORAGE_TYPE = 'api';
			process.env.NOVELMASTER_API_ENDPOINT = 'https://api.example.com';
			process.env.NOVELMASTER_MODEL_MAIN = 'gpt-4';

			const config = provider.loadConfig();

			expect(config).toEqual({
				storage: {
					type: 'api',
					apiEndpoint: 'https://api.example.com'
				},
				models: {
					main: 'gpt-4'
				}
			});
		});

		it('should return empty object when no env vars are set', () => {
			const config = provider.loadConfig();
			expect(config).toEqual({});
		});

		it('should skip runtime state variables', () => {
			process.env.NOVELMASTER_TAG = 'feature-branch';
			process.env.NOVELMASTER_MODEL_MAIN = 'claude-3';

			const config = provider.loadConfig();

			expect(config).toEqual({
				models: { main: 'claude-3' }
			});
			expect(config).not.toHaveProperty('activeTag');
		});

		it('should validate storage type values', () => {
			// Mock console.warn to check validation
			const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

			process.env.NOVELMASTER_STORAGE_TYPE = 'invalid';

			const config = provider.loadConfig();

			expect(config).toEqual({});
			expect(warnSpy).toHaveBeenCalledWith(
				'Invalid value for NOVELMASTER_STORAGE_TYPE: invalid'
			);

			warnSpy.mockRestore();
		});

		it('should accept valid storage type values', () => {
			process.env.NOVELMASTER_STORAGE_TYPE = 'file';
			let config = provider.loadConfig();
			expect(config.storage?.type).toBe('file');

			process.env.NOVELMASTER_STORAGE_TYPE = 'api';
			provider = new EnvironmentConfigProvider(); // Reset provider
			config = provider.loadConfig();
			expect(config.storage?.type).toBe('api');
		});

		it('should handle nested configuration paths', () => {
			process.env.NOVELMASTER_MODEL_MAIN = 'model1';
			process.env.NOVELMASTER_MODEL_RESEARCH = 'model2';
			process.env.NOVELMASTER_MODEL_FALLBACK = 'model3';

			const config = provider.loadConfig();

			expect(config).toEqual({
				models: {
					main: 'model1',
					research: 'model2',
					fallback: 'model3'
				}
			});
		});

		it('should handle custom response language', () => {
			process.env.NOVELMASTER_RESPONSE_LANGUAGE = 'Spanish';

			const config = provider.loadConfig();

			expect(config).toEqual({
				custom: {
					responseLanguage: 'Spanish'
				}
			});
		});

		it('should ignore empty string values', () => {
			process.env.NOVELMASTER_MODEL_MAIN = '';
			process.env.NOVELMASTER_MODEL_FALLBACK = 'fallback-model';

			const config = provider.loadConfig();

			expect(config).toEqual({
				models: {
					fallback: 'fallback-model'
				}
			});
		});
	});

	describe('getRuntimeState', () => {
		it('should extract runtime state variables', () => {
			process.env.NOVELMASTER_TAG = 'develop';
			process.env.NOVELMASTER_MODEL_MAIN = 'model'; // Should not be included

			const state = provider.getRuntimeState();

			expect(state).toEqual({
				activeTag: 'develop'
			});
		});

		it('should return empty object when no runtime state vars', () => {
			process.env.NOVELMASTER_MODEL_MAIN = 'model';

			const state = provider.getRuntimeState();

			expect(state).toEqual({});
		});
	});

	describe('hasEnvVar', () => {
		it('should return true when env var exists', () => {
			process.env.NOVELMASTER_MODEL_MAIN = 'test';

			expect(provider.hasEnvVar('NOVELMASTER_MODEL_MAIN')).toBe(true);
		});

		it('should return false when env var does not exist', () => {
			expect(provider.hasEnvVar('NOVELMASTER_NONEXISTENT')).toBe(false);
		});

		it('should return false for undefined values', () => {
			process.env.NOVELMASTER_TEST = undefined as any;

			expect(provider.hasEnvVar('NOVELMASTER_TEST')).toBe(false);
		});
	});

	describe('getAllNovelMasterEnvVars', () => {
		it('should return all NOVELMASTER_ prefixed variables', () => {
			process.env.NOVELMASTER_VAR1 = 'value1';
			process.env.NOVELMASTER_VAR2 = 'value2';
			process.env.OTHER_VAR = 'other';
			process.env.NOVEL_MASTER = 'wrong-prefix';

			const vars = provider.getAllNovel MasterEnvVars();

			expect(vars).toEqual({
				NOVELMASTER_VAR1: 'value1',
				NOVELMASTER_VAR2: 'value2'
			});
		});

		it('should return empty object when no NOVELMASTER_ vars', () => {
			process.env.OTHER_VAR = 'value';

			const vars = provider.getAllNovel MasterEnvVars();

			expect(vars).toEqual({});
		});

		it('should filter out undefined values', () => {
			process.env.NOVELMASTER_DEFINED = 'value';
			process.env.NOVELMASTER_UNDEFINED = undefined as any;

			const vars = provider.getAllNovel MasterEnvVars();

			expect(vars).toEqual({
				NOVELMASTER_DEFINED: 'value'
			});
		});
	});

	describe('custom mappings', () => {
		it('should use custom mappings when provided', () => {
			const customMappings = [{ env: 'CUSTOM_VAR', path: ['custom', 'value'] }];

			const customProvider = new EnvironmentConfigProvider(customMappings);
			process.env.CUSTOM_VAR = 'test-value';

			const config = customProvider.loadConfig();

			expect(config).toEqual({
				custom: {
					value: 'test-value'
				}
			});
		});

		it('should add new mapping with addMapping', () => {
			process.env.NEW_MAPPING = 'new-value';

			provider.addMapping({
				env: 'NEW_MAPPING',
				path: ['new', 'mapping']
			});

			const config = provider.loadConfig();

			expect(config).toHaveProperty('new.mapping', 'new-value');
		});

		it('should return current mappings with getMappings', () => {
			const mappings = provider.getMappings();

			expect(mappings).toBeInstanceOf(Array);
			expect(mappings.length).toBeGreaterThan(0);

			// Check for some expected mappings
			const envNames = mappings.map((m) => m.env);
			expect(envNames).toContain('NOVELMASTER_STORAGE_TYPE');
			expect(envNames).toContain('NOVELMASTER_MODEL_MAIN');
			expect(envNames).toContain('NOVELMASTER_TAG');
		});

		it('should return copy of mappings array', () => {
			const mappings1 = provider.getMappings();
			const mappings2 = provider.getMappings();

			expect(mappings1).not.toBe(mappings2); // Different instances
			expect(mappings1).toEqual(mappings2); // Same content
		});
	});

	describe('validation', () => {
		it('should validate values when validator is provided', () => {
			const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

			process.env.NOVELMASTER_STORAGE_TYPE = 'database'; // Invalid

			const config = provider.loadConfig();

			expect(config).toEqual({});
			expect(warnSpy).toHaveBeenCalledWith(
				'Invalid value for NOVELMASTER_STORAGE_TYPE: database'
			);

			warnSpy.mockRestore();
		});

		it('should accept values that pass validation', () => {
			process.env.NOVELMASTER_STORAGE_TYPE = 'file';

			const config = provider.loadConfig();

			expect(config.storage?.type).toBe('file');
		});

		it('should work with custom validators', () => {
			const customProvider = new EnvironmentConfigProvider([
				{
					env: 'CUSTOM_NUMBER',
					path: ['custom', 'number'],
					validate: (v) => !isNaN(Number(v))
				}
			]);

			process.env.CUSTOM_NUMBER = '123';
			let config = customProvider.loadConfig();
			expect(config.custom?.number).toBe('123');

			process.env.CUSTOM_NUMBER = 'not-a-number';
			const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
			customProvider = new EnvironmentConfigProvider([
				{
					env: 'CUSTOM_NUMBER',
					path: ['custom', 'number'],
					validate: (v) => !isNaN(Number(v))
				}
			]);
			config = customProvider.loadConfig();
			expect(config).toEqual({});
			expect(warnSpy).toHaveBeenCalled();

			warnSpy.mockRestore();
		});
	});

	describe('edge cases', () => {
		it('should handle special characters in values', () => {
			process.env.NOVELMASTER_API_ENDPOINT =
				'https://api.example.com/v1?key=abc&token=xyz';
			process.env.NOVELMASTER_API_TOKEN = 'Bearer abc123!@#$%^&*()';

			const config = provider.loadConfig();

			expect(config.storage?.apiEndpoint).toBe(
				'https://api.example.com/v1?key=abc&token=xyz'
			);
			expect(config.storage?.apiAccessToken).toBe('Bearer abc123!@#$%^&*()');
		});

		it('should handle whitespace in values', () => {
			process.env.NOVELMASTER_MODEL_MAIN = '  claude-3  ';

			const config = provider.loadConfig();

			// Note: We're not trimming, preserving the value as-is
			expect(config.models?.main).toBe('  claude-3  ');
		});

		it('should handle very long values', () => {
			const longValue = 'a'.repeat(10000);
			process.env.NOVELMASTER_API_TOKEN = longValue;

			const config = provider.loadConfig();

			expect(config.storage?.apiAccessToken).toBe(longValue);
		});
	});
});
