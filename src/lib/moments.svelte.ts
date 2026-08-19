// ============================================================================
// THE LIVING RECORD — one copy of her moments, shared by every room
// ============================================================================
//
// record.ts owns the writing; this owns the reading, so the cards and the
// calendar see the same list the instant a press lands, with no reload and no
// second query.
//
// IT ADDS NO STORAGE AND NO DERIVED RECORD. Everything here is either a
// passthrough to record.ts or a read-time derivation held in memory for a
// session. There is no count, no streak, no since(), no missed().
//
// AND IT MUST BE `.svelte.ts`. Runes compile only in `.svelte` and `.svelte.ts`
// files; in a plain `.ts` a `$state` typechecks clean and is undefined at
// runtime. Nemeton bought that lesson on 2026-08-18.

import {
	all,
	capture,
	captureOn,
	amend,
	forget,
	absorb as absorbMoments,
	purge as purgeRecord,
	marks as readMarks,
	mark as writeMark,
	type Moment
} from '$lib/record';

let moments = $state<Moment[]>([]);
let words = $state<Record<string, string>>({});
let loaded = $state(false);

export const record = {
	get moments() {
		return moments;
	},
	get loaded() {
		return loaded;
	},

	/** Her word for a circle, or null. THE APP NEVER READS THIS FOR MEANING —
	 *  nothing branches on it, nothing groups by it, nothing infers from it. */
	wordFor(glyph: string): string | null {
		return words[glyph] ?? null;
	},

	async load() {
		const [ms, ws] = await Promise.all([all(), readMarks()]);
		moments = ms; // already ORDER BY at DESC
		words = ws;
		loaded = true;
	},

	/** One press. `capture()` takes `at` inside itself, so the time recorded is
	 *  the time she pressed and not the time a save finished. */
	async press(glyph: string, tempC: number | null = null, note: string | null = null) {
		const m = await capture(glyph, tempC, note);
		moments = [m, ...moments];
		return m;
	},

	/** A moment placed on a day she has already lived. Her tap names the day. */
	async pressOn(
		day: string,
		glyph: string,
		time: string | null = null,
		tempC: number | null = null,
		note: string | null = null
	) {
		const m = await captureOn(day, glyph, time, tempC, note);
		moments = [m, ...moments].sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0));
		return m;
	},

	async attach(id: string, tempC: number | null, note: string | null) {
		await amend(id, { tempC, note });
		moments = moments.map((m) => (m.id === id ? { ...m, tempC, note } : m));
	},

	/** Undo for a thumb. A mis-tap is the most common real event in this app's
	 *  life, and the undo belongs exactly where the mis-tap landed. */
	async drop(id: string) {
		await forget(id);
		moments = moments.filter((m) => m.id !== id);
	},

	async name(glyph: string, word: string | null) {
		await writeMark(glyph, word);
		const next = { ...words };
		if (word && word.trim()) next[glyph] = word.trim();
		else delete next[glyph];
		words = next;
	},

	/** Everything she has, for the envelope — straight from the record, never
	 *  the loaded page (Echoes' E1). */
	async everything(): Promise<{ moments: Moment[]; words: Record<string, string> }> {
		const [ms, ws] = await Promise.all([all(), readMarks()]);
		return { moments: ms, words: ws };
	},

	/** Put a file back. Non-destructive both ways: a moment already here wins on
	 *  its id, and a word already here is her current mind and is never
	 *  overwritten by an older file. */
	async restore(
		incoming: Moment[],
		words: Record<string, string>
	): Promise<{ added: number; kept: number; wordsAdded: number; wordsKept: number }> {
		const { added, kept } = await absorbMoments(incoming);
		let wordsAdded = 0;
		let wordsKept = 0;
		for (const [glyph, word] of Object.entries(words)) {
			if (typeof word !== 'string' || !word.trim()) continue;
			if (this.wordFor(glyph)) wordsKept++;
			else {
				await writeMark(glyph, word);
				wordsAdded++;
			}
		}
		await this.load();
		return { added, kept, wordsAdded, wordsKept };
	},

	/** Everything gone, moments and her words together. */
	async purgeAll(): Promise<void> {
		await purgeRecord();
		await this.load();
	},

	/** The most recent press of this circle TODAY, or null.
	 *
	 *  Not a count, not a streak, not a since(). It answers the one question a
	 *  woman actually asks a tracker — "did I already?" — and it clears itself
	 *  at midnight without a word about yesterday. */
	lastToday(glyph: string): string | null {
		const today = new Date().toDateString();
		for (const m of moments) {
			if (m.emoji !== glyph) continue;
			if (new Date(m.at).toDateString() === today) return m.at;
		}
		return null;
	}
};
