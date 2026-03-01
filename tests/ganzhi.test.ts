import { describe, it, expect } from 'vitest';
import { makeGanZhi, ganzhiByCycleIndex, ganzhiCycleIndex, parseGanZhi, allSixtyGanZhi } from '../src/ganzhi';

describe('makeGanZhi', () => {
  it('combines stem and branch', () => {
    expect(makeGanZhi('甲', '子')).toBe('甲子');
    expect(makeGanZhi('癸', '亥')).toBe('癸亥');
  });
});

describe('ganzhiByCycleIndex', () => {
  it('returns 甲子 at index 0', () => {
    const result = ganzhiByCycleIndex(0);
    expect(result.stem).toBe('甲');
    expect(result.branch).toBe('子');
    expect(result.ganzhi).toBe('甲子');
  });

  it('returns 乙丑 at index 1', () => {
    const result = ganzhiByCycleIndex(1);
    expect(result.ganzhi).toBe('乙丑');
  });

  it('returns 癸亥 at index 59', () => {
    const result = ganzhiByCycleIndex(59);
    expect(result.ganzhi).toBe('癸亥');
  });

  it('wraps at 60', () => {
    expect(ganzhiByCycleIndex(60).ganzhi).toBe('甲子');
  });
});

describe('ganzhiCycleIndex', () => {
  it('returns 0 for 甲子', () => {
    expect(ganzhiCycleIndex('甲', '子')).toBe(0);
  });

  it('returns 59 for 癸亥', () => {
    expect(ganzhiCycleIndex('癸', '亥')).toBe(59);
  });

  it('returns -1 for invalid pairing (yin-yang mismatch)', () => {
    expect(ganzhiCycleIndex('甲', '丑')).toBe(-1); // 甲=陽, 丑=陰
  });

  it('returns correct index for 丙寅', () => {
    expect(ganzhiCycleIndex('丙', '寅')).toBe(2);
  });
});

describe('parseGanZhi', () => {
  it('parses valid GanZhi', () => {
    expect(parseGanZhi('甲子')).toEqual({ stem: '甲', branch: '子' });
    expect(parseGanZhi('壬戌')).toEqual({ stem: '壬', branch: '戌' });
  });

  it('returns null for invalid input', () => {
    expect(parseGanZhi('AB')).toBeNull();
    expect(parseGanZhi('甲')).toBeNull();
    expect(parseGanZhi('甲子丑')).toBeNull();
  });
});

describe('allSixtyGanZhi', () => {
  it('returns 60 unique pairs', () => {
    const all = allSixtyGanZhi();
    expect(all).toHaveLength(60);
    expect(new Set(all).size).toBe(60);
  });

  it('starts with 甲子 and ends with 癸亥', () => {
    const all = allSixtyGanZhi();
    expect(all[0]).toBe('甲子');
    expect(all[59]).toBe('癸亥');
  });
});

describe('ganzhiCycleIndex - exhaustive validation', () => {
  it('all 60 valid pairs produce correct indices (end-of-loop -1 is unreachable)', () => {
    // Verify every valid GanZhi pair resolves correctly
    // This proves the return -1 at end of the for-loop is unreachable for valid same-parity inputs
    const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
    const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;

    let validCount = 0;
    for (let s = 0; s < 10; s++) {
      for (let b = 0; b < 12; b++) {
        const result = ganzhiCycleIndex(TIANGAN[s], DIZHI[b]);
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
    expect(ganzhiByCycleIndex(-1).ganzhi).toBe('癸亥');
    expect(ganzhiByCycleIndex(-60).ganzhi).toBe('甲子');
  });
});
