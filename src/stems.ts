/* c8 ignore next */
import type { Stem, Element } from './types';

/** 天干 in order: 甲乙丙丁戊己庚辛壬癸 */
export const STEMS: readonly Stem[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

/** 天干 → 五行 mapping */
export const STEM_ELEMENT: Record<Stem, Element> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
};

/** 天干 → 陰陽 (甲丙戊庚壬=陽, 乙丁己辛癸=陰) */
export function stemPolarity(stem: Stem): '陽' | '陰' {
  return STEMS.indexOf(stem) % 2 === 0 ? '陽' : '陰';
}

/** Get Stem by index (mod 10) */
export function stemByIndex(index: number): Stem {
  return STEMS[((index % 10) + 10) % 10];
}
