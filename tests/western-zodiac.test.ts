import { describe, it, expect } from 'vitest';
import { getWesternZodiac } from '../src/western-zodiac';

describe('getWesternZodiac', () => {
  it('Aries (Mar 21 - Apr 19)', () => {
    const result = getWesternZodiac(new Date(2024, 2, 25));
    expect(result.sign).toBe('Aries');
    expect(result.symbol).toBe('♈');
    expect(result.chineseName).toBe('白羊座');
    expect(result.element).toBe('Fire');
  });

  it('Taurus (Apr 20 - May 20)', () => {
    const result = getWesternZodiac(new Date(2024, 3, 25));
    expect(result.sign).toBe('Taurus');
  });

  it('Cancer (Jun 21 - Jul 22)', () => {
    const result = getWesternZodiac(new Date(2024, 5, 25));
    expect(result.sign).toBe('Cancer');
  });

  it('Leo (Jul 23 - Aug 22)', () => {
    const result = getWesternZodiac(new Date(2024, 6, 25));
    expect(result.sign).toBe('Leo');
  });

  it('Capricorn wraps around (Dec 22 - Jan 19)', () => {
    expect(getWesternZodiac(new Date(2024, 11, 25)).sign).toBe('Capricorn');
    expect(getWesternZodiac(new Date(2024, 0, 10)).sign).toBe('Capricorn');
  });

  it('Aquarius (Jan 20 - Feb 18)', () => {
    expect(getWesternZodiac(new Date(2024, 0, 25)).sign).toBe('Aquarius');
  });

  it('Pisces (Feb 19 - Mar 20)', () => {
    expect(getWesternZodiac(new Date(2024, 1, 25)).sign).toBe('Pisces');
  });

  it('Scorpio (Oct 23 - Nov 21)', () => {
    expect(getWesternZodiac(new Date(2024, 9, 25)).sign).toBe('Scorpio');
  });

  it('Sagittarius (Nov 22 - Dec 21)', () => {
    expect(getWesternZodiac(new Date(2024, 10, 25)).sign).toBe('Sagittarius');
  });

  it('boundary: Dec 21 → Sagittarius, Dec 22 → Capricorn', () => {
    expect(getWesternZodiac(new Date(2024, 11, 21)).sign).toBe('Sagittarius');
    expect(getWesternZodiac(new Date(2024, 11, 22)).sign).toBe('Capricorn');
  });

  it('all signs have Chinese names', () => {
    const months = [
      [0, 10], [0, 25], [1, 25], [2, 25], [3, 25], [4, 25],
      [5, 25], [6, 25], [7, 25], [8, 25], [9, 25], [10, 25],
    ];
    for (const [m, d] of months) {
      const result = getWesternZodiac(new Date(2024, m, d));
      expect(result.chineseName).toBeTruthy();
      expect(result.symbol).toBeTruthy();
    }
  });
});
