import { describe, it, expect } from 'vitest';
import { computeTropicalChart } from '../src/tropical-astrology';

// Test date: 2024-06-15T14:30:00Z, Taipei (25°N, 121°E)
const date = new Date('2024-06-15T14:30:00Z');
const lat = 25;
const lng = 121;

describe('new celestial bodies in computeTropicalChart', () => {
  const chart = computeTropicalChart(date, lat, lng);
  const bodyNames = chart.positions.map(p => p.body);

  it('includes all original bodies', () => {
    expect(bodyNames).toContain('Sun');
    expect(bodyNames).toContain('Moon');
    expect(bodyNames).toContain('Mercury');
    expect(bodyNames).toContain('Venus');
    expect(bodyNames).toContain('Mars');
    expect(bodyNames).toContain('Jupiter');
    expect(bodyNames).toContain('Saturn');
    expect(bodyNames).toContain('Uranus');
    expect(bodyNames).toContain('Neptune');
    expect(bodyNames).toContain('Pluto');
  });

  it('includes North Node', () => {
    expect(bodyNames).toContain('North Node');
    const nn = chart.positions.find(p => p.body === 'North Node')!;
    expect(nn.longitude).toBeGreaterThanOrEqual(0);
    expect(nn.longitude).toBeLessThan(360);
  });

  it('includes South Node opposite North Node', () => {
    expect(bodyNames).toContain('South Node');
    const nn = chart.positions.find(p => p.body === 'North Node')!;
    const sn = chart.positions.find(p => p.body === 'South Node')!;
    const diff = Math.abs(nn.longitude - sn.longitude);
    const separation = diff > 180 ? 360 - diff : diff;
    expect(separation).toBeCloseTo(180, 0);
  });

  it('includes Chiron with valid position', () => {
    expect(bodyNames).toContain('Chiron');
    const chiron = chart.positions.find(p => p.body === 'Chiron')!;
    expect(chiron.longitude).toBeGreaterThanOrEqual(0);
    expect(chiron.longitude).toBeLessThan(360);
    // Chiron in June 2024 should be in Aries (~22°)
    expect(chiron.longitude).toBeGreaterThan(10);
    expect(chiron.longitude).toBeLessThan(35);
  });

  it('includes Lilith (Mean Black Moon)', () => {
    expect(bodyNames).toContain('Lilith');
    const lilith = chart.positions.find(p => p.body === 'Lilith')!;
    expect(lilith.longitude).toBeGreaterThanOrEqual(0);
    expect(lilith.longitude).toBeLessThan(360);
  });

  it('includes Part of Fortune with valid formula', () => {
    expect(bodyNames).toContain('Part of Fortune');
    const pof = chart.positions.find(p => p.body === 'Part of Fortune')!;
    expect(pof.longitude).toBeGreaterThanOrEqual(0);
    expect(pof.longitude).toBeLessThan(360);

    // Verify formula: ASC + Moon - Sun (day chart, Sun above horizon)
    const sun = chart.positions.find(p => p.body === 'Sun')!;
    const moon = chart.positions.find(p => p.body === 'Moon')!;
    const asc = chart.houses.ascendant;

    // Day formula: ASC + Moon - Sun
    const dayPof = ((asc + moon.longitude - sun.longitude) % 360 + 360) % 360;
    // Night formula: ASC + Sun - Moon
    const nightPof = ((asc + sun.longitude - moon.longitude) % 360 + 360) % 360;

    // Should match one of the two formulas
    const matchesDay = Math.abs(pof.longitude - dayPof) < 0.01;
    const matchesNight = Math.abs(pof.longitude - nightPof) < 0.01;
    expect(matchesDay || matchesNight).toBe(true);
  });

  it('includes Vertex', () => {
    expect(bodyNames).toContain('Vertex');
    const vertex = chart.positions.find(p => p.body === 'Vertex')!;
    expect(vertex.longitude).toBeGreaterThanOrEqual(0);
    expect(vertex.longitude).toBeLessThan(360);
  });

  it('has at least 16 bodies total', () => {
    expect(chart.positions.length).toBeGreaterThanOrEqual(16);
  });

  it('all positions have valid house assignments', () => {
    for (const pos of chart.positions) {
      expect(pos.house).toBeGreaterThanOrEqual(1);
      expect(pos.house).toBeLessThanOrEqual(12);
    }
  });
});
