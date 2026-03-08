import { describe, it, expect } from 'vitest';
import { computeVoidBranches } from '../src/void-branches';

describe('computeVoidBranches', () => {
  describe('六旬 void pairs', () => {
    it('甲子旬: 戌亥', () => {
      const v = computeVoidBranches('甲', '子');
      expect([v.true, v.partial]).toEqual(['戌', '亥']);
    });

    it('甲戌旬: 申酉', () => {
      const v = computeVoidBranches('甲', '戌');
      expect([v.true, v.partial]).toEqual(['申', '酉']);
    });

    it('甲申旬: 午未', () => {
      const v = computeVoidBranches('甲', '申');
      expect([v.true, v.partial]).toEqual(['午', '未']);
    });

    it('甲午旬: 辰巳', () => {
      const v = computeVoidBranches('甲', '午');
      expect([v.true, v.partial]).toEqual(['辰', '巳']);
    });

    it('甲辰旬: 寅卯', () => {
      const v = computeVoidBranches('甲', '辰');
      expect([v.true, v.partial]).toEqual(['寅', '卯']);
    });

    it('甲寅旬: 子丑', () => {
      const v = computeVoidBranches('甲', '寅');
      expect([v.true, v.partial]).toEqual(['子', '丑']);
    });
  });

  describe('non-甲 stems in same 旬', () => {
    it('乙丑 is in 甲子旬 → 戌亥', () => {
      const v = computeVoidBranches('乙', '丑');
      expect([v.true, v.partial]).toEqual(['亥', '戌']);
    });

    it('丙寅 is in 甲子旬 → 戌亥', () => {
      const v = computeVoidBranches('丙', '寅');
      expect([v.true, v.partial]).toEqual(['戌', '亥']);
    });
  });

  describe('正空/偏空 polarity', () => {
    it('yang stem (甲) → 正空 is yang branch', () => {
      // 甲子旬: 戌(yang) 亥(yin) → 正空=戌, 偏空=亥
      const v = computeVoidBranches('甲', '子');
      expect(v.true).toBe('戌');
      expect(v.partial).toBe('亥');
    });

    it('yin stem (乙) → 正空 is yin branch', () => {
      // 乙丑 in 甲子旬: 戌(yang) 亥(yin) → 正空=亥, 偏空=戌
      const v = computeVoidBranches('乙', '丑');
      expect(v.true).toBe('亥');
      expect(v.partial).toBe('戌');
    });

    it('yang stem (丙) → 正空 is yang branch', () => {
      // 丙寅 in 甲子旬 → 正空=戌(yang), 偏空=亥(yin)
      const v = computeVoidBranches('丙', '寅');
      expect(v.true).toBe('戌');
      expect(v.partial).toBe('亥');
    });

    it('yin stem (丁) → 正空 is yin branch', () => {
      // 丁卯 in 甲子旬 → 正空=亥(yin), 偏空=戌(yang)
      const v = computeVoidBranches('丁', '卯');
      expect(v.true).toBe('亥');
      expect(v.partial).toBe('戌');
    });

    it('yang stem (庚) in 甲戌旬 → 正空=申(yang)', () => {
      // 庚辰 in 甲戌旬: 申(yang) 酉(yin) → 正空=申
      const v = computeVoidBranches('庚', '辰');
      expect(v.true).toBe('申');
      expect(v.partial).toBe('酉');
    });

    it('yin stem (辛) in 甲戌旬 → 正空=酉(yin)', () => {
      // 辛巳 in 甲戌旬: 申(yang) 酉(yin) → 正空=酉
      const v = computeVoidBranches('辛', '巳');
      expect(v.true).toBe('酉');
      expect(v.partial).toBe('申');
    });
  });
});
