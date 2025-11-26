import { z } from 'zod';

// Base schemas that will be reused across commands
export const TaskStatusSchema = z.enum([
	'pending',
	'in-progress',
	'blocked',
	'done',
	'cancelled',
	'deferred'
]);

const NarrativeMetadataSchema = z
	.object({
		pov: z.string().optional().describe('Point of view character for this scene/chapter'),
		emotionalBeat: z.string().optional().describe('Emotional state or beat (e.g., fear → resolve)'),
		timeline: z.string().optional().describe('Story timeline period or date'),
		tensionLevel: z
			.union([z.number().int().min(1).max(10), z.string()])
			.optional()
			.describe('Tension level from 1-10 (1=calm, 10=climax)'),
		wordCountTarget: z
			.union([z.number().int().positive(), z.string()])
			.optional()
			.describe('Target word count for this chapter/scene'),
		currentWordCount: z
			.number()
			.int()
			.nonnegative()
			.optional()
			.describe('Current word count (updated during drafting)'),
		emotionalStakes: z.string().optional().describe('What is emotionally at stake in this scene'),
		sensoryNotes: z.string().optional().describe('Sensory details and atmosphere notes'),
		researchHook: z.string().optional().describe('Research questions or worldbuilding needs'),
		continuityCheck: z.string().optional().describe('Continuity validation requirements')
	})
	.optional();

export const BaseTaskSchema = z.object({
	id: z.number().int().positive(),
	title: z.string().min(1).max(200),
	description: z.string().min(1),
	status: TaskStatusSchema,
	dependencies: z.array(z.union([z.number().int(), z.string()])).default([]),
	priority: z
		.enum(['low', 'medium', 'high', 'critical'])
		.nullable()
		.default(null),
	details: z.string().nullable().default(null),
	testStrategy: z.string().nullable().default(null),
	metadata: NarrativeMetadataSchema
});

export const SubtaskSchema = z.object({
	id: z.number().int().positive(),
	title: z.string().min(5).max(200),
	description: z.string().min(10),
	dependencies: z.array(z.number().int()).default([]),
	details: z.string().min(20),
	status: z.enum(['pending', 'done', 'completed']).default('pending'),
	testStrategy: z.string().nullable().default(null),
	metadata: NarrativeMetadataSchema
});
