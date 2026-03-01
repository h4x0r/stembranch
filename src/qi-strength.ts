/* c8 ignore next */
import type { WuXing, QiStrength, DiZhi } from './types';
import { DIZHI_ELEMENT } from './dizhi';
import { SHENG_CYCLE, KE_CYCLE } from './wuxing';

/** Moon phase emoji for each qi strength level */
export const QI_MOON: Record<QiStrength, string> = {
  '旺': '🌕', '相': '🌔', '休': '🌓', '囚': '🌒', '死': '🌑',
};

/**
 * 旺相休囚死 — Determine the qi strength of an element given the month branch.
 *
 * - 旺 (Flourishing): same element as month
 * - 相 (Prosperous): month generates this element
 * - 休 (Resting): this element generates month
 * - 囚 (Imprisoned): this element conquers month
 * - 死 (Dead): month conquers this element
 */
export function getQiStrength(element: WuXing, monthBranch: DiZhi): { label: QiStrength; moon: string } {
  const monthElement = DIZHI_ELEMENT[monthBranch];
  if (!monthElement) return { label: '休', moon: QI_MOON['休'] };

  let label: QiStrength;
  if (element === monthElement) label = '旺';
  else if (SHENG_CYCLE[monthElement] === element) label = '相';
  else if (SHENG_CYCLE[element] === monthElement) label = '休';
  else if (KE_CYCLE[element] === monthElement) label = '囚';
  else label = '死';

  return { label, moon: QI_MOON[label] };
}
