import type { TianGan, WuXing } from './types';

/** 天干 in order: 甲乙丙丁戊己庚辛壬癸 */
export const TIANGAN: readonly TianGan[] = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

/** 天干 → 五行 mapping */
export const TIANGAN_ELEMENT: Record<TianGan, WuXing> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
};

/** 天干 → 陰陽 (甲丙戊庚壬=陽, 乙丁己辛癸=陰) */
export function tianganYinYang(stem: TianGan): '陽' | '陰' {
  return TIANGAN.indexOf(stem) % 2 === 0 ? '陽' : '陰';
}

/** Get TianGan by index (mod 10) */
export function tianganByIndex(index: number): TianGan {
  return TIANGAN[((index % 10) + 10) % 10];
}
