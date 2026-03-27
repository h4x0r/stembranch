import { describe, it, expect } from 'vitest';
import { FIXED_STARS, precessionRate, precessStar, findFixedStarConjunctions } from '../../src/data/fixed-stars';
import type { FixedStar } from '../../src/data/fixed-stars';

describe('FIXED_STARS catalog', () => {
  it('contains approximately 50 entries', () => {
    expect(FIXED_STARS.length).toBeGreaterThanOrEqual(48);
    expect(FIXED_STARS.length).toBeLessThanOrEqual(55);
  });

  it('each star has all required fields', () => {
    for (const star of FIXED_STARS) {
      expect(star.name).toBeTruthy();
      expect(typeof star.name).toBe('string');
      expect(typeof star.longitude2000).toBe('number');
      expect(typeof star.latitude).toBe('number');
      expect(typeof star.magnitude).toBe('number');
      expect(typeof star.nature).toBe('string');
      expect(star.nature.length).toBeGreaterThan(0);
    }
  });

  it('all longitudes are in [0, 360)', () => {
    for (const star of FIXED_STARS) {
      expect(star.longitude2000).toBeGreaterThanOrEqual(0);
      expect(star.longitude2000).toBeLessThan(360);
    }
  });

  it('all latitudes are in [-90, 90]', () => {
    for (const star of FIXED_STARS) {
      expect(star.latitude).toBeGreaterThanOrEqual(-90);
      expect(star.latitude).toBeLessThanOrEqual(90);
    }
  });

  it('has no duplicate star names', () => {
    const names = FIXED_STARS.map(s => s.name);
    const unique = new Set(names);
    expect(unique.size).toBe(names.length);
  });

  describe('key star positions (J2000.0 ecliptic longitude)', () => {
    function findStar(name: string): FixedStar {
      const star = FIXED_STARS.find(s => s.name === name);
      if (!star) throw new Error(`Star not found: ${name}`);
      return star;
    }

    it('Regulus longitude near 149.85 (Leo 29 51)', () => {
      const regulus = findStar('Regulus');
      expect(regulus.longitude2000).toBeCloseTo(149.85, 1);
    });

    it('Spica longitude near 203.87 (Libra 23 52)', () => {
      const spica = findStar('Spica');
      expect(spica.longitude2000).toBeCloseTo(203.87, 1);
    });

    it('Sirius longitude near 104.11 (Cancer 14 07)', () => {
      const sirius = findStar('Sirius');
      expect(sirius.longitude2000).toBeCloseTo(104.11, 1);
    });

    it('Aldebaran longitude near 69.86 (Gemini 9 52)', () => {
      const aldebaran = findStar('Aldebaran');
      expect(aldebaran.longitude2000).toBeCloseTo(69.86, 1);
    });

    it('Antares longitude near 249.63 (Sagittarius 9 38)', () => {
      const antares = findStar('Antares');
      expect(antares.longitude2000).toBeCloseTo(249.63, 1);
    });

    it('Fomalhaut longitude near 333.87 (Pisces 3 52)', () => {
      const fomalhaut = findStar('Fomalhaut');
      expect(fomalhaut.longitude2000).toBeCloseTo(333.87, 1);
    });

    it('Vega longitude near 285.28 (Capricorn 15 17)', () => {
      const vega = findStar('Vega');
      expect(vega.longitude2000).toBeCloseTo(285.28, 1);
    });
  });
});

describe('precessStar', () => {
  function findStar(name: string): FixedStar {
    const star = FIXED_STARS.find(s => s.name === name);
    if (!star) throw new Error(`Star not found: ${name}`);
    return star;
  }

  it('returns the same longitude at T=0 (J2000.0)', () => {
    const regulus = findStar('Regulus');
    expect(precessStar(regulus, 0)).toBeCloseTo(regulus.longitude2000, 10);
  });

  it('Regulus at T=1 (year 2100) is approximately 151.25', () => {
    const regulus = findStar('Regulus');
    const precessed = precessStar(regulus, 1);
    // 149.85 + 1.397 = 151.247
    expect(precessed).toBeCloseTo(151.247, 1);
  });

  it('Regulus at T=-1 (year 1900) is approximately 148.45', () => {
    const regulus = findStar('Regulus');
    const precessed = precessStar(regulus, -1);
    // 149.85 - 1.397 = 148.453
    expect(precessed).toBeCloseTo(148.453, 1);
  });

  it('wraps correctly near 360/0 boundary', () => {
    const scheat = findStar('Scheat');
    // Scheat is at ~359.37. Precess forward by 1 century: 359.37 + 1.397 = 360.767 -> 0.767
    const precessed = precessStar(scheat, 1);
    expect(precessed).toBeCloseTo(0.767, 1);
    expect(precessed).toBeGreaterThanOrEqual(0);
    expect(precessed).toBeLessThan(360);
  });

  it('wraps correctly for negative precession past 0', () => {
    // Difda at ~2.35. Precess backward by 2 centuries: 2.35 - 2.794 = -0.444 -> 359.556
    const difda = findStar('Difda');
    const precessed = precessStar(difda, -2);
    expect(precessed).toBeCloseTo(359.556, 1);
    expect(precessed).toBeGreaterThanOrEqual(0);
    expect(precessed).toBeLessThan(360);
  });

  it('precession rate is approximately 1.397 degrees per century', () => {
    expect(precessionRate).toBeCloseTo(1.397, 3);
  });
});

describe('findFixedStarConjunctions', () => {
  it('finds Regulus when body is at 150 degrees (within 1 degree orb at J2000)', () => {
    const conjunctions = findFixedStarConjunctions(150, 'Sun', 0, 1);
    const regulusConj = conjunctions.find(c => c.star === 'Regulus');
    expect(regulusConj).toBeDefined();
    expect(regulusConj!.body).toBe('Sun');
    expect(Math.abs(regulusConj!.orb)).toBeLessThanOrEqual(1);
  });

  it('finds no major stars at 200 degrees within 1 degree orb at J2000', () => {
    const conjunctions = findFixedStarConjunctions(200, 'Mars', 0, 1);
    expect(conjunctions.length).toBe(0);
  });

  it('returns results sorted by orb (closest first)', () => {
    // Use a wider orb to potentially find multiple stars
    const conjunctions = findFixedStarConjunctions(104.5, 'Moon', 0, 2);
    if (conjunctions.length >= 2) {
      for (let i = 1; i < conjunctions.length; i++) {
        expect(Math.abs(conjunctions[i].orb)).toBeGreaterThanOrEqual(
          Math.abs(conjunctions[i - 1].orb),
        );
      }
    }
  });

  it('accounts for precession at T != 0', () => {
    // Regulus at T=1 is ~151.247. Body at 151.2 should find it at T=1.
    const conjunctions = findFixedStarConjunctions(151.2, 'Sun', 1, 1);
    const regulusConj = conjunctions.find(c => c.star === 'Regulus');
    expect(regulusConj).toBeDefined();
  });

  it('uses default orb of 1 degree', () => {
    // Regulus at J2000 is 149.85. Body at 149 is 0.85 away -> found with default orb.
    const conjunctions = findFixedStarConjunctions(149, 'Venus', 0);
    const regulusConj = conjunctions.find(c => c.star === 'Regulus');
    expect(regulusConj).toBeDefined();
  });

  it('handles orb across 360/0 boundary', () => {
    // Scheat is at ~359.37. Body at 0.2 is ~0.83 away -> should find.
    const conjunctions = findFixedStarConjunctions(0.2, 'Jupiter', 0, 1);
    const scheatConj = conjunctions.find(c => c.star === 'Scheat');
    expect(scheatConj).toBeDefined();
  });

  it('includes orb as signed value (body - star)', () => {
    const conjunctions = findFixedStarConjunctions(150, 'Sun', 0, 1);
    const regulusConj = conjunctions.find(c => c.star === 'Regulus');
    expect(regulusConj).toBeDefined();
    // 150 - 149.85 = +0.15
    expect(regulusConj!.orb).toBeCloseTo(0.15, 1);
  });
});
