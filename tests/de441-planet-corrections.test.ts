/**
 * Tests for DE441 even-polynomial corrections per planet.
 *
 * Validates that fitted corrections exist for all 7 VSOP87D planets,
 * are small near J2000.0, symmetric (even polynomial), and absent for Pluto.
 */

import { describe, it, expect } from 'vitest';
import { getDE441Correction } from '../src/planets/de441-corrections';
import type { Planet } from '../src/types';

describe('DE441 planet corrections', () => {
  const vsopPlanets: Planet[] = [
    'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune',
  ];

  it('returns non-zero correction for all VSOP87D planets at tau=1', () => {
    for (const planet of vsopPlanets) {
      const corr = getDE441Correction(planet, 1);
      expect(corr, `${planet} should have fitted correction`).not.toBe(0);
    }
  });

  it('has modest c₀ at J2000.0 (within VSOP87D truncation limits)', () => {
    for (const planet of vsopPlanets) {
      const corr = getDE441Correction(planet, 0);
      // Inner planets (Mercury, Venus): < 5" (well-calibrated near J2000)
      // Outer planets (Mars–Neptune): up to ~20" from truncated series
      expect(Math.abs(corr)).toBeLessThan(25);
    }
  });

  it('is symmetric in tau (even polynomial)', () => {
    for (const planet of vsopPlanets) {
      const pos = getDE441Correction(planet, 1.5);
      const neg = getDE441Correction(planet, -1.5);
      expect(pos).toBeCloseTo(neg, 8);
    }
  });

  it('returns 0 for pluto (uses Meeus Ch. 37, not VSOP87D)', () => {
    expect(getDE441Correction('pluto', 1)).toBe(0);
  });
});
