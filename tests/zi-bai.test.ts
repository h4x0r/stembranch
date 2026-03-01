import { describe, it, expect } from 'vitest';
import {
  getYearStar, getMonthStar, getDayStar, getHourStar,
  getZiBai, ZI_BAI_STARS,
} from '../src/zi-bai';

describe('ZI_BAI_STARS', () => {
  it('has exactly 9 stars', () => {
    expect(ZI_BAI_STARS).toHaveLength(9);
  });

  it('star 1 is 一白水', () => {
    expect(ZI_BAI_STARS[0].name).toBe('一白');
    expect(ZI_BAI_STARS[0].element).toBe('水');
  });

  it('star 9 is 九紫火', () => {
    expect(ZI_BAI_STARS[8].name).toBe('九紫');
    expect(ZI_BAI_STARS[8].element).toBe('火');
  });
});

describe('getYearStar', () => {
  // Year star changes at 立春. Based on 三元九運:
  // 下元 starts 1984. 1984=七赤, descending: 1985=六白, 1986=五黃...
  // Formula: star = (10 - (year - 1864) % 9) % 9 || 9
  // Verified reference values from 萬年曆

  it('2024 = 三碧', () => {
    // 2024 after 立春
    expect(getYearStar(new Date(2024, 5, 15))).toBe(3);
  });

  it('2023 = 四綠', () => {
    expect(getYearStar(new Date(2023, 5, 15))).toBe(4);
  });

  it('2025 = 二黑', () => {
    expect(getYearStar(new Date(2025, 5, 15))).toBe(2);
  });

  it('1984 = 七赤 (下元 start)', () => {
    expect(getYearStar(new Date(1984, 5, 15))).toBe(7);
  });

  it('1924 = 四綠 (中元 start)', () => {
    expect(getYearStar(new Date(1924, 5, 15))).toBe(4);
  });

  it('1864 = 一白 (上元 start)', () => {
    expect(getYearStar(new Date(1864, 5, 15))).toBe(1);
  });

  it('uses 立春 as boundary, not Jan 1', { timeout: 30_000 }, () => {
    // 2024 立春 is Feb 4. Before that should still be 2023's star (四綠)
    expect(getYearStar(new Date(2024, 0, 15))).toBe(4); // before 立春 → 2023
    expect(getYearStar(new Date(2024, 5, 15))).toBe(3); // after 立春 → 2024
  });
});

describe('getMonthStar', () => {
  // Month star depends on year star group and solar month.
  // Group 1/4/7 → 寅月 starts at 八白
  // Group 2/5/8 → 寅月 starts at 五黃
  // Group 3/6/9 → 寅月 starts at 二黑

  it('returns a star between 1 and 9', { timeout: 30_000 }, () => {
    const star = getMonthStar(new Date(2024, 5, 15));
    expect(star).toBeGreaterThanOrEqual(1);
    expect(star).toBeLessThanOrEqual(9);
  });

  it('different months give different stars', { timeout: 30_000 }, () => {
    // March and April 2024 should have different month stars
    const mar = getMonthStar(new Date(2024, 2, 15));
    const apr = getMonthStar(new Date(2024, 3, 15));
    expect(mar).not.toBe(apr);
  });
});

describe('getDayStar', () => {
  it('returns a star between 1 and 9', () => {
    const star = getDayStar(new Date(2024, 5, 15));
    expect(star).toBeGreaterThanOrEqual(1);
    expect(star).toBeLessThanOrEqual(9);
  });

  it('consecutive days have consecutive stars', () => {
    const day1 = getDayStar(new Date(2024, 5, 15));
    const day2 = getDayStar(new Date(2024, 5, 16));
    // Stars advance by 1 each day (ascending in Lo Shu for 陽遁)
    // The difference should be exactly 1 (or wrap around)
    const diff = ((day2 - day1) % 9 + 9) % 9;
    expect(diff === 1 || diff === 8).toBe(true); // +1 or -1 in mod 9
  });

  it('cycle repeats every 9 days', () => {
    const day1 = getDayStar(new Date(2024, 5, 15));
    const day10 = getDayStar(new Date(2024, 5, 24)); // 9 days later
    expect(day10).toBe(day1);
  });
});

describe('getHourStar', () => {
  it('returns a star between 1 and 9', () => {
    const star = getHourStar(new Date(2024, 5, 15, 14, 0));
    expect(star).toBeGreaterThanOrEqual(1);
    expect(star).toBeLessThanOrEqual(9);
  });
});

describe('getZiBai', () => {
  it('returns all four stars', { timeout: 30_000 }, () => {
    const result = getZiBai(new Date(2024, 5, 15, 14, 0));
    expect(result.year).toBeGreaterThanOrEqual(1);
    expect(result.year).toBeLessThanOrEqual(9);
    expect(result.month).toBeGreaterThanOrEqual(1);
    expect(result.month).toBeLessThanOrEqual(9);
    expect(result.day).toBeGreaterThanOrEqual(1);
    expect(result.day).toBeLessThanOrEqual(9);
    expect(result.hour).toBeGreaterThanOrEqual(1);
    expect(result.hour).toBeLessThanOrEqual(9);
  });
});
