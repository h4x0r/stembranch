/**
 * TDD tests for extended house systems.
 *
 * Tests cover:
 * - Porphyry, Regiomontanus, Campanus, Alcabitius, Morinus, Topocentric
 * - Structural invariants (12 cusps, range [0,360), opposite cusps 180° apart)
 * - System-specific properties
 */

import { describe, it, expect } from 'vitest';
import { computeHouses, computeAscendant } from '../src/tropical-astrology';

const TEST_DATE = new Date('2024-06-15T14:30:00Z');
const TEST_LAT = 25;
const TEST_LNG = 121;

const NEW_SYSTEMS = [
  'porphyry',
  'regiomontanus',
  'campanus',
  'alcabitius',
  'morinus',
  'topocentric',
] as const;

// ── Structural invariants (shared across all new systems) ────────────────

describe.each(NEW_SYSTEMS)('computeHouses (%s) — structural invariants', (system) => {
  const result = computeHouses(TEST_DATE, TEST_LAT, TEST_LNG, system);

  it('returns 12 cusps', () => {
    expect(result.cusps).toHaveLength(12);
  });

  it('all cusps are in [0, 360)', () => {
    for (const cusp of result.cusps) {
      expect(cusp).toBeGreaterThanOrEqual(0);
      expect(cusp).toBeLessThan(360);
    }
  });

  it('ascendant is in [0, 360)', () => {
    expect(result.ascendant).toBeGreaterThanOrEqual(0);
    expect(result.ascendant).toBeLessThan(360);
  });

  it('midheaven is in [0, 360)', () => {
    expect(result.midheaven).toBeGreaterThanOrEqual(0);
    expect(result.midheaven).toBeLessThan(360);
  });

  it('opposite cusps are 180° apart', () => {
    for (let i = 0; i < 6; i++) {
      const c1 = result.cusps[i];
      const c2 = result.cusps[i + 6];
      const diff = Math.abs(c1 - c2);
      const arc = diff > 180 ? 360 - diff : diff;
      expect(arc).toBeCloseTo(180, 0);
    }
  });

  it('system property matches', () => {
    expect(result.system).toBe(system);
  });
});

// ── Porphyry-specific tests ──────────────────────────────────────────────

describe('computeHouses (porphyry) — specific', () => {
  const result = computeHouses(TEST_DATE, TEST_LAT, TEST_LNG, 'porphyry');

  it('cusp 1 equals ASC', () => {
    expect(result.cusps[0]).toBeCloseTo(result.ascendant, 6);
  });

  it('cusp 10 equals MC', () => {
    expect(result.cusps[9]).toBeCloseTo(result.midheaven, 6);
  });

  it('cusp 11 is between MC and ASC (1/3 of arc)', () => {
    const mc = result.midheaven;
    const asc = result.ascendant;
    const cusp11 = result.cusps[10];

    // The forward arc from MC to ASC
    const fullArc = ((asc - mc) % 360 + 360) % 360;
    const expectedCusp11 = (mc + fullArc / 3) % 360;
    expect(cusp11).toBeCloseTo(expectedCusp11, 4);
  });

  it('cusp 12 is between MC and ASC (2/3 of arc)', () => {
    const mc = result.midheaven;
    const asc = result.ascendant;
    const cusp12 = result.cusps[11];

    const fullArc = ((asc - mc) % 360 + 360) % 360;
    const expectedCusp12 = (mc + 2 * fullArc / 3) % 360;
    expect(cusp12).toBeCloseTo(expectedCusp12, 4);
  });
});

// ── Morinus-specific tests ───────────────────────────────────────────────

describe('computeHouses (morinus) — specific', () => {
  it('at the equator (lat=0), cusps are approximately 30° apart (within 3°)', () => {
    const result = computeHouses(TEST_DATE, 0, TEST_LNG, 'morinus');
    for (let i = 0; i < 12; i++) {
      const next = (i + 1) % 12;
      const diff = ((result.cusps[next] - result.cusps[i]) % 360 + 360) % 360;
      // Obliquity projection distorts equal equator arcs onto the ecliptic,
      // so cusps are approximately but not exactly 30° apart.
      expect(Math.abs(diff - 30)).toBeLessThan(3);
    }
  });

  it('cusps are independent of latitude (Morinus ignores lat)', () => {
    const r1 = computeHouses(TEST_DATE, 0, TEST_LNG, 'morinus');
    const r2 = computeHouses(TEST_DATE, 60, TEST_LNG, 'morinus');
    for (let i = 0; i < 12; i++) {
      expect(r1.cusps[i]).toBeCloseTo(r2.cusps[i], 4);
    }
  });
});

// ── Regiomontanus-specific tests ─────────────────────────────────────────

describe('computeHouses (regiomontanus) — specific', () => {
  const result = computeHouses(TEST_DATE, TEST_LAT, TEST_LNG, 'regiomontanus');

  it('cusp 1 equals ASC', () => {
    expect(result.cusps[0]).toBeCloseTo(result.ascendant, 6);
  });

  it('cusp 10 equals MC', () => {
    expect(result.cusps[9]).toBeCloseTo(result.midheaven, 6);
  });
});

// ── Campanus-specific tests ──────────────────────────────────────────────

describe('computeHouses (campanus) — specific', () => {
  const result = computeHouses(TEST_DATE, TEST_LAT, TEST_LNG, 'campanus');

  it('cusp 1 equals ASC', () => {
    expect(result.cusps[0]).toBeCloseTo(result.ascendant, 6);
  });

  it('cusp 10 equals MC', () => {
    expect(result.cusps[9]).toBeCloseTo(result.midheaven, 6);
  });
});

// ── Alcabitius-specific tests ────────────────────────────────────────────

describe('computeHouses (alcabitius) — specific', () => {
  const result = computeHouses(TEST_DATE, TEST_LAT, TEST_LNG, 'alcabitius');

  it('cusp 1 equals ASC', () => {
    expect(result.cusps[0]).toBeCloseTo(result.ascendant, 6);
  });

  it('cusp 10 equals MC', () => {
    expect(result.cusps[9]).toBeCloseTo(result.midheaven, 6);
  });
});

// ── Topocentric-specific tests ───────────────────────────────────────────

describe('computeHouses (topocentric) — specific', () => {
  const result = computeHouses(TEST_DATE, TEST_LAT, TEST_LNG, 'topocentric');

  it('cusp 1 equals ASC', () => {
    expect(result.cusps[0]).toBeCloseTo(result.ascendant, 6);
  });

  it('cusp 10 equals MC', () => {
    expect(result.cusps[9]).toBeCloseTo(result.midheaven, 6);
  });

  it('cusps progress in zodiacal order (no backward jumps > 180°)', () => {
    for (let i = 0; i < 12; i++) {
      const next = (i + 1) % 12;
      const arc = ((result.cusps[next] - result.cusps[i]) % 360 + 360) % 360;
      // Each cusp should advance forward by less than 180°
      expect(arc).toBeGreaterThan(0);
      expect(arc).toBeLessThan(180);
    }
  });
});

// ── computeAscendant export test ─────────────────────────────────────────

describe('computeAscendant (exported)', () => {
  it('is a function', () => {
    expect(typeof computeAscendant).toBe('function');
  });

  it('returns a number in [0, 360)', () => {
    const DEG_TO_RAD = Math.PI / 180;
    const result = computeAscendant(
      100 * DEG_TO_RAD,  // lstRad
      23.44 * DEG_TO_RAD, // epsRad
      25 * DEG_TO_RAD,    // latRad
    );
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(360);
  });
});
