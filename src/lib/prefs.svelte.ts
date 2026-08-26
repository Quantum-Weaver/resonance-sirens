// Preferences live in localStorage, not the database: display choices, never records.

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
	/** Whether the sky is shown at all — on a day cell, beside a moment, in the calendar's head. */
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
