import { jest } from '@jest/globals';
import fs from 'fs';
import os from 'os';
import path from 'path';

jest.unstable_mockModule(
	'../../../../../scripts/modules/dependency-manager.js',
	() => ({
		validateAndFixDependencies: jest.fn()
	})
);

jest.unstable_mockModule('../../../../../scripts/modules/ui.js', () => ({
	formatDependenciesWithStatus: jest.fn(() => 'Dependency Summary')
}));

const { validateAndFixDependencies } = await import(
	'../../../../../scripts/modules/dependency-manager.js'
);
const { formatDependenciesWithStatus } = await import(
	'../../../../../scripts/modules/ui.js'
);
const { default: generateTaskFiles } = await import(
	'../../../../../scripts/modules/task-manager/generate-task-files.js'
);

function createTaggedTasksData() {
	return {
		outline: {
			tasks: [
				{
					id: 1,
					title: 'Act I – Spark',
					description: 'Introduce the orbital habitat and looming sabotage.',
					status: 'pending',
					dependencies: [],
					priority: 'high',
					details: 'Ensure POV alternates between Aiko and Rafael.',
					metadata: {
						pov: 'Aiko ↔ Rafael',
						timeline: 'Act I (0-25%)',
						emotionalBeat: 'Distrust + wonder',
						tensionLevel: 'Rising',
						wordCountTarget: '25k',
						sensoryNotes: 'Ozone, low-grav echoes',
						researchHook: 'Orbital maintenance routines',
						continuityCheck: 'Mention sister Mina subtly'
					},
					subtasks: [
						{
							id: 1,
							title: 'Scene: Mirror Malfunction',
							description: 'Describe the first mirror failure',
							status: 'pending',
							details: 'Focus on sound + metallic smell'
						}
					]
				}
			]
		},
		draft: {
			tasks: []
		}
	};
}

function writeTasksFixture(projectRoot, data) {
	const tasksDir = path.join(projectRoot, '.novelmaster', 'tasks');
	fs.mkdirSync(tasksDir, { recursive: true });
	fs.writeFileSync(
		path.join(tasksDir, 'tasks.json'),
		JSON.stringify(data, null, 2)
	);
	return path.join(tasksDir, 'tasks.json');
}

describe('generateTaskFiles – manuscript generation', () => {
	let projectRoot;
	let tasksPath;

	beforeEach(() => {
		projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'nm-manuscript-'));
		tasksPath = writeTasksFixture(projectRoot, createTaggedTasksData());
		validateAndFixDependencies.mockClear();
		formatDependenciesWithStatus.mockClear();
	});

	afterEach(() => {
		fs.rmSync(projectRoot, { recursive: true, force: true });
	});

	test('creates chapter files, summary, and compiled manuscript', () => {
		const result = generateTaskFiles(tasksPath, undefined, {
			projectRoot,
			tag: 'outline'
		});

		expect(validateAndFixDependencies).toHaveBeenCalledWith(
			expect.any(Object),
			tasksPath,
			projectRoot,
			'outline'
		);

		const chapterPath = path.join(
			projectRoot,
			'.novelmaster',
			'manuscript',
			'outline',
			'chapters',
			'chapter-001.md'
		);
		expect(fs.existsSync(chapterPath)).toBe(true);
		const chapterContent = fs.readFileSync(chapterPath, 'utf8');
		expect(chapterContent).toContain('<!-- novel-master:managed:start -->');
		expect(chapterContent).toContain('## Scenes');
		expect(chapterContent).toContain('Scene: Mirror Malfunction');

		const summaryPath = path.join(
			projectRoot,
			'.novelmaster',
			'manuscript',
			'outline',
			'manuscript-summary.json'
		);
		expect(fs.existsSync(summaryPath)).toBe(true);
		const summaryData = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
		expect(summaryData.totals.targetWords).toBe(25000);
		expect(summaryData.chapters[0].title).toBe('Act I – Spark');

		const compiledPath = path.join(
			projectRoot,
			'.novelmaster',
			'manuscript',
			'outline',
			'compiled',
			'manuscript-outline.md'
		);
		expect(fs.existsSync(compiledPath)).toBe(true);
		const compiledContent = fs.readFileSync(compiledPath, 'utf8');
		expect(compiledContent).toContain('# Manuscript (outline)');
		expect(compiledContent).toContain('Draft not started');

		expect(result.chapters[0].wordCountTarget).toBe(25000);
	});

	test('preserves existing draft text and updates summary word counts', () => {
		// Update task to have a dependency so formatDependenciesWithStatus is called
		const data = createTaggedTasksData();
		data.outline.tasks[0].dependencies = [99]; // Add dummy dependency
		tasksPath = writeTasksFixture(projectRoot, data);

		const manuscriptDir = path.join(
			projectRoot,
			'.novelmaster',
			'manuscript',
			'outline'
		);
		const chaptersDir = path.join(manuscriptDir, 'chapters');
		fs.mkdirSync(chaptersDir, { recursive: true });
		const existingChapterPath = path.join(chaptersDir, 'chapter-001.md');
		const draftText = 'Solar storms ignite hope among the crew.';
		fs.writeFileSync(
			existingChapterPath,
			[
				'<!-- novel-master:managed:start -->',
				'legacy content',
				'<!-- novel-master:managed:end -->',
				'## Draft',
				'',
				'<!-- novel-master:draft:start -->',
				draftText,
				'<!-- novel-master:draft:end -->'
			].join('\n')
		);

		const result = generateTaskFiles(tasksPath, undefined, {
			projectRoot,
			tag: 'outline'
		});

		const summaryPath = path.join(manuscriptDir, 'manuscript-summary.json');
		const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
		expect(summary.chapters[0].draftWordCount).toBe(7);
		expect(result.chapters[0].draftWordCount).toBe(7);

		const updatedChapter = fs.readFileSync(existingChapterPath, 'utf8');
		expect(updatedChapter).toContain(draftText);
		expect(formatDependenciesWithStatus).toHaveBeenCalled();
	});
});

