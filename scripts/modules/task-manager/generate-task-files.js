import fs from 'fs';
import path from 'path';

import {
	log,
	readJSON,
	writeJSON,
	slugifyTagForFilePath,
	ensureNarrativeTagDefaults,
	findProjectRoot
} from '../utils.js';
import { formatDependenciesWithStatus } from '../ui.js';
import { validateAndFixDependencies } from '../dependency-manager.js';
import { NOVELMASTER_MANUSCRIPT_DIR } from '../../../src/constants/paths.js';
import {
	countWords,
	parseWordCountTarget,
	calculateWordCountStats,
	calculateProgress
} from '../utils/word-count.js';
import { getTargetWordCount } from '../config-manager.js';
import { updateManuscriptProgress } from '../utils.js';

const MANAGED_START = '<!-- novel-master:managed:start -->';
const MANAGED_END = '<!-- novel-master:managed:end -->';
const DRAFT_START = '<!-- novel-master:draft:start -->';
const DRAFT_END = '<!-- novel-master:draft:end -->';

const noopLogger = {
	info: (...args) => log('info', ...args),
	warn: (...args) => log('warn', ...args),
	error: (...args) => log('error', ...args),
	debug: (...args) => log('debug', ...args)
};

function ensureDirectory(dirPath) {
	if (!fs.existsSync(dirPath)) {
		fs.mkdirSync(dirPath, { recursive: true });
	}
}

function getChapterFilename(taskId) {
	return `chapter-${String(taskId).padStart(3, '0')}.md`;
}

function buildMarkdownTableRow(label, value) {
	const sanitized = Array.isArray(value) ? value.join(', ') : value || '—';
	return `| ${label} | ${sanitized} |`;
}

function buildManagedSection(task, tag, allTasksInTag) {
	const metadata = task.metadata || {};
	const dependencies =
		task.dependencies && task.dependencies.length > 0
			? formatDependenciesWithStatus(task.dependencies, allTasksInTag, false)
			: 'None';

	const summaryTable = [
		'| Field | Value |',
		'| --- | --- |',
		buildMarkdownTableRow('Status', task.status || 'pending'),
		buildMarkdownTableRow('Priority', task.priority || 'medium'),
		buildMarkdownTableRow('Dependencies', dependencies),
		buildMarkdownTableRow('POV', metadata.pov || '—'),
		buildMarkdownTableRow('Timeline', metadata.timeline || '—'),
		buildMarkdownTableRow('Emotional Beat', metadata.emotionalBeat || '—'),
		buildMarkdownTableRow('Tension Level', metadata.tensionLevel || '—'),
		buildMarkdownTableRow('Word Count Target', metadata.wordCountTarget || '—')
	].join('\n');

	const summaryParagraphs = [
		metadata.sensoryNotes
			? `- **Sensory Notes:** ${metadata.sensoryNotes}`
			: null,
		metadata.researchHook
			? `- **Research Hooks:** ${metadata.researchHook}`
			: null,
		metadata.continuityCheck
			? `- **Continuity Check:** ${metadata.continuityCheck}`
			: null
	]
		.filter(Boolean)
		.join('\n');

	const frontMatter = [
		'---',
		`title: "${(task.title || '').replace(/"/g, '\\"')}"`,
		`taskId: ${task.id}`,
		`tag: ${tag}`,
		`status: ${task.status || 'pending'}`,
		`wordCountTarget: ${metadata.wordCountTarget || ''}`,
		'---'
	].join('\n');

	const scenesSection = Array.isArray(task.subtasks) && task.subtasks.length > 0
		? task.subtasks
				.map((scene, index) => {
					const sceneMeta = [
						scene.description ? `- **Description:** ${scene.description}` : null,
						scene.details ? `- **Details:** ${scene.details}` : null,
						scene.dependencies?.length
							? `- **Dependencies:** ${scene.dependencies
									.map((dep) =>
										typeof dep === 'number'
											? `${task.id}.${dep}`
											: dep.toString()
									)
									.join(', ')}`
							: null
					]
						.filter(Boolean)
						.join('\n');
					return `### Scene ${index + 1}: ${scene.title || 'Untitled'} [${
						scene.status || 'pending'
					}]\n${sceneMeta || '- No additional details provided.'}`;
				})
				.join('\n\n')
		: '_No beats generated yet. Use `expand` to add scenes._';

	return [
		frontMatter,
		'# Chapter Overview',
		summaryTable,
		summaryParagraphs,
		'',
		'## Scenes',
		scenesSection
	]
		.filter(Boolean)
		.join('\n');
}

function mergeManagedContent(existingContent, managedSection) {
	const managedBlock = `${MANAGED_START}\n${managedSection.trim()}\n${MANAGED_END}`;

	if (!existingContent) {
		return `${managedBlock}\n\n## Draft\n\n${DRAFT_START}\n\n${DRAFT_END}\n`;
	}

	if (existingContent.includes(MANAGED_START) && existingContent.includes(MANAGED_END)) {
		return existingContent.replace(
			new RegExp(
				`${MANAGED_START}[\\s\\S]*?${MANAGED_END}`,
				'm'
			),
			managedBlock
		);
	}

	return `${managedBlock}\n\n${existingContent.trim()}\n`;
}

function ensureDraftSection(content) {
	if (content.includes(DRAFT_START) && content.includes(DRAFT_END)) {
		return content;
	}

	const draftTemplate = [
		'## Draft',
		'',
		DRAFT_START,
		'',
		'<!-- Write your prose between the draft markers. -->',
		'',
		DRAFT_END,
		''
	].join('\n');

	return `${content.trim()}\n\n${draftTemplate}\n`;
}

function extractDraftContent(content) {
	const startIndex = content.indexOf(DRAFT_START);
	const endIndex = content.indexOf(DRAFT_END);
	if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
		return '';
	}
	return content
		.slice(startIndex + DRAFT_START.length, endIndex)
		.replace(/^\s+|\s+$/g, '');
}

function resolveProjectRoot(projectRoot) {
	return projectRoot || findProjectRoot() || process.cwd();
}

function generateTaskFiles(tasksPath, outputDir, options = {}) {
	const {
		projectRoot: incomingProjectRoot,
		tag = 'outline',
		mcpLog,
		compile = true,
		summary = true,
		format = 'md'
	} = options;

	const logger = mcpLog || noopLogger;
	const projectRoot = resolveProjectRoot(incomingProjectRoot);

	const resolvedData = readJSON(tasksPath, projectRoot, tag);
	if (!resolvedData) {
		throw new Error(`Unable to read tasks file at ${tasksPath}`);
	}

	const rawData = resolvedData._rawTaggedData
		? ensureNarrativeTagDefaults(resolvedData._rawTaggedData)
		: ensureNarrativeTagDefaults({
				[tag]: {
					tasks: resolvedData.tasks || [],
					metadata: resolvedData.metadata || {}
				}
		  });

	const tagData = rawData[tag];
	if (!tagData || !Array.isArray(tagData.tasks)) {
		throw new Error(`Tag '${tag}' not found or contains no tasks.`);
	}

	// Pass tagData (which has .tasks) instead of rawData (which has tag keys)
	validateAndFixDependencies(tagData, tasksPath, projectRoot, tag);

	const baseOutputDir = outputDir
		? path.isAbsolute(outputDir)
			? outputDir
			: path.join(projectRoot, outputDir)
		: path.join(projectRoot, NOVELMASTER_MANUSCRIPT_DIR);

	const tagSlug = slugifyTagForFilePath(tag);
	const tagRootDir = path.join(baseOutputDir, tagSlug);
	const chaptersDir = path.join(tagRootDir, 'chapters');
	const compiledDir = path.join(tagRootDir, 'compiled');

	ensureDirectory(tagRootDir);
	ensureDirectory(chaptersDir);
	if (compile) {
		ensureDirectory(compiledDir);
	}

	logger.info(
		`Generating ${tagData.tasks.length} chapter files in ${chaptersDir} for tag '${tag}'`
	);

	const chapterSummaries = [];
	const statusCounts = {};

	tagData.tasks.forEach((task) => {
		const chapterFileName = getChapterFilename(task.id);
		const chapterPath = path.join(chaptersDir, chapterFileName);
		const managedSection = buildManagedSection(task, tag, tagData.tasks);
		const existingContent = fs.existsSync(chapterPath)
			? fs.readFileSync(chapterPath, 'utf8')
			: null;

		const mergedContent = ensureDraftSection(
			mergeManagedContent(existingContent, managedSection)
		);

		fs.writeFileSync(chapterPath, mergedContent);

		const draftContent = extractDraftContent(mergedContent);
		const draftWordCount = countWords(draftContent);
		const targetWordCount = parseWordCountTarget(
			task.metadata?.wordCountTarget
		);
		const progress = calculateProgress(draftWordCount, targetWordCount);

		// Write progress metadata back to task
		if (!task.metadata) {
			task.metadata = {};
		}
		task.metadata.draftWordCount = draftWordCount;
		if (progress !== null) {
			task.metadata.progress = progress;
		}

		const statusKey = task.status || 'pending';
		statusCounts[statusKey] = (statusCounts[statusKey] || 0) + 1;

		chapterSummaries.push({
			id: task.id,
			title: task.title || `Chapter ${task.id}`,
			status: statusKey,
			wordCountTarget: targetWordCount,
			draftWordCount,
			progress,
			path: chapterPath
		});
	});

	// Write updated tasks back to file with progress metadata
	const updatedData = readJSON(tasksPath, projectRoot, tag);
	if (updatedData && updatedData.tasks) {
		// Update tasks with progress metadata
		updatedData.tasks.forEach((task) => {
			const summary = chapterSummaries.find((ch) => ch.id === task.id);
			if (summary && task.metadata) {
				task.metadata.draftWordCount = summary.draftWordCount;
				if (summary.progress !== null && summary.progress !== undefined) {
					task.metadata.progress = summary.progress;
				}
			}
		});
		writeJSON(tasksPath, updatedData, projectRoot, tag);
	}

	let summaryPath = null;
	if (summary) {
		const stats = calculateWordCountStats(chapterSummaries);
		const globalTarget = getTargetWordCount(projectRoot);

		const summaryData = {
			tag,
			generatedAt: new Date().toISOString(),
			totals: {
				chapters: chapterSummaries.length,
				targetWords: stats.totalTarget,
				draftedWords: stats.totalDraft,
				averageTarget: stats.averageTarget,
				averageDraft: stats.averageDraft,
				completion: stats.completion,
				globalTarget: globalTarget || null,
				globalProgress:
					globalTarget && globalTarget > 0
						? Number((stats.totalDraft / globalTarget).toFixed(2))
						: null
			},
			statusCounts,
			chapters: chapterSummaries
		};

		summaryPath = path.join(tagRootDir, 'manuscript-summary.json');
		fs.writeFileSync(summaryPath, JSON.stringify(summaryData, null, 2));

		// Update manuscript progress in state.json
		const completedChapters = chapterSummaries.filter(
			(ch) => ch.status === 'done' || ch.status === 'completed'
		).length;

		updateManuscriptProgress(projectRoot, tag, {
			totalChapters: chapterSummaries.length,
			totalWords: stats.totalDraft,
			targetWords: globalTarget || stats.totalTarget,
			completedChapters: completedChapters,
			lastGenerated: new Date(),
			chapterStatus: chapterSummaries.reduce((acc, ch) => {
				acc[ch.id] = {
					status: ch.status,
					wordCount: ch.draftWordCount,
					targetWordCount: ch.wordCountTarget,
					progress: ch.progress
				};
				return acc;
			}, {})
		});
	}

	let compiledPath = null;
	if (compile) {
		const compiledSections = chapterSummaries.map((chapter, index) => {
			const content = fs.readFileSync(chapter.path, 'utf8');
			const draft = extractDraftContent(content).trim();
			const safeDraft = draft || '_Draft not started._';
			
			if (format === 'txt') {
				// Plain text format: remove markdown, use simple headers
				const plainDraft = safeDraft
					.replace(/^#+\s+/gm, '') // Remove markdown headers
					.replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
					.replace(/\*(.*?)\*/g, '$1') // Remove italic
					.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links
					.trim();
				return `CHAPTER ${index + 1}\n${chapter.title}\n\n${plainDraft}`;
			} else {
				// Markdown format (default)
				return `## Chapter ${index + 1}: ${chapter.title}\n\n${safeDraft}`;
			}
		});

		let compiledContent;
		if (format === 'txt') {
			// Plain text format
			compiledContent = [
				`MANUSCRIPT: ${tag.toUpperCase()}`,
				'',
				compiledSections.join('\n\n' + '='.repeat(60) + '\n\n')
			]
				.filter(Boolean)
				.join('\n');
		} else {
			// Markdown format (default)
			compiledContent = [
				`# Manuscript (${tag})`,
				'',
				compiledSections.join('\n\n---\n\n')
			]
				.filter(Boolean)
				.join('\n');
		}

		const extension = format === 'txt' ? 'txt' : 'md';
		compiledPath = path.join(
			compiledDir,
			`manuscript-${slugifyTagForFilePath(tag)}.${extension}`
		);
		fs.writeFileSync(compiledPath, `${compiledContent.trim()}\n`);
	}

	logger.info(
		`Finished generating manuscript assets for tag '${tag}'. Chapters: ${chapterSummaries.length}`
	);

	return {
		tag,
		outputDir: chaptersDir,
		summaryPath,
		compiledPath,
		chapters: chapterSummaries
	};
}

export default generateTaskFiles;
