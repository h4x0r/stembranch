import { describe, it, expect } from 'vitest';
import { TIANGAN, TIANGAN_ELEMENT, tianganYinYang, tianganByIndex } from '../src/tiangan';

describe('TIANGAN', () => {
  it('has 10 stems in correct order', () => {
    expect(TIANGAN).toEqual(['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']);
    expect(TIANGAN).toHaveLength(10);
  });
});

describe('TIANGAN_ELEMENT', () => {
  it('maps paired stems to elements', () => {
    expect(TIANGAN_ELEMENT['甲']).toBe('木');
    expect(TIANGAN_ELEMENT['乙']).toBe('木');
    expect(TIANGAN_ELEMENT['丙']).toBe('火');
    expect(TIANGAN_ELEMENT['丁']).toBe('火');
    expect(TIANGAN_ELEMENT['戊']).toBe('土');
    expect(TIANGAN_ELEMENT['己']).toBe('土');
    expect(TIANGAN_ELEMENT['庚']).toBe('金');
    expect(TIANGAN_ELEMENT['辛']).toBe('金');
    expect(TIANGAN_ELEMENT['壬']).toBe('水');
    expect(TIANGAN_ELEMENT['癸']).toBe('水');
  });
});

describe('tianganYinYang', () => {
  it('classifies yang stems (even index)', () => {
    expect(tianganYinYang('甲')).toBe('陽');
    expect(tianganYinYang('丙')).toBe('陽');
    expect(tianganYinYang('戊')).toBe('陽');
    expect(tianganYinYang('庚')).toBe('陽');
    expect(tianganYinYang('壬')).toBe('陽');
  });

  it('classifies yin stems (odd index)', () => {
    expect(tianganYinYang('乙')).toBe('陰');
    expect(tianganYinYang('丁')).toBe('陰');
    expect(tianganYinYang('己')).toBe('陰');
    expect(tianganYinYang('辛')).toBe('陰');
    expect(tianganYinYang('癸')).toBe('陰');
  });
});

describe('tianganByIndex', () => {
  it('returns correct stem for index', () => {
    expect(tianganByIndex(0)).toBe('甲');
    expect(tianganByIndex(9)).toBe('癸');
  });

  it('wraps around with mod 10', () => {
    expect(tianganByIndex(10)).toBe('甲');
    expect(tianganByIndex(13)).toBe('丁');
  });

  it('handles negative indices', () => {
    expect(tianganByIndex(-1)).toBe('癸');
    expect(tianganByIndex(-10)).toBe('甲');
  });
});
