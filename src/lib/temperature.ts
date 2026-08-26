// Celsius is what the record holds, always; Fahrenheit is a keyboard, not a unit. The flip converts.

export type Unit = 'C' | 'F';
const KEY = 'resonance-sirens-unit';

/** Her typed string to the stored Celsius. Empty or unparseable is null. */
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

/** Both, for reading rather than typing. */
export function bothUnits(c: number | null): string | null {
	if (c === null) return null;
	return `${c} \u00B0C \u00B7 ${Math.round((c * 1.8 + 32) * 10) / 10} \u00B0F`;
}

/** Her display unit, remembered. A preference, not a record. */
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
