import { describe, it, expect } from 'vitest';
import {
  getTriplicityRuler,
  getTermRuler,
  getFaceRuler,
  getExtendedDignity,
  isPeregrine,
  findMutualReceptions,
} from '../src/dignity-tables';

describe('getTriplicityRuler', () => {
  // Fire triplicity: Sun (day), Jupiter (night)
  it('returns Sun for Aries day chart', () => {
    expect(getTriplicityRuler('Aries', true)).toBe('Sun');
  });
  it('returns Jupiter for Aries night chart', () => {
    expect(getTriplicityRuler('Aries', false)).toBe('Jupiter');
  });
  it('returns Sun for Leo day chart', () => {
    expect(getTriplicityRuler('Leo', true)).toBe('Sun');
  });
  it('returns Jupiter for Sagittarius night chart', () => {
    expect(getTriplicityRuler('Sagittarius', false)).toBe('Jupiter');
  });

  // Earth triplicity: Venus (day), Moon (night)
  it('returns Venus for Taurus day chart', () => {
    expect(getTriplicityRuler('Taurus', true)).toBe('Venus');
  });
  it('returns Moon for Virgo night chart', () => {
    expect(getTriplicityRuler('Virgo', false)).toBe('Moon');
  });

  // Air triplicity: Saturn (day), Mercury (night)
  it('returns Saturn for Gemini day chart', () => {
    expect(getTriplicityRuler('Gemini', true)).toBe('Saturn');
  });
  it('returns Mercury for Libra night chart', () => {
    expect(getTriplicityRuler('Libra', false)).toBe('Mercury');
  });

  // Water triplicity: Mars (day and night)
  it('returns Mars for Cancer day chart', () => {
    expect(getTriplicityRuler('Cancer', true)).toBe('Mars');
  });
  it('returns Mars for Scorpio night chart', () => {
    expect(getTriplicityRuler('Scorpio', false)).toBe('Mars');
  });
});

describe('getTermRuler (Egyptian terms)', () => {
  // Aries terms: Jupiter 0-6, Venus 6-12, Mercury 12-20, Mars 20-25, Saturn 25-30
  it('returns Jupiter for Aries 3°', () => {
    expect(getTermRuler('Aries', 3)).toBe('Jupiter');
  });
  it('returns Venus for Aries 8°', () => {
    expect(getTermRuler('Aries', 8)).toBe('Venus');
  });
  it('returns Mercury for Aries 15°', () => {
    expect(getTermRuler('Aries', 15)).toBe('Mercury');
  });
  it('returns Mars for Aries 22°', () => {
    expect(getTermRuler('Aries', 22)).toBe('Mars');
  });
  it('returns Saturn for Aries 28°', () => {
    expect(getTermRuler('Aries', 28)).toBe('Saturn');
  });

  // Taurus terms: Venus 0-8, Mercury 8-14, Jupiter 14-22, Saturn 22-27, Mars 27-30
  it('returns Venus for Taurus 5°', () => {
    expect(getTermRuler('Taurus', 5)).toBe('Venus');
  });
  it('returns Mercury for Taurus 10°', () => {
    expect(getTermRuler('Taurus', 10)).toBe('Mercury');
  });

  // Boundary: exactly at term boundary
  it('returns Venus for Aries 6° (boundary)', () => {
    expect(getTermRuler('Aries', 6)).toBe('Venus');
  });
});

describe('getFaceRuler (Chaldean decans)', () => {
  // Chaldean order: Mars, Sun, Venus, Mercury, Moon, Saturn, Jupiter (repeating)
  // Aries: 0-10 Mars, 10-20 Sun, 20-30 Venus
  it('returns Mars for Aries 1st face (5°)', () => {
    expect(getFaceRuler('Aries', 5)).toBe('Mars');
  });
  it('returns Sun for Aries 2nd face (15°)', () => {
    expect(getFaceRuler('Aries', 15)).toBe('Sun');
  });
  it('returns Venus for Aries 3rd face (25°)', () => {
    expect(getFaceRuler('Aries', 25)).toBe('Venus');
  });

  // Taurus: Mercury, Moon, Saturn
  it('returns Mercury for Taurus 1st face (5°)', () => {
    expect(getFaceRuler('Taurus', 5)).toBe('Mercury');
  });
  it('returns Moon for Taurus 2nd face (15°)', () => {
    expect(getFaceRuler('Taurus', 15)).toBe('Moon');
  });
  it('returns Saturn for Taurus 3rd face (25°)', () => {
    expect(getFaceRuler('Taurus', 25)).toBe('Saturn');
  });

  // Gemini: Jupiter, Mars, Sun
  it('returns Jupiter for Gemini 1st face (5°)', () => {
    expect(getFaceRuler('Gemini', 5)).toBe('Jupiter');
  });

  // Leo 1st face: Saturn (index 12 in Chaldean cycle)
  // Aries=Mars,Sun,Venus | Taurus=Mercury,Moon,Saturn | Gemini=Jupiter,Mars,Sun
  // Cancer=Venus,Mercury,Moon | Leo=Saturn,Jupiter,Mars
  it('returns Saturn for Leo 1st face (5°)', () => {
    expect(getFaceRuler('Leo', 5)).toBe('Saturn');
  });

  // Boundary: exactly at 10° enters second face
  it('returns Sun for Aries 10° (2nd face boundary)', () => {
    expect(getFaceRuler('Aries', 10)).toBe('Sun');
  });
});

describe('getExtendedDignity', () => {
  it('returns rulership for Sun in Leo', () => {
    const result = getExtendedDignity('Sun', 'Leo', 5, true);
    expect(result.dignities).toContain('rulership');
    expect(result.score).toBeGreaterThanOrEqual(5);
  });

  it('returns exaltation for Sun in Aries', () => {
    const result = getExtendedDignity('Sun', 'Aries', 15, true);
    expect(result.dignities).toContain('exaltation');
  });

  it('returns triplicity for Sun in Leo day chart', () => {
    const result = getExtendedDignity('Sun', 'Leo', 5, true);
    expect(result.dignities).toContain('triplicity');
  });

  it('returns detriment for Sun in Aquarius', () => {
    const result = getExtendedDignity('Sun', 'Aquarius', 15, true);
    expect(result.dignities).toContain('detriment');
    expect(result.score).toBeLessThan(0);
  });

  it('returns fall for Sun in Libra', () => {
    const result = getExtendedDignity('Sun', 'Libra', 15, true);
    expect(result.dignities).toContain('fall');
  });

  it('accumulates multiple dignities for Sun in Leo', () => {
    // Sun in Leo: rulership (+5) + triplicity (+3) + possibly face
    const result = getExtendedDignity('Sun', 'Leo', 5, true);
    expect(result.dignities.length).toBeGreaterThanOrEqual(2);
    expect(result.score).toBeGreaterThanOrEqual(8); // at least rulership + triplicity
  });

  it('returns term dignity when body rules the term', () => {
    // Jupiter rules first 6° of Aries
    const result = getExtendedDignity('Jupiter', 'Aries', 3, true);
    expect(result.dignities).toContain('term');
  });

  it('returns empty for non-traditional body', () => {
    const result = getExtendedDignity('Chiron', 'Aries', 15, true);
    expect(result.dignities).toHaveLength(0);
    expect(result.score).toBe(0);
  });
});

describe('isPeregrine', () => {
  it('returns false for Sun in Leo (has rulership)', () => {
    expect(isPeregrine('Sun', 'Leo', 5, true)).toBe(false);
  });

  it('returns true for Mars in Gemini 15° day chart (no essential dignity)', () => {
    // Mars in Gemini: no rulership (Aries/Scorpio), no exaltation (Capricorn),
    // no triplicity (Air day = Saturn), no term at 15° (need to check),
    // Gemini 2nd face = Mars... actually Mars IS the Chaldean face ruler for Gemini 10-20°!
    // Let's pick a degree where Mars has nothing:
    // Gemini terms: Mercury 0-6, Jupiter 6-12, Venus 12-17, Mars 17-24, Saturn 24-30
    // Gemini faces: Jupiter 0-10, Mars 10-20, Sun 20-30
    // At Gemini 5°: term = Mercury, face = Jupiter → Mars has nothing → peregrine
    expect(isPeregrine('Mars', 'Gemini', 5, true)).toBe(true);
  });

  it('returns false for Jupiter in Aries 3° (has term)', () => {
    expect(isPeregrine('Jupiter', 'Aries', 3, true)).toBe(false);
  });
});

describe('findMutualReceptions', () => {
  it('finds mutual reception between Sun in Aries and Mars in Leo', () => {
    const positions = [
      { body: 'Sun', sign: 'Aries' as const },
      { body: 'Mars', sign: 'Leo' as const },
      { body: 'Moon', sign: 'Cancer' as const },
    ];
    const receptions = findMutualReceptions(positions);
    expect(receptions).toHaveLength(1);
    expect(receptions[0]).toEqual({
      body1: 'Sun',
      body2: 'Mars',
      type: 'domicile',
    });
  });

  it('finds no mutual reception when none exists', () => {
    const positions = [
      { body: 'Sun', sign: 'Aries' as const },
      { body: 'Moon', sign: 'Cancer' as const },
    ];
    const receptions = findMutualReceptions(positions);
    // Sun rules Leo, Moon rules Cancer. Sun is in Aries (Mars' sign), Moon is in Cancer (own sign).
    // No mutual reception.
    expect(receptions).toHaveLength(0);
  });

  it('finds Venus-Mars mutual reception', () => {
    // Venus rules Taurus/Libra, Mars rules Aries/Scorpio
    const positions = [
      { body: 'Venus', sign: 'Aries' as const },  // Venus in Mars' sign
      { body: 'Mars', sign: 'Taurus' as const },   // Mars in Venus' sign
    ];
    const receptions = findMutualReceptions(positions);
    expect(receptions).toHaveLength(1);
    expect(receptions[0].body1).toBe('Venus');
    expect(receptions[0].body2).toBe('Mars');
  });
});
