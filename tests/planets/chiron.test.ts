/**
 * TDD tests for Chiron ephemeris via Keplerian orbital elements.
 *
 * Reference values from JPL Horizons geocentric ecliptic (ObsEcLon, ObsEcLat):
 * - 2000-01-01T00:00Z: 251.5604°, +4.0686°
 * - 2010-06-15T00:00Z: 330.9339°, +6.2778°
 * - 2024-06-15T00:00Z:  22.8025°, +1.1307°
 *
 * Accuracy target: within ~2° of JPL positions (Keplerian without perturbations).
 */

import { describe, it, expect } from 'vitest';
import { getChironPosition } from '../../src/planets/chiron';

describe('getChironPosition', () => {
  // ── Return type ───────────────────────────────────────────────
  it('returns an object with longitude, latitude, and distance', () => {
    const pos = getChironPosition(new Date('2024-01-01T00:00:00Z'));
    expect(pos).toHaveProperty('longitude');
    expect(pos).toHaveProperty('latitude');
    expect(pos).toHaveProperty('distance');
  });

  // ── Longitude range ───────────────────────────────────────────
  it('returns longitude in [0, 360) range', () => {
    const dates = [
      new Date('2000-01-01T12:00:00Z'),
      new Date('2010-06-15T00:00:00Z'),
      new Date('2024-06-15T00:00:00Z'),
    ];
    for (const d of dates) {
      const pos = getChironPosition(d);
      expect(pos.longitude).toBeGreaterThanOrEqual(0);
      expect(pos.longitude).toBeLessThan(360);
    }
  });

  // ── Latitude within orbital inclination bounds ────────────────
  it('returns latitude within +-8 degrees (inclination ~6.95°)', () => {
    const dates = [
      new Date('2000-01-01T00:00:00Z'),
      new Date('2010-06-15T00:00:00Z'),
      new Date('2024-06-15T00:00:00Z'),
    ];
    for (const d of dates) {
      const pos = getChironPosition(d);
      expect(pos.latitude).toBeGreaterThanOrEqual(-8);
      expect(pos.latitude).toBeLessThanOrEqual(8);
    }
  });

  // ── Distance within physical range ────────────────────────────
  // Perihelion ~8.43 AU, aphelion ~18.86 AU; geocentric adds ~1 AU variation
  it('returns distance roughly in 7-20 AU range', () => {
    const dates = [
      new Date('2000-01-01T00:00:00Z'),
      new Date('2010-06-15T00:00:00Z'),
      new Date('2024-06-15T00:00:00Z'),
    ];
    for (const d of dates) {
      const pos = getChironPosition(d);
      expect(pos.distance).toBeGreaterThan(7);
      expect(pos.distance).toBeLessThan(20);
    }
  });

  // ── Known positions from JPL Horizons ─────────────────────────
  describe('known positions from JPL Horizons', () => {
    it('2000-01-01T00:00Z: Chiron near 251.56° (+-2°)', () => {
      const pos = getChironPosition(new Date('2000-01-01T00:00:00Z'));
      expect(pos.longitude).toBeGreaterThanOrEqual(249.5);
      expect(pos.longitude).toBeLessThanOrEqual(253.5);
    });

    it('2024-06-15T00:00Z: Chiron near 22.80° (+-2°)', () => {
      const pos = getChironPosition(new Date('2024-06-15T00:00:00Z'));
      expect(pos.longitude).toBeGreaterThanOrEqual(20.8);
      expect(pos.longitude).toBeLessThanOrEqual(24.8);
    });

    it('2010-06-15T00:00Z: Chiron near 330.93° (+-2°)', () => {
      const pos = getChironPosition(new Date('2010-06-15T00:00:00Z'));
      expect(pos.longitude).toBeGreaterThanOrEqual(328.9);
      expect(pos.longitude).toBeLessThanOrEqual(332.9);
    });
  });
});
