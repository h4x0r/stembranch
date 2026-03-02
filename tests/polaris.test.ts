import { describe, it, expect } from 'vitest';
import {
  MAJOR_STARS, PALACE_NAMES,
  getFatepalace, getElementPattern,
  getZiWeiPosition, computeZiWei,
} from '../src/polaris';
import type { ZiWeiChart } from '../src/polaris';

// ── Constants ─────────────────────────────────────────────────

describe('constants', () => {
  it('should have 14 major stars', () => {
    expect(MAJOR_STARS).toHaveLength(14);
    expect(MAJOR_STARS[0]).toBe('紫微');
    expect(MAJOR_STARS[13]).toBe('破軍');
  });

  it('should have 12 palace names', () => {
    expect(PALACE_NAMES).toHaveLength(12);
    expect(PALACE_NAMES[0]).toBe('命宮');
  });
});

// ── 命宮 (Fate Palace) ────────────────────────────────────────

describe('getFatepalace', () => {
  it('should return a branch index (0-11) for month + hour', () => {
    // Birth month 1 (寅月), hour 子 → 命宮 at 丑
    const result = getFatepalace(1, 0); // month=1 (寅), hour index=0 (子)
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(11);
  });

  it('should return different palaces for different hours', () => {
    const a = getFatepalace(1, 0);
    const b = getFatepalace(1, 6);
    expect(a).not.toBe(b);
  });

  // Known: month=1, hour=子(0) → fate palace at 寅(2)
  it('should compute known fate palace: month 1, hour 子 → 寅(2)', () => {
    expect(getFatepalace(1, 0)).toBe(2); // 寅
  });
});

// ── 五行局 (Element Pattern) ──────────────────────────────────

describe('getElementPattern', () => {
  it('should return a valid 五行局 number (2, 3, 4, 5, or 6)', () => {
    // Fate palace stem-branch determines the 納音 element → 局數
    const result = getElementPattern(0, '甲'); // palace index 0 (子), year stem 甲
    expect([2, 3, 4, 5, 6]).toContain(result);
  });
});

// ── 紫微 position ─────────────────────────────────────────────

describe('getZiWeiPosition', () => {
  it('should return a palace index (0-11)', () => {
    const result = getZiWeiPosition(15, 2); // day 15, 水二局
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(11);
  });

  it('should produce different positions for different days', () => {
    const a = getZiWeiPosition(1, 2);
    const b = getZiWeiPosition(15, 2);
    expect(a).not.toBe(b);
  });
});

// ── Full chart ────────────────────────────────────────────────

describe('computeZiWei', () => {
  let chart: ZiWeiChart;

  it('should return a chart with 12 palaces', () => {
    chart = computeZiWei({
      year: 1990, month: 8, day: 15, hour: 6, // 午時
      gender: 'male',
    });
    expect(chart.palaces).toHaveLength(12);
  });

  it('should assign a palace name to each palace', () => {
    chart = computeZiWei({
      year: 1990, month: 8, day: 15, hour: 6,
      gender: 'male',
    });
    const names = chart.palaces.map((p) => p.name);
    expect(names).toContain('命宮');
    expect(names).toContain('財帛宮');
    expect(names).toContain('夫妻宮');
  });

  it('should place all 14 major stars', () => {
    chart = computeZiWei({
      year: 1990, month: 8, day: 15, hour: 6,
      gender: 'male',
    });
    const allStars = chart.palaces.flatMap((p) => p.majorStars);
    for (const star of MAJOR_STARS) {
      expect(allStars).toContain(star);
    }
  });

  it('should identify the fate palace', () => {
    chart = computeZiWei({
      year: 1990, month: 8, day: 15, hour: 6,
      gender: 'male',
    });
    const fatePalace = chart.palaces.find((p) => p.name === '命宮');
    expect(fatePalace).toBeDefined();
    expect(fatePalace!.branch).toBeTruthy();
  });

  it('should compute 四化', () => {
    chart = computeZiWei({
      year: 1990, month: 8, day: 15, hour: 6,
      gender: 'male',
    });
    expect(chart.siHua).toBeDefined();
    expect(chart.siHua.lu).toBeTruthy();  // 化祿
    expect(chart.siHua.quan).toBeTruthy(); // 化權
    expect(chart.siHua.ke).toBeTruthy();   // 化科
    expect(chart.siHua.ji).toBeTruthy();   // 化忌
  });

  it('should compute 五行局', () => {
    chart = computeZiWei({
      year: 1990, month: 8, day: 15, hour: 6,
      gender: 'male',
    });
    expect([2, 3, 4, 5, 6]).toContain(chart.elementPattern);
  });

  it('should assign a branch to each palace', () => {
    chart = computeZiWei({
      year: 1990, month: 8, day: 15, hour: 6,
      gender: 'male',
    });
    const branches = '子丑寅卯辰巳午未申酉戌亥';
    for (const palace of chart.palaces) {
      expect(branches).toContain(palace.branch);
    }
  });

  it('should produce different charts for different birth data', () => {
    const a = computeZiWei({ year: 1990, month: 8, day: 15, hour: 6, gender: 'male' });
    const b = computeZiWei({ year: 1985, month: 3, day: 20, hour: 2, gender: 'female' });
    // Different birth data → different star placements
    const aStars = a.palaces.map((p) => p.majorStars.join(',')).join('|');
    const bStars = b.palaces.map((p) => p.majorStars.join(',')).join('|');
    expect(aStars).not.toBe(bStars);
  });
});
