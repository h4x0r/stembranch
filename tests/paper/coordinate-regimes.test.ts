import { describe, it, expect } from 'vitest';
import {
  computeFourRegimes,
  generateFourRegimeTable,
} from '../../src/paper/coordinate-regimes';

describe('four coordinate regime comparison', () => {
  const date = new Date('1400-06-15T12:00:00Z');

  describe('computeFourRegimes', () => {
    it('returns all four regime positions for a given tropical longitude', () => {
      const result = computeFourRegimes(75.0, date);
      expect(result).toHaveProperty('eclipticSidereal');
      expect(result).toHaveProperty('equatorialSidereal');
      expect(result).toHaveProperty('quasiEcliptic');
      expect(result).toHaveProperty('eclipticTropical');
    });

    it('ecliptic tropical equals the input tropical longitude', () => {
      const result = computeFourRegimes(75.0, date);
      expect(result.eclipticTropical.lon).toBeCloseTo(75.0, 5);
    });

    it('ecliptic sidereal is offset from tropical by ayanamsa', () => {
      const result = computeFourRegimes(75.0, date);
      expect(result.eclipticSidereal.lon).not.toBeCloseTo(75.0, 0);
      // Spica-based ayanamsa (~193° for 1400 CE): sidereal = normDeg(tropical - ayanamsa)
      // The wrapped offset is large because the Spica reference places 0° Aries ~193° from the vernal equinox
      const wrappedOffset = ((75.0 - result.eclipticSidereal.lon) + 360) % 360;
      expect(wrappedOffset).toBeGreaterThan(180);
      expect(wrappedOffset).toBeLessThan(210);
    });

    it('equatorial sidereal differs from ecliptic sidereal', () => {
      const result = computeFourRegimes(75.0, date);
      expect(result.equatorialSidereal.lon).not.toBeCloseTo(
        result.eclipticSidereal.lon, 0,
      );
    });

    it('quasi-ecliptic sign is valid 1–12', () => {
      const result = computeFourRegimes(52.0, date);
      expect(result.quasiEcliptic.sign).toBeGreaterThanOrEqual(1);
      expect(result.quasiEcliptic.sign).toBeLessThanOrEqual(12);
    });
  });

  describe('generateFourRegimeTable', () => {
    it('generates a comparison table for a set of bodies', () => {
      const bodies = [
        { name: 'Sun', tropicalLon: 83.5 },
        { name: 'Moon', tropicalLon: 220.3 },
        { name: 'Ketu (apogee)', tropicalLon: 150.0 },
        { name: 'Ketu (node)', tropicalLon: 330.0 },
      ];
      const table = generateFourRegimeTable(bodies, date);

      expect(table).toHaveLength(4);
      for (const row of table) {
        expect(row).toHaveProperty('bodyName');
        expect(row).toHaveProperty('eclipticSidereal');
        expect(row).toHaveProperty('equatorialSidereal');
        expect(row).toHaveProperty('quasiEcliptic');
        expect(row).toHaveProperty('eclipticTropical');
      }
    });

    it('demonstrates divergence between equatorial and ecliptic', () => {
      // Divergence between ecliptic and equatorial is maximal near 45°/135° from equinox
      // (at equinox and solstice points, RA = ecliptic longitude exactly)
      const bodies = [{ name: 'Test', tropicalLon: 45.0 }];
      const table = generateFourRegimeTable(bodies, date);
      const row = table[0];
      const diff = Math.abs(row.eclipticSidereal.lon - row.equatorialSidereal.lon);
      expect(diff).toBeGreaterThan(1);
    });
  });
});
