/* c8 ignore next */
import type { Branch, Element } from './types';

/** 地支 in order: 子丑寅卯辰巳午未申酉戌亥 */
export const BRANCHES: readonly Branch[] = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

/** 地支 → 五行 mapping */
export const BRANCH_ELEMENT: Record<Branch, Element> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火',
  '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水',
};

/** 地支 → 陰陽 (子寅辰午申戌=陽, 丑卯巳未酉亥=陰) */
export function branchPolarity(branch: Branch): '陽' | '陰' {
  return BRANCHES.indexOf(branch) % 2 === 0 ? '陽' : '陰';
}

/** Get Branch by index (mod 12) */
export function branchByIndex(index: number): Branch {
  return BRANCHES[((index % 12) + 12) % 12];
}

/** 地支 → 時辰 hour ranges (each branch spans 2 hours, 子時=23:00-00:59) */
export function branchFromHour(hour: number): Branch {
  if (hour >= 23) return '子';
  return BRANCHES[Math.floor((hour + 1) / 2)];
}

/** 地支 → 月份 (寅=1月 through 丑=12月 in traditional reckoning) */
export function branchFromMonth(monthIndex: number): Branch {
  return BRANCHES[(monthIndex + 2) % 12];
}
