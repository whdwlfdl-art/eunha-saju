import {
  BRANCHES,
  DAY_STEMS,
  ELEMENT_LABEL,
  STEM_ELEMENTS,
  ZODIACS,
} from '@/content/stems';
import type { BirthInput, SajuKeys } from '@/content/types';

/**
 * Anchor: 1900-01-01 ≈ 갑술일 in this MVP table (not a professional 만세력).
 * Day index = days since UTC midnight of that date.
 */
const EPOCH = Date.UTC(1900, 0, 1);

function parseDateParts(isoDate: string): { y: number; m: number; d: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const dt = new Date(y, mo - 1, d);
  if (
    dt.getFullYear() !== y ||
    dt.getMonth() !== mo - 1 ||
    dt.getDate() !== d
  ) {
    return null;
  }
  return { y, m: mo, d };
}

function daysSinceEpoch(y: number, m: number, d: number): number {
  const utc = Date.UTC(y, m - 1, d);
  return Math.floor((utc - EPOCH) / 86_400_000);
}

/**
 * 시진: 23–01 자, 01–03 축, … (짝수 시각 경계, 전통 근사).
 * hour 23 → 자(0); 0 → 자; 1–2 → 축, etc.
 */
export function hourToBranchIndex(hour: number, minute: number): number {
  const total = hour * 60 + minute;
  // Shift so 23:00 starts 자
  const shifted = (total + 60) % (24 * 60);
  return Math.floor(shifted / 120) % 12;
}

function parseTime(time: string): { hour: number; minute: number } | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!m) return null;
  const hour = Number(m[1]);
  const minute = Number(m[2]);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return { hour, minute };
}

function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

function localDayKey(asOf: Date): string {
  return `${asOf.getFullYear()}-${pad2(asOf.getMonth() + 1)}-${pad2(asOf.getDate())}`;
}

/**
 * Build deterministic 사주-inspired keys from birth input.
 * Assumptions documented in README — not professional 역술 accuracy.
 */
export function deriveSajuKeys(birth: BirthInput, asOf: Date = new Date()): SajuKeys {
  const parts = parseDateParts(birth.date);
  if (!parts) {
    // Stable fallback so UI still renders when date is invalid upstream
    return {
      dayStemIndex: 0,
      dayStem: DAY_STEMS[0],
      dayBranchIndex: 0,
      dayBranch: BRANCHES[0],
      zodiacIndex: 0,
      zodiac: ZODIACS[0],
      element: ELEMENT_LABEL[STEM_ELEMENTS[0]],
      hourBranchIndex: null,
      hourBranch: null,
      profileKey: 'invalid',
      dailyKey: `invalid:${localDayKey(asOf)}`,
    };
  }

  const dayIndex = daysSinceEpoch(parts.y, parts.m, parts.d);
  // 1900-01-01 → 갑(0)·술(10) in this table
  const dayStemIndex = ((dayIndex % 10) + 10) % 10;
  const dayBranchIndex = ((dayIndex + 10) % 12 + 12) % 12;

  // 띠: 흔한 근사 — (year - 4) % 12 → 쥐=0 (1900 쥐해 계열)
  const zodiacIndex = ((parts.y - 4) % 12 + 12) % 12;

  let hourBranchIndex: number | null = null;
  let hourBranch: string | null = null;
  if (!birth.timeUnknown) {
    const t = parseTime(birth.time);
    if (t) {
      hourBranchIndex = hourToBranchIndex(t.hour, t.minute);
      hourBranch = BRANCHES[hourBranchIndex];
    }
  }

  const elementCode = STEM_ELEMENTS[dayStemIndex];
  const profileKey = [
    DAY_STEMS[dayStemIndex],
    BRANCHES[dayBranchIndex],
    ZODIACS[zodiacIndex],
    hourBranch ?? '모름',
    birth.gender,
  ].join('-');

  const dailyKey = `${profileKey}:${localDayKey(asOf)}`;

  return {
    dayStemIndex,
    dayStem: DAY_STEMS[dayStemIndex],
    dayBranchIndex,
    dayBranch: BRANCHES[dayBranchIndex],
    zodiacIndex,
    zodiac: ZODIACS[zodiacIndex],
    element: ELEMENT_LABEL[elementCode],
    hourBranchIndex,
    hourBranch,
    profileKey,
    dailyKey,
  };
}

/** Simple stable string → non-negative int for template indexing. */
export function hashKey(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function pickIndex(key: string, length: number): number {
  if (length <= 0) return 0;
  return hashKey(key) % length;
}

export function isValidBirthDate(date: string): boolean {
  return parseDateParts(date) !== null;
}

export function isValidBirthTime(time: string): boolean {
  return parseTime(time) !== null;
}
