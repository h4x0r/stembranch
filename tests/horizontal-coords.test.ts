import { describe, it, expect } from 'vitest';
import { equatorialToHorizontal } from '../src/astro';

describe('equatorialToHorizontal', () => {
  it('star at zenith when dec equals latitude at meridian transit', () => {
    // RA=90° (6h), dec=+40°, LST=90° (HA=0), lat=+40°
    // dec === lat → star passes through zenith → altitude = 90°
    const result = equatorialToHorizontal(90, 40, 90, 40);
    expect(result.altitude).toBeCloseTo(90, 4);
    // At zenith, azimuth is mathematically undefined; accept any value
  });

  it('star due south at meridian with dec < lat', () => {
    // dec=+20°, HA=0 (LST=RA), lat=+40°
    // Altitude = 90° - |lat - dec| = 90° - 20° = 70°
    // Azimuth = 180° (due south)
    const ra = 45; // arbitrary RA
    const result = equatorialToHorizontal(ra, 20, ra, 40);
    expect(result.altitude).toBeCloseTo(70, 4);
    expect(result.azimuth).toBeCloseTo(180, 4);
  });

  it('star on the horizon setting in the west', () => {
    // dec=0°, lat=0°, HA=90° → sin(alt) = 0, alt = 0°
    // HA = LST - RA = 90° → LST = RA + 90°
    // Star is setting in the west → azimuth ≈ 270°
    const ra = 0;
    const result = equatorialToHorizontal(ra, 0, 90, 0);
    expect(result.altitude).toBeCloseTo(0, 4);
    expect(result.azimuth).toBeCloseTo(270, 4);
  });

  it('circumpolar star below pole is still above horizon', () => {
    // dec=+80°, lat=+45°, HA=180° (below pole, at lower culmination)
    // sin(alt) = sin(80°)sin(45°) + cos(80°)cos(45°)cos(180°)
    //          = 0.9848·0.7071 + 0.1736·0.7071·(-1)
    //          = 0.6964 - 0.1228 = 0.5736
    // alt = asin(0.5736) ≈ 35.0°
    const ra = 0;
    const lst = 180; // HA = 180 - 0 = 180°
    const result = equatorialToHorizontal(ra, 80, lst, 45);
    expect(result.altitude).toBeCloseTo(35.0, 0);
    expect(result.altitude).toBeGreaterThan(0); // still above horizon
    // Azimuth should be ~0° (due north, below pole)
    expect(result.azimuth).toBeCloseTo(0, 0);
  });

  it('star rising due east at equatorial latitude', () => {
    // dec=0°, lat=45°, HA=-90° (star rising)
    // At HA=-90 on celestial equator, star is exactly on the eastern horizon
    // RA=90, LST=0 → HA = LST - RA = -90°
    const result = equatorialToHorizontal(90, 0, 0, 45);
    expect(result.altitude).toBeCloseTo(0, 4);
    expect(result.azimuth).toBeCloseTo(90, 4); // due east
  });
});
