// The circles — the whole vocabulary of this app: ten glyphs, nine solid and one hollow.
// No eleventh, no picker, no search. The order means nothing and nothing is a scale.

/** In row order, and this order means nothing. It is not a scale, not a
 *  sequence, and not a ranking — it is the order they sit on the screen, which
 *  is the only property this list has. */
export const CIRCLES = [
	'\u{1F534}', // red
	'\u{1F7E0}', // orange
	'\u{1F7E1}', // yellow
	'\u{1F7E2}', // green
	'\u{1F535}', // blue
	'\u{1F7E3}', // purple
	'\u{1F7E4}', // brown
	'\u{26AB}', // black
	'\u{26AA}', // white
	'\u{2B55}' // hollow
] as const;

export type Circle = (typeof CIRCLES)[number];

/** Is this glyph one of ours? The guard on anything read back from the record,
 *  since an older build could have written something else into the table. */
export function isCircle(glyph: string): glyph is Circle {
	return (CIRCLES as readonly string[]).includes(glyph);
}

// THE TINT — a card wears a faint wash of its own circle, and that is all.
// Nothing in this app is encoded in colour; these hues only repeat the glyph.

const HUE: Record<string, number> = {
	'\u{1F534}': 2,
	'\u{1F7E0}': 28,
	'\u{1F7E1}': 48,
	'\u{1F7E2}': 132,
	'\u{1F535}': 214,
	'\u{1F7E3}': 280,
	'\u{1F7E4}': 22,
	'\u{26AB}': 240,
	'\u{26AA}': 210,
	'\u{2B55}': 356
};

const SAT: Record<string, number> = {
	'\u{1F7E4}': 30,
	'\u{26AB}': 6,
	'\u{26AA}': 8
};

/** The wash behind a card. Faint by design — it is decoration, not a signal. */
export function tintOf(glyph: string): string {
	const h = HUE[glyph] ?? 210;
	const s = SAT[glyph] ?? 62;
	return `hsl(${h} ${s}% 55%)`;
}
