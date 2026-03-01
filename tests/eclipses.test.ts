import { describe, it, expect } from 'vitest';
import type { Eclipse, EclipseKind, SolarEclipseType, LunarEclipseType } from '../src/types';
import {
  getAllSolarEclipses,
  getAllLunarEclipses,
  getEclipsesForYear,
  getEclipsesInRange,
  findNearestEclipse,
  isEclipseDate,
  ECLIPSE_DATA_RANGE,
} from '../src/eclipses';

describe('Eclipse arrays', () => {
  it('solar eclipses is a non-empty array', () => {
    const solar = getAllSolarEclipses();
    expect(Array.isArray(solar)).toBe(true);
    expect(solar.length).toBeGreaterThan(0);
  });

  it('lunar eclipses is a non-empty array', () => {
    const lunar = getAllLunarEclipses();
    expect(Array.isArray(lunar)).toBe(true);
    expect(lunar.length).toBeGreaterThan(0);
  });

  it('each solar eclipse has required fields', () => {
    const solar = getAllSolarEclipses();
    for (const e of solar.slice(0, 10)) {
      expect(e.kind).toBe('solar');
      expect(['T', 'A', 'P', 'H']).toContain(e.type);
      expect(e.date).toBeInstanceOf(Date);
      expect(e.magnitude).toBeGreaterThan(0);
    }
  });

  it('each lunar eclipse has required fields', () => {
    const lunar = getAllLunarEclipses();
    for (const e of lunar.slice(0, 10)) {
      expect(e.kind).toBe('lunar');
      expect(['T', 'P', 'N']).toContain(e.type);
      expect(e.date).toBeInstanceOf(Date);
      expect(e.magnitude).toBeGreaterThan(0);
    }
  });

  it('solar eclipses are sorted by date', () => {
    const solar = getAllSolarEclipses();
    for (let i = 1; i < solar.length; i++) {
      expect(solar[i].date.getTime())
        .toBeGreaterThanOrEqual(solar[i - 1].date.getTime());
    }
  });

  it('lunar eclipses are sorted by date', () => {
    const lunar = getAllLunarEclipses();
    for (let i = 1; i < lunar.length; i++) {
      expect(lunar[i].date.getTime())
        .toBeGreaterThanOrEqual(lunar[i - 1].date.getTime());
    }
  });

  it('dataset range is 1000-3000', () => {
    expect(ECLIPSE_DATA_RANGE.min).toBe(1000);
    expect(ECLIPSE_DATA_RANGE.max).toBe(3000);
  });
});

describe('getEclipsesForYear', () => {
  it('2024 has the April 8 total solar eclipse', () => {
    const eclipses = getEclipsesForYear(2024);
    const apr8 = eclipses.find(
      e => e.kind === 'solar' && e.type === 'T'
        && e.date.getUTCMonth() === 3 && e.date.getUTCDate() === 8
    );
    expect(apr8).toBeDefined();
    expect(apr8!.magnitude).toBeGreaterThan(1);
  });

  it('2024 has the October 2 annular solar eclipse', () => {
    const eclipses = getEclipsesForYear(2024);
    const oct2 = eclipses.find(
      e => e.kind === 'solar' && e.type === 'A'
        && e.date.getUTCMonth() === 9
    );
    expect(oct2).toBeDefined();
  });

  it('2024 has lunar eclipses in March and September', () => {
    const eclipses = getEclipsesForYear(2024);
    const lunar = eclipses.filter(e => e.kind === 'lunar');
    expect(lunar.length).toBeGreaterThanOrEqual(2);
    const months = lunar.map(e => e.date.getUTCMonth());
    expect(months).toContain(2); // March
    expect(months).toContain(8); // September
  });

  it('2017 has the August 21 total solar eclipse', () => {
    const eclipses = getEclipsesForYear(2017);
    const aug21 = eclipses.find(
      e => e.kind === 'solar' && e.type === 'T'
        && e.date.getUTCMonth() === 7 && e.date.getUTCDate() === 21
    );
    expect(aug21).toBeDefined();
  });

  it('returns empty for years outside dataset range', () => {
    expect(getEclipsesForYear(999)).toEqual([]);
    expect(getEclipsesForYear(3001)).toEqual([]);
  });

  it('returns both solar and lunar eclipses sorted by date', () => {
    const eclipses = getEclipsesForYear(2024);
    for (let i = 1; i < eclipses.length; i++) {
      expect(eclipses[i].date.getTime())
        .toBeGreaterThanOrEqual(eclipses[i - 1].date.getTime());
    }
  });

  it('works for year 1066 (Battle of Hastings era)', () => {
    const eclipses = getEclipsesForYear(1066);
    expect(eclipses.length).toBeGreaterThan(0);
  });

  it('works for year 2999 (far future)', () => {
    const eclipses = getEclipsesForYear(2999);
    expect(eclipses.length).toBeGreaterThan(0);
  });
});

describe('getEclipsesInRange', () => {
  it('finds eclipses in a date range', () => {
    const start = new Date(Date.UTC(2024, 0, 1));
    const end = new Date(Date.UTC(2024, 11, 31));
    const eclipses = getEclipsesInRange(start, end);
    expect(eclipses.length).toBeGreaterThanOrEqual(4);
  });

  it('can filter by kind', () => {
    const start = new Date(Date.UTC(2024, 0, 1));
    const end = new Date(Date.UTC(2024, 11, 31));
    const solar = getEclipsesInRange(start, end, 'solar');
    const lunar = getEclipsesInRange(start, end, 'lunar');
    expect(solar.every(e => e.kind === 'solar')).toBe(true);
    expect(lunar.every(e => e.kind === 'lunar')).toBe(true);
  });

  it('returns empty for range outside dataset', () => {
    const start = new Date(Date.UTC(500, 0, 1));
    const end = new Date(Date.UTC(500, 11, 31));
    expect(getEclipsesInRange(start, end)).toEqual([]);
  });
});

describe('findNearestEclipse', () => {
  it('finds the nearest eclipse to a given date', () => {
    const date = new Date(Date.UTC(2024, 3, 1)); // April 1
    const nearest = findNearestEclipse(date);
    expect(nearest).toBeDefined();
    const daysDiff = Math.abs(nearest!.date.getTime() - date.getTime()) / 86400000;
    expect(daysDiff).toBeLessThan(15);
  });

  it('can filter by kind', () => {
    const date = new Date(Date.UTC(2024, 3, 1)); // April 1
    const nearest = findNearestEclipse(date, 'solar');
    expect(nearest).toBeDefined();
    expect(nearest!.kind).toBe('solar');
    expect(nearest!.date.getUTCMonth()).toBe(3); // April
    expect(nearest!.date.getUTCDate()).toBe(8);
  });

  it('returns undefined for dates far outside dataset range', () => {
    const date = new Date(Date.UTC(500, 0, 1));
    expect(findNearestEclipse(date)).toBeUndefined();
  });
});

describe('isEclipseDate', () => {
  it('returns eclipse for April 8 2024', () => {
    const result = isEclipseDate(new Date(Date.UTC(2024, 3, 8)));
    expect(result).not.toBeNull();
    expect(result!.kind).toBe('solar');
    expect(result!.type).toBe('T');
  });

  it('returns null for a non-eclipse date', () => {
    const result = isEclipseDate(new Date(Date.UTC(2024, 3, 15)));
    expect(result).toBeNull();
  });

  it('matches on UTC date regardless of time', () => {
    const result = isEclipseDate(new Date(Date.UTC(2024, 3, 8, 23, 59)));
    expect(result).not.toBeNull();
  });

  it('finds a lunar eclipse date', () => {
    // Nov 8 2022 total lunar eclipse
    const result = isEclipseDate(new Date(Date.UTC(2022, 10, 8)));
    expect(result).not.toBeNull();
    expect(result!.kind).toBe('lunar');
    expect(result!.type).toBe('T');
  });
});

describe('dataset coverage', () => {
  it('covers 1000-3000 range', () => {
    const y1000 = getEclipsesForYear(1000);
    const y3000 = getEclipsesForYear(3000);
    expect(y1000.length).toBeGreaterThan(0);
    expect(y3000.length).toBeGreaterThan(0);
  });

  it('has approximately 2-5 solar eclipses per year', () => {
    for (const year of [1100, 1500, 1950, 2000, 2024, 2050, 2500]) {
      const solar = getEclipsesForYear(year).filter(e => e.kind === 'solar');
      expect(solar.length).toBeGreaterThanOrEqual(2);
      expect(solar.length).toBeLessThanOrEqual(5);
    }
  });

  it('has approximately 1-5 lunar eclipses per year', () => {
    for (const year of [1100, 1500, 1950, 2000, 2024, 2050, 2500]) {
      const lunar = getEclipsesForYear(year).filter(e => e.kind === 'lunar');
      expect(lunar.length).toBeGreaterThanOrEqual(1);
      expect(lunar.length).toBeLessThanOrEqual(5);
    }
  });

  it('total eclipse count is in expected range', () => {
    const solar = getAllSolarEclipses();
    const lunar = getAllLunarEclipses();
    // ~2.4 per year × 2000 years = ~4800 each
    expect(solar.length).toBeGreaterThan(4500);
    expect(solar.length).toBeLessThan(5200);
    expect(lunar.length).toBeGreaterThan(4500);
    expect(lunar.length).toBeLessThan(5200);
  });
});
