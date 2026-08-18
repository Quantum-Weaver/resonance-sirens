// ============================================================================
// HER SYMBOLS — the surface she presses, and how it learns
// ============================================================================
//
// THE LAW, carried from the emoji dataset's own header (KP's ruling
// 2026-07-31): "Names are for search only - meaning is the vessel's own."
//
// So this file does exactly two things: it offers a broad, UNLABELLED opening
// set, and it lets her own history float her symbols to the front. It never
// names a symbol, never groups symbols by what they might mean, and never
// ships a taxonomy — no light/medium/heavy, no mood words, no cycle phases.
// Every other tracker hands a woman someone else's vocabulary for her own
// body. This one hands her the whole alphabet and gets out of the way.
//
// THE OPENING SET is not a suggestion about what to record. It is simply the
// most broadly useful part of the Unicode table to start from, because a blank
// grid is not neutrality, it is a locked door. She replaces it by using it.

import { EMOJI_GROUPS, type EmojiEntry } from './data/emojis.gen';

/** The groups worth opening on. Faces and symbols carry the widest range of
 *  what a person might mean; the rest are a search away, never hidden. */
const OPENING_GROUPS = ['Smileys & Emotion', 'People & Body', 'Symbols', 'Animals & Nature'];

export const ALL: EmojiEntry[] = EMOJI_GROUPS.flatMap((g) => g.emojis);

export const OPENING: EmojiEntry[] = EMOJI_GROUPS.filter((g) =>
	OPENING_GROUPS.includes(g.group)
).flatMap((g) => g.emojis);

/**
 * Search by Unicode name. The name is a SEARCH KEY and never a definition —
 * finding "droplet" by typing "drop" says nothing about what she means by it.
 */
export function search(query: string, limit = 120): EmojiEntry[] {
	const q = query.trim().toLowerCase();
	if (!q) return [];
	const out: EmojiEntry[] = [];
	for (const e of ALL) {
		if (e.n.includes(q)) {
			out.push(e);
			if (out.length >= limit) break;
		}
	}
	return out;
}

/**
 * Her own symbols, most-pressed first, derived from her moments.
 *
 * DERIVED, NEVER STORED — there is no "favourites" table for her to curate or
 * for the app to get wrong. Stop using a symbol and it recedes on its own; no
 * setting to change, nothing to tidy, and no record anywhere that says this is
 * the kind of person she is.
 */
export function hers(moments: { emoji: string }[], limit = 24): string[] {
	const count = new Map<string, number>();
	for (const m of moments) count.set(m.emoji, (count.get(m.emoji) ?? 0) + 1);
	return [...count.entries()]
		.sort((a, b) => b[1] - a[1])
		.slice(0, limit)
		.map(([e]) => e);
}
