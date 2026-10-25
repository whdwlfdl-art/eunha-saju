/**
 * Content pipeline types — rules/templates now; AI draft later (검수 후 출고).
 */

export type Gender = 'female' | 'male' | 'other';

export type BirthInput = {
  /** YYYY-MM-DD */
  date: string;
  /** HH:mm or empty when unknown */
  time: string;
  timeUnknown: boolean;
  gender: Gender;
};

/** Deterministic 사주-inspired keys (MVP approximation — see README). */
export type SajuKeys = {
  /** 천간 (day stem) index 0–9 */
  dayStemIndex: number;
  dayStem: string;
  /** 지지 (day branch) index 0–11 */
  dayBranchIndex: number;
  dayBranch: string;
  /** 띠 from birth year */
  zodiacIndex: number;
  zodiac: string;
  /** 오행 from day stem */
  element: string;
  /** 시진 index 0–11, or null if time unknown */
  hourBranchIndex: number | null;
  hourBranch: string | null;
  /** Stable hash for template picking */
  profileKey: string;
  /** Daily rotation key (profile + calendar day) */
  dailyKey: string;
};

export type DailyFortune = {
  headline: string;
  body: string;
  tip: string;
  keys: SajuKeys;
  source: 'template' | 'ai-draft';
};

export type DetailSectionId =
  | 'personality'
  | 'overview'
  | 'wealth'
  | 'love'
  | 'yearFlow';

export type DetailSection = {
  id: DetailSectionId;
  title: string;
  body: string;
};

export type DetailReading = {
  summary: string;
  sections: DetailSection[];
  keys: SajuKeys;
  source: 'template' | 'ai-draft';
};

export type ContentRequest = {
  birth: BirthInput;
  /** Reference day for “today’s” fortune; defaults to local today */
  asOf?: Date;
};

/**
 * Pluggable content source. Ship only reviewed template (or reviewed AI) text.
 */
export interface ContentProvider {
  readonly id: string;
  getDailyFortune(request: ContentRequest): Promise<DailyFortune | null>;
  getDetailReading(request: ContentRequest): Promise<DetailReading | null>;
}
