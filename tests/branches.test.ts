import { describe, it, expect } from 'vitest';
import { BRANCHES, BRANCH_ELEMENT, branchPolarity, branchByIndex, branchFromHour, branchFromMonth } from '../src/branches';

describe('BRANCHES', () => {
  it('has 12 branches in correct order', () => {
    expect(BRANCHES).toEqual(['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']);
    expect(BRANCHES).toHaveLength(12);
  });
});

describe('BRANCH_ELEMENT', () => {
  it('maps branches to elements correctly', () => {
    expect(BRANCH_ELEMENT['子']).toBe('水');
    expect(BRANCH_ELEMENT['寅']).toBe('木');
    expect(BRANCH_ELEMENT['巳']).toBe('火');
    expect(BRANCH_ELEMENT['申']).toBe('金');
    expect(BRANCH_ELEMENT['丑']).toBe('土');
    expect(BRANCH_ELEMENT['辰']).toBe('土');
    expect(BRANCH_ELEMENT['未']).toBe('土');
    expect(BRANCH_ELEMENT['戌']).toBe('土');
  });
});

describe('branchPolarity', () => {
  it('classifies yang branches (even index)', () => {
    expect(branchPolarity('子')).toBe('陽');
    expect(branchPolarity('寅')).toBe('陽');
    expect(branchPolarity('辰')).toBe('陽');
    expect(branchPolarity('午')).toBe('陽');
    expect(branchPolarity('申')).toBe('陽');
    expect(branchPolarity('戌')).toBe('陽');
  });

  it('classifies yin branches (odd index)', () => {
    expect(branchPolarity('丑')).toBe('陰');
    expect(branchPolarity('卯')).toBe('陰');
    expect(branchPolarity('巳')).toBe('陰');
    expect(branchPolarity('未')).toBe('陰');
    expect(branchPolarity('酉')).toBe('陰');
    expect(branchPolarity('亥')).toBe('陰');
  });
});

describe('branchByIndex', () => {
  it('returns correct branch for index', () => {
    expect(branchByIndex(0)).toBe('子');
    expect(branchByIndex(11)).toBe('亥');
  });

  it('wraps around with mod 12', () => {
    expect(branchByIndex(12)).toBe('子');
    expect(branchByIndex(15)).toBe('卯');
  });

  it('handles negative indices', () => {
    expect(branchByIndex(-1)).toBe('亥');
    expect(branchByIndex(-12)).toBe('子');
  });
});

describe('branchFromHour', () => {
  it('maps 子時 (23:00-00:59)', () => {
    expect(branchFromHour(23)).toBe('子');
    expect(branchFromHour(0)).toBe('子');
  });

  it('maps 丑時 (01:00-02:59)', () => {
    expect(branchFromHour(1)).toBe('丑');
    expect(branchFromHour(2)).toBe('丑');
  });

  it('maps 午時 (11:00-12:59)', () => {
    expect(branchFromHour(11)).toBe('午');
    expect(branchFromHour(12)).toBe('午');
  });

  it('maps 亥時 (21:00-22:59)', () => {
    expect(branchFromHour(21)).toBe('亥');
    expect(branchFromHour(22)).toBe('亥');
  });
});

describe('branchFromMonth', () => {
  it('maps solar month index to branch (寅=month 0)', () => {
    expect(branchFromMonth(0)).toBe('寅');
    expect(branchFromMonth(1)).toBe('卯');
    expect(branchFromMonth(10)).toBe('子');
    expect(branchFromMonth(11)).toBe('丑');
  });
});
