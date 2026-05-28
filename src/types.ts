export interface GlossaryEntry {
  word: string;
  syll: string;
  def: string;
}

export interface Quiz {
  q: string;
  options: string[];
  correct: number;
  explain: string;
}

export interface Choice {
  label: string;
  value: string;
}

export interface ChapterPanel {
  bg?: string;
  caption?: string;
  bubble?: { text: string; style?: string; pos?: string } | null;
  sfx?: string | null;
  // illustrated-panel pipeline
  imagePrompt?: string;
  dialogue?: string;
  imageUrl?: string;
}

export interface Chapter {
  title: string;
  text: string;
  glossary: GlossaryEntry[];
  quiz: Quiz;
  choices: Choice[];
  panels?: ChapterPanel[];
}

export interface Character {
  id: string;
  name: string;
  pronounce: string;
  tagline: string;
  traits: string[];
  art: string;
  // custom hero fields
  shape?: string;
  bodyPalette?: string;
  accentPalette?: string;
  eyes?: string;
}

export interface SetupOption {
  v: string;
  label: string;
  sub: string;
  icon: string;
  /** Restrict this option to specific character ids; if omitted, it's universal. */
  for?: string[];
}

export interface SetupQuestion {
  id: string;
  q: string;
  hint: string;
  pool: SetupOption[];
  options: SetupOption[];
}

export interface SessionStats {
  wordCount: number;
  wordsTapped: number;
  quizCorrect: number;
  quizTotal: number;
  timeMins: number;
  xpGained: number;
  earnedStickers?: string[];
  newSticker?: string;
}

export interface Settings {
  fontPreset: string;
  baseDifficulty: string;
  rampDifficulty: boolean;
  chaptersPerStory: number;
  showXpFlash: boolean;
  palette: string;
}

export type Stage = 'welcome' | 'character' | 'hero_builder' | 'setup' | 'loading' | 'reader' | 'end' | 'settings';

export interface Token {
  kind: 'word' | 'space' | 'punct';
  text: string;
}
