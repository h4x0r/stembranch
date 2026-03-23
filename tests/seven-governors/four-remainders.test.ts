import { describe, it, expect } from 'vitest';
import {
  getRahuPosition, getKetuPosition,
  getYuebeiPosition, getPurpleQiPosition,
} from '../../src/seven-governors';

describe('getRahuPosition (羅睺)', () => {
  it('returns longitude in [0, 360)', () => {
    const pos = getRahuPosition(new Date('2000-01-01T12:00:00Z'));
    expect(pos.longitude).toBeGreaterThanOrEqual(0);
    expect(pos.longitude).toBeLessThan(360);
  });

  it('latitude is 0', () => {
    expect(getRahuPosition(new Date('2000-01-01T12:00:00Z')).latitude).toBe(0);
  });

  it('J2000.0 node longitude ≈ 125°', () => {
    const pos = getRahuPosition(new Date('2000-01-01T12:00:00Z'));
    expect(pos.longitude).toBeCloseTo(125.04, 0);
  });

  it('moves retrograde (~19.35° per year)', () => {
    const p0 = getRahuPosition(new Date('2000-01-01T12:00:00Z'));
    const p1 = getRahuPosition(new Date('2001-01-01T12:00:00Z'));
    let diff = p0.longitude - p1.longitude;
    if (diff < 0) diff += 360;
    expect(diff).toBeCloseTo(19.35, 0);
  });

  it('completes cycle in ~18.61 years', () => {
    const p0 = getRahuPosition(new Date('2000-01-01T12:00:00Z'));
    const p1 = getRahuPosition(new Date('2018-08-11T00:00:00Z'));
    let diff = Math.abs(p0.longitude - p1.longitude);
    if (diff > 180) diff = 360 - diff;
    expect(diff).toBeLessThan(5);
  });
});

describe('getKetuPosition (計都)', () => {
  it('J2000.0 apogee ≈ 263° (±10° for perturbations)', () => {
    const pos = getKetuPosition(new Date('2000-01-01T12:00:00Z'));
    expect(pos.longitude).toBeGreaterThan(250);
    expect(pos.longitude).toBeLessThan(280);
  });

  it('latitude is 0', () => {
    expect(getKetuPosition(new Date('2000-01-01T12:00:00Z')).latitude).toBe(0);
  });

  it('moves prograde (~40.7°/year)', () => {
    const k1 = getKetuPosition(new Date('2000-01-01T12:00:00Z'));
    const k2 = getKetuPosition(new Date('2001-01-01T12:00:00Z'));
    let diff = k2.longitude - k1.longitude;
    if (diff < 0) diff += 360;
    expect(diff).toBeCloseTo(40.7, -1);
  });

  it('descending-node mode returns Rahu + 180°', () => {
    const date = new Date('2000-01-01T12:00:00Z');
    const ketuDN = getKetuPosition(date, 'descending-node');
    const rahu = getRahuPosition(date);
    const expected = (rahu.longitude + 180) % 360;
    expect(ketuDN.longitude).toBeCloseTo(expected, 6);
  });
});

describe('getYuebeiPosition (月孛)', () => {
  it('J2000.0 mean apogee ≈ 263°', () => {
    const pos = getYuebeiPosition(new Date('2000-01-01T12:00:00Z'));
    expect(pos.longitude).toBeCloseTo(263.35, 0);
  });

  it('differs from Ketu (osculating has perturbations)', () => {
    const date = new Date('2010-06-15T00:00:00Z');
    const ketu = getKetuPosition(date);
    const yuebei = getYuebeiPosition(date);
    const diff = Math.abs(ketu.longitude - yuebei.longitude);
    expect(diff).toBeGreaterThan(0.1);
    expect(diff).toBeLessThan(40);
  });
});

describe('getPurpleQiPosition (紫氣)', () => {
  it('returns longitude in [0, 360)', () => {
    const pos = getPurpleQiPosition(new Date('2000-01-01T12:00:00Z'));
    expect(pos.longitude).toBeGreaterThanOrEqual(0);
    expect(pos.longitude).toBeLessThan(360);
  });

  it('latitude is 0', () => {
    expect(getPurpleQiPosition(new Date('2000-01-01T12:00:00Z')).latitude).toBe(0);
  });

  it('moves prograde (~12.86°/year)', () => {
    const p1 = getPurpleQiPosition(new Date('2000-01-01T12:00:00Z'));
    const p2 = getPurpleQiPosition(new Date('2001-01-01T12:00:00Z'));
    let diff = p2.longitude - p1.longitude;
    if (diff < 0) diff += 360;
    expect(diff).toBeCloseTo(12.86, 0);
  });

  it('completes full cycle in ~28 years', () => {
    const p1 = getPurpleQiPosition(new Date('2000-01-01T12:00:00Z'));
    const p2 = getPurpleQiPosition(new Date('2028-01-01T12:00:00Z'));
    let diff = Math.abs(p1.longitude - p2.longitude);
    if (diff > 180) diff = 360 - diff;
    expect(diff).toBeLessThan(5);
  });
});
