import { DEFAULT_THEME, PRESET_THEMES, presetSwatch } from '$lib/theme/theme';
import type { ThemeConfig, TintLevel } from '$lib/types/types';

/** The founding rose — the shelf's own token. */
export const SIRENS_ROSE = PRESET_THEMES.rose.accentColor;

/** Rose leads, then the family in the shelf's own order. */
const ROSE_FIRST = ['rose', ...Object.keys(PRESET_THEMES).filter((k) => k !== 'rose')];

/** Every preset the shelf holds; a flag preset carries its stripes as its swatch. */
export const SIRENS_THEMES = ROSE_FIRST.map((key) => {
	const t = PRESET_THEMES[key];
	return {
		key,
		icon: t.icon ?? '✨',
		/** The card's label. */
		name: key === 'amoled' ? 'AMOLED' : t.presetName,
		/** What `setPreset` stores — match the active card on this, never on the accent or the label. */
		presetName: t.presetName,
		accent: t.accentColor,
		swatch: presetSwatch(t)
	};
});

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
			// Merged over the default so a config saved before a field existed keeps working.
			config = { ...SIRENS_DEFAULT, ...(JSON.parse(stored) as Partial<ThemeConfig>) };
		} catch {
			config = { ...SIRENS_DEFAULT };
		}
	},
	/** Takes the preset's COLOUR only: display mode, font size and tint survive
	 *  untouched, except a preset that declares a mode (AMOLED). */
	setPreset(presetName: string) {
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
	/** An accent on its own. */
	setAccent(accentColor: string, presetName = 'Rose') {
		config = { ...config, accentColor, presetName };
		persist();
	},
	rose() {
		this.setAccent(SIRENS_ROSE, 'Rose');
	}
};
