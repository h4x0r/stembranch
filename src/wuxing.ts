import type { WuXing, WuXingRelationship } from './types';

/** 五行相生 (Generative cycle): 金→水→木→火→土→金 */
export const SHENG_CYCLE: Record<WuXing, WuXing> = {
  '金': '水', '水': '木', '木': '火', '火': '土', '土': '金',
};

/** 五行相剋 (Conquering cycle): 金→木→土→水→火→金 */
export const KE_CYCLE: Record<WuXing, WuXing> = {
  '金': '木', '木': '土', '土': '水', '水': '火', '火': '金',
};

/** Determine the relationship between two elements */
export function getRelationship(from: WuXing, to: WuXing): WuXingRelationship {
  if (from === to) return '比和';
  if (SHENG_CYCLE[from] === to) return '生';
  if (KE_CYCLE[from] === to) return '剋';
  if (SHENG_CYCLE[to] === from) return '被生';
  return '被剋';
}

/** All five elements in traditional order */
export const WUXING_ORDER: readonly WuXing[] = ['金', '木', '水', '火', '土'];
