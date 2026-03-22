import { describe, it, expect } from 'vitest';
import { getPlanetPosition } from '../src/planets/planets';
import type { Planet } from '../src/types';

// Reference: Meeus, Astronomical Algorithms, Example 33.a
// Venus on 1992-Dec-20 0h TT
// Geocentric ecliptic longitude ≈ 313.08° (apparent)
describe('getPlanetPosition', () => {
  it('computes Venus apparent longitude for Meeus example', () => {
    // 1992-Dec-20 0h UT ≈ 0h TT (ΔT ≈ 59s, negligible for this test)
    const date = new Date(Date.UTC(1992, 11, 20, 0, 0, 0));
    const pos = getPlanetPosition('venus', date);

    // Meeus example gives geocentric λ ≈ 313.08° (geometric)
    // Our pipeline includes nutation + aberration, so within ~0.5° is good
    expect(pos.longitude).toBeCloseTo(313.1, 0);
    expect(pos.latitude).toBeGreaterThan(-3);
    expect(pos.latitude).toBeLessThan(3);
  });

  const testPlanets: Planet[] = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];

  for (const planet of testPlanets) {
    it(`returns valid coordinates for ${planet} at J2000.0`, () => {
      const date = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));
      const pos = getPlanetPosition(planet, date);

      expect(pos.longitude).toBeGreaterThanOrEqual(0);
      expect(pos.longitude).toBeLessThan(360);
      expect(Math.abs(pos.latitude)).toBeLessThan(15);
      expect(pos.distance).toBeGreaterThan(0);
      expect(pos.ra).toBeGreaterThanOrEqual(0);
      expect(pos.ra).toBeLessThan(360);
      expect(Math.abs(pos.dec)).toBeLessThanOrEqual(90);
    });
  }

  it('Mars distance at J2000.0 within expected range', () => {
    const date = new Date(Date.UTC(2000, 0, 1, 12, 0, 0));
    const pos = getPlanetPosition('mars', date);
    // Mars geocentric distance: roughly 0.4 - 2.7 AU
    expect(pos.distance).toBeGreaterThan(0.4);
    expect(pos.distance).toBeLessThan(2.7);
  });

  it('Jupiter RA/Dec are plausible at known date', () => {
    // 2024-Jan-01 — Jupiter in Aries region
    const date = new Date(Date.UTC(2024, 0, 1, 0, 0, 0));
    const pos = getPlanetPosition('jupiter', date);
    // RA should be in the Aries/Taurus region (~30-60°)
    expect(pos.ra).toBeGreaterThan(20);
    expect(pos.ra).toBeLessThan(80);
  });
});
