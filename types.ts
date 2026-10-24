export enum AppScreen {
  SPLASH = 'SPLASH',
  HOME = 'HOME',
  PLAYER_SETUP = 'PLAYER_SETUP',
  G1_ASSIGNMENT = 'G1_ASSIGNMENT',
  G1_INPUT = 'G1_INPUT',
  G1_REVEAL = 'G1_REVEAL',
  G1_DISCUSS = 'G1_DISCUSS',
  G1_VOTE = 'G1_VOTE',
  G1_RESULTS = 'G1_RESULTS',
  G2_CATEGORY_SELECT = 'G2_CATEGORY_SELECT',
  G2_REVEAL_FLOW = 'G2_REVEAL_FLOW',
  G2_PASS_PHONE = 'G2_PASS_PHONE', 
  G2_GAMEPLAY = 'G2_GAMEPLAY',
  G2_VOTE = 'G2_VOTE',
  G2_RESULTS = 'G2_RESULTS',
  G3_DRAW = 'G3_DRAW',
  G3_DISCUSS = 'G3_DISCUSS',
  G3_VOTE = 'G3_VOTE',
  G3_RESULTS = 'G3_RESULTS'
}

export enum GameMode {
  NUMBER_JUSTIFY = 'NUMBER_JUSTIFY',
  IMPOSTOR_WORD = 'IMPOSTOR_WORD',
  SKETCHY_SUSPECT = 'SKETCHY_SUSPECT'
}

export interface Player {
  id: string;
  name: string;
  avatarSeed: number;
  isImpostor: boolean;
  score: number;
  answer?: string;
  numberAnswer?: number;
}

export interface QuestionPair {
  safe: string;
  impostor: string;
  type: 'number' | 'text';
}

export interface WordPair {
  safe: string;
  impostor: string;
  category: string;
}

// New interface for your 2000 Sketchy words
export interface SketchyWord {
  word: string;
  category: string;
}

export const CATEGORIES = ["Daily Life", "Food", "Places", "School", "Bollywood", "Cricket", "Objects"];