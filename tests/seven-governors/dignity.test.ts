import { describe, it, expect } from 'vitest';
import { DIGNITY_TABLE, getDignity } from '../../src/seven-governors/data/dignity';
import { ALL_BODIES } from '../../src/seven-governors';

const PALACES = ['子宮','丑宮','寅宮','卯宮','辰宮','巳宮','午宮','未宮','申宮','酉宮','戌宮','亥宮'] as const;
const VALID = ['廟', '旺', '平', '陷'];

describe('dignity table', () => {
  it('has entries for all 11 bodies', () => {
    for (const body of ALL_BODIES) expect(DIGNITY_TABLE[body]).toBeTruthy();
  });
  it('each body has all 12 palaces', () => {
    for (const body of ALL_BODIES)
      for (const p of PALACES) expect(DIGNITY_TABLE[body][p]).toBeTruthy();
  });
  it('all values are valid dignity levels', () => {
    for (const body of ALL_BODIES)
      for (const p of PALACES) expect(VALID).toContain(DIGNITY_TABLE[body][p]);
  });
  it('getDignity returns correct lookup', () => {
    expect(getDignity('sun', '巳宮')).toBe('廟');
    expect(getDignity('sun', '子宮')).toBe('陷');
  });
});
