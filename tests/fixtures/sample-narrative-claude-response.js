/**
 * Sample Claude API response for narrative task generation testing
 */

export const sampleNarrativeClaudeResponse = {
	tasks: [
		{
			id: 1,
			title: 'Act I: Setup',
			description:
				'Establish Elena in exile, introduce the codex theft, and set up the world of 2147',
			status: 'pending',
			dependencies: [],
			priority: 'high',
			details:
				'Chapters 1-6: Elena receives message from Thorne, flashback to data breach, decides to pursue codex, meets ARI, first encounter with The Architect, commits to mission. Establishes 2147 setting, post-Great Migration world, digital consciousness concepts. Focus on Elena\'s internal conflict and guilt.',
			metadata: {
				pov: 'Elena',
				tensionLevel: 'medium',
				emotionalBeat: 'inciting incident',
				timeline: '2147, present day',
				act: 'I'
			}
		},
		{
			id: 2,
			title: 'Act II: Confrontation',
			description:
				'Elena and ARI track the codex, face obstacles, discover secrets about Elena\'s past',
			status: 'pending',
			dependencies: [1],
			priority: 'high',
			details:
				'Chapters 7-13: Enter digital realm, face obstacles from The Architect and human authorities, discover Elena\'s memories in codex (midpoint), learn The Architect\'s true nature, crisis decision point. Rising action, midpoint revelation, crisis. Explore themes of memory and identity.',
			metadata: {
				pov: 'Elena/ARI',
				tensionLevel: 'high',
				emotionalBeat: 'rising action',
				timeline: '2147, present day',
				act: 'II'
			}
		},
		{
			id: 3,
			title: 'Act III: Resolution',
			description:
				'Final confrontation with The Architect, resolution, and Elena finds peace with her past',
			status: 'pending',
			dependencies: [2],
			priority: 'high',
			details:
				'Chapters 14-16: Confrontation with The Architect in digital realm, codex secured but Elena loses her memories again, Elena finds peace and new purpose. Climax, falling action, resolution. Complete Elena\'s arc from guilt to acceptance.',
			metadata: {
				pov: 'Elena',
				tensionLevel: 'very high',
				emotionalBeat: 'climax',
				timeline: '2147, present day',
				act: 'III'
			}
		}
	],
	metadata: {
		projectName: 'The Last Codex',
		totalTasks: 3,
		sourceFile: 'tests/fixtures/sample-nrd.txt',
		generatedAt: '2023-12-15',
		genre: 'Science Fiction',
		targetWordCount: '80,000 - 100,000',
		narrativeStructure: 'Three-Act Structure'
	}
};

export const sampleSceneExpansionResponse = {
	subtasks: [
		{
			id: 1,
			title: 'Scene 1.1: Exile',
			description: 'Elena in her remote cabin, reflecting on her exile and the data breach',
			status: 'pending',
			dependencies: [],
			metadata: {
				pov: 'Elena',
				tensionLevel: 'low',
				emotionalBeat: 'establishment',
				wordCountTarget: 1500,
				location: 'Remote cabin, physical realm',
				timeline: '2147, present day'
			}
		},
		{
			id: 2,
			title: 'Scene 1.2: The Message',
			description:
				'Elena receives the encrypted message from Thorne about the stolen codex',
			status: 'pending',
			dependencies: [1],
			metadata: {
				pov: 'Elena',
				tensionLevel: 'medium',
				emotionalBeat: 'inciting incident',
				wordCountTarget: 1500,
				location: 'Remote cabin, physical realm',
				timeline: '2147, present day'
			}
		},
		{
			id: 3,
			title: 'Scene 1.3: Decision',
			description: 'Elena decides to respond to the message and pursue the codex',
			status: 'pending',
			dependencies: [2],
			metadata: {
				pov: 'Elena',
				tensionLevel: 'medium',
				emotionalBeat: 'decision',
				wordCountTarget: 1000,
				location: 'Remote cabin, physical realm',
				timeline: '2147, present day'
			}
		}
	]
};

