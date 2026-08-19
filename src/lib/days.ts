// ============================================================================
// THE DAYS — the only place this app turns moments into a calendar
// ============================================================================
//
// What record.ts says, carried here because THIS is the file that could break it:
// "A cycle is DERIVED from moments at read time and never stored." Everything
// below is a pure function of her moments and a date. Nothing is written,
// nothing is cached to disk, nothing survives the render.
//
// WHAT THIS FILE REFUSES TO COMPUTE, and the refusal IS the design:
//
//   · no length of anything — not a cycle, not a run, not a gap
//   · no comparison of one stretch to another, no average, no "usual"
//   · nothing at all about a day that has not happened
//   · no meaning for any circle. `byDay` moves her circle onto the day she
//     pressed it and that is the entire extent of its opinion.
//
// AND `byDay` RETURNS HER MOMENTS, NEVER HOW MANY THERE WERE. A function that
// returned counts would hand the calendar a number it could render, and the
// guard would then be a matter of someone's discipline instead of a matter of
// what exists. The room's silence is structural.
//
// Even given a marker, "31 days" is a number about a body, and every number
// about a body is silently measured against 28. The word `irregular` never has
// to appear on a screen; the figure summons it in the reader. That is why
// there is no figure.
//
// TODAY COMES FROM the-now, never from rolling date logic. Its own words:
// "'what is today' is the one fact a program most often assumes and most often
// gets wrong." src/lib/now is its byte-faithful mirror.
//
// AND ALL DAY ARITHMETIC GOES THROUGH THE LOCAL CALENDAR, never through
// milliseconds — a day is not always 86,400,000 ms, and twice a year that is a
// bug that puts her moment on the wrong square.

import { now, readMoment } from '$lib/now';
import { moonPhase } from '$lib/sky';
import type { Moment } from '$lib/record';

/** `YYYY-MM-DD`, in her own local calendar. */
export type DayKey = string;

export function dayKey(d: Date): DayKey {
	return readMoment(d).date;
}

export function todayKey(): DayKey {
	return now().date;
}

/** Her moments on the days she pressed them, oldest first within a day. */
export function byDay(moments: Moment[]): Map<DayKey, Moment[]> {
	const out = new Map<DayKey, Moment[]>();
	for (const m of moments) {
		const k = dayKey(new Date(m.at));
		const list = out.get(k);
		if (list) list.push(m);
		else out.set(k, [m]);
	}
	for (const list of out.values()) list.sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0));
	return out;
}

/** Sunday. Hers to flip to 1. */
export const WEEK_STARTS_ON = 0;

/** Fixed English tables — the-now's own discipline. No locale variance, and no
 *  `toLocaleDateString` anywhere in the calendar. */
const MONTHS = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December'
] as const;

export const HEADS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export interface Day {
	key: DayKey;
	date: Date;
	dayOfMonth: number;
	/** "Tuesday, 12 August 2026" — spoken to a reader, printed in a panel. */
	spelled: string;
	firstOfMonth: boolean;
	/** The moon over that day. Furniture: identical for every woman, so it can
	 *  encode nothing about her — which is exactly why it is safe here, and why
	 *  nothing in this app may ever relate it to her moments. */
	moon: string;
	moonName: string;
}

export interface Week {
	key: DayKey;
	days: Day[];
	/** "August 2026" on the week that contains a 1st, else null. */
	caption: string | null;
}

function midnight(d: Date): Date {
	return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d: Date, n: number): Date {
	const out = midnight(d);
	out.setDate(out.getDate() + n); // the calendar's own arithmetic — DST-safe
	return out;
}

function makeDay(date: Date): Day {
	const r = readMoment(date);
	const mp = moonPhase(date);
	return {
		key: r.date,
		date,
		dayOfMonth: date.getDate(),
		spelled: `${r.weekday}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`,
		firstOfMonth: date.getDate() === 1,
		moon: mp.emoji,
		moonName: mp.phase
	};
}

/**
 * THE RIBBON — rows of seven around the week `anchor` falls in: `weeksBack`
 * before it, `weeksForward` after.
 *
 * It reaches forward as far as it is asked to. An earlier version stopped dead
 * at today, which was my invention and not KP's — his word, 2026-08-18: "a
 * calendar that cannot look a year into the future is hardly a calendar."
 */
export function ribbon(anchor: Date, weeksBack: number, weeksForward = 0): Week[] {
	const t = midnight(anchor);
	const endOfWeek = addDays(t, 6 - ((t.getDay() - WEEK_STARTS_ON + 7) % 7));
	const out: Week[] = [];
	for (let w = weeksBack - 1; w >= -weeksForward; w--) {
		const start = addDays(endOfWeek, -6 - w * 7);
		const days: Day[] = [];
		for (let i = 0; i < 7; i++) days.push(makeDay(addDays(start, i)));
		const first = days.find((d) => d.firstOfMonth);
		out.push({
			key: days[0].key,
			days,
			caption: first ? `${MONTHS[first.date.getMonth()]} ${first.date.getFullYear()}` : null
		});
	}
	return out;
}

/** A clock time for a moment, or null when she named the day and not the hour
 *  (stored at local midnight — see `captureOn`). */
export function clockOf(m: Moment): string | null {
	const d = new Date(m.at);
	if (d.getHours() === 0 && d.getMinutes() === 0) return null;
	return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}
