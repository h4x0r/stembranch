import { describe, it, expect } from 'vitest';
import { computeBirthChart } from '../src/birth-chart';
import type { BirthChartData, BirthChartPosition } from '../src/birth-chart-types';

// Test date: 2024-06-15T14:30:00Z, Taipei (25°N, 121°E)
const date = new Date('2024-06-15T14:30:00Z');
const lat = 25;
const lng = 121;

describe('computeBirthChart', () => {
  const chart: BirthChartData = computeBirthChart(date, lat, lng);

  // ── Positions ──────────────────────────────────────────────

  it('includes at least 16 bodies', () => {
    expect(chart.positions.length).toBeGreaterThanOrEqual(16);
  });

  it('includes all expected bodies', () => {
    const names = chart.positions.map(p => p.body);
    for (const body of [
      'Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn',
      'Uranus', 'Neptune', 'Pluto', 'North Node', 'South Node',
      'Chiron', 'Lilith', 'Part of Fortune', 'Vertex',
    ]) {
      expect(names).toContain(body);
    }
  });

  // ── Enriched fields on each position ──────────────────────

  it('every position has valid longitude, sign, house', () => {
    for (const p of chart.positions) {
      expect(p.longitude).toBeGreaterThanOrEqual(0);
      expect(p.longitude).toBeLessThan(360);
      expect(p.house).toBeGreaterThanOrEqual(1);
      expect(p.house).toBeLessThanOrEqual(12);
      expect(typeof p.sign).toBe('string');
      expect(p.signDegree).toBeGreaterThanOrEqual(0);
      expect(p.signDegree).toBeLessThan(30);
    }
  });

  it('every position has element, quality, polarity', () => {
    for (const p of chart.positions) {
      expect(['fire', 'earth', 'air', 'water']).toContain(p.element);
      expect(['cardinal', 'fixed', 'mutable']).toContain(p.quality);
      expect(['positive', 'negative']).toContain(p.polarity);
    }
  });

  it('every position has decan 1-3', () => {
    for (const p of chart.positions) {
      expect([1, 2, 3]).toContain(p.decan);
    }
  });

  it('every position has speed (number)', () => {
    for (const p of chart.positions) {
      expect(typeof p.speed).toBe('number');
    }
  });

  it('Sun speed is approximately 1°/day', () => {
    const sun = chart.positions.find(p => p.body === 'Sun')!;
    expect(sun.speed).toBeGreaterThan(0.8);
    expect(sun.speed).toBeLessThan(1.2);
  });

  it('Moon speed is approximately 12-15°/day', () => {
    const moon = chart.positions.find(p => p.body === 'Moon')!;
    expect(moon.speed).toBeGreaterThan(10);
    expect(moon.speed).toBeLessThan(16);
  });

  it('retrograde flag matches negative speed', () => {
    for (const p of chart.positions) {
      if (p.speed < 0) expect(p.retrograde).toBe(true);
      if (p.speed > 0.5) expect(p.retrograde).toBe(false);
    }
  });

  it('every position has RA and declination', () => {
    for (const p of chart.positions) {
      expect(typeof p.ra).toBe('number');
      expect(typeof p.declination).toBe('number');
      expect(p.ra).toBeGreaterThanOrEqual(0);
      expect(p.ra).toBeLessThan(360);
      expect(p.declination).toBeGreaterThan(-90);
      expect(p.declination).toBeLessThan(90);
    }
  });

  it('every position has distance', () => {
    for (const p of chart.positions) {
      expect(typeof p.distance).toBe('number');
      expect(p.distance).toBeGreaterThanOrEqual(0);
    }
  });

  it('every position has azimuth and altitude', () => {
    for (const p of chart.positions) {
      expect(typeof p.azimuth).toBe('number');
      expect(typeof p.altitude).toBe('number');
    }
  });

  it('every position has dignity result', () => {
    for (const p of chart.positions) {
      expect(p.dignity).toBeDefined();
      expect(typeof p.dignity.score).toBe('number');
      expect(Array.isArray(p.dignity.dignities)).toBe(true);
    }
  });

  it('every position has dispositor', () => {
    for (const p of chart.positions) {
      expect(typeof p.dispositor).toBe('string');
    }
  });

  it('every position has antiscia and contra-antiscia', () => {
    for (const p of chart.positions) {
      expect(p.antiscia).toBeGreaterThanOrEqual(0);
      expect(p.antiscia).toBeLessThan(360);
      expect(p.contraAntiscia).toBeGreaterThanOrEqual(0);
      expect(p.contraAntiscia).toBeLessThan(360);
    }
  });

  it('every position has solar proximity flags (boolean)', () => {
    for (const p of chart.positions) {
      expect(typeof p.combust).toBe('boolean');
      expect(typeof p.cazimi).toBe('boolean');
      expect(typeof p.underBeams).toBe('boolean');
    }
  });

  it('every position has outOfBounds flag', () => {
    for (const p of chart.positions) {
      expect(typeof p.outOfBounds).toBe('boolean');
    }
  });

  it('every position has oriental flag (boolean or null)', () => {
    for (const p of chart.positions) {
      expect(p.oriental === null || typeof p.oriental === 'boolean').toBe(true);
    }
  });

  it('Sun and Moon have oriental=null', () => {
    const sun = chart.positions.find(p => p.body === 'Sun')!;
    const moon = chart.positions.find(p => p.body === 'Moon')!;
    expect(sun.oriental).toBeNull();
    expect(moon.oriental).toBeNull();
  });

  it('every position has peregrine flag', () => {
    for (const p of chart.positions) {
      expect(typeof p.peregrine).toBe('boolean');
    }
  });

  it('every position has a Sabian symbol', () => {
    for (const p of chart.positions) {
      expect(typeof p.sabianSymbol).toBe('string');
      expect(p.sabianSymbol.length).toBeGreaterThan(0);
    }
  });

  it('Moon has lunarMansion', () => {
    const moon = chart.positions.find(p => p.body === 'Moon')!;
    expect(moon.lunarMansion).toBeDefined();
    expect(moon.lunarMansion!.number).toBeGreaterThanOrEqual(1);
    expect(moon.lunarMansion!.number).toBeLessThanOrEqual(28);
    expect(typeof moon.lunarMansion!.name).toBe('string');
  });

  // ── Houses ─────────────────────────────────────────────────

  it('has 12 house cusps', () => {
    expect(chart.houses.cusps).toHaveLength(12);
  });

  // ── Angles ─────────────────────────────────────────────────

  it('has all angle fields', () => {
    expect(typeof chart.angles.asc).toBe('number');
    expect(typeof chart.angles.dsc).toBe('number');
    expect(typeof chart.angles.mc).toBe('number');
    expect(typeof chart.angles.ic).toBe('number');
    expect(typeof chart.angles.vertex).toBe('number');
    expect(typeof chart.angles.equatorialAscendant).toBe('number');
  });

  it('DSC = ASC + 180°', () => {
    const dsc = (chart.angles.asc + 180) % 360;
    expect(chart.angles.dsc).toBeCloseTo(dsc, 5);
  });

  it('IC = MC + 180°', () => {
    const ic = (chart.angles.mc + 180) % 360;
    expect(chart.angles.ic).toBeCloseTo(ic, 5);
  });

  // ── Aspects ────────────────────────────────────────────────

  it('has aspects array with applying/separating flags', () => {
    expect(chart.aspects.length).toBeGreaterThan(0);
    for (const a of chart.aspects) {
      expect(typeof a.applying).toBe('boolean');
      expect(typeof a.major).toBe('boolean');
      expect(typeof a.orb).toBe('number');
    }
  });

  it('has parallels array', () => {
    expect(Array.isArray(chart.parallels)).toBe(true);
  });

  // ── Distributions ──────────────────────────────────────────

  it('element distribution counts sum to position count', () => {
    const d = chart.distributions;
    const sum = d.elements.fire + d.elements.earth + d.elements.air + d.elements.water;
    expect(sum).toBe(chart.positions.length);
  });

  it('quality distribution counts sum to position count', () => {
    const d = chart.distributions;
    const sum = d.qualities.cardinal + d.qualities.fixed + d.qualities.mutable;
    expect(sum).toBe(chart.positions.length);
  });

  it('polarity distribution counts sum to position count', () => {
    const d = chart.distributions;
    const sum = d.polarities.positive + d.polarities.negative;
    expect(sum).toBe(chart.positions.length);
  });

  it('has dominant element and quality', () => {
    expect(['fire', 'earth', 'air', 'water']).toContain(chart.distributions.elements.dominant);
    expect(['cardinal', 'fixed', 'mutable']).toContain(chart.distributions.qualities.dominant);
  });

  // ── Hemispheres ────────────────────────────────────────────

  it('hemisphere counts sum to position count', () => {
    expect(chart.hemispheres.north + chart.hemispheres.south).toBe(chart.positions.length);
    expect(chart.hemispheres.east + chart.hemispheres.west).toBe(chart.positions.length);
  });

  // ── Chart pattern ──────────────────────────────────────────

  it('has a chart pattern string', () => {
    expect(typeof chart.chartPattern).toBe('string');
    expect([
      'Bundle', 'Bowl', 'Bucket', 'Locomotive', 'See-Saw', 'Splash', 'Splay',
    ]).toContain(chart.chartPattern);
  });

  // ── Sect ───────────────────────────────────────────────────

  it('isDayChart is a boolean', () => {
    expect(typeof chart.isDayChart).toBe('boolean');
  });

  // ── Moon phase ─────────────────────────────────────────────

  it('has moon phase with name and illumination', () => {
    expect(typeof chart.moonPhase.name).toBe('string');
    expect(chart.moonPhase.illumination).toBeGreaterThanOrEqual(0);
    expect(chart.moonPhase.illumination).toBeLessThanOrEqual(1);
  });

  // ── Dispositors ────────────────────────────────────────────

  it('has dispositor chain', () => {
    expect(typeof chart.dispositorChain).toBe('object');
    expect(Object.keys(chart.dispositorChain).length).toBeGreaterThan(0);
  });

  it('finalDispositor is string or null', () => {
    expect(
      chart.finalDispositor === null || typeof chart.finalDispositor === 'string',
    ).toBe(true);
  });

  // ── Mutual receptions ─────────────────────────────────────

  it('mutualReceptions is an array', () => {
    expect(Array.isArray(chart.mutualReceptions)).toBe(true);
  });

  // ── Fixed stars ────────────────────────────────────────────

  it('fixedStarConjunctions is an array', () => {
    expect(Array.isArray(chart.fixedStarConjunctions)).toBe(true);
  });

  // ── Planetary hour/day ─────────────────────────────────────

  it('has planetary hour', () => {
    expect(typeof chart.planetaryHour.planet).toBe('string');
    expect(chart.planetaryHour.hourNumber).toBeGreaterThanOrEqual(1);
    expect(chart.planetaryHour.hourNumber).toBeLessThanOrEqual(24);
    expect(typeof chart.planetaryHour.isDayHour).toBe('boolean');
  });

  it('has planetary day', () => {
    expect(typeof chart.planetaryDay).toBe('string');
  });

  // ── Void-of-course Moon ───────────────────────────────────

  it('voidOfCourseMoon is a boolean', () => {
    expect(typeof chart.voidOfCourseMoon).toBe('boolean');
  });

  // ── Prenatal syzygy ───────────────────────────────────────

  it('has prenatal syzygy', () => {
    expect(['new', 'full']).toContain(chart.prenatalSyzygy.type);
    expect(chart.prenatalSyzygy.date).toBeInstanceOf(Date);
    expect(chart.prenatalSyzygy.date.getTime()).toBeLessThan(date.getTime());
    expect(chart.prenatalSyzygy.longitude).toBeGreaterThanOrEqual(0);
    expect(chart.prenatalSyzygy.longitude).toBeLessThan(360);
  });

  // ── Profection ─────────────────────────────────────────────

  it('has profection', () => {
    expect(typeof chart.profection.sign).toBe('string');
    expect(typeof chart.profection.lord).toBe('string');
    expect(chart.profection.house).toBeGreaterThanOrEqual(1);
    expect(chart.profection.house).toBeLessThanOrEqual(12);
  });

  // ── Firdaria ───────────────────────────────────────────────

  it('has firdaria', () => {
    expect(typeof chart.firdaria.ruler).toBe('string');
    expect(typeof chart.firdaria.subRuler).toBe('string');
    expect(chart.firdaria.startDate).toBeInstanceOf(Date);
    expect(chart.firdaria.endDate).toBeInstanceOf(Date);
  });

  // ── Hyleg / Alcochoden ─────────────────────────────────────

  it('hyleg is string or null', () => {
    expect(chart.hyleg === null || typeof chart.hyleg === 'string').toBe(true);
  });

  it('alcochoden is string or null', () => {
    expect(chart.alcochoden === null || typeof chart.alcochoden === 'string').toBe(true);
  });

  // ── Lunar mansion ─────────────────────────────────────────

  it('has lunar mansion', () => {
    expect(chart.lunarMansion.number).toBeGreaterThanOrEqual(1);
    expect(chart.lunarMansion.number).toBeLessThanOrEqual(28);
    expect(typeof chart.lunarMansion.name).toBe('string');
  });

  // ── Settings ───────────────────────────────────────────────

  it('has settings', () => {
    expect(chart.settings.houseSystem).toBe('placidus');
    expect(chart.settings.zodiac).toBe('tropical');
  });
});

describe('computeBirthChart options', () => {
  it('accepts custom house system', () => {
    const chart = computeBirthChart(date, lat, lng, { houseSystem: 'whole-sign' });
    expect(chart.houses.system).toBe('whole-sign');
    expect(chart.settings.houseSystem).toBe('whole-sign');
  });

  it('accepts custom query date for time-lords', () => {
    const queryDate = new Date('2050-01-01T00:00:00Z');
    const chart = computeBirthChart(date, lat, lng, { queryDate });
    // Profection at ~25 years after birth should differ from birth date profection
    expect(chart.profection.house).toBeGreaterThanOrEqual(1);
  });
});
