import { describe, it, expect } from 'vitest';
import { findAspects, findParallelAspects } from '../src/tropical-astrology';
import type { TropicalPosition } from '../src/tropical-astrology';

function makePos(body: string, longitude: number, speed = 0): TropicalPosition {
  return {
    body,
    longitude,
    latitude: 0,
    sign: 'Aries', // placeholder
    signDegree: 0,
    house: 1,
    dignity: null,
  };
}

describe('extended aspect types', () => {
  it('detects semi-sextile at ~30° separation', () => {
    const positions = [makePos('Sun', 10), makePos('Moon', 40)];
    const aspects = findAspects(positions);
    const found = aspects.find(a => a.type === 'semi-sextile');
    expect(found).toBeDefined();
    expect(found!.angle).toBe(30);
    expect(found!.orb).toBeCloseTo(0, 0);
    expect(found!.major).toBe(false);
  });

  it('detects quincunx at ~150° separation', () => {
    const positions = [makePos('Sun', 10), makePos('Moon', 160)];
    const aspects = findAspects(positions);
    const found = aspects.find(a => a.type === 'quincunx');
    expect(found).toBeDefined();
    expect(found!.angle).toBe(150);
    expect(found!.major).toBe(false);
  });

  it('detects semi-square at ~45° separation', () => {
    const positions = [makePos('Sun', 10), makePos('Moon', 55)];
    const aspects = findAspects(positions);
    const found = aspects.find(a => a.type === 'semi-square');
    expect(found).toBeDefined();
    expect(found!.angle).toBe(45);
  });

  it('detects sesquiquadrate at ~135° separation', () => {
    const positions = [makePos('Sun', 10), makePos('Moon', 145)];
    const aspects = findAspects(positions);
    const found = aspects.find(a => a.type === 'sesquiquadrate');
    expect(found).toBeDefined();
    expect(found!.angle).toBe(135);
  });

  it('detects quintile at ~72° separation', () => {
    const positions = [makePos('Sun', 10), makePos('Moon', 82)];
    const aspects = findAspects(positions);
    const found = aspects.find(a => a.type === 'quintile');
    expect(found).toBeDefined();
    expect(found!.angle).toBe(72);
  });

  it('detects biquintile at ~144° separation', () => {
    const positions = [makePos('Sun', 10), makePos('Moon', 154)];
    const aspects = findAspects(positions);
    const found = aspects.find(a => a.type === 'biquintile');
    expect(found).toBeDefined();
    expect(found!.angle).toBe(144);
  });

  it('minor aspects use tighter default orbs than major', () => {
    // At 32° separation: within 2° of semi-sextile (30°) but outside 8° of conjunction (0°)
    const positions = [makePos('Sun', 0), makePos('Moon', 32)];
    const aspects = findAspects(positions);
    const semiSextile = aspects.find(a => a.type === 'semi-sextile');
    expect(semiSextile).toBeDefined();
    expect(semiSextile!.orb).toBeCloseTo(2, 0);

    // At 33° separation: outside 2° orb for semi-sextile
    const positions2 = [makePos('Sun', 0), makePos('Moon', 33)];
    const aspects2 = findAspects(positions2);
    const semiSextile2 = aspects2.find(a => a.type === 'semi-sextile');
    expect(semiSextile2).toBeUndefined();
  });
});

describe('major flag', () => {
  it('conjunction is major', () => {
    const positions = [makePos('Sun', 10), makePos('Moon', 12)];
    const aspects = findAspects(positions);
    const conj = aspects.find(a => a.type === 'conjunction');
    expect(conj).toBeDefined();
    expect(conj!.major).toBe(true);
  });

  it('opposition is major', () => {
    const positions = [makePos('Sun', 10), makePos('Moon', 190)];
    const aspects = findAspects(positions);
    const opp = aspects.find(a => a.type === 'opposition');
    expect(opp).toBeDefined();
    expect(opp!.major).toBe(true);
  });

  it('trine is major', () => {
    const positions = [makePos('Sun', 10), makePos('Moon', 130)];
    const aspects = findAspects(positions);
    const tri = aspects.find(a => a.type === 'trine');
    expect(tri).toBeDefined();
    expect(tri!.major).toBe(true);
  });

  it('semi-sextile is minor', () => {
    const positions = [makePos('Sun', 10), makePos('Moon', 40)];
    const aspects = findAspects(positions);
    const ss = aspects.find(a => a.type === 'semi-sextile');
    expect(ss).toBeDefined();
    expect(ss!.major).toBe(false);
  });
});

describe('applying / separating detection', () => {
  it('detects applying aspect when speeds close the orb', () => {
    // Sun at 5°, Moon at 12°: conjunction with 7° orb
    // Sun speed 1°/day, Moon speed 13°/day — Moon closing gap → applying
    const positions = [makePos('Sun', 5), makePos('Moon', 12)];
    const speeds: Record<string, number> = { Sun: 1, Moon: 13 };
    const aspects = findAspects(positions, undefined, speeds);
    const conj = aspects.find(a => a.type === 'conjunction');
    expect(conj).toBeDefined();
    // Moon is ahead and faster: separating (moving away from conjunction)
    // Actually: Sun at 5°, Moon at 12°, Moon moving faster (13°/day vs 1°/day)
    // Moon is AHEAD of Sun, and moving FASTER → separating from conjunction
    expect(conj!.applying).toBe(false);
  });

  it('detects applying when slower planet is ahead', () => {
    // Sun at 12°, Moon at 5°: conjunction with 7° orb
    // Moon at lower longitude, Sun ahead, Moon faster → Moon approaching Sun → applying
    const positions = [makePos('Moon', 5), makePos('Sun', 12)];
    const speeds: Record<string, number> = { Moon: 13, Sun: 1 };
    const aspects = findAspects(positions, undefined, speeds);
    const conj = aspects.find(a => a.type === 'conjunction');
    expect(conj).toBeDefined();
    expect(conj!.applying).toBe(true);
  });

  it('defaults applying to true when no speeds provided', () => {
    const positions = [makePos('Sun', 5), makePos('Moon', 12)];
    const aspects = findAspects(positions);
    const conj = aspects.find(a => a.type === 'conjunction');
    expect(conj).toBeDefined();
    expect(conj!.applying).toBe(true); // default
  });
});

describe('findParallelAspects', () => {
  it('detects parallel (same declination hemisphere)', () => {
    const bodies = [
      { body: 'Sun', declination: 20 },
      { body: 'Moon', declination: 20.5 },
    ];
    const parallels = findParallelAspects(bodies);
    expect(parallels).toHaveLength(1);
    expect(parallels[0].type).toBe('parallel');
    expect(parallels[0].orb).toBeCloseTo(0.5, 1);
  });

  it('detects contra-parallel (opposite declination)', () => {
    const bodies = [
      { body: 'Sun', declination: 20 },
      { body: 'Moon', declination: -20.3 },
    ];
    const parallels = findParallelAspects(bodies);
    expect(parallels).toHaveLength(1);
    expect(parallels[0].type).toBe('contra-parallel');
    expect(parallels[0].orb).toBeCloseTo(0.3, 1);
  });

  it('returns empty when no parallels within orb', () => {
    const bodies = [
      { body: 'Sun', declination: 20 },
      { body: 'Moon', declination: 10 },
    ];
    const parallels = findParallelAspects(bodies);
    expect(parallels).toHaveLength(0);
  });

  it('uses custom orb', () => {
    const bodies = [
      { body: 'Sun', declination: 20 },
      { body: 'Moon', declination: 18.5 },
    ];
    // Default orb (1°) wouldn't match, but 2° orb should
    expect(findParallelAspects(bodies, 1)).toHaveLength(0);
    expect(findParallelAspects(bodies, 2)).toHaveLength(1);
  });

  it('can find both parallel and contra-parallel in one set', () => {
    const bodies = [
      { body: 'Sun', declination: 20 },
      { body: 'Moon', declination: 20.3 },
      { body: 'Mars', declination: -19.8 },
    ];
    const parallels = findParallelAspects(bodies);
    // Sun-Moon: parallel (0.3°), Sun-Mars: contra-parallel (0.2°), Moon-Mars: contra-parallel (0.5°)
    expect(parallels).toHaveLength(3);
    const types = parallels.map(p => p.type);
    expect(types).toContain('parallel');
    expect(types).toContain('contra-parallel');
  });
});
