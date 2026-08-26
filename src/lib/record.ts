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

// THE CONNECTION

type Db = {
	execute(query: string, values?: unknown[]): Promise<unknown>;
	select<T>(query: string, values?: unknown[]): Promise<T>;
};

let db: Db | null = null;
let tried = false;

/** `Database.load` throws outside Tauri, and dev is a plain browser. */
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

// WRITING

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
 * The day comes from HER TAP on a day in the calendar and from nowhere else.
 *
 * If she gives no time the moment is stored at local midnight, which this app
 * reads as SHE NAMED THE DAY, NOT THE HOUR - the calendar prints no clock time
 * for a midnight moment.
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

/** Change a moment already recorded. */
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

// READING

/** Every moment, newest first. There is no paging and no limit. */
export async function all(): Promise<Moment[]> {
	const d = await connect();
	if (!d) return [...ephemeral];
	return d.select<Moment[]>(
		'SELECT id, at, emoji, temp_c as "tempC", note FROM moments ORDER BY at DESC'
	);
}

// HER WORDS

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
 *  than leaving a blank behind. */
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

// SOVEREIGNTY

/** Everything, for the envelope. */
export async function everything(): Promise<Moment[]> {
	return all();
}

/**
 * Erase every moment. THE PURGE IS REAL - no soft delete, no tombstone, no
 * "deleted_at" column.
 *
 * The caller is expected to have offered the export first; this function does
 * not enforce it.
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
 *  one already present. */
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
