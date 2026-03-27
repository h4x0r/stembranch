/**
 * TDD tests for tropical astrology module.
 *
 * Tests cover:
 * - Zodiac sign determination from ecliptic longitude
 * - House cusp calculation (Equal, Whole-sign, Placidus, Koch)
 * - Aspect detection between celestial bodies
 * - Classical dignity lookup
 * - Full tropical chart computation
 */

import { describe, it, expect } from 'vitest';
import {
  getZodiacSign,
  computeHouses,
  findAspects,
  getDignity,
  computeTropicalChart,
  type ZodiacSign,
  type HouseSystem,
  type AspectName,
  type Dignity,
  type TropicalPosition,
  type TropicalAspect,
  type HouseCusps,
  type TropicalChart,
} from '../src/tropical-astrology';

// ── getZodiacSign ────────────────────────────────────────────────────────

describe('getZodiacSign', () => {
  it('returns Aries for 0 degrees', () => {
    const result = getZodiacSign(0);
    expect(result.sign).toBe('Aries');
    expect(result.degree).toBeCloseTo(0, 5);
  });

  it('returns Taurus for 30 degrees', () => {
    const result = getZodiacSign(30);
    expect(result.sign).toBe('Taurus');
    expect(result.degree).toBeCloseTo(0, 5);
  });

  it('returns Taurus for 59.99 degrees', () => {
    const result = getZodiacSign(59.99);
    expect(result.sign).toBe('Taurus');
    expect(result.degree).toBeCloseTo(29.99, 2);
  });

  it('returns Gemini for 60 degrees', () => {
    const result = getZodiacSign(60);
    expect(result.sign).toBe('Gemini');
    expect(result.degree).toBeCloseTo(0, 5);
  });

  it('returns Cancer for 90 degrees', () => {
    const result = getZodiacSign(90);
    expect(result.sign).toBe('Cancer');
    expect(result.degree).toBeCloseTo(0, 5);
  });

  it('returns Leo for 120 degrees', () => {
    const result = getZodiacSign(120);
    expect(result.sign).toBe('Leo');
    expect(result.degree).toBeCloseTo(0, 5);
  });

  it('returns Virgo for 150 degrees', () => {
    const result = getZodiacSign(150);
    expect(result.sign).toBe('Virgo');
    expect(result.degree).toBeCloseTo(0, 5);
  });

  it('returns Libra for 180 degrees', () => {
    const result = getZodiacSign(180);
    expect(result.sign).toBe('Libra');
    expect(result.degree).toBeCloseTo(0, 5);
  });

  it('returns Scorpio for 210 degrees', () => {
    const result = getZodiacSign(210);
    expect(result.sign).toBe('Scorpio');
    expect(result.degree).toBeCloseTo(0, 5);
  });

  it('returns Sagittarius for 240 degrees', () => {
    const result = getZodiacSign(240);
    expect(result.sign).toBe('Sagittarius');
    expect(result.degree).toBeCloseTo(0, 5);
  });

  it('returns Capricorn for 270 degrees', () => {
    const result = getZodiacSign(270);
    expect(result.sign).toBe('Capricorn');
    expect(result.degree).toBeCloseTo(0, 5);
  });

  it('returns Aquarius for 300 degrees', () => {
    const result = getZodiacSign(300);
    expect(result.sign).toBe('Aquarius');
    expect(result.degree).toBeCloseTo(0, 5);
  });

  it('returns Pisces for 330 degrees', () => {
    const result = getZodiacSign(330);
    expect(result.sign).toBe('Pisces');
    expect(result.degree).toBeCloseTo(0, 5);
  });

  it('returns Pisces for 359.99 degrees', () => {
    const result = getZodiacSign(359.99);
    expect(result.sign).toBe('Pisces');
    expect(result.degree).toBeCloseTo(29.99, 2);
  });

  it('handles mid-sign degrees correctly', () => {
    const result = getZodiacSign(135);
    expect(result.sign).toBe('Leo');
    expect(result.degree).toBeCloseTo(15, 5);
  });

  it('normalizes negative longitudes', () => {
    const result = getZodiacSign(-10);
    expect(result.sign).toBe('Pisces');
    expect(result.degree).toBeCloseTo(20, 5);
  });

  it('normalizes longitudes >= 360', () => {
    const result = getZodiacSign(375);
    expect(result.sign).toBe('Aries');
    expect(result.degree).toBeCloseTo(15, 5);
  });
});

// ── computeHouses — Equal house system ───────────────────────────────────

describe('computeHouses (equal)', () => {
  // ASC at 15 degrees -> cusps at 15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345
  it('produces 12 cusps spaced 30 degrees apart from ASC', () => {
    // Use a date/location that gives a known ASC near 15 degrees
    // We test the house system logic by checking cusp spacing
    const date = new Date('2024-01-01T12:00:00Z');
    const result = computeHouses(date, 51.5, 0, 'equal');

    expect(result.system).toBe('equal');
    expect(result.cusps).toHaveLength(12);
    expect(result.ascendant).toBeGreaterThanOrEqual(0);
    expect(result.ascendant).toBeLessThan(360);

    // Each cusp should be ASC + i*30 (mod 360)
    for (let i = 0; i < 12; i++) {
      const expected = ((result.ascendant + i * 30) % 360 + 360) % 360;
      expect(result.cusps[i]).toBeCloseTo(expected, 1);
    }
  });

  it('wraps cusps correctly near 360 degrees', () => {
    // Use any date — just verify the wrapping behavior
    const date = new Date('2024-06-15T06:00:00Z');
    const result = computeHouses(date, 40.7, -74.0, 'equal');

    expect(result.cusps).toHaveLength(12);
    for (const cusp of result.cusps) {
      expect(cusp).toBeGreaterThanOrEqual(0);
      expect(cusp).toBeLessThan(360);
    }
  });
});

// ── computeHouses — Whole-sign house system ──────────────────────────────

describe('computeHouses (whole-sign)', () => {
  it('produces cusps at sign boundaries starting from ASC sign', () => {
    const date = new Date('2024-01-01T12:00:00Z');
    const result = computeHouses(date, 51.5, 0, 'whole-sign');

    expect(result.system).toBe('whole-sign');
    expect(result.cusps).toHaveLength(12);

    // First cusp should be at the start of the ASC's sign (multiple of 30)
    const ascSignStart = Math.floor(result.ascendant / 30) * 30;
    expect(result.cusps[0]).toBeCloseTo(ascSignStart, 1);

    // Each subsequent cusp should be +30
    for (let i = 1; i < 12; i++) {
      const expected = (ascSignStart + i * 30) % 360;
      expect(result.cusps[i]).toBeCloseTo(expected, 1);
    }
  });

  it('always places cusps at exact multiples of 30', () => {
    const date = new Date('2024-03-20T10:00:00Z');
    const result = computeHouses(date, 35.6, 139.7, 'whole-sign');

    for (const cusp of result.cusps) {
      expect(cusp % 30).toBeCloseTo(0, 5);
    }
  });
});

// ── computeHouses — Placidus house system ────────────────────────────────

describe('computeHouses (placidus)', () => {
  const date = new Date('2024-01-01T12:00:00Z');
  const lat = 51.5;  // London
  const lng = 0;

  it('returns 12 cusps', () => {
    const result = computeHouses(date, lat, lng, 'placidus');
    expect(result.system).toBe('placidus');
    expect(result.cusps).toHaveLength(12);
  });

  it('MC and ASC are within reasonable ranges', () => {
    const result = computeHouses(date, lat, lng, 'placidus');

    expect(result.midheaven).toBeGreaterThanOrEqual(0);
    expect(result.midheaven).toBeLessThan(360);
    expect(result.ascendant).toBeGreaterThanOrEqual(0);
    expect(result.ascendant).toBeLessThan(360);
  });

  it('cusp 1 equals ASC and cusp 10 equals MC', () => {
    const result = computeHouses(date, lat, lng, 'placidus');

    expect(result.cusps[0]).toBeCloseTo(result.ascendant, 1);
    expect(result.cusps[9]).toBeCloseTo(result.midheaven, 1);
  });

  it('cusp 7 is opposite cusp 1 and cusp 4 is opposite cusp 10', () => {
    const result = computeHouses(date, lat, lng, 'placidus');

    const opp1 = (result.cusps[0] + 180) % 360;
    const opp10 = (result.cusps[9] + 180) % 360;
    expect(result.cusps[6]).toBeCloseTo(opp1, 1);
    expect(result.cusps[3]).toBeCloseTo(opp10, 1);
  });

  it('cusps are in ascending order (with wrap)', () => {
    const result = computeHouses(date, lat, lng, 'placidus');

    for (let i = 1; i < 12; i++) {
      const prev = result.cusps[i - 1];
      const curr = result.cusps[i];
      // Forward distance should be positive and < 180 for adjacent cusps
      const forward = ((curr - prev) % 360 + 360) % 360;
      expect(forward).toBeGreaterThan(0);
      expect(forward).toBeLessThan(180);
    }
  });

  it('all cusps are in [0, 360) range', () => {
    const result = computeHouses(date, lat, lng, 'placidus');
    for (const cusp of result.cusps) {
      expect(cusp).toBeGreaterThanOrEqual(0);
      expect(cusp).toBeLessThan(360);
    }
  });
});

// ── computeHouses — Koch house system ────────────────────────────────────

describe('computeHouses (koch)', () => {
  const date = new Date('2024-01-01T12:00:00Z');
  const lat = 51.5;
  const lng = 0;

  it('returns 12 cusps', () => {
    const result = computeHouses(date, lat, lng, 'koch');
    expect(result.system).toBe('koch');
    expect(result.cusps).toHaveLength(12);
  });

  it('MC and ASC match Placidus values (they are system-independent)', () => {
    const koch = computeHouses(date, lat, lng, 'koch');
    const placidus = computeHouses(date, lat, lng, 'placidus');

    expect(koch.midheaven).toBeCloseTo(placidus.midheaven, 1);
    expect(koch.ascendant).toBeCloseTo(placidus.ascendant, 1);
  });

  it('cusp 1 equals ASC and cusp 10 equals MC', () => {
    const result = computeHouses(date, lat, lng, 'koch');
    expect(result.cusps[0]).toBeCloseTo(result.ascendant, 1);
    expect(result.cusps[9]).toBeCloseTo(result.midheaven, 1);
  });

  it('cusp 7 is opposite cusp 1 and cusp 4 is opposite cusp 10', () => {
    const result = computeHouses(date, lat, lng, 'koch');
    const opp1 = (result.cusps[0] + 180) % 360;
    const opp10 = (result.cusps[9] + 180) % 360;
    expect(result.cusps[6]).toBeCloseTo(opp1, 1);
    expect(result.cusps[3]).toBeCloseTo(opp10, 1);
  });

  it('cusps are in ascending order (with wrap)', () => {
    const result = computeHouses(date, lat, lng, 'koch');
    for (let i = 1; i < 12; i++) {
      const prev = result.cusps[i - 1];
      const curr = result.cusps[i];
      const forward = ((curr - prev) % 360 + 360) % 360;
      expect(forward).toBeGreaterThan(0);
      expect(forward).toBeLessThan(180);
    }
  });

  it('all cusps are in [0, 360) range', () => {
    const result = computeHouses(date, lat, lng, 'koch');
    for (const cusp of result.cusps) {
      expect(cusp).toBeGreaterThanOrEqual(0);
      expect(cusp).toBeLessThan(360);
    }
  });
});

// ── findAspects ──────────────────────────────────────────────────────────

describe('findAspects', () => {
  it('detects a trine between 0 and 120 degrees', () => {
    const positions: TropicalPosition[] = [
      makePosition('Sun', 0),
      makePosition('Moon', 120),
    ];
    const aspects = findAspects(positions);
    const trine = aspects.find(a => a.type === 'trine');
    expect(trine).toBeDefined();
    expect(trine!.body1).toBe('Sun');
    expect(trine!.body2).toBe('Moon');
    expect(trine!.orb).toBeCloseTo(0, 1);
  });

  it('does not detect a trine between 0 and 129 degrees (outside 8 degree orb)', () => {
    const positions: TropicalPosition[] = [
      makePosition('Sun', 0),
      makePosition('Moon', 129),
    ];
    const aspects = findAspects(positions);
    const trine = aspects.find(a => a.type === 'trine');
    expect(trine).toBeUndefined();
  });

  it('detects a conjunction between 0 and 2 degrees', () => {
    const positions: TropicalPosition[] = [
      makePosition('Sun', 0),
      makePosition('Moon', 2),
    ];
    const aspects = findAspects(positions);
    const conjunction = aspects.find(a => a.type === 'conjunction');
    expect(conjunction).toBeDefined();
    expect(conjunction!.orb).toBeCloseTo(2, 1);
  });

  it('detects an opposition between 0 and 178 degrees', () => {
    const positions: TropicalPosition[] = [
      makePosition('Sun', 0),
      makePosition('Moon', 178),
    ];
    const aspects = findAspects(positions);
    const opposition = aspects.find(a => a.type === 'opposition');
    expect(opposition).toBeDefined();
    expect(opposition!.orb).toBeCloseTo(2, 1);
  });

  it('detects a square between 90 and 0 degrees', () => {
    const positions: TropicalPosition[] = [
      makePosition('Mars', 0),
      makePosition('Saturn', 90),
    ];
    const aspects = findAspects(positions);
    const square = aspects.find(a => a.type === 'square');
    expect(square).toBeDefined();
    expect(square!.orb).toBeCloseTo(0, 1);
  });

  it('detects a sextile between 0 and 62 degrees (within 6 degree orb)', () => {
    const positions: TropicalPosition[] = [
      makePosition('Venus', 0),
      makePosition('Jupiter', 62),
    ];
    const aspects = findAspects(positions);
    const sextile = aspects.find(a => a.type === 'sextile');
    expect(sextile).toBeDefined();
    expect(sextile!.orb).toBeCloseTo(2, 1);
  });

  it('does not detect a sextile between 0 and 67 degrees (outside 6 degree orb)', () => {
    const positions: TropicalPosition[] = [
      makePosition('Venus', 0),
      makePosition('Jupiter', 67),
    ];
    const aspects = findAspects(positions);
    const sextile = aspects.find(a => a.type === 'sextile');
    expect(sextile).toBeUndefined();
  });

  it('handles wrap-around for conjunction near 0/360', () => {
    const positions: TropicalPosition[] = [
      makePosition('Sun', 358),
      makePosition('Moon', 3),
    ];
    const aspects = findAspects(positions);
    const conjunction = aspects.find(a => a.type === 'conjunction');
    expect(conjunction).toBeDefined();
    expect(conjunction!.orb).toBeCloseTo(5, 1);
  });

  it('supports custom orbs', () => {
    const positions: TropicalPosition[] = [
      makePosition('Sun', 0),
      makePosition('Moon', 125),
    ];
    // With a 6-degree orb, 125 - 120 = 5, which should be within orb
    const aspects = findAspects(positions, { trine: 6 });
    const trine = aspects.find(a => a.type === 'trine');
    expect(trine).toBeDefined();
  });

  it('returns correct angle for each aspect', () => {
    const positions: TropicalPosition[] = [
      makePosition('Sun', 10),
      makePosition('Moon', 130),
    ];
    const aspects = findAspects(positions);
    const trine = aspects.find(a => a.type === 'trine');
    expect(trine).toBeDefined();
    expect(trine!.angle).toBeCloseTo(120, 0);
  });
});

// ── getDignity ───────────────────────────────────────────────────────────

describe('getDignity', () => {
  // Sun dignities
  it('Sun in Leo -> rulership', () => {
    expect(getDignity('Sun', 'Leo')).toBe('rulership');
  });

  it('Sun in Aries -> exaltation', () => {
    expect(getDignity('Sun', 'Aries')).toBe('exaltation');
  });

  it('Sun in Aquarius -> detriment', () => {
    expect(getDignity('Sun', 'Aquarius')).toBe('detriment');
  });

  it('Sun in Libra -> fall', () => {
    expect(getDignity('Sun', 'Libra')).toBe('fall');
  });

  it('Sun in Gemini -> null', () => {
    expect(getDignity('Sun', 'Gemini')).toBeNull();
  });

  // Moon dignities
  it('Moon in Cancer -> rulership', () => {
    expect(getDignity('Moon', 'Cancer')).toBe('rulership');
  });

  it('Moon in Taurus -> exaltation', () => {
    expect(getDignity('Moon', 'Taurus')).toBe('exaltation');
  });

  it('Moon in Capricorn -> detriment', () => {
    expect(getDignity('Moon', 'Capricorn')).toBe('detriment');
  });

  it('Moon in Scorpio -> fall', () => {
    expect(getDignity('Moon', 'Scorpio')).toBe('fall');
  });

  // Mercury with dual rulership
  it('Mercury in Gemini -> rulership', () => {
    expect(getDignity('Mercury', 'Gemini')).toBe('rulership');
  });

  it('Mercury in Virgo -> rulership (dual rulership takes precedence over exaltation)', () => {
    // Mercury rules Virgo AND is exalted in Virgo.
    // Rulership is the stronger dignity and should take precedence.
    const result = getDignity('Mercury', 'Virgo');
    expect(result).toBe('rulership');
  });

  it('Mercury in Sagittarius -> detriment', () => {
    expect(getDignity('Mercury', 'Sagittarius')).toBe('detriment');
  });

  it('Mercury in Pisces -> detriment (dual detriment takes precedence over fall)', () => {
    const result = getDignity('Mercury', 'Pisces');
    expect(result).toBe('detriment');
  });

  // Venus dignities
  it('Venus in Taurus -> rulership', () => {
    expect(getDignity('Venus', 'Taurus')).toBe('rulership');
  });

  it('Venus in Libra -> rulership', () => {
    expect(getDignity('Venus', 'Libra')).toBe('rulership');
  });

  it('Venus in Pisces -> exaltation', () => {
    expect(getDignity('Venus', 'Pisces')).toBe('exaltation');
  });

  it('Venus in Aries -> detriment', () => {
    expect(getDignity('Venus', 'Aries')).toBe('detriment');
  });

  it('Venus in Virgo -> fall', () => {
    expect(getDignity('Venus', 'Virgo')).toBe('fall');
  });

  // Mars dignities
  it('Mars in Aries -> rulership', () => {
    expect(getDignity('Mars', 'Aries')).toBe('rulership');
  });

  it('Mars in Scorpio -> rulership', () => {
    expect(getDignity('Mars', 'Scorpio')).toBe('rulership');
  });

  it('Mars in Capricorn -> exaltation', () => {
    expect(getDignity('Mars', 'Capricorn')).toBe('exaltation');
  });

  it('Mars in Cancer -> fall', () => {
    expect(getDignity('Mars', 'Cancer')).toBe('fall');
  });

  // Jupiter dignities
  it('Jupiter in Sagittarius -> rulership', () => {
    expect(getDignity('Jupiter', 'Sagittarius')).toBe('rulership');
  });

  it('Jupiter in Cancer -> exaltation', () => {
    expect(getDignity('Jupiter', 'Cancer')).toBe('exaltation');
  });

  it('Jupiter in Capricorn -> fall', () => {
    expect(getDignity('Jupiter', 'Capricorn')).toBe('fall');
  });

  // Saturn dignities
  it('Saturn in Capricorn -> rulership', () => {
    expect(getDignity('Saturn', 'Capricorn')).toBe('rulership');
  });

  it('Saturn in Aquarius -> rulership', () => {
    expect(getDignity('Saturn', 'Aquarius')).toBe('rulership');
  });

  it('Saturn in Libra -> exaltation', () => {
    expect(getDignity('Saturn', 'Libra')).toBe('exaltation');
  });

  it('Saturn in Aries -> fall', () => {
    expect(getDignity('Saturn', 'Aries')).toBe('fall');
  });

  // Unknown body
  it('returns null for unknown body', () => {
    expect(getDignity('Pluto', 'Aries')).toBeNull();
  });
});

// ── computeTropicalChart ─────────────────────────────────────────────────

describe('computeTropicalChart', () => {
  const date = new Date('2024-01-01T12:00:00Z');
  const lat = 51.5;
  const lng = 0;

  it('returns a TropicalChart with positions, houses, and aspects', () => {
    const chart = computeTropicalChart(date, lat, lng);

    expect(chart).toHaveProperty('positions');
    expect(chart).toHaveProperty('houses');
    expect(chart).toHaveProperty('aspects');
  });

  it('positions array contains Sun, Moon, and planets', () => {
    const chart = computeTropicalChart(date, lat, lng);
    const bodies = chart.positions.map(p => p.body);

    expect(bodies).toContain('Sun');
    expect(bodies).toContain('Moon');
    expect(bodies).toContain('Mercury');
    expect(bodies).toContain('Venus');
    expect(bodies).toContain('Mars');
    expect(bodies).toContain('Jupiter');
    expect(bodies).toContain('Saturn');
    expect(bodies).toContain('Uranus');
    expect(bodies).toContain('Neptune');
    expect(bodies).toContain('Pluto');
    expect(chart.positions).toHaveLength(16);
  });

  it('each position has valid sign, signDegree, house, and longitude', () => {
    const chart = computeTropicalChart(date, lat, lng);

    const validSigns: ZodiacSign[] = [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
    ];

    for (const pos of chart.positions) {
      expect(validSigns).toContain(pos.sign);
      expect(pos.signDegree).toBeGreaterThanOrEqual(0);
      expect(pos.signDegree).toBeLessThan(30);
      expect(pos.house).toBeGreaterThanOrEqual(1);
      expect(pos.house).toBeLessThanOrEqual(12);
      expect(pos.longitude).toBeGreaterThanOrEqual(0);
      expect(pos.longitude).toBeLessThan(360);
    }
  });

  it('houses default to placidus system', () => {
    const chart = computeTropicalChart(date, lat, lng);
    expect(chart.houses.system).toBe('placidus');
    expect(chart.houses.cusps).toHaveLength(12);
  });

  it('allows specifying a different house system', () => {
    const chart = computeTropicalChart(date, lat, lng, { houseSystem: 'whole-sign' });
    expect(chart.houses.system).toBe('whole-sign');
  });

  it('aspects array contains valid aspect objects', () => {
    const chart = computeTropicalChart(date, lat, lng);

    const validAspects: AspectName[] = [
      'conjunction', 'opposition', 'trine', 'square', 'sextile',
      'semi-sextile', 'quincunx', 'semi-square', 'sesquiquadrate',
      'quintile', 'biquintile',
    ];

    for (const aspect of chart.aspects) {
      expect(validAspects).toContain(aspect.type);
      expect(typeof aspect.body1).toBe('string');
      expect(typeof aspect.body2).toBe('string');
      expect(typeof aspect.angle).toBe('number');
      expect(typeof aspect.orb).toBe('number');
      expect(aspect.orb).toBeGreaterThanOrEqual(0);
    }
  });

  it('aspects reference bodies that exist in positions', () => {
    const chart = computeTropicalChart(date, lat, lng);
    const bodyNames = chart.positions.map(p => p.body);

    for (const aspect of chart.aspects) {
      expect(bodyNames).toContain(aspect.body1);
      expect(bodyNames).toContain(aspect.body2);
    }
  });

  it('positions include dignity where applicable', () => {
    const chart = computeTropicalChart(date, lat, lng);

    // At least some positions should have dignities or null
    for (const pos of chart.positions) {
      if (pos.dignity !== null) {
        expect(['rulership', 'exaltation', 'detriment', 'fall']).toContain(pos.dignity);
      }
    }
  });
});

// ── Helpers ──────────────────────────────────────────────────────────────

/**
 * Create a minimal TropicalPosition for testing aspects.
 */
function makePosition(body: string, longitude: number): TropicalPosition {
  const { sign, degree } = getZodiacSign(longitude);
  return {
    body,
    longitude,
    latitude: 0,
    sign,
    signDegree: degree,
    house: 1,
    dignity: null,
  };
}
