import { describe, it, expect } from 'vitest';
import { GOVERNORS, REMAINDERS, ALL_BODIES, BODY_CHINESE, PALACE_ROLES } from '../../src/seven-governors';

describe('seven-governors types', () => {
  it('has 7 governors', () => {
    expect(GOVERNORS).toHaveLength(7);
  });

  it('has 4 remainders', () => {
    expect(REMAINDERS).toHaveLength(4);
  });

  it('ALL_BODIES has 11 entries', () => {
    expect(ALL_BODIES).toHaveLength(11);
  });

  it('every body has a Chinese name', () => {
    for (const body of ALL_BODIES) {
      expect(BODY_CHINESE[body]).toBeTruthy();
    }
  });

  it('has 12 palace roles', () => {
    expect(PALACE_ROLES).toHaveLength(12);
  });
});
