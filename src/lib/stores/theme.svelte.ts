import { DEFAULT_THEME, PRESET_THEMES } from '$lib/theme/theme';
import type { ThemeConfig, TintLevel } from '$lib/types/types';

// ---------------------------------------------------------------------------
// SIRENS' OWN GROUND — the rose this app was founded in.
//
// The first build carried its own palette in app.css: a calm rose ground with
// `--accent: #a63d62` light / `#e78fae` dark, and a dark mode written as "the
// same design rather than an inversion of it." That file was replaced by the
// family's, and the colour would otherwise have been lost with it.
//
// It is NOT added to PRESET_THEMES, because `$lib/theme/theme.ts` is a MIRROR
// (origin: resonance-awen/standalone/theme/theme.ts) and a hand-edit there is
// drift the next shelf run erases. It lives here instead, in this app's own
// store, which is this app's own file.
// ---------------------------------------------------------------------------

/** The founding rose. "An app someone opens on a hard day." */
export const SIRENS_ROSE = '#e78fae';

/** THE SEVEN, in one place, so Settings and the onboarding walk cannot drift.
 *  Rose leads because it is this app's own default; the six behind it are the
 *  family's, in the mirror's own order. */
export const SIRENS_THEMES = [
	{ key: 'rose', icon: '🌹', name: 'Rose', accent: SIRENS_ROSE },
	{ key: 'dark', icon: '🌙', name: 'Dark', accent: PRESET_THEMES.dark.accentColor },
	{ key: 'warm', icon: '🔥', name: 'Warm', accent: PRESET_THEMES.warm.accentColor },
	{ key: 'ocean', icon: '🌊', name: 'Ocean', accent: PRESET_THEMES.ocean.accentColor },
	{ key: 'forest', icon: '🌲', name: 'Forest', accent: PRESET_THEMES.forest.accentColor },
	{ key: 'sunset', icon: '🌅', name: 'Sunset', accent: PRESET_THEMES.sunset.accentColor },
	{ key: 'amoled', icon: '⚫', name: 'AMOLED', accent: PRESET_THEMES.amoled.accentColor }
] as const;

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
	/** Takes any of the seven, rose included, so onboarding and Settings can
	 *  both speak one vocabulary. Takes the preset's COLOUR only: display mode,
	 *  font size and tint are the reader's own choices and survive untouched —
	 *  the one exception being a preset that declares a mode because its
	 *  identity IS a mode (AMOLED). */
	setPreset(presetName: string) {
		if (presetName === 'rose') {
			config = { ...config, accentColor: SIRENS_ROSE, presetName: 'Rose' };
			persist();
			return;
		}
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
