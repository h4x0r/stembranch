import { describe, it, expect } from 'vitest';
import { julianDayNumber, jdToCalendarDate, julianCalendarToDate } from '../src/julian-day';

describe('julianDayNumber', () => {
  // Reference values from Meeus, Astronomical Algorithms, 2nd ed., Chapter 7

  it('J2000.0: 2000 Jan 1.5 = JD 2451545.0 (Gregorian)', () => {
    expect(julianDayNumber(2000, 1, 1.5)).toBeCloseTo(2451545.0, 1);
  });

  it('1999 Jan 1.0 = JD 2451179.5 (Gregorian)', () => {
    expect(julianDayNumber(1999, 1, 1.0)).toBeCloseTo(2451179.5, 1);
  });

  it('1987 Jan 27.0 = JD 2446822.5 (Gregorian)', () => {
    expect(julianDayNumber(1987, 1, 27.0)).toBeCloseTo(2446822.5, 1);
  });

  it('1987 Jun 19.5 = JD 2446966.0 (Gregorian)', () => {
    expect(julianDayNumber(1987, 6, 19.5)).toBeCloseTo(2446966.0, 1);
  });

  it('1957 Oct 4.81 = JD 2436116.31 (Gregorian)', () => {
    expect(julianDayNumber(1957, 10, 4.81)).toBeCloseTo(2436116.31, 2);
  });

  it('1600 Jan 1.0 = JD 2305447.5 (Gregorian)', () => {
    expect(julianDayNumber(1600, 1, 1.0, 'gregorian')).toBeCloseTo(2305447.5, 1);
  });

  it('1600 Dec 31.0 = JD 2305812.5 (Gregorian)', () => {
    expect(julianDayNumber(1600, 12, 31.0, 'gregorian')).toBeCloseTo(2305812.5, 1);
  });

  it('837 Apr 10.3 = JD 2026871.8 (Julian)', () => {
    expect(julianDayNumber(837, 4, 10.3, 'julian')).toBeCloseTo(2026871.8, 1);
  });

  it('-4712 Jan 1.5 = JD 0.0 (Julian, epoch)', () => {
    expect(julianDayNumber(-4712, 1, 1.5, 'julian')).toBeCloseTo(0.0, 1);
  });

  it('333 Jan 27.5 = JD 1842713.0 (Julian)', () => {
    // Meeus example 7.a
    expect(julianDayNumber(333, 1, 27.5, 'julian')).toBeCloseTo(1842713.0, 1);
  });

  it('auto mode: uses Julian before 1582-10-15', () => {
    const jdAuto = julianDayNumber(1500, 6, 15);
    const jdJulian = julianDayNumber(1500, 6, 15, 'julian');
    expect(jdAuto).toBeCloseTo(jdJulian, 5);
  });

  it('auto mode: uses Gregorian on and after 1582-10-15', () => {
    const jdAuto = julianDayNumber(1582, 10, 15);
    const jdGregorian = julianDayNumber(1582, 10, 15, 'gregorian');
    expect(jdAuto).toBeCloseTo(jdGregorian, 5);
  });

  it('Julian and Gregorian differ by 10 days in 1582', () => {
    const jdJulian = julianDayNumber(1582, 10, 4, 'julian');
    const jdGregorian = julianDayNumber(1582, 10, 15, 'gregorian');
    // Oct 4 Julian → next day is Oct 15 Gregorian
    expect(jdGregorian - jdJulian).toBeCloseTo(1.0, 1);
  });

  it('1582-10-15 Gregorian = JD 2299160.5', () => {
    expect(julianDayNumber(1582, 10, 15, 'gregorian')).toBeCloseTo(2299160.5, 1);
  });

  it('1582-10-04 Julian = JD 2299159.5', () => {
    expect(julianDayNumber(1582, 10, 4, 'julian')).toBeCloseTo(2299159.5, 1);
  });
});

describe('jdToCalendarDate', () => {
  it('JD 2451545.0 → 2000 Jan 1.5 (Gregorian)', () => {
    const { year, month, day } = jdToCalendarDate(2451545.0);
    expect(year).toBe(2000);
    expect(month).toBe(1);
    expect(day).toBeCloseTo(1.5, 1);
  });

  it('JD 2299160.5 → 1582 Oct 15 (Gregorian)', () => {
    const { year, month, day } = jdToCalendarDate(2299160.5);
    expect(year).toBe(1582);
    expect(month).toBe(10);
    expect(day).toBeCloseTo(15, 0);
  });

  it('JD 2299159.5 → 1582 Oct 4 (Julian)', () => {
    const { year, month, day } = jdToCalendarDate(2299159.5, 'julian');
    expect(year).toBe(1582);
    expect(month).toBe(10);
    expect(day).toBeCloseTo(4, 0);
  });

  it('round-trips for modern dates', () => {
    for (const [y, m, d] of [[2024, 3, 15], [1900, 1, 1], [2100, 12, 31]]) {
      const jd = julianDayNumber(y, m, d, 'gregorian');
      const result = jdToCalendarDate(jd);
      expect(result.year).toBe(y);
      expect(result.month).toBe(m);
      expect(result.day).toBeCloseTo(d, 1);
    }
  });

  it('round-trips for Julian dates', () => {
    for (const [y, m, d] of [[837, 4, 10], [333, 1, 27], [100, 6, 15]]) {
      const jd = julianDayNumber(y, m, d, 'julian');
      const result = jdToCalendarDate(jd, 'julian');
      expect(result.year).toBe(y);
      expect(result.month).toBe(m);
      expect(result.day).toBeCloseTo(d, 1);
    }
  });
});

describe('julianCalendarToDate', () => {
  it('converts Julian calendar date to JS Date (Gregorian)', () => {
    // 1582-10-04 Julian = 1582-10-14 Gregorian
    const date = julianCalendarToDate(1582, 10, 4);
    expect(date.getUTCFullYear()).toBe(1582);
    expect(date.getUTCMonth()).toBe(9); // October (0-based)
    expect(date.getUTCDate()).toBe(14);
  });

  it('handles dates before 1 CE correctly', () => {
    const date = julianCalendarToDate(1, 1, 1);
    expect(date).toBeInstanceOf(Date);
    expect(date.getTime()).not.toBeNaN();
  });
});
