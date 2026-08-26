// Theme customization
export type TintLevel = 'off' | 'subtle' | 'full';

export interface ThemeConfig {
  mode: 'dark' | 'light' | 'amoled';
  accentColor: string;
  presetName?: string;
  fontSize: 'small' | 'medium' | 'large';
  /** How far the accent bleeds into the background. The reader's choice, not
   *  the app's. A config saved before this field existed is merged over the
   *  default and reads as 'subtle'. */
  tint: TintLevel;
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
