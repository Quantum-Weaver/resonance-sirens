// ============================================================================
// THE RECORD — where a moment goes so she can find it again
// ============================================================================
//
// ONE TABLE. A moment is: when it was, the symbol she pressed, optionally her
// temperature, optionally a note. That is the whole schema and it is thin on
// purpose.
//
// WHAT THIS FILE DELIBERATELY CANNOT DO, and it is the point of the app:
//
//   · There is no cycle table, no phase table, no prediction table. A cycle is
//     DERIVED from moments at read time and never stored, because a stored
//     cycle is a judgement about her body that outlives the day it was made.
//     Same law as the-temporal: derive, never store.
//   · There is no count function, no streak, no `since()`, no `missed()`.
//     Nothing here knows what a missed day would be, so nothing here can
//     grade one. (Carried verbatim in spirit from resonance-tarocchi's own
//     record layer, and from KP's word: "no streaks, no counts, no
//     missed-day language, ever.")
//   · There is no network call in this file, or anywhere in this app.
//
// THE EMOJI IS NOT A CATEGORY. Every other tracker makes a woman translate her
// body into someone else's vocabulary — light, medium, heavy, spotting. Here
// the symbol is stored raw and the app never interprets it. KP's ruling of
// 2026-07-31, carried in the emoji dataset's own header: "Names are for search
// only - meaning is the vessel's own."
//
// AND FROM PHILOSOPHY.md: what is recorded must be exportable whole and
// deletable permanently. Both are below, and `purge()` really purges.

import { browser } from '$app/environment';

export interface Moment {
	id: string;
	/** ISO 8601, in her own local time when it was pressed. */
	at: string;
	/** The symbol she chose. Raw, uninterpreted, hers. */
	emoji: string;
	/** Celsius is the one stored unit; Fahrenheit is a display choice. */
	tempC: number | null;
	note: string | null;
}

// ============================================================================
// THE CONNECTION — with the guard that keeps `npm run dev` alive
// ============================================================================

type Db = {
	execute(query: string, values?: unknown[]): Promise<unknown>;
	select<T>(query: string, values?: unknown[]): Promise<T>;
};

let db: Db | null = null;
let tried = false;

/** `Database.load` throws outside Tauri, and dev is a plain browser. Without
 *  this the app dies in development, so it degrades to memory and says so
 *  rather than pretending. */
export function inTauri(): boolean {
	return browser && typeof (window as unknown as Record<string, unknown>).__TAURI_INTERNALS__ !== 'undefined';
}

async function connect(): Promise<Db | null> {
	if (db || tried) return db;
	tried = true;
	if (!inTauri()) return null;
	try {
		const mod = await import('@tauri-apps/plugin-sql');
		// This URL must match src-tauri/src/lib.rs exactly.
		db = (await mod.default.load('sqlite:siren.db')) as unknown as Db;
	} catch {
		db = null;
	}
	return db;
}

/** Moments held in memory when there is no database — a session, not a record. */
let ephemeral: Moment[] = [];

// ============================================================================
// WRITING — one press
// ============================================================================

/**
 * Capture a moment. `at` is taken here, once, so the time recorded is the time
 * she pressed and not the time a save finished.
 */
export async function capture(
	emoji: string,
	tempC: number | null = null,
	note: string | null = null
): Promise<Moment> {
	const moment: Moment = {
		id: crypto.randomUUID(),
		at: new Date().toISOString(),
		emoji,
		tempC,
		note: note && note.trim() ? note.trim() : null
	};

	const d = await connect();
	if (d) {
		await d.execute(
			'INSERT INTO moments (id, at, emoji, temp_c, note) VALUES ($1, $2, $3, $4, $5)',
			[moment.id, moment.at, moment.emoji, moment.tempC, moment.note]
		);
	} else {
		ephemeral = [moment, ...ephemeral];
	}
	return moment;
}

/**
 * A moment she is placing on a day she has already lived.
 *
 * `capture()` above stamps the clock, because the time recorded should be the
 * time she pressed. This one takes the day from HER TAP on a day in the
 * calendar and from nowhere else - the app never back-dates anything on its
 * own, and no caller in this repo hands it a computed day.
 *
 * If she gives no time the moment is stored at local midnight, which this app
 * reads as SHE NAMED THE DAY, NOT THE HOUR - the calendar prints no clock time
 * for a midnight moment. That convention costs no column: nothing new is
 * stored about her body to carry a flag, and the schema is still the founding
 * one.
 *
 * There is still no way to record a day that has not happened. The calendar
 * offers this on today and earlier only, and this function is the only door.
 */
export async function captureOn(
	day: string,
	emoji: string,
	time: string | null = null,
	tempC: number | null = null,
	note: string | null = null
): Promise<Moment> {
	const [y, mo, d] = day.split('-').map(Number);
	const [h, mi] = (time ?? '00:00').split(':').map(Number);
	const at = new Date(y, mo - 1, d, h || 0, mi || 0, 0, 0);
	const moment: Moment = {
		id: crypto.randomUUID(),
		at: at.toISOString(),
		emoji,
		tempC,
		note: note && note.trim() ? note.trim() : null
	};
	const conn = await connect();
	if (conn) {
		await conn.execute(
			'INSERT INTO moments (id, at, emoji, temp_c, note) VALUES ($1, $2, $3, $4, $5)',
			[moment.id, moment.at, moment.emoji, moment.tempC, moment.note]
		);
	} else {
		ephemeral = [moment, ...ephemeral];
	}
	return moment;
}

/** Change a moment already recorded. Hers to correct; a record is not a verdict. */
export async function amend(
	id: string,
	patch: Partial<Pick<Moment, 'emoji' | 'tempC' | 'note'>>
): Promise<void> {
	const d = await connect();
	if (d) {
		const m = (await d.select<Moment[]>('SELECT id, at, emoji, temp_c as "tempC", note FROM moments WHERE id = $1', [id]))[0];
		if (!m) return;
		await d.execute('UPDATE moments SET emoji = $1, temp_c = $2, note = $3 WHERE id = $4', [
			patch.emoji ?? m.emoji,
			patch.tempC === undefined ? m.tempC : patch.tempC,
			patch.note === undefined ? m.note : patch.note,
			id
		]);
	} else {
		ephemeral = ephemeral.map((m) => (m.id === id ? { ...m, ...patch } : m));
	}
}

/** Remove one moment. It goes; there is no bin. */
export async function forget(id: string): Promise<void> {
	const d = await connect();
	if (d) await d.execute('DELETE FROM moments WHERE id = $1', [id]);
	else ephemeral = ephemeral.filter((m) => m.id !== id);
}

// ============================================================================
// READING
// ============================================================================

/** Every moment, newest first. There is no paging and no limit by design —
 *  a year of daily presses is a few hundred rows. */
export async function all(): Promise<Moment[]> {
	const d = await connect();
	if (!d) return [...ephemeral];
	return d.select<Moment[]>(
		'SELECT id, at, emoji, temp_c as "tempC", note FROM moments ORDER BY at DESC'
	);
}

// ============================================================================
// HER WORDS - the one thing stored that is not a moment
// ============================================================================
//
// A word she typed under a circle, on her device, for her eyes. THE APP SHIPS
// NO WORDS AND SUGGESTS NONE. It never reads one either: nothing in this
// program branches on what a mark says, nothing groups by it, nothing exports
// it as a claim about her body. A red circle with "heavy" beside it means, to
// this code, exactly what a red circle with nothing beside it means - nothing.
//
// That is the line between HER vocabulary and a taxonomy, and it is the whole
// reason this is allowed to exist at all.

/** Her words when there is no database - a session, not a record. */
let ephemeralMarks: Record<string, string> = {};

/** Every word she has given, glyph -> word. Absent means she gave none. */
export async function marks(): Promise<Record<string, string>> {
	const d = await connect();
	if (!d) return { ...ephemeralMarks };
	const rows = await d.select<{ glyph: string; word: string }[]>('SELECT glyph, word FROM marks');
	const out: Record<string, string> = {};
	for (const r of rows) out[r.glyph] = r.word;
	return out;
}

/** Set or clear her word for a circle. An empty word deletes the row rather
 *  than leaving a blank behind - there is no such thing here as a word she
 *  once had. */
export async function mark(glyph: string, word: string | null): Promise<void> {
	const w = word && word.trim() ? word.trim() : null;
	const d = await connect();
	if (d) {
		if (w === null) await d.execute('DELETE FROM marks WHERE glyph = $1', [glyph]);
		else
			await d.execute(
				'INSERT INTO marks (glyph, word) VALUES ($1, $2) ON CONFLICT(glyph) DO UPDATE SET word = $2',
				[glyph, w]
			);
	} else {
		if (w === null) delete ephemeralMarks[glyph];
		else ephemeralMarks[glyph] = w;
	}
}

// ============================================================================
// SOVEREIGNTY — export whole, purge real
// ============================================================================

/** Everything, for the envelope. */
export async function everything(): Promise<Moment[]> {
	return all();
}

/**
 * Erase every moment. THE PURGE IS REAL — no soft delete, no tombstone, no
 * "deleted_at" column that a later version could resurrect. PRIVACY.md's own
 * words: "when you purge, it is truly gone."
 *
 * The caller is expected to have offered the export first — the-envelope's
 * `purgeAfter` law — but this function does not enforce it, because a woman
 * who wants her data gone RIGHT NOW must not be made to perform a backup first.
 */
export async function purge(): Promise<void> {
	const d = await connect();
	if (d) {
		await d.execute('DELETE FROM moments');
		await d.execute('DELETE FROM marks');
	}
	ephemeral = [];
	ephemeralMarks = {};
}

/** Merge imported moments without destroying what is here. Same id wins the
 *  one already present — an import never overwrites her own hand. */
export async function absorb(incoming: Moment[]): Promise<{ added: number; kept: number }> {
	const mine = await all();
	const seen = new Set(mine.map((m) => m.id));
	let added = 0;
	for (const m of incoming) {
		if (seen.has(m.id)) continue;
		const d = await connect();
		if (d) {
			await d.execute(
				'INSERT INTO moments (id, at, emoji, temp_c, note) VALUES ($1, $2, $3, $4, $5)',
				[m.id, m.at, m.emoji, m.tempC ?? null, m.note ?? null]
			);
		} else {
			ephemeral = [m, ...ephemeral];
		}
		added++;
	}
	return { added, kept: mine.length };
}
