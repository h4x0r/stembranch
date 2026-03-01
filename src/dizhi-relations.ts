import type { DiZhi, DayRelation } from './types';
import { DIZHI_ELEMENT } from './dizhi';
import { getRelationship } from './wuxing';

/** 六合 (Harmony) pairs */
export const LIUHE_PAIRS: readonly [DiZhi, DiZhi][] = [
  ['子', '丑'], ['寅', '亥'], ['卯', '戌'],
  ['辰', '酉'], ['巳', '申'], ['午', '未'],
];

/** 六沖 (Clash) pairs — branches 6 apart on the cycle */
export const LIUCHONG_PAIRS: readonly [DiZhi, DiZhi][] = [
  ['子', '午'], ['丑', '未'], ['寅', '申'],
  ['卯', '酉'], ['辰', '戌'], ['巳', '亥'],
];

/** Check if two branches form a 六合 (Harmony) pair */
export function isLiuHe(a: DiZhi, b: DiZhi): boolean {
  return LIUHE_PAIRS.some(([x, y]) => (a === x && b === y) || (a === y && b === x));
}

/** Check if two branches form a 六沖 (Clash) pair */
export function isLiuChong(a: DiZhi, b: DiZhi): boolean {
  return LIUCHONG_PAIRS.some(([x, y]) => (a === x && b === y) || (a === y && b === x));
}

/**
 * Day branch → line branch relationship.
 * Priority: 合 > 沖 > 五行 (生/剋/比和)
 */
export function getDayRelation(dayBranch: DiZhi, lineBranch: DiZhi): DayRelation {
  if (isLiuHe(dayBranch, lineBranch)) return '合';
  if (isLiuChong(dayBranch, lineBranch)) return '沖';
  const dayEl = DIZHI_ELEMENT[dayBranch];
  const lineEl = DIZHI_ELEMENT[lineBranch];
  const rel = getRelationship(dayEl, lineEl);
  if (rel === '生') return '生';
  if (rel === '剋') return '剋';
  return '比和';
}
