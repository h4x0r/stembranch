import { describe, it, expect } from 'vitest';
import { dailyAlmanac } from 'stembranch';
import {
  formatPillar,
  formatPillarsRow,
  formatLunarDate,
  formatSolarTermPair,
  formatFlyingStar,
  formatAlmanacFlags,
  formatElementStrength,
  formatSixRenSummary,
  formatEclipseInfo,
} from '@/lib/format-almanac';

const TEST_DATE = new Date(Date.UTC(2024, 5, 15, 6, 30)); // 14:30 CST
const almanac = dailyAlmanac(TEST_DATE);

describe('formatPillar', () => {
  it('should join stem and branch', () => {
    const result = formatPillar(almanac.pillars.year);
    expect(result).toMatch(/^.{2}$/); // two CJK characters
  });
});

describe('formatPillarsRow', () => {
  it('should return four pillar strings', () => {
    const result = formatPillarsRow(almanac.pillars);
    expect(result).toHaveLength(4);
    result.forEach((p) => expect(p).toMatch(/^.{2}$/));
  });
});

describe('formatLunarDate', () => {
  it('should return a human-readable lunar date string', () => {
    const result = formatLunarDate(almanac.lunar);
    expect(result).toContain('月');
    // Day uses traditional names like 初一, 十五, 廿三 — not always '日'
    expect(result.length).toBeGreaterThan(2);
  });

  it('should indicate leap month when applicable', () => {
    const leapLunar = { year: 2023, month: 2, day: 15, isLeapMonth: true };
    const result = formatLunarDate(leapLunar);
    expect(result).toContain('閏');
  });
});

describe('formatSolarTermPair', () => {
  it('should return current and next term labels', () => {
    const result = formatSolarTermPair(almanac.solarTerm);
    expect(result.current).toBeTruthy();
    expect(result.next).toBeTruthy();
    // next should include a date string
    expect(result.next).toMatch(/\d/);
  });
});

describe('formatFlyingStar', () => {
  it('should format a flying star with number, name, and element', () => {
    const result = formatFlyingStar(almanac.flyingStars.year);
    expect(result).toMatch(/\d/);    // has a number
    expect(result.length).toBeGreaterThan(1);
  });
});

describe('formatAlmanacFlags', () => {
  it('should separate auspicious and inauspicious flags', () => {
    const result = formatAlmanacFlags(almanac.almanacFlags);
    expect(result).toHaveProperty('auspicious');
    expect(result).toHaveProperty('inauspicious');
    expect(Array.isArray(result.auspicious)).toBe(true);
    expect(Array.isArray(result.inauspicious)).toBe(true);
  });
});

describe('formatElementStrength', () => {
  it('should return element and strength label', () => {
    const result = formatElementStrength(almanac.dayElement, almanac.dayStrength);
    expect(result).toContain(almanac.dayElement);
    expect(result).toContain(almanac.dayStrength);
  });
});

describe('formatSixRenSummary', () => {
  it('should include method and three transmissions', () => {
    const result = formatSixRenSummary(almanac.sixRen);
    expect(result.method).toBe(almanac.sixRen.method);
    expect(result.transmissions).toBeTruthy();
    expect(result.lessons).toHaveLength(4);
  });
});

describe('formatEclipseInfo', () => {
  it('should describe the nearest eclipse', () => {
    const result = formatEclipseInfo(almanac.nearestEclipse, almanac.isEclipseDay);
    expect(result).toContain(almanac.nearestEclipse.kind === 'solar' ? '日食' : '月食');
  });

  it('should flag eclipse days', () => {
    const result = formatEclipseInfo(almanac.nearestEclipse, true);
    expect(result).toMatch(/今日|當日|eclipse/i);
  });
});
