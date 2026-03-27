import { describe, it, expect } from 'vitest';
import {
  SIGN_ELEMENT,
  SIGN_QUALITY,
  SIGN_POLARITY,
  SIGN_RULER,
} from '../src/sign-metadata';
import type { ZodiacSign } from '../src/tropical-astrology';

const ALL_SIGNS: ZodiacSign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

describe('SIGN_ELEMENT', () => {
  it('has entries for all 12 signs', () => {
    for (const sign of ALL_SIGNS) {
      expect(SIGN_ELEMENT[sign]).toBeDefined();
    }
  });

  it('maps fire signs correctly', () => {
    expect(SIGN_ELEMENT.Aries).toBe('fire');
    expect(SIGN_ELEMENT.Leo).toBe('fire');
    expect(SIGN_ELEMENT.Sagittarius).toBe('fire');
  });

  it('maps earth signs correctly', () => {
    expect(SIGN_ELEMENT.Taurus).toBe('earth');
    expect(SIGN_ELEMENT.Virgo).toBe('earth');
    expect(SIGN_ELEMENT.Capricorn).toBe('earth');
  });

  it('maps air signs correctly', () => {
    expect(SIGN_ELEMENT.Gemini).toBe('air');
    expect(SIGN_ELEMENT.Libra).toBe('air');
    expect(SIGN_ELEMENT.Aquarius).toBe('air');
  });

  it('maps water signs correctly', () => {
    expect(SIGN_ELEMENT.Cancer).toBe('water');
    expect(SIGN_ELEMENT.Scorpio).toBe('water');
    expect(SIGN_ELEMENT.Pisces).toBe('water');
  });
});

describe('SIGN_QUALITY', () => {
  it('has entries for all 12 signs', () => {
    for (const sign of ALL_SIGNS) {
      expect(SIGN_QUALITY[sign]).toBeDefined();
    }
  });

  it('maps cardinal signs correctly', () => {
    expect(SIGN_QUALITY.Aries).toBe('cardinal');
    expect(SIGN_QUALITY.Cancer).toBe('cardinal');
    expect(SIGN_QUALITY.Libra).toBe('cardinal');
    expect(SIGN_QUALITY.Capricorn).toBe('cardinal');
  });

  it('maps fixed signs correctly', () => {
    expect(SIGN_QUALITY.Taurus).toBe('fixed');
    expect(SIGN_QUALITY.Leo).toBe('fixed');
    expect(SIGN_QUALITY.Scorpio).toBe('fixed');
    expect(SIGN_QUALITY.Aquarius).toBe('fixed');
  });

  it('maps mutable signs correctly', () => {
    expect(SIGN_QUALITY.Gemini).toBe('mutable');
    expect(SIGN_QUALITY.Virgo).toBe('mutable');
    expect(SIGN_QUALITY.Sagittarius).toBe('mutable');
    expect(SIGN_QUALITY.Pisces).toBe('mutable');
  });
});

describe('SIGN_POLARITY', () => {
  it('has entries for all 12 signs', () => {
    for (const sign of ALL_SIGNS) {
      expect(SIGN_POLARITY[sign]).toBeDefined();
    }
  });

  it('fire and air signs are positive', () => {
    const positiveSigns: ZodiacSign[] = [
      'Aries', 'Gemini', 'Leo', 'Libra', 'Sagittarius', 'Aquarius',
    ];
    for (const sign of positiveSigns) {
      expect(SIGN_POLARITY[sign]).toBe('positive');
    }
  });

  it('earth and water signs are negative', () => {
    const negativeSigns: ZodiacSign[] = [
      'Taurus', 'Cancer', 'Virgo', 'Scorpio', 'Capricorn', 'Pisces',
    ];
    for (const sign of negativeSigns) {
      expect(SIGN_POLARITY[sign]).toBe('negative');
    }
  });
});

describe('SIGN_RULER', () => {
  it('has entries for all 12 signs', () => {
    for (const sign of ALL_SIGNS) {
      expect(SIGN_RULER[sign]).toBeDefined();
    }
  });

  it('maps all traditional rulers correctly', () => {
    expect(SIGN_RULER.Aries).toBe('Mars');
    expect(SIGN_RULER.Taurus).toBe('Venus');
    expect(SIGN_RULER.Gemini).toBe('Mercury');
    expect(SIGN_RULER.Cancer).toBe('Moon');
    expect(SIGN_RULER.Leo).toBe('Sun');
    expect(SIGN_RULER.Virgo).toBe('Mercury');
    expect(SIGN_RULER.Libra).toBe('Venus');
    expect(SIGN_RULER.Scorpio).toBe('Mars');
    expect(SIGN_RULER.Sagittarius).toBe('Jupiter');
    expect(SIGN_RULER.Capricorn).toBe('Saturn');
    expect(SIGN_RULER.Aquarius).toBe('Saturn');
    expect(SIGN_RULER.Pisces).toBe('Jupiter');
  });
});

describe('cross-table consistency', () => {
  it('Aries is fire/cardinal/positive', () => {
    expect(SIGN_ELEMENT.Aries).toBe('fire');
    expect(SIGN_QUALITY.Aries).toBe('cardinal');
    expect(SIGN_POLARITY.Aries).toBe('positive');
  });

  it('Cancer is water/cardinal/negative', () => {
    expect(SIGN_ELEMENT.Cancer).toBe('water');
    expect(SIGN_QUALITY.Cancer).toBe('cardinal');
    expect(SIGN_POLARITY.Cancer).toBe('negative');
  });

  it('Leo is fire/fixed/positive', () => {
    expect(SIGN_ELEMENT.Leo).toBe('fire');
    expect(SIGN_QUALITY.Leo).toBe('fixed');
    expect(SIGN_POLARITY.Leo).toBe('positive');
  });

  it('Virgo is earth/mutable/negative', () => {
    expect(SIGN_ELEMENT.Virgo).toBe('earth');
    expect(SIGN_QUALITY.Virgo).toBe('mutable');
    expect(SIGN_POLARITY.Virgo).toBe('negative');
  });
});
