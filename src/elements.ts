/* c8 ignore next */
import type { Element, ElementRelation } from './types';

/** 五行相生 (Generative cycle): 金→水→木→火→土→金 */
export const GENERATIVE_CYCLE: Record<Element, Element> = {
  '金': '水', '水': '木', '木': '火', '火': '土', '土': '金',
};

/** 五行相剋 (Conquering cycle): 金→木→土→水→火→金 */
export const CONQUERING_CYCLE: Record<Element, Element> = {
  '金': '木', '木': '土', '土': '水', '水': '火', '火': '金',
};

/** Determine the relationship between two elements */
export function getElementRelation(from: Element, to: Element): ElementRelation {
  if (from === to) return '比和';
  if (GENERATIVE_CYCLE[from] === to) return '生';
  if (CONQUERING_CYCLE[from] === to) return '剋';
  if (GENERATIVE_CYCLE[to] === from) return '被生';
  return '被剋';
}

/** All five elements in traditional order */
export const ELEMENT_ORDER: readonly Element[] = ['金', '木', '水', '火', '土'];
