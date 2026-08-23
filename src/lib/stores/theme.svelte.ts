import { DEFAULT_THEME, PRESET_THEMES, presetSwatch } from '$lib/theme/theme';
import type { ThemeConfig, TintLevel } from '$lib/types/types';

// ---------------------------------------------------------------------------
// SIRENS' OWN GROUND — the rose this app was founded in.
//
// The first build carried its own palette in app.css: a calm rose ground with
// `--accent: #a63d62` light / `#e78fae` dark, and a dark mode written as "the
// same design rather than an inversion of it." That file was replaced by the
// family's, and the colour would otherwise have been lost with it — so it
// lived HERE, in this app's own store, because `$lib/theme/theme.ts` is a
// MIRROR (origin: resonance-awen/standalone/theme/theme.ts) and a hand-edit
// there is drift the next shelf run erases.
//
// RECONCILED 2026-08-23 (the special-attention sitting the 08-22 row named):
// at KP's word of 2026-08-22 — "there is a rose color in the sirens onboarding
// and settings we should bring into the cosmic design system" — the rose went
// into cosmic as `sirens.rose` (#E78FAE, the same hex) and the shelf's theme
// table grew a `rose` preset from it. So the rose is read FROM the shelf now,
// and this list is DERIVED from the shelf's table rather than hand-kept — which
// is how Rainbow and Progress Pride arrive here without a line being written
// for them, and how any preset born later will too.
// ---------------------------------------------------------------------------

/** The founding rose — the shelf's own token now. "An app someone opens on a
 *  hard day." Kept as a named export because `rose()` and the default read it. */
export const SIRENS_ROSE = PRESET_THEMES.rose.accentColor;

/** Rose leads because it is this app's own default; the family follows in the
 *  shelf's own order. A display-name tweak or two is dress; the KEY is what is
 *  stored, and the key is the shelf's. */
const ROSE_FIRST = ['rose', ...Object.keys(PRESET_THEMES).filter((k) => k !== 'rose')];

/** EVERY preset the shelf holds, in one place, so Settings and the onboarding
 *  walk cannot drift — and a flag preset carries its stripes as its swatch. */
export const SIRENS_THEMES = ROSE_FIRST.map((key) => {
	const t = PRESET_THEMES[key];
	return {
		key,
		icon: t.icon ?? '✨',
		/** The card's label — dress; AMOLED reads shorter on a card. */
		name: key === 'amoled' ? 'AMOLED' : t.presetName,
		/** What `setPreset` actually stores — match the active card on THIS,
		 *  never on the accent (Dark and AMOLED share one) and never on the
		 *  label (AMOLED's label is shortened above). */
		presetName: t.presetName,
		accent: t.accentColor,
		swatch: presetSwatch(t)
	};
});

// Only the colour is Sirens' own; mode, text size and tint are the family's
// defaults, and the reader's to change (the Echoes shape, 2026-08-21, carried
// here 2026-08-22: a preset is a COLOUR IDENTITY, never a whole configuration).
const SIRENS_DEFAULT: ThemeConfig = {
	...DEFAULT_THEME,
	accentColor: SIRENS_ROSE,
	presetName: 'Rose'
};

const STORAGE_KEY = 'resonance-sirens-theme';

let config = $state<ThemeConfig>({ ...SIRENS_DEFAULT });

function persist() {
	if (typeof localStorage !== 'undefined') {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
	}
}

export const themeStore = {
	get config() {
		return config;
	},
	loadTheme() {
		if (typeof localStorage === 'undefined') return;
		const stored = localStorage.getItem(STORAGE_KEY);
		if (!stored) return;
		try {
			// Merged over the default, never cast blind: a config saved before a
			// field existed keeps working instead of arriving undefined.
			config = { ...SIRENS_DEFAULT, ...(JSON.parse(stored) as Partial<ThemeConfig>) };
		} catch {
			config = { ...SIRENS_DEFAULT };
		}
	},
	/** Takes any preset the shelf holds, rose included, so onboarding and
	 *  Settings both speak one vocabulary. Takes the preset's COLOUR only: display mode,
	 *  font size and tint are the reader's own choices and survive untouched —
	 *  the one exception being a preset that declares a mode because its
	 *  identity IS a mode (AMOLED). */
	setPreset(presetName: string) {
		// 'rose' resolves through the shelf's table like every other key now —
		// the special case of 08-18 retired with the reconciliation above.
		const preset = PRESET_THEMES[presetName];
		if (!preset) return;
		config = {
			...config,
			accentColor: preset.accentColor,
			presetName: preset.presetName,
			...(preset.mode ? { mode: preset.mode } : {})
		};
		persist();
	},
	setMode(mode: 'dark' | 'light' | 'amoled') {
		config = { ...config, mode };
		persist();
	},
	setFontSize(size: 'small' | 'medium' | 'large') {
		config = { ...config, fontSize: size };
		persist();
	},
	setTint(tint: TintLevel) {
		config = { ...config, tint };
		persist();
	},
	/** An accent on its own, so the rose is reachable without touching the
	 *  mirrored preset table. */
	setAccent(accentColor: string, presetName = 'Rose') {
		config = { ...config, accentColor, presetName };
		persist();
	},
	rose() {
		this.setAccent(SIRENS_ROSE, 'Rose');
	}
};
