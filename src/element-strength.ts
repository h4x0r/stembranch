/* c8 ignore next */
import type { Element, Strength, Branch } from './types';
import { BRANCH_ELEMENT } from './branches';
import { GENERATIVE_CYCLE, CONQUERING_CYCLE } from './elements';

/** Moon phase emoji for each strength level */
export const STRENGTH: Record<Strength, string> = {
  '旺': '🌕', '相': '🌔', '休': '🌓', '囚': '🌒', '死': '🌑',
};

/**
 * 旺相休囚死 — Determine the strength of an element given the month branch.
 *
 * - 旺 (Flourishing): same element as month
 * - 相 (Prosperous): month generates this element
 * - 休 (Resting): this element generates month
 * - 囚 (Imprisoned): this element conquers month
 * - 死 (Dead): month conquers this element
 */
export function getStrength(element: Element, monthBranch: Branch): { label: Strength; moon: string } {
  const monthElement = BRANCH_ELEMENT[monthBranch];
  if (!monthElement) return { label: '休', moon: STRENGTH['休'] };

  let label: Strength;
  if (element === monthElement) label = '旺';
  else if (GENERATIVE_CYCLE[monthElement] === element) label = '相';
  else if (GENERATIVE_CYCLE[element] === monthElement) label = '休';
  else if (CONQUERING_CYCLE[element] === monthElement) label = '囚';
  else label = '死';

  return { label, moon: STRENGTH[label] };
}
