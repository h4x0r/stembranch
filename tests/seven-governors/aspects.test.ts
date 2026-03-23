import { describe, it, expect } from 'vitest';
import { computeAspects } from '../../src/seven-governors/data/aspects';
import type { GovernorOrRemainder } from '../../src/seven-governors';

describe('computeAspects', () => {
  it('finds 合 when two bodies share a palace', () => {
    const map = new Map<GovernorOrRemainder, number>([['sun', 3], ['mars', 3]]);
    const aspects = computeAspects(map);
    expect(aspects).toHaveLength(1);
    expect(aspects[0].type).toBe('合');
  });
  it('finds 沖 for 6 palaces apart', () => {
    const map = new Map<GovernorOrRemainder, number>([['sun', 0], ['moon', 6]]);
    const aspects = computeAspects(map);
    expect(aspects).toHaveLength(1);
    expect(aspects[0].type).toBe('沖');
  });
  it('finds 三合 for 4 palaces apart', () => {
    const map = new Map<GovernorOrRemainder, number>([['jupiter', 0], ['venus', 4]]);
    expect(computeAspects(map)[0].type).toBe('三合');
  });
  it('finds 刑 for 3 palaces apart', () => {
    const map = new Map<GovernorOrRemainder, number>([['mars', 1], ['saturn', 4]]);
    expect(computeAspects(map)[0].type).toBe('刑');
  });
  it('handles wrap-around (2 apart → no aspect)', () => {
    const map = new Map<GovernorOrRemainder, number>([['sun', 0], ['moon', 10]]);
    expect(computeAspects(map)).toHaveLength(0);
  });
  it('finds multiple aspects with multiple bodies', () => {
    const map = new Map<GovernorOrRemainder, number>([['sun', 0], ['moon', 0], ['mars', 6]]);
    expect(computeAspects(map)).toHaveLength(3); // sun-moon 合, sun-mars 沖, moon-mars 沖
  });
});
