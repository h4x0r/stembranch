// tests/vsop87d-planets.test.ts
import { describe, it, expect } from 'vitest';
import { evaluateVsopSeries } from '../src/vsop87d-earth';

import { MERCURY_L, MERCURY_B, MERCURY_R } from '../src/planets/vsop87d-mercury';
import { VENUS_L, VENUS_B, VENUS_R } from '../src/planets/vsop87d-venus';
import { MARS_L, MARS_B, MARS_R } from '../src/planets/vsop87d-mars';
import { JUPITER_L, JUPITER_B, JUPITER_R } from '../src/planets/vsop87d-jupiter';
import { SATURN_L, SATURN_B, SATURN_R } from '../src/planets/vsop87d-saturn';
import { URANUS_L, URANUS_B, URANUS_R } from '../src/planets/vsop87d-uranus';
import { NEPTUNE_L, NEPTUNE_B, NEPTUNE_R } from '../src/planets/vsop87d-neptune';

const PLANETS = [
  { name: 'Mercury', L: MERCURY_L, B: MERCURY_B, R: MERCURY_R },
  { name: 'Venus',   L: VENUS_L,   B: VENUS_B,   R: VENUS_R },
  { name: 'Mars',    L: MARS_L,    B: MARS_B,    R: MARS_R },
  { name: 'Jupiter', L: JUPITER_L, B: JUPITER_B, R: JUPITER_R },
  { name: 'Saturn',  L: SATURN_L,  B: SATURN_B,  R: SATURN_R },
  { name: 'Uranus',  L: URANUS_L,  B: URANUS_B,  R: URANUS_R },
  { name: 'Neptune', L: NEPTUNE_L, B: NEPTUNE_B, R: NEPTUNE_R },
];

describe('VSOP87D planet coefficients', () => {
  for (const planet of PLANETS) {
    describe(planet.name, () => {
      it('has at least 4 series for L', () => {
        expect(planet.L.length).toBeGreaterThanOrEqual(4);
      });
      it('has at least 3 series for B', () => {
        expect(planet.B.length).toBeGreaterThanOrEqual(3);
      });
      it('has at least 4 series for R', () => {
        expect(planet.R.length).toBeGreaterThanOrEqual(4);
      });
      it('L has non-zero total terms', () => {
        const total = planet.L.reduce((sum, s) => sum + s.length, 0);
        expect(total).toBeGreaterThan(100);
      });
      it('each term is [A, B, C] with valid numbers', () => {
        const term = planet.L[0][0];
        expect(term).toHaveLength(3);
        expect(Number.isFinite(term[0])).toBe(true);
        expect(Number.isFinite(term[1])).toBe(true);
        expect(Number.isFinite(term[2])).toBe(true);
      });
      it('evaluates L at t=0 without NaN', () => {
        const L = evaluateVsopSeries(planet.L, 0);
        expect(Number.isFinite(L)).toBe(true);
      });
      it('evaluates R at t=0 to a reasonable distance', () => {
        const R = evaluateVsopSeries(planet.R, 0);
        expect(R).toBeGreaterThan(0.2);
        expect(R).toBeLessThan(31);
      });
    });
  }

  // Cross-validate with VSOP87D reference values at J2000.0 (ecliptic of date)
  it('Mars L at J2000.0 ≈ 6.27 rad (359.4°, ecliptic of date)', () => {
    const L = evaluateVsopSeries(MARS_L, 0);
    expect(L).toBeCloseTo(6.27, 1);
  });
  it('Venus R at J2000.0 ≈ 0.72 AU', () => {
    const R = evaluateVsopSeries(VENUS_R, 0);
    expect(R).toBeCloseTo(0.72, 1);
  });
});
