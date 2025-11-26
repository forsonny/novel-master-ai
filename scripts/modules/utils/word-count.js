/**
 * Word count utilities for manuscript tracking and analysis.
 * These functions help track writing progress, parse word count targets,
 * and analyze draft content.
 */

/**
 * Count words in a text string.
 * Handles empty strings, null/undefined, and normalizes whitespace.
 * 
 * @param {string|null|undefined} text - Text to count words in
 * @returns {number} Number of words (0 for empty/null/undefined)
 * 
 * @example
 * countWords("Hello world") // 2
 * countWords("") // 0
 * countWords(null) // 0
 */
export function countWords(text) {
	if (!text || typeof text !== 'string') {
		return 0;
	}
	return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Parse a word count target value from various formats.
 * Supports numbers, strings with commas, and "k" suffix (e.g., "5k" = 5000).
 * 
 * @param {string|number|null|undefined} value - Word count target value
 * @returns {number|null} Parsed word count or null if invalid
 * 
 * @example
 * parseWordCountTarget(5000) // 5000
 * parseWordCountTarget("5,000") // 5000
 * parseWordCountTarget("5k") // 5000
 * parseWordCountTarget("invalid") // null
 * parseWordCountTarget(null) // null
 */
export function parseWordCountTarget(value) {
	if (value == null) {
		return null;
	}

	if (typeof value === 'number' && !Number.isNaN(value)) {
		return value;
	}

	const cleaned = value.toString().trim().toLowerCase().replace(/,/g, '');
	if (!cleaned) {
		return null;
	}

	if (cleaned.endsWith('k')) {
		const base = parseFloat(cleaned.slice(0, -1));
		return Number.isNaN(base) ? null : Math.round(base * 1000);
	}

	const parsed = parseInt(cleaned, 10);
	return Number.isNaN(parsed) ? null : parsed;
}

/**
 * Calculate word count statistics for a collection of chapters.
 * 
 * @param {Array<Object>} chapters - Array of chapter objects with wordCountTarget and draftWordCount
 * @returns {Object} Statistics object with totals, averages, and completion percentage
 * 
 * @example
 * const chapters = [
 *   { wordCountTarget: 2000, draftWordCount: 1500 },
 *   { wordCountTarget: 3000, draftWordCount: 2000 }
 * ];
 * calculateWordCountStats(chapters)
 * // { totalTarget: 5000, totalDraft: 3500, averageTarget: 2500, averageDraft: 1750, completion: 0.7 }
 */
export function calculateWordCountStats(chapters) {
	if (!Array.isArray(chapters) || chapters.length === 0) {
		return {
			totalTarget: 0,
			totalDraft: 0,
			averageTarget: 0,
			averageDraft: 0,
			completion: null
		};
	}

	const totalTarget = chapters.reduce(
		(sum, chapter) => sum + (chapter.wordCountTarget || 0),
		0
	);
	const totalDraft = chapters.reduce(
		(sum, chapter) => sum + (chapter.draftWordCount || 0),
		0
	);
	const averageTarget = totalTarget / chapters.length;
	const averageDraft = totalDraft / chapters.length;
	const completion = totalTarget > 0 ? totalDraft / totalTarget : null;

	return {
		totalTarget,
		totalDraft,
		averageTarget: Math.round(averageTarget),
		averageDraft: Math.round(averageDraft),
		completion: completion !== null ? Number(completion.toFixed(2)) : null
	};
}

/**
 * Format word count for display (e.g., "1,234 words" or "5.2k words").
 * 
 * @param {number} count - Word count to format
 * @param {boolean} [includeLabel=true] - Whether to include "words" label
 * @returns {string} Formatted word count string
 * 
 * @example
 * formatWordCount(1234) // "1,234 words"
 * formatWordCount(5000, false) // "5,000"
 * formatWordCount(5200) // "5,200 words"
 */
export function formatWordCount(count, includeLabel = true) {
	if (count == null || Number.isNaN(count)) {
		return includeLabel ? '0 words' : '0';
	}

	const formatted = count.toLocaleString('en-US');
	return includeLabel ? `${formatted} words` : formatted;
}

/**
 * Calculate progress percentage for a chapter or manuscript.
 * 
 * @param {number} draftCount - Current word count
 * @param {number} targetCount - Target word count
 * @returns {number|null} Progress percentage (0-100) or null if target is 0
 * 
 * @example
 * calculateProgress(1500, 2000) // 75
 * calculateProgress(0, 0) // null
 */
export function calculateProgress(draftCount, targetCount) {
	if (targetCount == null || targetCount === 0) {
		return null;
	}
	return Math.min(100, Math.round((draftCount / targetCount) * 100));
}

/**
 * Extract draft content from a chapter markdown file.
 * Looks for content between `<!-- novel-master:draft:start -->` and `<!-- novel-master:draft:end -->` markers.
 * 
 * @param {string} content - Full chapter markdown content
 * @returns {string} Extracted draft content (empty string if markers not found)
 * 
 * @example
 * const content = `# Chapter 1\n<!-- novel-master:draft:start -->\nThis is the draft.\n<!-- novel-master:draft:end -->`;
 * extractDraftContent(content) // "This is the draft."
 */
export function extractDraftContent(content) {
	if (!content || typeof content !== 'string') {
		return '';
	}
	const DRAFT_START = '<!-- novel-master:draft:start -->';
	const DRAFT_END = '<!-- novel-master:draft:end -->';
	
	const startIndex = content.indexOf(DRAFT_START);
	const endIndex = content.indexOf(DRAFT_END);
	
	if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
		return '';
	}
	
	return content
		.slice(startIndex + DRAFT_START.length, endIndex)
		.replace(/^\s+|\s+$/g, '');
}

