import { describe, it, expect } from 'vitest';
import { HARMONY_PAIRS, CLASH_PAIRS, isHarmony, isClash, getDayRelation } from '../src/branch-relations';

describe('HARMONY_PAIRS', () => {
  it('has 6 harmony pairs', () => {
    expect(HARMONY_PAIRS).toHaveLength(6);
  });
});

describe('CLASH_PAIRS', () => {
  it('has 6 clash pairs', () => {
    expect(CLASH_PAIRS).toHaveLength(6);
  });
});

describe('isHarmony', () => {
  it('detects harmony pairs', () => {
    expect(isHarmony('子', '丑')).toBe(true);
    expect(isHarmony('寅', '亥')).toBe(true);
    expect(isHarmony('午', '未')).toBe(true);
  });

  it('is bidirectional', () => {
    expect(isHarmony('丑', '子')).toBe(true);
    expect(isHarmony('亥', '寅')).toBe(true);
  });

  it('rejects non-harmony pairs', () => {
    expect(isHarmony('子', '午')).toBe(false);
    expect(isHarmony('子', '子')).toBe(false);
  });
});

describe('isClash', () => {
  it('detects clash pairs', () => {
    expect(isClash('子', '午')).toBe(true);
    expect(isClash('寅', '申')).toBe(true);
    expect(isClash('巳', '亥')).toBe(true);
  });

  it('is bidirectional', () => {
    expect(isClash('午', '子')).toBe(true);
  });

  it('rejects non-clash pairs', () => {
    expect(isClash('子', '丑')).toBe(false);
  });
});

describe('getDayRelation', () => {
  it('returns 合 for harmony pairs (highest priority)', () => {
    expect(getDayRelation('子', '丑')).toBe('合');
  });

  it('returns 沖 for clash pairs', () => {
    expect(getDayRelation('子', '午')).toBe('沖');
  });

  it('returns 生 for generative relationship', () => {
    // 子=水 → 寅=木 : 水生木 → 生
    expect(getDayRelation('子', '寅')).toBe('生');
  });

  it('returns 剋 for conquering relationship', () => {
    // 子=水 → 巳=火 : 水剋火 → 剋
    expect(getDayRelation('子', '巳')).toBe('剋');
  });

  it('returns 比和 for same-element pairs', () => {
    // 子=水 → 亥=水, but 子亥 is NOT a 六合 or 六沖 pair → 比和
    expect(getDayRelation('子', '亥')).toBe('比和');
  });
});
