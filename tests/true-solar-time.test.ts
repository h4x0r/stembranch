import { describe, it, expect } from 'vitest';
import { equationOfTime, trueSolarTime } from '../src/true-solar-time';

describe('equationOfTime', () => {
  it('returns a value in the range ±17 minutes', () => {
    // Test several dates throughout the year
    for (let m = 0; m < 12; m++) {
      const eot = equationOfTime(new Date(2024, m, 15));
      expect(eot).toBeGreaterThanOrEqual(-17);
      expect(eot).toBeLessThanOrEqual(17);
    }
  });

  it('is near +14 minutes in early February', () => {
    const eot = equationOfTime(new Date(2024, 1, 12));
    expect(eot).toBeGreaterThan(10);
    expect(eot).toBeLessThan(16);
  });

  it('is near -16 minutes in early November', () => {
    const eot = equationOfTime(new Date(2024, 10, 5));
    expect(eot).toBeLessThan(-12);
    expect(eot).toBeGreaterThan(-18);
  });
});

describe('trueSolarTime', () => {
  it('corrects time for Beijing (116.4°E, UTC+8, standard meridian 120°E)', () => {
    const clock = new Date(2024, 5, 15, 12, 0, 0);
    const result = trueSolarTime(clock, 116.4, 120);

    // Longitude correction: (116.4 - 120) * 4 = -14.4 minutes
    expect(result.longitudeCorrection).toBeCloseTo(-14.4, 1);
    expect(result.totalCorrection).toBeDefined();
    expect(result.trueSolarTime instanceof Date).toBe(true);
  });

  it('no longitude correction when observer is on standard meridian', () => {
    const clock = new Date(2024, 5, 15, 12, 0, 0);
    const result = trueSolarTime(clock, 120, 120);
    expect(result.longitudeCorrection).toBeCloseTo(0, 5);
  });

  it('positive correction when observer is east of standard meridian', () => {
    const clock = new Date(2024, 5, 15, 12, 0, 0);
    const result = trueSolarTime(clock, 125, 120);
    // (125 - 120) * 4 = +20 minutes
    expect(result.longitudeCorrection).toBeCloseTo(20, 1);
  });

  it('infers standard meridian from timezone offset when not provided', () => {
    const clock = new Date(2024, 5, 15, 12, 0, 0);
    const result = trueSolarTime(clock, 120);
    // Standard meridian inferred from timezone offset
    expect(result.totalCorrection).toBeDefined();
  });
});
