import { describe, it, expect } from 'vitest';
import { equationOfTime, trueSolarTime } from '../src/true-solar-time';
import { equationOfTimeVSOP } from '../src/solar-longitude';

// ═══════════════════════════════════════════════════════════════
//  equationOfTime — basic shape (existing tests, wide tolerance)
// ═══════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════
//  equationOfTimeVSOP — VSOP87D-based (Meeus Ch. 28)
// ═══════════════════════════════════════════════════════════════

describe('equationOfTimeVSOP', () => {
  // Helper: create a Date at 12:00 TT (≈ UT for modern dates)
  const noon = (y: number, m: number, d: number) =>
    new Date(Date.UTC(y, m - 1, d, 12, 0, 0));

  // ── Sign convention ──────────────────────────────────────────
  // Positive = sundial ahead of clock (apparent solar time > mean solar time)
  // February: sundial fast → positive (~+14 min)
  // November: sundial slow → negative (~-16 min)

  it('returns positive EoT in February (sundial ahead of clock)', () => {
    const eot = equationOfTimeVSOP(noon(2024, 2, 12));
    expect(eot).toBeGreaterThan(13);
    expect(eot).toBeLessThan(15);
  });

  it('returns negative EoT in November (sundial behind clock)', () => {
    const eot = equationOfTimeVSOP(noon(2024, 11, 3));
    expect(eot).toBeLessThan(-15);
    expect(eot).toBeGreaterThan(-17.5);
  });

  // ── Range ────────────────────────────────────────────────────

  it('stays within ±17 minutes for all months', () => {
    for (let m = 1; m <= 12; m++) {
      const eot = equationOfTimeVSOP(noon(2024, m, 15));
      expect(Math.abs(eot)).toBeLessThan(17);
    }
  });

  // ── Zero crossings ──────────────────────────────────────────
  // EoT crosses zero approximately 4 times per year:
  // ~Apr 15, ~Jun 13, ~Sep 1, ~Dec 25

  it('is near zero around April 15', () => {
    const eot = equationOfTimeVSOP(noon(2024, 4, 15));
    expect(Math.abs(eot)).toBeLessThan(0.5);
  });

  it('is near zero around June 13', () => {
    const eot = equationOfTimeVSOP(noon(2024, 6, 13));
    expect(Math.abs(eot)).toBeLessThan(0.5);
  });

  it('is near zero around September 1', () => {
    const eot = equationOfTimeVSOP(noon(2024, 9, 1));
    expect(Math.abs(eot)).toBeLessThan(0.5);
  });

  it('is near zero around December 25', () => {
    const eot = equationOfTimeVSOP(noon(2024, 12, 25));
    expect(Math.abs(eot)).toBeLessThan(0.5);
  });

  // ── Year-to-year variation ─────────────────────────────────
  // Unlike Spencer (which uses only day-of-year), VSOP87D accounts
  // for actual orbital mechanics. The same calendar date in different
  // years gives slightly different EoT values.

  it('gives different values for the same calendar date in different years', () => {
    const eot2020 = equationOfTimeVSOP(noon(2020, 2, 12));
    const eot2024 = equationOfTimeVSOP(noon(2024, 2, 12));
    // The values should be similar but NOT identical
    expect(Math.abs(eot2020 - eot2024)).toBeGreaterThan(0.001);
    // But still close (same order of magnitude)
    expect(Math.abs(eot2020 - eot2024)).toBeLessThan(1.0);
  });

  // ── Full-year profile: 2024 ────────────────────────────────
  // Reference values derived from NOAA solar calculator (DE-based),
  // converted to our convention: positive = sundial ahead of clock.
  // Tolerances are ±0.3 min (~18 seconds). After JPL Horizons
  // comparison, these will be tightened.
  //
  // Sign pattern: two positive peaks (Feb ~+14, Jul/Aug ~+6),
  // two negative troughs (May ~-3.7, Nov ~-16), four zero crossings.

  const reference2024: [number, number, number, number][] = [
    // [month, day, expected EoT (min), tolerance (min)]
    [1,  1,  +3.3,  0.3],   // sundial fast (post-perihelion)
    [2, 12, +14.2,  0.3],   // peak sundial fast
    [3, 20,  +7.3,  0.3],   // decreasing toward zero
    [5, 14,  -3.7,  0.3],   // sundial slow (secondary trough)
    [7, 26,  +6.3,  0.3],   // sundial fast (secondary peak)
    [10, 15, -14.4, 0.3],   // approaching peak slow
    [11,  3, -16.4, 0.3],   // peak sundial slow
  ];

  for (const [month, day, expected, tol] of reference2024) {
    it(`2024-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}: EoT ≈ ${expected > 0 ? '+' : ''}${expected} min (±${tol})`, () => {
      const eot = equationOfTimeVSOP(noon(2024, month, day));
      expect(eot).toBeCloseTo(expected, 0); // within 0.5 min for now
      expect(Math.abs(eot - expected)).toBeLessThan(tol);
    });
  }

  // ── Historical dates ─────────────────────────────────────────
  // VSOP87D should work accurately for dates well outside 2024.

  it('works for 1900 dates', () => {
    const eot = equationOfTimeVSOP(noon(1900, 2, 12));
    expect(eot).toBeGreaterThan(13);
    expect(eot).toBeLessThan(15);
  });

  it('works for 2100 dates', () => {
    const eot = equationOfTimeVSOP(noon(2100, 11, 3));
    expect(eot).toBeLessThan(-15);
    expect(eot).toBeGreaterThan(-17.5);
  });

  // ── Consistency with equationOfTime ──────────────────────────
  // After wiring, equationOfTime should delegate to VSOP87D.

  it('equationOfTime delegates to VSOP87D', () => {
    const date = noon(2024, 6, 15);
    const vsop = equationOfTimeVSOP(date);
    const legacy = equationOfTime(date);
    // After wiring, these should be identical
    expect(legacy).toBeCloseTo(vsop, 5);
  });
});

// ═══════════════════════════════════════════════════════════════
//  trueSolarTime — longitude correction and total pipeline
// ═══════════════════════════════════════════════════════════════

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
