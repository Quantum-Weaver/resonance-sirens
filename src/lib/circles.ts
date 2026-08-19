// ============================================================================
// THE CIRCLES — the whole vocabulary of this app
// ============================================================================
//
// Ten glyphs. Nine solid colours and one hollow. There is no eleventh, there
// is no picker, and there is no search — the entire Unicode set was here once
// and it was a misreading.
//
// KP's word, 2026-08-18, correcting it:
//
//   "i suggested only keeping the circle emojis the colored circle emojis no
//    other emojis as the clickable triggers. and they created circles."
//
// and at the founding, which reads correctly the moment you stop mis-parsing
// it: "just colors circles for emojis, nothing more." THE COLOURS ARE THE
// EMOJIS. The first build read that as "draw circles in CSS" and put other
// symbols inside them, over a 3,944-emoji dataset and a name search.
//
// WHY THIS IS THE RIGHT VOCABULARY AND NOT A LIMITATION:
//
// Every other tracker makes a woman translate her body into someone else's
// words — light, medium, heavy, spotting. A colour is the one mark that can
// carry meaning without ever declaring it. This app cannot form a taxonomy
// around these ten because there is nothing here to form one out of: no name,
// no order, no rank, no group. Red is not worse than green. Nothing is a
// scale. She decides what each one is for and the program never finds out.
//
// The hollow one is deliberately last and deliberately different in KIND
// rather than in colour — a mark that is not one of the nine, for whatever
// she needs a not-one-of-the-nine for. KP's ruling, 2026-08-18.

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

// ---------------------------------------------------------------------------
// THE TINT — a card wears a faint wash of its own circle, and that is all.
//
// Fixed per glyph, forever. It does not walk, it does not warm, it does not
// redden. Hearth's entity cards journey white -> yellow -> red as a window the
// vessel set elapses, and on a cat's water bowl that is care; on a woman's
// body it is the app inventing an expectation and then drawing her distance
// from it — `late`, rendered in colour, inside an app whose record layer
// refuses the word. So none of cardColor.ts came across. Not one function.
//
// NOTHING IN THIS APP IS ENCODED IN COLOUR. These hues only repeat what the
// glyph already says. Greyscale loses nothing; a colour-blind eye loses
// nothing; a dark room loses nothing.
// ---------------------------------------------------------------------------

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
