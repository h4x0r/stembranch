import { describe, it, expect } from 'vitest';
import {
  generateKetuEphemeris,
  estimateOrbitalPeriod,
} from '../../src/paper/ketu-period-analysis';

describe('Ketu period analysis', () => {
  describe('generateKetuEphemeris', () => {
    it('generates entries with valid longitudes for a date range', () => {
      const start = new Date('0806-01-01T00:00:00Z');
      const end = new Date('0806-07-01T00:00:00Z');
      const entries = generateKetuEphemeris(start, end, 30);

      expect(entries.length).toBe(7);
      for (const e of entries) {
        expect(e.apogeeLon).toBeGreaterThanOrEqual(0);
        expect(e.apogeeLon).toBeLessThan(360);
        expect(e.nodeLon).toBeGreaterThanOrEqual(0);
        expect(e.nodeLon).toBeLessThan(360);
        expect(e.divergenceDeg).toBeGreaterThanOrEqual(0);
        expect(e.divergenceDeg).toBeLessThanOrEqual(180);
      }
    });

    it('shows large divergence between apogee and node over 62 years', () => {
      const start = new Date('0806-01-01T00:00:00Z');
      const end = new Date('0868-01-01T00:00:00Z');
      const entries = generateKetuEphemeris(start, end, 60);
      const maxDiv = Math.max(...entries.map(e => e.divergenceDeg));
      expect(maxDiv).toBeGreaterThan(90);
    });
  });

  describe('estimateOrbitalPeriod', () => {
    const start = new Date('0800-01-01T00:00:00Z');
    const end = new Date('0900-01-01T00:00:00Z');
    const entries = generateKetuEphemeris(start, end, 5);

    it('estimates apogee-based Ketu period near 8.85 years', () => {
      const period = estimateOrbitalPeriod(entries, 'apogee');
      expect(period).toBeGreaterThan(8.0);
      expect(period).toBeLessThan(9.5);
    });

    it('estimates node-based Ketu period near 18.6 years', () => {
      const period = estimateOrbitalPeriod(entries, 'node');
      expect(period).toBeGreaterThan(17.5);
      expect(period).toBeLessThan(19.5);
    });

    it('apogee period is approximately half the nodal period', () => {
      const apogeePeriod = estimateOrbitalPeriod(entries, 'apogee');
      const nodalPeriod = estimateOrbitalPeriod(entries, 'node');
      const ratio = apogeePeriod / nodalPeriod;
      expect(ratio).toBeGreaterThan(0.4);
      expect(ratio).toBeLessThan(0.55);
    });
  });
});
