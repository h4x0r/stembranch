/* c8 ignore next */
import type { Branch, DayRelation } from './types';
import { BRANCH_ELEMENT } from './branches';
import { getElementRelation } from './elements';

/** 六合 (Harmony) pairs */
export const HARMONY_PAIRS: readonly [Branch, Branch][] = [
  ['子', '丑'], ['寅', '亥'], ['卯', '戌'],
  ['辰', '酉'], ['巳', '申'], ['午', '未'],
];

/** 六沖 (Clash) pairs — branches 6 apart on the cycle */
export const CLASH_PAIRS: readonly [Branch, Branch][] = [
  ['子', '午'], ['丑', '未'], ['寅', '申'],
  ['卯', '酉'], ['辰', '戌'], ['巳', '亥'],
];

/** Check if two branches form a 六合 (Harmony) pair */
export function isHarmony(a: Branch, b: Branch): boolean {
  return HARMONY_PAIRS.some(([x, y]) => (a === x && b === y) || (a === y && b === x));
}

/** Check if two branches form a 六沖 (Clash) pair */
export function isClash(a: Branch, b: Branch): boolean {
  return CLASH_PAIRS.some(([x, y]) => (a === x && b === y) || (a === y && b === x));
}

/**
 * Day branch → line branch relationship.
 * Priority: 合 > 沖 > 五行 (生/剋/比和)
 */
export function getDayRelation(dayBranch: Branch, lineBranch: Branch): DayRelation {
  if (isHarmony(dayBranch, lineBranch)) return '合';
  if (isClash(dayBranch, lineBranch)) return '沖';
  const dayEl = BRANCH_ELEMENT[dayBranch];
  const lineEl = BRANCH_ELEMENT[lineBranch];
  const rel = getElementRelation(dayEl, lineEl);
  if (rel === '生') return '生';
  if (rel === '剋') return '剋';
  return '比和';
}
