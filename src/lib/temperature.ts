// ============================================================================
// TEMPERATURE — one stored unit, two ways of typing it
// ============================================================================
//
// Celsius is what the record holds, always, so her history can never disagree
// with itself because a display setting changed. Fahrenheit is a keyboard, not
// a unit.
//
// AND THE FLIP CONVERTS. The first build swapped the label and left her number
// sitting under it — type 37.0, tap °F, and 37.0 Fahrenheit is stored as 2.78
// Celsius. Her number crosses with her.
//
// THERE IS NO RANGE CHECK, and there will not be one. An app that refuses her
// number, or paints it amber, or calls it out of range, has graded a reading
// taken off her own body.

export type Unit = 'C' | 'F';
const KEY = 'resonance-sirens-unit';

/** Her typed string to the stored Celsius. Empty or unparseable is null, not
 *  an error — an unfilled box is a normal thing, not a mistake. */
export function toC(raw: string, unit: Unit): number | null {
	const n = Number(raw);
	if (!raw.trim() || Number.isNaN(n)) return null;
	return unit === 'F' ? Math.round((((n - 32) * 5) / 9) * 100) / 100 : n;
}

/** Stored Celsius back to the box, in whichever unit she is typing in. */
export function fromC(c: number | null, unit: Unit): string {
	if (c === null) return '';
	return unit === 'F' ? String(Math.round((c * 1.8 + 32) * 10) / 10) : String(c);
}

/** Both, for reading rather than typing — so a day she opens later needs no
 *  preference to have been stored and no unit to be guessed. */
export function bothUnits(c: number | null): string | null {
	if (c === null) return null;
	return `${c} \u00B0C \u00B7 ${Math.round((c * 1.8 + 32) * 10) / 10} \u00B0F`;
}

/** Her display unit, remembered. A preference, not a record — the one thing
 *  about her kept outside the database. */
export function readUnit(): Unit {
	try {
		return localStorage.getItem(KEY) === 'F' ? 'F' : 'C';
	} catch {
		return 'C';
	}
}

export function writeUnit(u: Unit): void {
	try {
		localStorage.setItem(KEY, u);
	} catch {
		/* private mode; the session still works */
	}
}
