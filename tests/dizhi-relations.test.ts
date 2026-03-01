import { describe, it, expect } from 'vitest';
import { LIUHE_PAIRS, LIUCHONG_PAIRS, isLiuHe, isLiuChong, getDayRelation } from '../src/dizhi-relations';

describe('LIUHE_PAIRS', () => {
  it('has 6 harmony pairs', () => {
    expect(LIUHE_PAIRS).toHaveLength(6);
  });
});

describe('LIUCHONG_PAIRS', () => {
  it('has 6 clash pairs', () => {
    expect(LIUCHONG_PAIRS).toHaveLength(6);
  });
});

describe('isLiuHe', () => {
  it('detects harmony pairs', () => {
    expect(isLiuHe('子', '丑')).toBe(true);
    expect(isLiuHe('寅', '亥')).toBe(true);
    expect(isLiuHe('午', '未')).toBe(true);
  });

  it('is bidirectional', () => {
    expect(isLiuHe('丑', '子')).toBe(true);
    expect(isLiuHe('亥', '寅')).toBe(true);
  });

  it('rejects non-harmony pairs', () => {
    expect(isLiuHe('子', '午')).toBe(false);
    expect(isLiuHe('子', '子')).toBe(false);
  });
});

describe('isLiuChong', () => {
  it('detects clash pairs', () => {
    expect(isLiuChong('子', '午')).toBe(true);
    expect(isLiuChong('寅', '申')).toBe(true);
    expect(isLiuChong('巳', '亥')).toBe(true);
  });

  it('is bidirectional', () => {
    expect(isLiuChong('午', '子')).toBe(true);
  });

  it('rejects non-clash pairs', () => {
    expect(isLiuChong('子', '丑')).toBe(false);
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
