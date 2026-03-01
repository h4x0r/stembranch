import { describe, it, expect } from 'vitest';
import { computeXunKong } from '../src/xunkong';

describe('computeXunKong', () => {
  it('甲子旬: void = 戌亥', () => {
    expect(computeXunKong('甲', '子')).toEqual(['戌', '亥']);
  });

  it('甲戌旬: void = 申酉', () => {
    expect(computeXunKong('甲', '戌')).toEqual(['申', '酉']);
  });

  it('甲申旬: void = 午未', () => {
    expect(computeXunKong('甲', '申')).toEqual(['午', '未']);
  });

  it('甲午旬: void = 辰巳', () => {
    expect(computeXunKong('甲', '午')).toEqual(['辰', '巳']);
  });

  it('甲辰旬: void = 寅卯', () => {
    expect(computeXunKong('甲', '辰')).toEqual(['寅', '卯']);
  });

  it('甲寅旬: void = 子丑', () => {
    expect(computeXunKong('甲', '寅')).toEqual(['子', '丑']);
  });

  it('works for non-甲 stems in the same 旬', () => {
    // 乙丑 is in 甲子旬 → void = 戌亥
    expect(computeXunKong('乙', '丑')).toEqual(['戌', '亥']);
    // 丙寅 is in 甲子旬 → void = 戌亥
    expect(computeXunKong('丙', '寅')).toEqual(['戌', '亥']);
  });
});
