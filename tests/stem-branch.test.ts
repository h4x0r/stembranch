import { describe, it, expect } from 'vitest';
import { makeStemBranch, stemBranchByCycleIndex, stemBranchCycleIndex, parseStemBranch, allSixtyStemBranch } from '../src/stem-branch';

describe('makeStemBranch', () => {
  it('combines stem and branch', () => {
    expect(makeStemBranch('甲', '子')).toBe('甲子');
    expect(makeStemBranch('癸', '亥')).toBe('癸亥');
  });
});

describe('stemBranchByCycleIndex', () => {
  it('returns 甲子 at index 0', () => {
    const result = stemBranchByCycleIndex(0);
    expect(result.stem).toBe('甲');
    expect(result.branch).toBe('子');
    expect(result.stemBranch).toBe('甲子');
  });

  it('returns 乙丑 at index 1', () => {
    const result = stemBranchByCycleIndex(1);
    expect(result.stemBranch).toBe('乙丑');
  });

  it('returns 癸亥 at index 59', () => {
    const result = stemBranchByCycleIndex(59);
    expect(result.stemBranch).toBe('癸亥');
  });

  it('wraps at 60', () => {
    expect(stemBranchByCycleIndex(60).stemBranch).toBe('甲子');
  });
});

describe('stemBranchCycleIndex', () => {
  it('returns 0 for 甲子', () => {
    expect(stemBranchCycleIndex('甲', '子')).toBe(0);
  });

  it('returns 59 for 癸亥', () => {
    expect(stemBranchCycleIndex('癸', '亥')).toBe(59);
  });

  it('returns -1 for invalid pairing (yin-yang mismatch)', () => {
    expect(stemBranchCycleIndex('甲', '丑')).toBe(-1); // 甲=陽, 丑=陰
  });

  it('returns correct index for 丙寅', () => {
    expect(stemBranchCycleIndex('丙', '寅')).toBe(2);
  });
});

describe('parseStemBranch', () => {
  it('parses valid StemBranch', () => {
    expect(parseStemBranch('甲子')).toEqual({ stem: '甲', branch: '子' });
    expect(parseStemBranch('壬戌')).toEqual({ stem: '壬', branch: '戌' });
  });

  it('returns null for invalid input', () => {
    expect(parseStemBranch('AB')).toBeNull();
    expect(parseStemBranch('甲')).toBeNull();
    expect(parseStemBranch('甲子丑')).toBeNull();
  });
});

describe('allSixtyStemBranch', () => {
  it('returns 60 unique pairs', () => {
    const all = allSixtyStemBranch();
    expect(all).toHaveLength(60);
    expect(new Set(all).size).toBe(60);
  });

  it('starts with 甲子 and ends with 癸亥', () => {
    const all = allSixtyStemBranch();
    expect(all[0]).toBe('甲子');
    expect(all[59]).toBe('癸亥');
  });
});

describe('stemBranchCycleIndex - exhaustive validation', () => {
  it('all 60 valid pairs produce correct indices (end-of-loop -1 is unreachable)', () => {
    // Verify every valid StemBranch pair resolves correctly
    // This proves the return -1 at end of the for-loop is unreachable for valid same-parity inputs
    const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
    const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;

    let validCount = 0;
    for (let s = 0; s < 10; s++) {
      for (let b = 0; b < 12; b++) {
        const result = stemBranchCycleIndex(STEMS[s], BRANCHES[b]);
        if (s % 2 === b % 2) {
          // Same parity: should always find a valid index
          expect(result).toBeGreaterThanOrEqual(0);
          expect(result).toBeLessThan(60);
          validCount++;
        } else {
          expect(result).toBe(-1);
        }
      }
    }
    expect(validCount).toBe(60);
  });

  it('handles negative cycle index wrapping', () => {
    expect(stemBranchByCycleIndex(-1).stemBranch).toBe('癸亥');
    expect(stemBranchByCycleIndex(-60).stemBranch).toBe('甲子');
  });
});
