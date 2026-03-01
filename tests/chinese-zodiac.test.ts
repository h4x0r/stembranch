import { describe, it, expect } from 'vitest';
import {
  ZODIAC_ANIMALS, ZODIAC_ENGLISH,
  animalFromBranch, branchFromAnimal,
  getChineseZodiac, getChineseZodiacLichun,
} from '../src/chinese-zodiac';

describe('ZODIAC_ANIMALS', () => {
  it('has 12 animals', () => {
    expect(ZODIAC_ANIMALS).toHaveLength(12);
  });

  it('starts with 鼠 and ends with 豬', () => {
    expect(ZODIAC_ANIMALS[0]).toBe('鼠');
    expect(ZODIAC_ANIMALS[11]).toBe('豬');
  });
});

describe('ZODIAC_ENGLISH', () => {
  it('maps all animals to English', () => {
    expect(ZODIAC_ENGLISH['鼠']).toBe('Rat');
    expect(ZODIAC_ENGLISH['龍']).toBe('Dragon');
    expect(ZODIAC_ENGLISH['馬']).toBe('Horse');
    expect(ZODIAC_ENGLISH['豬']).toBe('Pig');
  });
});

describe('animalFromBranch', () => {
  it('maps 子 → 鼠', () => {
    expect(animalFromBranch('子')).toBe('鼠');
  });

  it('maps 辰 → 龍', () => {
    expect(animalFromBranch('辰')).toBe('龍');
  });

  it('maps 亥 → 豬', () => {
    expect(animalFromBranch('亥')).toBe('豬');
  });
});

describe('branchFromAnimal', () => {
  it('maps 龍 → 辰', () => {
    expect(branchFromAnimal('龍')).toBe('辰');
  });

  it('maps 虎 → 寅', () => {
    expect(branchFromAnimal('虎')).toBe('寅');
  });
});

describe('getChineseZodiacLichun', () => {
  it('2024 after 立春 = 龍 (甲辰)', () => {
    const result = getChineseZodiacLichun(new Date(2024, 2, 1));
    expect(result.animal).toBe('龍');
    expect(result.branch).toBe('辰');
    expect(result.effectiveYear).toBe(2024);
  });

  it('2024 before 立春 = 兔 (癸卯)', () => {
    const result = getChineseZodiacLichun(new Date(2024, 0, 15));
    expect(result.animal).toBe('兔');
    expect(result.branch).toBe('卯');
    expect(result.effectiveYear).toBe(2023);
  });

  it('2000 = 龍 (庚辰)', () => {
    const result = getChineseZodiacLichun(new Date(2000, 5, 1));
    expect(result.animal).toBe('龍');
    expect(result.branch).toBe('辰');
  });

  it('2025 after 立春 = 蛇 (乙巳)', () => {
    const result = getChineseZodiacLichun(new Date(2025, 2, 1));
    expect(result.animal).toBe('蛇');
    expect(result.branch).toBe('巳');
  });
});

describe('getChineseZodiac', () => {
  it('defaults to lichun boundary', () => {
    const result = getChineseZodiac(new Date(2024, 5, 1));
    expect(result.yearBoundary).toBe('lichun');
    expect(result.animal).toBe('龍');
  });

  it('can use lunar-new-year boundary', () => {
    const result = getChineseZodiac(new Date(2024, 5, 1), 'lunar-new-year');
    expect(result.yearBoundary).toBe('lunar-new-year');
    expect(result.animal).toBe('龍');
  });
});

import { getChineseZodiacLunarNewYear } from '../src/chinese-zodiac';

describe('getChineseZodiacLunarNewYear', () => {
  it('correctly determines zodiac after lunar new year', () => {
    // 2024 LNY is Jan 10 → date in March is after LNY
    const result = getChineseZodiacLunarNewYear(new Date(2024, 2, 15));
    expect(result.animal).toBe('龍');
    expect(result.branch).toBe('辰');
    expect(result.effectiveYear).toBe(2024);
    expect(result.yearBoundary).toBe('lunar-new-year');
  });

  it('correctly determines zodiac before lunar new year', () => {
    // 2024 LNY is Feb 10 → date Jan 5 is before LNY → effective year 2023
    const result = getChineseZodiacLunarNewYear(new Date(2024, 0, 5));
    expect(result.animal).toBe('兔');
    expect(result.branch).toBe('卯');
    expect(result.effectiveYear).toBe(2023);
    expect(result.yearBoundary).toBe('lunar-new-year');
  });

  it('falls back to Feb 1 approximation for years not in LNY_DATA', () => {
    // Year 1800 is not in the lookup table → falls back to Feb 1
    const beforeFallback = getChineseZodiacLunarNewYear(new Date(1800, 0, 15));
    expect(beforeFallback.effectiveYear).toBe(1799); // before Feb 1 → previous year

    const afterFallback = getChineseZodiacLunarNewYear(new Date(1800, 1, 15));
    expect(afterFallback.effectiveYear).toBe(1800); // after Feb 1 → current year
  });
});

describe('getChineseZodiac with lunar-new-year before LNY date', () => {
  it('returns previous year zodiac when date is before LNY', () => {
    // Ensure the lunar-new-year branch in getChineseZodiac is fully covered
    const result = getChineseZodiac(new Date(2024, 0, 5), 'lunar-new-year');
    expect(result.yearBoundary).toBe('lunar-new-year');
    expect(result.effectiveYear).toBe(2023);
  });
});
