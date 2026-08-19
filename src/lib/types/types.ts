// Theme customization
export interface ThemeConfig {
  mode: 'dark' | 'light' | 'amoled';
  accentColor: string;
  presetName?: string;
  fontSize: 'small' | 'medium' | 'large';
}

// Echo — a single journal entry
export interface Echo {
  id: string;
  name: string;
  sense: string;
  subcategory: string;
  emoji: string;
  note?: string;
  intensity: number;
  timestamp: number;
  createdAt: number;
}

// Sense — top-level perception category (Seen, Heard, Felt, Thought, etc.)
export interface Sense {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

// Subcategory — fine-grain entry under each Sense
export interface Subcategory {
  id: string;
  senseId: string;
  name: string;
  description: string;
}

// DELIBERATE DIVERGENCE FROM THE FAMILY, 2026-08-18. Echoes, gaia and awen
// re-export `EmojiDef` from `$lib/data/emojis` here — a sensory lexicon of
// several hundred symbols. Sirens has no lexicon and never will: its entire
// vocabulary is the ten circles in `$lib/circles.ts`, and an emoji dataset is
// the exact thing this app was rebuilt to remove. The data file is not copied,
// so the re-export is dropped with it. Nothing else in this file changes.
