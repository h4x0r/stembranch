import { describe, it, expect } from 'vitest';
import {
  computeFirdaria,
  computeProfection,
  findPrenatalSyzygy,
  findHyleg,
  findAlcochoden,
} from '../src/time-lords';

describe('computeFirdaria', () => {
  const birth = new Date('2000-01-01T00:00:00Z');

  it('day chart: ruler is Sun during first 10 years', () => {
    const query = new Date('2005-06-15T00:00:00Z');
    const result = computeFirdaria(birth, true, query);
    expect(result.ruler).toBe('Sun');
  });

  it('day chart: ruler is Moon during years 10-19', () => {
    const query = new Date('2012-06-15T00:00:00Z');
    const result = computeFirdaria(birth, true, query);
    expect(result.ruler).toBe('Moon');
  });

  it('night chart: ruler is Moon during first 9 years', () => {
    const query = new Date('2005-06-15T00:00:00Z');
    const result = computeFirdaria(birth, false, query);
    expect(result.ruler).toBe('Moon');
  });

  it('returns valid startDate < endDate with queryDate between them', () => {
    const query = new Date('2005-06-15T00:00:00Z');
    const result = computeFirdaria(birth, true, query);
    expect(result.startDate.getTime()).toBeLessThan(result.endDate.getTime());
    expect(query.getTime()).toBeGreaterThanOrEqual(result.startDate.getTime());
    expect(query.getTime()).toBeLessThan(result.endDate.getTime());
  });
});

describe('computeProfection', () => {
  it('age 0: house = 1, sign = natal ASC sign', () => {
    const birth = new Date('2000-01-01T00:00:00Z');
    const query = new Date('2000-06-15T00:00:00Z'); // still age 0
    const result = computeProfection(birth, query, 0); // 0 degrees = Aries
    expect(result.house).toBe(1);
    expect(result.sign).toBe('Aries');
  });

  it('age 12: full cycle back to house 1', () => {
    const birth = new Date('2000-01-01T00:00:00Z');
    const query = new Date('2012-06-15T00:00:00Z'); // age 12
    const result = computeProfection(birth, query, 0);
    expect(result.house).toBe(1);
  });

  it('age 30: house = (30 % 12) + 1 = 7', () => {
    const birth = new Date('2000-01-01T00:00:00Z');
    const query = new Date('2030-06-15T00:00:00Z'); // age 30
    const result = computeProfection(birth, query, 0);
    expect(result.house).toBe(7);
  });

  it('age 3 from 0 degrees Aries ASC: Cancer, lord = Moon', () => {
    const birth = new Date('2000-01-01T00:00:00Z');
    const query = new Date('2003-06-15T00:00:00Z'); // age 3
    const result = computeProfection(birth, query, 0); // 0 = Aries
    expect(result.sign).toBe('Cancer');
    expect(result.lord).toBe('Moon');
  });
});

describe('findPrenatalSyzygy', () => {
  it('returns type "new" for a date shortly after a known new moon', () => {
    // 2000 Jan 6 is the k=0 new moon reference epoch
    // Use a date a few days after
    const birth = new Date('2000-01-10T00:00:00Z');
    const result = findPrenatalSyzygy(birth);
    expect(result.type).toBe('new');
  });

  it('returns a date before birthDate', () => {
    const birth = new Date('2000-03-15T00:00:00Z');
    const result = findPrenatalSyzygy(birth);
    expect(result.date.getTime()).toBeLessThan(birth.getTime());
  });
});

describe('findHyleg', () => {
  it('Sun in house 10 (day chart) returns Sun', () => {
    const positions = [
      { body: 'Sun', house: 10 },
      { body: 'Moon', house: 3 },
    ];
    expect(findHyleg(positions, true)).toBe('Sun');
  });

  it('Sun in house 3, Moon in house 1 (day chart) returns Moon', () => {
    const positions = [
      { body: 'Sun', house: 3 },
      { body: 'Moon', house: 1 },
    ];
    expect(findHyleg(positions, true)).toBe('Moon');
  });

  it('no bodies in hylegical places returns null', () => {
    const positions = [
      { body: 'Sun', house: 6 },
      { body: 'Moon', house: 8 },
    ];
    expect(findHyleg(positions, true)).toBeNull();
  });
});

describe('findAlcochoden', () => {
  it('Sun degree in Leo returns Sun with high dignity score', () => {
    // Sun rules Leo, so Sun at 15 Leo should have high dignity
    const result = findAlcochoden('Leo', 15, true);
    expect(result).toBe('Sun');
  });
});
