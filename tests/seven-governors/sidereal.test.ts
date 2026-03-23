import { describe, it, expect } from 'vitest';
import { toSiderealLongitude } from '../../src/seven-governors';

describe('toSiderealLongitude', () => {
  const j2000 = new Date('2000-01-01T12:00:00Z');

  describe('modern mode (default)', () => {
    it('Spica tropical lon → sidereal ~0°', () => {
      const sid = toSiderealLongitude(201.298, j2000);
      // Result is ~359.9997° which is correct (essentially 0° mod 360)
      // Check that distance to 0° on the circle is within 0.5°
      const distToZero = Math.min(sid, 360 - sid);
      expect(distToZero).toBeLessThan(0.5);
    });

    it('tropical 0° → sidereal ≈ 158.7°', () => {
      const sid = toSiderealLongitude(0, j2000);
      expect(sid).toBeCloseTo(158.7, 0);
    });

    it('wraps around correctly', () => {
      const sid = toSiderealLongitude(201.0, j2000);
      expect(sid).toBeGreaterThan(358);
      expect(sid).toBeLessThan(361);
    });

    it('precession shifts sidereal origin over time', () => {
      const y2100 = new Date('2100-01-01T12:00:00Z');
      const sid2000 = toSiderealLongitude(201.298, j2000);
      const sid2100 = toSiderealLongitude(201.298, y2100);
      expect(sid2100).toBeLessThan(sid2000);
      expect(sid2000 - sid2100).toBeCloseTo(1.397, 0);
    });
  });

  describe('classical mode', () => {
    it('kaiyuan epoch freezes precession at 724 CE', () => {
      const sid = toSiderealLongitude(201.298, j2000, { type: 'classical', epoch: 'kaiyuan' });
      // 724 CE is ~1276 years before J2000, precession ≈ 50.3"/yr → ~17.8° less
      expect(sid).toBeGreaterThan(15);
      expect(sid).toBeLessThan(20);
    });
  });

  describe('ayanamsa mode', () => {
    it('subtracts fixed offset', () => {
      const sid = toSiderealLongitude(100, j2000, { type: 'ayanamsa', value: 24.0 });
      expect(sid).toBeCloseTo(76.0, 6);
    });

    it('wraps negative values', () => {
      const sid = toSiderealLongitude(10, j2000, { type: 'ayanamsa', value: 24.0 });
      expect(sid).toBeCloseTo(346.0, 6);
    });
  });
});
