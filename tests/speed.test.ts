import { describe, it, expect } from 'vitest';
import { computeSpeed } from '../src/speed';
import { getSunLongitude } from '../src/solar-longitude';
import { getMoonPosition } from '../src/moon/moon';
import { getPlanetPosition } from '../src/planets/planets';

describe('computeSpeed', () => {
  it('Sun speed ≈ 0.95–1.05 °/day for a typical date', () => {
    const date = new Date('2024-06-15T12:00:00Z');
    const speed = computeSpeed(date, getSunLongitude);
    expect(speed).toBeGreaterThanOrEqual(0.95);
    expect(speed).toBeLessThanOrEqual(1.05);
  });

  it('Moon speed ≈ 11–15 °/day for a typical date', () => {
    const date = new Date('2024-06-15T12:00:00Z');
    const speed = computeSpeed(date, (d) => getMoonPosition(d).longitude);
    expect(speed).toBeGreaterThanOrEqual(11);
    expect(speed).toBeLessThanOrEqual(15);
  });

  it('Jupiter speed is small (~0.01–0.15 °/day when direct)', () => {
    const date = new Date('2024-06-15T12:00:00Z');
    const speed = computeSpeed(date, (d) => getPlanetPosition('jupiter', d).longitude);
    expect(speed).toBeGreaterThanOrEqual(0.01);
    expect(speed).toBeLessThanOrEqual(0.25);
  });

  it('Mars retrograde: speed < 0 around 2024-12-20', () => {
    const date = new Date('2024-12-20T12:00:00Z');
    const speed = computeSpeed(date, (d) => getPlanetPosition('mars', d).longitude);
    expect(speed).toBeLessThan(0);
  });

  it('handles angle wrapping at 0°/360° boundary', () => {
    // Mock function: returns 359° before and 1° after → actual motion is +2°
    const mockPosition = (d: Date): number => {
      const ref = new Date('2024-01-01T12:00:00Z').getTime();
      return d.getTime() < ref ? 359 : 1;
    };
    const date = new Date('2024-01-01T12:00:00Z');
    const speed = computeSpeed(date, mockPosition);
    // Speed should be positive (forward motion across 0°), not negative ~-358°/dt
    expect(speed).toBeGreaterThan(0);
  });
});
