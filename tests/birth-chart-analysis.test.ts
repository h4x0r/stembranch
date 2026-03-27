import { describe, it, expect } from 'vitest';
import {
  isDayChart,
  computeDispositorChain,
  findFinalDispositor,
  computeAntiscia,
  computeContraAntiscia,
  computeDistributions,
  computeHemispheres,
  detectChartPattern,
  computeMoonPhase,
  computePlanetaryHour,
  getPlanetaryDay,
  computeSolarProximity,
  isOriental,
  isOutOfBounds,
  isVoidOfCourseMoon,
} from '../src/birth-chart-analysis';
import type { ZodiacSign } from '../src/tropical-astrology';

describe('isDayChart', () => {
  it('returns true for Sun in house 10 (above horizon)', () => {
    expect(isDayChart(10)).toBe(true);
  });
  it('returns false for Sun in house 4 (below horizon)', () => {
    expect(isDayChart(4)).toBe(false);
  });
  it('returns true for Sun in house 7 (on DSC, above horizon)', () => {
    expect(isDayChart(7)).toBe(true);
  });
  it('returns false for Sun in house 6 (below horizon)', () => {
    expect(isDayChart(6)).toBe(false);
  });
  it('returns true for Sun in house 12', () => {
    expect(isDayChart(12)).toBe(true);
  });
});

describe('computeAntiscia', () => {
  it('mirrors Leo 15° (135°) to Taurus 15° (45°)', () => {
    expect(computeAntiscia(135)).toBeCloseTo(45, 10);
  });
  it('mirrors 0° (Aries 0°) to 180° (Libra 0°)', () => {
    expect(computeAntiscia(0)).toBeCloseTo(180, 10);
  });
  it('Cancer axis is a fixed point: 90° → 90°', () => {
    expect(computeAntiscia(90)).toBeCloseTo(90, 10);
  });
  it('Capricorn axis is a fixed point: 270° → 270°', () => {
    // (180 - 270 + 360) % 360 = 270
    expect(computeAntiscia(270)).toBeCloseTo(270, 10);
  });
});

describe('computeContraAntiscia', () => {
  it('mirrors 135° to 225°', () => {
    expect(computeContraAntiscia(135)).toBeCloseTo(225, 10);
  });
  it('Aries axis is a fixed point: 0° → 0°', () => {
    expect(computeContraAntiscia(0)).toBeCloseTo(0, 10);
  });
  it('Libra axis is a fixed point: 180° → 180°', () => {
    expect(computeContraAntiscia(180)).toBeCloseTo(180, 10);
  });
});

describe('computeDistributions', () => {
  it('counts 5 fire positions correctly', () => {
    const positions = Array.from({ length: 5 }, (_, i) => ({
      body: `planet${i}`,
      element: 'fire' as const,
      quality: 'cardinal' as const,
      polarity: 'positive' as const,
    }));
    const dist = computeDistributions(positions);
    expect(dist.elements.fire).toBe(5);
    expect(dist.elements.earth).toBe(0);
    expect(dist.elements.air).toBe(0);
    expect(dist.elements.water).toBe(0);
    expect(dist.elements.dominant).toBe('fire');
  });

  it('computes mixed distributions', () => {
    const positions = [
      { body: 'Sun', element: 'fire' as const, quality: 'fixed' as const, polarity: 'positive' as const },
      { body: 'Moon', element: 'water' as const, quality: 'cardinal' as const, polarity: 'negative' as const },
      { body: 'Mars', element: 'fire' as const, quality: 'cardinal' as const, polarity: 'positive' as const },
      { body: 'Venus', element: 'earth' as const, quality: 'fixed' as const, polarity: 'negative' as const },
    ];
    const dist = computeDistributions(positions);
    expect(dist.elements.fire).toBe(2);
    expect(dist.elements.water).toBe(1);
    expect(dist.elements.earth).toBe(1);
    expect(dist.elements.dominant).toBe('fire');
    expect(dist.qualities.cardinal).toBe(2);
    expect(dist.qualities.fixed).toBe(2);
    expect(dist.polarities.positive).toBe(2);
    expect(dist.polarities.negative).toBe(2);
  });
});

describe('computeMoonPhase', () => {
  it('Sun 0°, Moon 90° → First Quarter, illumination ~0.5', () => {
    const result = computeMoonPhase(0, 90);
    expect(result.name).toBe('First Quarter');
    expect(result.illumination).toBeCloseTo(0.5, 2);
  });

  it('Sun 0°, Moon 180° → Full Moon, illumination ~1.0', () => {
    const result = computeMoonPhase(0, 180);
    expect(result.name).toBe('Full Moon');
    expect(result.illumination).toBeCloseTo(1.0, 2);
  });

  it('Sun 0°, Moon 0° → New Moon, illumination ~0', () => {
    const result = computeMoonPhase(0, 0);
    expect(result.name).toBe('New Moon');
    expect(result.illumination).toBeCloseTo(0, 2);
  });

  it('Sun 0°, Moon 270° → Last Quarter', () => {
    const result = computeMoonPhase(0, 270);
    expect(result.name).toBe('Last Quarter');
    expect(result.illumination).toBeCloseTo(0.5, 2);
  });

  it('returns correct elongation angle', () => {
    const result = computeMoonPhase(30, 120);
    expect(result.angle).toBeCloseTo(90, 10);
  });
});

describe('getPlanetaryDay', () => {
  it('returns Sun for a known Sunday', () => {
    // 2024-01-07 is a Sunday
    const sunday = new Date(Date.UTC(2024, 0, 7, 12, 0, 0));
    expect(getPlanetaryDay(sunday)).toBe('Sun');
  });

  it('returns Moon for Monday', () => {
    const monday = new Date(Date.UTC(2024, 0, 8, 12, 0, 0));
    expect(getPlanetaryDay(monday)).toBe('Moon');
  });

  it('returns Mars for Tuesday', () => {
    const tuesday = new Date(Date.UTC(2024, 0, 9, 12, 0, 0));
    expect(getPlanetaryDay(tuesday)).toBe('Mars');
  });

  it('returns Mercury for Wednesday', () => {
    const wednesday = new Date(Date.UTC(2024, 0, 10, 12, 0, 0));
    expect(getPlanetaryDay(wednesday)).toBe('Mercury');
  });

  it('returns Jupiter for Thursday', () => {
    const thursday = new Date(Date.UTC(2024, 0, 11, 12, 0, 0));
    expect(getPlanetaryDay(thursday)).toBe('Jupiter');
  });

  it('returns Venus for Friday', () => {
    const friday = new Date(Date.UTC(2024, 0, 12, 12, 0, 0));
    expect(getPlanetaryDay(friday)).toBe('Venus');
  });

  it('returns Saturn for Saturday', () => {
    const saturday = new Date(Date.UTC(2024, 0, 13, 12, 0, 0));
    expect(getPlanetaryDay(saturday)).toBe('Saturn');
  });
});

describe('computeSolarProximity', () => {
  it('combust at 5° distance', () => {
    const result = computeSolarProximity(105, 100);
    expect(result.combust).toBe(true);
    expect(result.cazimi).toBe(false);
    expect(result.angularDistance).toBeCloseTo(5, 10);
  });

  it('cazimi at 0.1° distance', () => {
    const result = computeSolarProximity(100.1, 100);
    expect(result.combust).toBe(true);
    expect(result.cazimi).toBe(true);
    expect(result.angularDistance).toBeCloseTo(0.1, 2);
  });

  it('not combust at 20° distance', () => {
    const result = computeSolarProximity(120, 100);
    expect(result.combust).toBe(false);
    expect(result.underBeams).toBe(false);
  });

  it('under beams at 10° distance', () => {
    const result = computeSolarProximity(110, 100);
    expect(result.combust).toBe(false);
    expect(result.underBeams).toBe(true);
    expect(result.angularDistance).toBeCloseTo(10, 10);
  });
});

describe('isOutOfBounds', () => {
  it('returns true when |dec| > obliquity', () => {
    expect(isOutOfBounds(25, 23.44)).toBe(true);
  });
  it('returns false when |dec| < obliquity', () => {
    expect(isOutOfBounds(20, 23.44)).toBe(false);
  });
  it('handles negative declination', () => {
    expect(isOutOfBounds(-25, 23.44)).toBe(true);
  });
  it('returns false at exact obliquity', () => {
    expect(isOutOfBounds(23.44, 23.44)).toBe(false);
  });
});

describe('detectChartPattern', () => {
  it('detects Bundle when all within 120°', () => {
    const longitudes = [10, 30, 50, 70, 90, 100, 110, 115, 120, 125];
    expect(detectChartPattern(longitudes)).toBe('Bundle');
  });

  it('detects Bowl when all within 180° but not 120°', () => {
    const longitudes = [0, 20, 40, 60, 80, 100, 120, 140, 160, 170];
    expect(detectChartPattern(longitudes)).toBe('Bowl');
  });

  it('detects Splash when across 7+ signs', () => {
    // Spread across 10 different signs
    const longitudes = [5, 35, 65, 95, 125, 155, 185, 215, 245, 335];
    expect(detectChartPattern(longitudes)).toBe('Splash');
  });
});

describe('computeDispositorChain', () => {
  it('maps each body to the ruler of its sign', () => {
    const positions: Array<{ body: string; sign: ZodiacSign }> = [
      { body: 'Sun', sign: 'Leo' },
      { body: 'Moon', sign: 'Cancer' },
      { body: 'Mars', sign: 'Aries' },
    ];
    const chain = computeDispositorChain(positions);
    expect(chain['Sun']).toBe('Sun');   // Leo ruler = Sun
    expect(chain['Moon']).toBe('Moon'); // Cancer ruler = Moon
    expect(chain['Mars']).toBe('Mars'); // Aries ruler = Mars
  });

  it('handles cross-dispositions', () => {
    const positions: Array<{ body: string; sign: ZodiacSign }> = [
      { body: 'Sun', sign: 'Taurus' },  // ruler = Venus
      { body: 'Venus', sign: 'Leo' },   // ruler = Sun
    ];
    const chain = computeDispositorChain(positions);
    expect(chain['Sun']).toBe('Venus');
    expect(chain['Venus']).toBe('Sun');
  });
});

describe('findFinalDispositor', () => {
  it('finds Sun as final dispositor when Sun is in Leo', () => {
    const chain: Record<string, string> = {
      Sun: 'Sun',    // Sun in Leo, disposes itself
      Moon: 'Sun',   // Moon in Leo
      Mars: 'Sun',   // Mars in Leo
    };
    expect(findFinalDispositor(chain)).toBe('Sun');
  });

  it('returns null when there is a loop with no fixed point', () => {
    const chain: Record<string, string> = {
      Sun: 'Venus',   // Sun in Taurus
      Venus: 'Mars',  // Venus in Aries
      Mars: 'Sun',    // Mars in Leo → but Sun maps to Venus, loop
    };
    expect(findFinalDispositor(chain)).toBeNull();
  });
});

describe('computeHemispheres', () => {
  it('all in houses 1-6 → north=6, south=0', () => {
    const positions = [
      { house: 1 }, { house: 2 }, { house: 3 },
      { house: 4 }, { house: 5 }, { house: 6 },
    ];
    const result = computeHemispheres(positions);
    expect(result.north).toBe(6);
    expect(result.south).toBe(0);
  });

  it('all in houses 7-12 → south=6, north=0', () => {
    const positions = [
      { house: 7 }, { house: 8 }, { house: 9 },
      { house: 10 }, { house: 11 }, { house: 12 },
    ];
    const result = computeHemispheres(positions);
    expect(result.south).toBe(6);
    expect(result.north).toBe(0);
  });

  it('computes east/west correctly', () => {
    // E = houses 10,11,12,1,2,3 ; W = houses 4,5,6,7,8,9
    const positions = [
      { house: 1 }, { house: 2 }, { house: 3 },
      { house: 10 }, { house: 11 }, { house: 12 },
    ];
    const result = computeHemispheres(positions);
    expect(result.east).toBe(6);
    expect(result.west).toBe(0);
  });
});

describe('isOriental', () => {
  it('returns true when planet rises before Sun', () => {
    // Body at 80°, Sun at 100° → body is behind Sun in zodiac → oriental
    const result = isOriental(80, 100);
    expect(result).toBe(true);
  });

  it('returns false when planet sets after Sun', () => {
    // Body at 120°, Sun at 100° → body is ahead of Sun → occidental
    const result = isOriental(120, 100);
    expect(result).toBe(false);
  });
});

describe('isVoidOfCourseMoon', () => {
  it('returns false when Moon can aspect another planet before sign change', () => {
    // Moon at 10° Aries (10°), speed 12°/day, other planet at 80° (Gemini 20°)
    // Sextile (60°) aspect point: 80 - 60 = 20°, which is ahead of Moon (10°)
    // and before Aries boundary (30°). So Moon applies to sextile before leaving Aries.
    const result = isVoidOfCourseMoon(10, 12, 'Aries', [{ longitude: 80 }], [0, 60, 90, 120, 180]);
    expect(result).toBe(false);
  });

  it('returns true when Moon cannot aspect any planet before sign change', () => {
    // Moon at 28° Aries (28°), speed 12°/day, only planet at 200° (Libra 20°)
    // Moon leaves Aries at 30°, only 2° to go. No Ptolemaic aspect within 2°.
    const result = isVoidOfCourseMoon(28, 12, 'Aries', [{ longitude: 200 }], [0, 60, 90, 120, 180]);
    expect(result).toBe(true);
  });
});

describe('computePlanetaryHour', () => {
  it('returns a valid planetary hour result', () => {
    const date = new Date(Date.UTC(2024, 0, 7, 14, 0, 0)); // Sunday afternoon
    const result = computePlanetaryHour(date, 40, -74); // NYC-ish
    expect(result).toHaveProperty('planet');
    expect(result).toHaveProperty('hourNumber');
    expect(result).toHaveProperty('isDayHour');
    expect(typeof result.planet).toBe('string');
    expect(result.hourNumber).toBeGreaterThanOrEqual(1);
    expect(result.hourNumber).toBeLessThanOrEqual(24);
  });

  it('first hour of Sunday is Sun', () => {
    // First planetary hour of the day = day ruler
    // For Sunday, at sunrise, the planetary hour should be Sun
    // Use Sunday March 24, 2024 near equinox at equator, lng=0
    // Sunrise ~6:00 UTC, day hour ~1h each, 6:20 safely in first hour
    const date = new Date(Date.UTC(2024, 2, 24, 6, 20, 0));
    const result = computePlanetaryHour(date, 0, 0);
    expect(result.planet).toBe('Sun');
    expect(result.hourNumber).toBe(1);
    expect(result.isDayHour).toBe(true);
  });
});
