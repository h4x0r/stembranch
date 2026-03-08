/* c8 ignore next */
import type { Stem, Branch } from './types';
import { STEMS, stemPolarity } from './stems';
import { BRANCHES, branchPolarity } from './branches';

export interface VoidBranches {
  /** 正空: void branch whose polarity matches the day stem — truly empty */
  true: Branch;
  /** 偏空: void branch whose polarity differs from the day stem — partially empty */
  partial: Branch;
}

/**
 * 旬空 (Void Branches) from a day pillar.
 *
 * The 60-cycle is divided into 6 decades (旬), each starting from 甲.
 * Since each decade has 10 stems but 12 branches, 2 branches are left out — these are 空亡.
 *
 * The two void branches are further distinguished:
 * - 正空: the one whose yin/yang polarity matches the day stem (truly void)
 * - 偏空: the one whose polarity differs (partially void, more easily rescued by 合)
 *
 * @param dayStem - Day pillar heavenly stem
 * @param dayBranch - Day pillar earthly branch
 * @returns Object with `true` (正空) and `partial` (偏空) void branches
 */
export function computeVoidBranches(dayStem: Stem, dayBranch: Branch): VoidBranches {
  const s = STEMS.indexOf(dayStem);
  const b = BRANCHES.indexOf(dayBranch);
  const startBranch = ((b - s) % 12 + 12) % 12;
  const v1 = BRANCHES[(startBranch + 10) % 12]; // always yang
  const v2 = BRANCHES[(startBranch + 11) % 12]; // always yin
  const stemIsYang = stemPolarity(dayStem) === '陽';
  return stemIsYang
    ? { true: v1, partial: v2 }
    : { true: v2, partial: v1 };
}
