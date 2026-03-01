import type { TianGan, DiZhi } from './types';
import { TIANGAN } from './tiangan';
import { DIZHI } from './dizhi';

/**
 * 旬空 (Void Branches) from a day pillar.
 *
 * The 60-cycle is divided into 6 decades (旬), each starting from 甲.
 * Since each decade has 10 stems but 12 branches, 2 branches are left out — these are 空亡.
 *
 * @param dayStem - Day pillar heavenly stem
 * @param dayBranch - Day pillar earthly branch
 * @returns Tuple of the two void branches
 */
export function computeXunKong(dayStem: TianGan, dayBranch: DiZhi): [DiZhi, DiZhi] {
  const s = TIANGAN.indexOf(dayStem);
  const b = DIZHI.indexOf(dayBranch);
  const startBranch = ((b - s) % 12 + 12) % 12;
  const void1 = DIZHI[(startBranch + 10) % 12];
  const void2 = DIZHI[(startBranch + 11) % 12];
  return [void1, void2];
}
