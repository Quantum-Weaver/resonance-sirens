// All day arithmetic goes through the local calendar, never milliseconds — a day is not always 86,400,000 ms.

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

/** Fixed English tables — no locale variance, and no `toLocaleDateString` in the calendar. */
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
	/** The moon over that day. */
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
