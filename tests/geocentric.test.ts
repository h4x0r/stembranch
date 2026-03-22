import { describe, it, expect } from 'vitest';
import {
  helioToGeo, lightTimeCorrected,
  type HeliocentricPosition,
} from '../src/planets/geocentric';
import { evaluateVsopSeries } from '../src/vsop87d-earth';
import { EARTH_L, EARTH_B, EARTH_R } from '../src/vsop87d-earth';
import { VENUS_L, VENUS_B, VENUS_R } from '../src/planets/vsop87d-venus';
import { MARS_L, MARS_B, MARS_R } from '../src/planets/vsop87d-mars';

function earthHelio(tau: number): HeliocentricPosition {
  return {
    L: evaluateVsopSeries(EARTH_L, tau),
    B: evaluateVsopSeries(EARTH_B, tau),
    R: evaluateVsopSeries(EARTH_R, tau),
  };
}

describe('helioToGeo', () => {
  it('converts Venus helio to geocentric at t=0', () => {
    const venus: HeliocentricPosition = {
      L: evaluateVsopSeries(VENUS_L, 0),
      B: evaluateVsopSeries(VENUS_B, 0),
      R: evaluateVsopSeries(VENUS_R, 0),
    };
    const earth = earthHelio(0);
    const geo = helioToGeo(venus, earth);

    // Geocentric ecliptic longitude should be a valid angle
    expect(geo.longitude).toBeGreaterThanOrEqual(0);
    expect(geo.longitude).toBeLessThan(2 * Math.PI);
    // Distance should be between 0.2 and 1.8 AU
    expect(geo.distance).toBeGreaterThan(0.2);
    expect(geo.distance).toBeLessThan(1.8);
  });

  it('produces valid latitude', () => {
    const mars: HeliocentricPosition = {
      L: evaluateVsopSeries(MARS_L, 0),
      B: evaluateVsopSeries(MARS_B, 0),
      R: evaluateVsopSeries(MARS_R, 0),
    };
    const earth = earthHelio(0);
    const geo = helioToGeo(mars, earth);

    // Geocentric latitude within ±90° (±π/2 radians)
    expect(Math.abs(geo.latitude)).toBeLessThan(Math.PI / 2);
  });
});

describe('lightTimeCorrected', () => {
  it('returns a slightly different position than without correction', () => {
    const tau = 0;
    const getPlanetHelio = (t: number): HeliocentricPosition => ({
      L: evaluateVsopSeries(MARS_L, t),
      B: evaluateVsopSeries(MARS_B, t),
      R: evaluateVsopSeries(MARS_R, t),
    });
    const earth = earthHelio(tau);
    const uncorrected = helioToGeo(getPlanetHelio(tau), earth);
    const corrected = lightTimeCorrected(getPlanetHelio, earth, tau);

    // Should be slightly different (light-time for Mars ~3-22 minutes)
    expect(corrected.longitude).not.toBeCloseTo(uncorrected.longitude, 6);
    // But not drastically different
    const diff = Math.abs(corrected.longitude - uncorrected.longitude);
    expect(diff).toBeLessThan(0.01); // < 0.01 radians ≈ 0.57°
  });
});
