import { describe, it, expect } from 'vitest';
import { DIZHI, DIZHI_ELEMENT, dizhiYinYang, dizhiByIndex, dizhiFromHour, dizhiFromMonth } from '../src/dizhi';

describe('DIZHI', () => {
  it('has 12 branches in correct order', () => {
    expect(DIZHI).toEqual(['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']);
    expect(DIZHI).toHaveLength(12);
  });
});

describe('DIZHI_ELEMENT', () => {
  it('maps branches to elements correctly', () => {
    expect(DIZHI_ELEMENT['子']).toBe('水');
    expect(DIZHI_ELEMENT['寅']).toBe('木');
    expect(DIZHI_ELEMENT['巳']).toBe('火');
    expect(DIZHI_ELEMENT['申']).toBe('金');
    expect(DIZHI_ELEMENT['丑']).toBe('土');
    expect(DIZHI_ELEMENT['辰']).toBe('土');
    expect(DIZHI_ELEMENT['未']).toBe('土');
    expect(DIZHI_ELEMENT['戌']).toBe('土');
  });
});

describe('dizhiYinYang', () => {
  it('classifies yang branches (even index)', () => {
    expect(dizhiYinYang('子')).toBe('陽');
    expect(dizhiYinYang('寅')).toBe('陽');
    expect(dizhiYinYang('辰')).toBe('陽');
    expect(dizhiYinYang('午')).toBe('陽');
    expect(dizhiYinYang('申')).toBe('陽');
    expect(dizhiYinYang('戌')).toBe('陽');
  });

  it('classifies yin branches (odd index)', () => {
    expect(dizhiYinYang('丑')).toBe('陰');
    expect(dizhiYinYang('卯')).toBe('陰');
    expect(dizhiYinYang('巳')).toBe('陰');
    expect(dizhiYinYang('未')).toBe('陰');
    expect(dizhiYinYang('酉')).toBe('陰');
    expect(dizhiYinYang('亥')).toBe('陰');
  });
});

describe('dizhiByIndex', () => {
  it('returns correct branch for index', () => {
    expect(dizhiByIndex(0)).toBe('子');
    expect(dizhiByIndex(11)).toBe('亥');
  });

  it('wraps around with mod 12', () => {
    expect(dizhiByIndex(12)).toBe('子');
    expect(dizhiByIndex(15)).toBe('卯');
  });

  it('handles negative indices', () => {
    expect(dizhiByIndex(-1)).toBe('亥');
    expect(dizhiByIndex(-12)).toBe('子');
  });
});

describe('dizhiFromHour', () => {
  it('maps 子時 (23:00-00:59)', () => {
    expect(dizhiFromHour(23)).toBe('子');
    expect(dizhiFromHour(0)).toBe('子');
  });

  it('maps 丑時 (01:00-02:59)', () => {
    expect(dizhiFromHour(1)).toBe('丑');
    expect(dizhiFromHour(2)).toBe('丑');
  });

  it('maps 午時 (11:00-12:59)', () => {
    expect(dizhiFromHour(11)).toBe('午');
    expect(dizhiFromHour(12)).toBe('午');
  });

  it('maps 亥時 (21:00-22:59)', () => {
    expect(dizhiFromHour(21)).toBe('亥');
    expect(dizhiFromHour(22)).toBe('亥');
  });
});

describe('dizhiFromMonth', () => {
  it('maps solar month index to branch (寅=month 0)', () => {
    expect(dizhiFromMonth(0)).toBe('寅');
    expect(dizhiFromMonth(1)).toBe('卯');
    expect(dizhiFromMonth(10)).toBe('子');
    expect(dizhiFromMonth(11)).toBe('丑');
  });
});
