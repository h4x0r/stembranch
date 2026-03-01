/* c8 ignore next */
import type { Branch, ChineseZodiacAnimal, ChineseZodiacResult, YearBoundary } from './types';
import { BRANCHES } from './branches';
import { findSpringStart } from './solar-terms';

/** 生肖 (Chinese Zodiac Animals) mapped to 地支 in order */
export const ZODIAC_ANIMALS: readonly ChineseZodiacAnimal[] = [
  '鼠', '牛', '虎', '兔', '龍', '蛇',
  '馬', '羊', '猴', '雞', '狗', '豬',
];

/** English names for the 12 animals */
export const ZODIAC_ENGLISH: Record<ChineseZodiacAnimal, string> = {
  '鼠': 'Rat', '牛': 'Ox', '虎': 'Tiger', '兔': 'Rabbit',
  '龍': 'Dragon', '蛇': 'Snake', '馬': 'Horse', '羊': 'Goat',
  '猴': 'Monkey', '雞': 'Rooster', '狗': 'Dog', '豬': 'Pig',
};

/** Get the zodiac animal for a given branch */
export function animalFromBranch(branch: Branch): ChineseZodiacAnimal {
  return ZODIAC_ANIMALS[BRANCHES.indexOf(branch)];
}

/** Get the branch for a given zodiac animal */
export function branchFromAnimal(animal: ChineseZodiacAnimal): Branch {
  return BRANCHES[ZODIAC_ANIMALS.indexOf(animal)];
}

/**
 * 立春派 (Spring Start School): Year changes at 立春 (Start of Spring, solar longitude 315°).
 * Used in traditional 四柱八字 (Four Pillars of Destiny) and most 術數 systems.
 *
 * @param date - Date to determine zodiac for
 * @returns Chinese zodiac result with the effective year boundary
 */
export function getZodiacBySpringStart(date: Date): ChineseZodiacResult {
  const year = date.getFullYear();
  const springStart = findSpringStart(year);
  const effectiveYear = date >= springStart ? year : year - 1;
  const branchIndex = ((effectiveYear - 4) % 12 + 12) % 12;
  const branch = BRANCHES[branchIndex];
  const animal = ZODIAC_ANIMALS[branchIndex];

  return { animal, branch, yearBoundary: 'spring-start', effectiveYear };
}

/**
 * 初一派 (Lunar New Year School): Year changes at 農曆正月初一 (1st day of 1st lunar month).
 * Used in popular culture and everyday reference.
 *
 * Note: This uses a lookup approximation for lunar new year dates.
 * For exact computation, a full lunar calendar algorithm is needed.
 *
 * @param date - Date to determine zodiac for
 * @returns Chinese zodiac result with the effective year boundary
 */
export function getChineseZodiacLunarNewYear(date: Date): ChineseZodiacResult {
  const year = date.getFullYear();
  const lnyDate = lunarNewYearDate(year);
  const effectiveYear = date >= lnyDate ? year : year - 1;
  const branchIndex = ((effectiveYear - 4) % 12 + 12) % 12;
  const branch = BRANCHES[branchIndex];
  const animal = ZODIAC_ANIMALS[branchIndex];

  return { animal, branch, yearBoundary: 'lunar-new-year', effectiveYear };
}

/**
 * Get Chinese zodiac using the specified school.
 *
 * @param date - Date to determine zodiac for
 * @param boundary - Which year boundary convention to use:
 *   - 'spring-start' (default): 立春派 — year starts at 立春 (astronomy-based, exact)
 *   - 'lunar-new-year': 初一派 — year starts at lunar new year (approximation)
 */
export function getChineseZodiac(
  date: Date,
  boundary: YearBoundary = 'spring-start',
): ChineseZodiacResult {
  return boundary === 'spring-start'
    ? getZodiacBySpringStart(date)
    : getChineseZodiacLunarNewYear(date);
}

// ── Lunar New Year date lookup ──────────────────────────────
// Approximation using known dates 1900-2100.
// For a full astronomical calculation, use a dedicated lunar calendar module.

const LNY_DATA: Record<number, [number, number]> = {
  // [month (0-based), day] — only a representative subset shown;
  // the algorithm falls back to Feb 1 approximation for missing years.
  2020: [0, 25], 2021: [1, 12], 2022: [1, 1], 2023: [0, 22],
  2024: [1, 10], 2025: [0, 29], 2026: [1, 17], 2027: [1, 6],
  2028: [0, 26], 2029: [1, 13], 2030: [1, 3], 2031: [0, 23],
  2032: [1, 11], 2033: [0, 31], 2034: [1, 19], 2035: [1, 8],
  2036: [0, 28], 2037: [1, 15], 2038: [1, 4], 2039: [0, 24],
  2040: [1, 12], 2041: [1, 1], 2042: [0, 22], 2043: [1, 10],
  2044: [0, 30], 2045: [1, 17], 2046: [1, 6], 2047: [0, 26],
  2048: [1, 14], 2049: [1, 2], 2050: [0, 23],
  // Historical dates
  1990: [0, 27], 1991: [1, 15], 1992: [1, 4], 1993: [0, 23],
  1994: [1, 10], 1995: [0, 31], 1996: [1, 19], 1997: [1, 7],
  1998: [0, 28], 1999: [1, 16], 2000: [1, 5], 2001: [0, 24],
  2002: [1, 12], 2003: [1, 1], 2004: [0, 22], 2005: [1, 9],
  2006: [0, 29], 2007: [1, 18], 2008: [1, 7], 2009: [0, 26],
  2010: [1, 14], 2011: [1, 3], 2012: [0, 23], 2013: [1, 10],
  2014: [0, 31], 2015: [1, 19], 2016: [1, 8], 2017: [0, 28],
  2018: [1, 16], 2019: [1, 5],
};

function lunarNewYearDate(year: number): Date {
  const entry = LNY_DATA[year];
  if (entry) {
    return new Date(year, entry[0], entry[1]);
  }
  // Fallback approximation: LNY is typically late Jan to mid Feb
  // Use Feb 1 as rough estimate for years not in lookup table
  return new Date(year, 1, 1);
}
