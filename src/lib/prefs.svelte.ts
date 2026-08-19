// ============================================================================
// PREFERENCES — the few things kept about her that are not moments
// ============================================================================
//
// localStorage, not the database. A preference is a display choice; it is not
// a record, it never appears in an export as a claim about her, and losing it
// costs nothing but a tap.
//
// KP's word, 2026-08-18, on why the sky is a switch and not a fixture:
// "to attach more understanding to a moment captured. and toggle on or off in
// settings as some may not be interested."

const SKY_KEY = 'resonance-sirens-sky';

function read(key: string, fallback: boolean): boolean {
	try {
		const v = localStorage.getItem(key);
		return v === null ? fallback : v === '1';
	} catch {
		return fallback;
	}
}

function write(key: string, on: boolean): void {
	try {
		localStorage.setItem(key, on ? '1' : '0');
	} catch {
		/* private mode; the session still works */
	}
}

let sky = $state(true);

export const prefs = {
	/** Whether the sky is shown at all — on a day cell, beside a moment, in the
	 *  calendar's head. ONE SWITCH, ONE IDEA: some will not be interested, and
	 *  that is a whole reason. */
	get sky() {
		return sky;
	},

	load() {
		sky = read(SKY_KEY, true);
	},

	setSky(on: boolean) {
		sky = on;
		write(SKY_KEY, on);
	}
};
