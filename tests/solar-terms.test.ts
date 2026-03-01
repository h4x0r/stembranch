import { describe, it, expect } from 'vitest';
import {
  SOLAR_TERM_NAMES, SOLAR_TERM_LONGITUDES, JIE_INDICES,
  findSolarTermMoment, getSolarTermsForYear, findLichun,
  getJieTermsForYear,
} from '../src/solar-terms';

describe('SOLAR_TERM_NAMES', () => {
  it('has 24 terms', () => {
    expect(SOLAR_TERM_NAMES).toHaveLength(24);
  });

  it('starts with 小寒 and ends with 冬至', () => {
    expect(SOLAR_TERM_NAMES[0]).toBe('小寒');
    expect(SOLAR_TERM_NAMES[23]).toBe('冬至');
  });
});

describe('SOLAR_TERM_LONGITUDES', () => {
  it('has 24 longitudes', () => {
    expect(SOLAR_TERM_LONGITUDES).toHaveLength(24);
  });

  it('春分 is at 0°', () => {
    const chunfenIdx = SOLAR_TERM_NAMES.indexOf('春分');
    expect(SOLAR_TERM_LONGITUDES[chunfenIdx]).toBe(0);
  });

  it('夏至 is at 90°', () => {
    const xiazhi = SOLAR_TERM_NAMES.indexOf('夏至');
    expect(SOLAR_TERM_LONGITUDES[xiazhi]).toBe(90);
  });
});

describe('JIE_INDICES', () => {
  it('has 12 節 terms', () => {
    expect(JIE_INDICES).toHaveLength(12);
  });
});

describe('findSolarTermMoment', () => {
  it('finds 春分 2024 (longitude 0°) in March', () => {
    const date = findSolarTermMoment(0, 2024, 3);
    expect(date.getFullYear()).toBe(2024);
    expect(date.getMonth()).toBe(2); // March (0-indexed)
    expect(date.getDate()).toBeGreaterThanOrEqual(19);
    expect(date.getDate()).toBeLessThanOrEqual(21);
  });

  it('finds 夏至 2024 (longitude 90°) in June', () => {
    const date = findSolarTermMoment(90, 2024, 5);
    expect(date.getMonth()).toBe(5); // June
    expect(date.getDate()).toBeGreaterThanOrEqual(20);
    expect(date.getDate()).toBeLessThanOrEqual(22);
  });
});

describe('findLichun', () => {
  it('returns 立春 around Feb 3-5', () => {
    const lichun2024 = findLichun(2024);
    expect(lichun2024.getMonth()).toBe(1); // February
    expect(lichun2024.getDate()).toBeGreaterThanOrEqual(3);
    expect(lichun2024.getDate()).toBeLessThanOrEqual(5);
  });

  it('returns date in February for various years', () => {
    for (const year of [2020, 2021, 2022, 2023, 2025]) {
      const lichun = findLichun(year);
      expect(lichun.getMonth()).toBe(1);
    }
  });
});

describe('getSolarTermsForYear', () => {
  it('returns 24 terms for 2024', () => {
    const terms = getSolarTermsForYear(2024);
    expect(terms).toHaveLength(24);
    expect(terms[0].name).toBe('小寒');
    expect(terms[23].name).toBe('冬至');
  });

  it('terms are in chronological order', () => {
    const terms = getSolarTermsForYear(2024);
    for (let i = 1; i < terms.length; i++) {
      expect(terms[i].date.getTime()).toBeGreaterThan(terms[i - 1].date.getTime());
    }
  });
});

describe('getJieTermsForYear', () => {
  it('returns 12 節 terms', () => {
    const jie = getJieTermsForYear(2024);
    expect(jie).toHaveLength(12);
    expect(jie[0].name).toBe('小寒');
    expect(jie[1].name).toBe('立春');
  });
});
