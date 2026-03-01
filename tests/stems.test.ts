import { describe, it, expect } from 'vitest';
import { STEMS, STEM_ELEMENT, stemPolarity, stemByIndex } from '../src/stems';

describe('STEMS', () => {
  it('has 10 stems in correct order', () => {
    expect(STEMS).toEqual(['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']);
    expect(STEMS).toHaveLength(10);
  });
});

describe('STEM_ELEMENT', () => {
  it('maps paired stems to elements', () => {
    expect(STEM_ELEMENT['甲']).toBe('木');
    expect(STEM_ELEMENT['乙']).toBe('木');
    expect(STEM_ELEMENT['丙']).toBe('火');
    expect(STEM_ELEMENT['丁']).toBe('火');
    expect(STEM_ELEMENT['戊']).toBe('土');
    expect(STEM_ELEMENT['己']).toBe('土');
    expect(STEM_ELEMENT['庚']).toBe('金');
    expect(STEM_ELEMENT['辛']).toBe('金');
    expect(STEM_ELEMENT['壬']).toBe('水');
    expect(STEM_ELEMENT['癸']).toBe('水');
  });
});

describe('stemPolarity', () => {
  it('classifies yang stems (even index)', () => {
    expect(stemPolarity('甲')).toBe('陽');
    expect(stemPolarity('丙')).toBe('陽');
    expect(stemPolarity('戊')).toBe('陽');
    expect(stemPolarity('庚')).toBe('陽');
    expect(stemPolarity('壬')).toBe('陽');
  });

  it('classifies yin stems (odd index)', () => {
    expect(stemPolarity('乙')).toBe('陰');
    expect(stemPolarity('丁')).toBe('陰');
    expect(stemPolarity('己')).toBe('陰');
    expect(stemPolarity('辛')).toBe('陰');
    expect(stemPolarity('癸')).toBe('陰');
  });
});

describe('stemByIndex', () => {
  it('returns correct stem for index', () => {
    expect(stemByIndex(0)).toBe('甲');
    expect(stemByIndex(9)).toBe('癸');
  });

  it('wraps around with mod 10', () => {
    expect(stemByIndex(10)).toBe('甲');
    expect(stemByIndex(13)).toBe('丁');
  });

  it('handles negative indices', () => {
    expect(stemByIndex(-1)).toBe('癸');
    expect(stemByIndex(-10)).toBe('甲');
  });
});
