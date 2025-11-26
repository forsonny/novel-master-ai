/**
 * Sample narrative task data for testing novel workflows
 */

export const sampleNarrativeTasks = {
	meta: {
		projectName: 'The Last Codex',
		projectVersion: '1.0.0',
		createdAt: '2023-01-01T00:00:00.000Z',
		updatedAt: '2023-01-01T00:00:00.000Z'
	},
	tasks: [
		{
			id: 1,
			title: 'Act I: Setup',
			description: 'Establish Elena in exile, introduce the codex theft, and set up the world',
			status: 'done',
			dependencies: [],
			priority: 'high',
			details:
				'Chapters 1-6: Elena receives message from Thorne, flashback to data breach, decides to pursue codex, meets ARI, first encounter with The Architect, commits to mission. Establishes 2147 setting, post-Great Migration world, digital consciousness concepts.',
			metadata: {
				pov: 'Elena',
				tensionLevel: 'medium',
				emotionalBeat: 'inciting incident',
				timeline: '2147, present day'
			},
			subtasks: [
				{
					id: 1,
					title: 'Chapter 1: Exile',
					description: 'Elena in exile, receives message from Thorne',
					status: 'done',
					dependencies: [],
					metadata: {
						pov: 'Elena',
						tensionLevel: 'low',
						emotionalBeat: 'establishment',
						wordCountTarget: 4000
					}
				},
				{
					id: 2,
					title: 'Chapter 2: The Breach',
					description: 'Flashback to the data breach, Elena guilt',
					status: 'done',
					dependencies: [1],
					metadata: {
						pov: 'Elena',
						tensionLevel: 'medium',
						emotionalBeat: 'revelation',
						wordCountTarget: 4500
					}
				}
			]
		},
		{
			id: 2,
			title: 'Act II: Confrontation',
			description: 'Elena and ARI track the codex, face obstacles, discover secrets',
			status: 'in-progress',
			dependencies: [1],
			priority: 'high',
			details:
				'Chapters 7-13: Enter digital realm, face obstacles, discover Elena memories in codex, learn The Architect true nature, crisis decision point. Rising action, midpoint revelation, crisis.',
			metadata: {
				pov: 'Elena/ARI',
				tensionLevel: 'high',
				emotionalBeat: 'rising action',
				timeline: '2147, present day'
			},
			subtasks: [
				{
					id: 1,
					title: 'Chapter 7: Digital Realm',
					description: 'Entering the digital realm, meeting uploaded consciousnesses',
					status: 'in-progress',
					dependencies: [],
					metadata: {
						pov: 'Elena',
						tensionLevel: 'medium',
						emotionalBeat: 'exploration',
						wordCountTarget: 5000
					}
				},
				{
					id: 2,
					title: 'Chapter 10: Midpoint',
					description: 'Elena discovers her memories in the codex',
					status: 'pending',
					dependencies: [1],
					metadata: {
						pov: 'Elena',
						tensionLevel: 'high',
						emotionalBeat: 'revelation',
						wordCountTarget: 5500
					}
				}
			]
		},
		{
			id: 3,
			title: 'Act III: Resolution',
			description: 'Final confrontation, resolution, and Elena finds peace',
			status: 'pending',
			dependencies: [2],
			priority: 'high',
			details:
				'Chapters 14-16: Confrontation with The Architect, codex secured, memories lost, Elena finds peace. Climax, falling action, resolution.',
			metadata: {
				pov: 'Elena',
				tensionLevel: 'very high',
				emotionalBeat: 'climax',
				timeline: '2147, present day'
			}
		}
	]
};

export const emptyNarrativeTasks = {
	meta: {
		projectName: 'Empty Novel Project',
		projectVersion: '1.0.0',
		createdAt: '2023-01-01T00:00:00.000Z',
		updatedAt: '2023-01-01T00:00:00.000Z'
	},
	tasks: []
};

export const taggedNarrativeTasks = {
	tag: 'outline',
	tasks: [
		{
			id: 1,
			title: 'Chapter 1: The Message',
			description: 'Elena receives message from Thorne about stolen codex',
			status: 'pending',
			dependencies: [],
			priority: 'high',
			metadata: {
				pov: 'Elena',
				tensionLevel: 'low',
				emotionalBeat: 'establishment',
				wordCountTarget: 4000
			}
		},
		{
			id: 2,
			title: 'Chapter 2: The Breach',
			description: 'Flashback to the data breach that led to Elena exile',
			status: 'pending',
			dependencies: [1],
			priority: 'high',
			metadata: {
				pov: 'Elena',
				tensionLevel: 'medium',
				emotionalBeat: 'revelation',
				wordCountTarget: 4500
			}
		}
	]
};

export const narrativeTasksWithScenes = {
	tag: 'draft',
	tasks: [
		{
			id: 1,
			title: 'Chapter 1: The Message',
			description: 'Elena receives message from Thorne about stolen codex',
			status: 'in-progress',
			dependencies: [],
			priority: 'high',
			metadata: {
				pov: 'Elena',
				tensionLevel: 'low',
				emotionalBeat: 'establishment',
				wordCountTarget: 4000,
				currentWordCount: 2500
			},
			subtasks: [
				{
					id: 1,
					title: 'Scene 1.1: Exile',
					description: 'Elena in her remote cabin, reflecting on her exile',
					status: 'done',
					dependencies: [],
					metadata: {
						pov: 'Elena',
						tensionLevel: 'low',
						emotionalBeat: 'establishment',
						wordCountTarget: 1500,
						currentWordCount: 1500
					}
				},
				{
					id: 2,
					title: 'Scene 1.2: The Message',
					description: 'Elena receives the encrypted message from Thorne',
					status: 'in-progress',
					dependencies: [1],
					metadata: {
						pov: 'Elena',
						tensionLevel: 'medium',
						emotionalBeat: 'inciting incident',
						wordCountTarget: 1500,
						currentWordCount: 1000
					}
				},
				{
					id: 3,
					title: 'Scene 1.3: Decision',
					description: 'Elena decides to respond to the message',
					status: 'pending',
					dependencies: [2],
					metadata: {
						pov: 'Elena',
						tensionLevel: 'medium',
						emotionalBeat: 'decision',
						wordCountTarget: 1000,
						currentWordCount: 0
					}
				}
			]
		}
	]
};

/**
 * Helper function to create custom narrative tagged fixture
 * @param {string} tagName - Tag name (default: 'outline')
 * @param {Array} tasks - Array of narrative task objects
 * @returns {Object} Tagged narrative task data
 */
export function createNarrativeTaggedFixture(tagName = 'outline', tasks = []) {
	return {
		tag: tagName,
		tasks
	};
}

