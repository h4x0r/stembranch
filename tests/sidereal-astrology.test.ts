/**
 * Tests for Sidereal Astrology (Jyotish / Vedic Astrology) module.
 *
 * Covers:
 * - Lahiri ayanamsa computation (Chitrapaksha system)
 * - Nakshatra determination and pada calculation
 * - Vimshottari dasha period computation
 * - Divisional charts (D-1, D-9, D-10)
 * - Full sidereal chart computation
 */

import { describe, it, expect } from 'vitest';
import {
  getLahiriAyanamsa,
  getNakshatra,
  computeVimshottariDashas,
  computeDivisionalChart,
  computeSiderealChart,
} from '../src/sidereal-astrology';

describe('Sidereal Astrology (Jyotish)', () => {
  describe('getLahiriAyanamsa', () => {
    it('returns ~23°51\' for J2000 (2000-01-01)', () => {
      const date = new Date('2000-01-01T12:00:00Z');
      const ayanamsa = getLahiriAyanamsa(date);
      // Lahiri ayanamsa for J2000 ≈ 23.856° (23°51'22")
      expect(ayanamsa).toBeCloseTo(23.856, 0);
    });

    it('returns ~24.17° for 2024', () => {
      const date = new Date('2024-01-01T12:00:00Z');
      const ayanamsa = getLahiriAyanamsa(date);
      // Lahiri for 2024 ≈ 24.17° (published tables)
      expect(ayanamsa).toBeCloseTo(24.17, 0);
    });

    it('increases over time (precession)', () => {
      const d1 = new Date('2000-01-01T12:00:00Z');
      const d2 = new Date('2024-01-01T12:00:00Z');
      expect(getLahiriAyanamsa(d2)).toBeGreaterThan(getLahiriAyanamsa(d1));
    });
  });

  describe('getNakshatra', () => {
    it('0° sidereal → Ashwini', () => {
      const result = getNakshatra(0);
      expect(result.nakshatra).toBe('Ashwini');
      expect(result.pada).toBe(1);
    });

    it('13°20\' → Bharani pada 1', () => {
      const result = getNakshatra(13 + 20/60);
      expect(result.nakshatra).toBe('Bharani');
      expect(result.pada).toBe(1);
    });

    it('3°20\' → Ashwini pada 2', () => {
      const result = getNakshatra(3 + 20/60);
      expect(result.pada).toBe(2);
    });

    it('6°40\' → Ashwini pada 3', () => {
      const result = getNakshatra(6 + 40/60);
      expect(result.pada).toBe(3);
    });

    it('10°00\' → Ashwini pada 4', () => {
      const result = getNakshatra(10);
      expect(result.pada).toBe(4);
    });

    it('covers all 27 nakshatras', () => {
      const nakshatraWidth = 360 / 27; // 13°20'
      const seen = new Set<string>();
      for (let i = 0; i < 27; i++) {
        const result = getNakshatra(i * nakshatraWidth + 0.1);
        seen.add(result.nakshatra);
      }
      expect(seen.size).toBe(27);
    });

    it('handles wrap-around near 360°', () => {
      const result = getNakshatra(359.9);
      expect(result.nakshatra).toBe('Revati');
    });
  });

  describe('computeVimshottariDashas', () => {
    it('returns dasha periods that sum to 120 years', () => {
      const birthDate = new Date('1990-01-15T06:00:00Z');
      // Moon at ~0° sidereal Aries (Ashwini) → Ketu mahadasha start
      const dashas = computeVimshottariDashas(0, birthDate);
      const totalYears = dashas.reduce((sum, d) => sum + d.years, 0);
      expect(totalYears).toBe(120);
    });

    it('starts with correct dasha lord for Ashwini nakshatra', () => {
      const birthDate = new Date('1990-01-15T06:00:00Z');
      const dashas = computeVimshottariDashas(0, birthDate);
      // Ashwini → Ketu
      expect(dashas[0].planet).toBe('Ketu');
    });

    it('has 9 mahadasha periods', () => {
      const birthDate = new Date('1990-01-15T06:00:00Z');
      const dashas = computeVimshottariDashas(100, birthDate);
      expect(dashas).toHaveLength(9);
    });

    it('first period is partially elapsed based on Moon position', () => {
      const birthDate = new Date('1990-01-15T06:00:00Z');
      // Moon at 6°40' (middle of Ashwini) → half of Ketu dasha elapsed
      const dashas = computeVimshottariDashas(6 + 40/60, birthDate);
      expect(dashas[0].planet).toBe('Ketu');
      // Full Ketu = 7 years, half elapsed ≈ 3.5 years remaining
      expect(dashas[0].years).toBeCloseTo(3.5, 0);
    });

    it('each dasha has correct start/end dates', () => {
      const birthDate = new Date('1990-01-15T06:00:00Z');
      const dashas = computeVimshottariDashas(0, birthDate);
      // First dasha starts at birth
      expect(dashas[0].startDate.getTime()).toBe(birthDate.getTime());
      // Each subsequent dasha starts when previous ends
      for (let i = 1; i < dashas.length; i++) {
        expect(dashas[i].startDate.getTime()).toBe(dashas[i-1].endDate.getTime());
      }
    });

    it('Bharani nakshatra → Venus mahadasha', () => {
      const birthDate = new Date('1990-01-15T06:00:00Z');
      const dashas = computeVimshottariDashas(13.5, birthDate);
      expect(dashas[0].planet).toBe('Venus');
    });
  });

  describe('computeDivisionalChart', () => {
    it('D1 (Rasi) returns same signs as sidereal positions', () => {
      const positions = [
        { body: 'Sun', tropicalLongitude: 280, siderealLongitude: 256, sign: 'Sagittarius' as const, signDegree: 16, nakshatra: 'Purva Ashadha' as const, nakshatraPada: 3 as const },
      ];
      const d1 = computeDivisionalChart(positions, 'D1');
      expect(d1.positions[0].sign).toBe('Sagittarius');
    });

    it('D9 (Navamsa) computes correct sign for 0° Aries', () => {
      const positions = [
        { body: 'Sun', tropicalLongitude: 24, siderealLongitude: 0, sign: 'Aries' as const, signDegree: 0, nakshatra: 'Ashwini' as const, nakshatraPada: 1 as const },
      ];
      const d9 = computeDivisionalChart(positions, 'D9');
      // 0° Aries → Navamsa Aries (fire sign starts from Aries)
      expect(d9.positions[0].sign).toBe('Aries');
    });

    it('D9 divides each sign into 9 parts of 3°20\'', () => {
      // At 8° Aries → 3rd Navamsa (6°40' to 10°00') → Gemini
      const positions = [
        { body: 'Sun', tropicalLongitude: 32, siderealLongitude: 8, sign: 'Aries' as const, signDegree: 8, nakshatra: 'Ashwini' as const, nakshatraPada: 3 as const },
      ];
      const d9 = computeDivisionalChart(positions, 'D9');
      expect(d9.positions[0].sign).toBe('Gemini');
    });

    it('D10 (Dasamsa) returns correct sign for career analysis', () => {
      const positions = [
        { body: 'Sun', tropicalLongitude: 24, siderealLongitude: 0, sign: 'Aries' as const, signDegree: 0, nakshatra: 'Ashwini' as const, nakshatraPada: 1 as const },
      ];
      const d10 = computeDivisionalChart(positions, 'D10');
      // 0° of odd sign (Aries) → starts from same sign
      expect(d10.positions[0].sign).toBe('Aries');
    });
  });

  describe('computeSiderealChart', () => {
    const testDate = new Date('2024-06-15T14:30:00Z');
    const lat = 28.6139; // New Delhi
    const lng = 77.2090;

    it('returns ayanamsa value', () => {
      const chart = computeSiderealChart(testDate, lat, lng);
      expect(chart.ayanamsa).toBeGreaterThan(23);
      expect(chart.ayanamsa).toBeLessThan(25);
    });

    it('returns positions for Sun, Moon, and planets', () => {
      const chart = computeSiderealChart(testDate, lat, lng);
      expect(chart.positions.length).toBeGreaterThanOrEqual(9); // Sun + Moon + 7 planets (excl. Pluto optionally)
      const bodies = chart.positions.map(p => p.body);
      expect(bodies).toContain('Sun');
      expect(bodies).toContain('Moon');
      expect(bodies).toContain('Mars');
    });

    it('sidereal longitude = tropical - ayanamsa', () => {
      const chart = computeSiderealChart(testDate, lat, lng);
      for (const pos of chart.positions) {
        const expected = ((pos.tropicalLongitude - chart.ayanamsa) % 360 + 360) % 360;
        expect(pos.siderealLongitude).toBeCloseTo(expected, 4);
      }
    });

    it('returns Vimshottari dashas based on Moon', () => {
      const chart = computeSiderealChart(testDate, lat, lng);
      expect(chart.dashas.length).toBe(9);
      const totalYears = chart.dashas.reduce((sum, d) => sum + d.years, 0);
      // First period is partial (based on Moon's position within its nakshatra),
      // so total is ≤ 120 but always > 100 (maximum reduction is one full dasha of 20 years)
      expect(totalYears).toBeLessThanOrEqual(120);
      expect(totalYears).toBeGreaterThan(100);
    });

    it('returns D1, D9, and D10 divisional charts', () => {
      const chart = computeSiderealChart(testDate, lat, lng);
      expect(chart.divisionalCharts).toHaveLength(3);
      const types = chart.divisionalCharts.map(c => c.type);
      expect(types).toContain('D1');
      expect(types).toContain('D9');
      expect(types).toContain('D10');
    });

    it('each position has valid nakshatra and pada', () => {
      const chart = computeSiderealChart(testDate, lat, lng);
      for (const pos of chart.positions) {
        expect(pos.nakshatra).toBeDefined();
        expect(pos.nakshatraPada).toBeGreaterThanOrEqual(1);
        expect(pos.nakshatraPada).toBeLessThanOrEqual(4);
      }
    });
  });
});
