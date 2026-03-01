import { describe, it, expect } from 'vitest';
import { getJianChuOfficer, getJianChuForDate, JIANCHU_OFFICERS } from '../src/jianchu';

describe('JIANCHU_OFFICERS', () => {
  it('has exactly 12 officers', () => {
    expect(JIANCHU_OFFICERS).toHaveLength(12);
  });

  it('starts with 建 and ends with 閉', () => {
    expect(JIANCHU_OFFICERS[0]).toBe('建');
    expect(JIANCHU_OFFICERS[11]).toBe('閉');
  });
});

describe('getJianChuOfficer', () => {
  it('day branch matching month branch is 建', () => {
    // In 寅月, 寅日 = 建
    expect(getJianChuOfficer('寅', '寅')).toBe('建');
    // In 卯月, 卯日 = 建
    expect(getJianChuOfficer('卯', '卯')).toBe('建');
    // In 子月, 子日 = 建
    expect(getJianChuOfficer('子', '子')).toBe('建');
  });

  it('cycles forward from 建', () => {
    // In 寅月: 卯日=除, 辰日=滿, 巳日=平, ...
    expect(getJianChuOfficer('卯', '寅')).toBe('除');
    expect(getJianChuOfficer('辰', '寅')).toBe('滿');
    expect(getJianChuOfficer('巳', '寅')).toBe('平');
    expect(getJianChuOfficer('午', '寅')).toBe('定');
    expect(getJianChuOfficer('未', '寅')).toBe('執');
    expect(getJianChuOfficer('申', '寅')).toBe('破');
    expect(getJianChuOfficer('酉', '寅')).toBe('危');
    expect(getJianChuOfficer('戌', '寅')).toBe('成');
    expect(getJianChuOfficer('亥', '寅')).toBe('收');
    expect(getJianChuOfficer('子', '寅')).toBe('開');
    expect(getJianChuOfficer('丑', '寅')).toBe('閉');
  });

  it('works for other months', () => {
    // In 酉月: 酉日=建, 戌日=除, 亥日=滿
    expect(getJianChuOfficer('酉', '酉')).toBe('建');
    expect(getJianChuOfficer('戌', '酉')).toBe('除');
    expect(getJianChuOfficer('亥', '酉')).toBe('滿');
    // In 酉月: 申日=閉 (one before 建)
    expect(getJianChuOfficer('申', '酉')).toBe('閉');
  });
});

describe('getJianChuForDate', () => {
  it('returns officer and auspicious flag for a date', { timeout: 30_000 }, () => {
    // 2024-02-10 is in 寅月 (after 立春 Feb 4)
    // Day pillar for 2024-02-10: 壬午 → dayBranch = 午
    // In 寅月, 午日 offset = (6 - 2) = 4 → 定
    const result = getJianChuForDate(new Date(2024, 1, 10));
    expect(result.officer).toBeDefined();
    expect(typeof result.auspicious).toBe('boolean');
    expect(JIANCHU_OFFICERS).toContain(result.officer);
  });

  it('returns different officers for consecutive days', { timeout: 30_000 }, () => {
    const day1 = getJianChuForDate(new Date(2024, 5, 15));
    const day2 = getJianChuForDate(new Date(2024, 5, 16));
    // Consecutive days should have consecutive officers (usually different)
    expect(day1.officer).not.toBe(day2.officer);
  });

  it('all 12 officers appear in a 12-day span within one solar month', { timeout: 30_000 }, () => {
    // Use June 10-21 2024 (safely within 午月, 芒種 is ~June 5)
    const officers = new Set<string>();
    for (let d = 10; d <= 21; d++) {
      const result = getJianChuForDate(new Date(2024, 5, d));
      officers.add(result.officer);
    }
    expect(officers.size).toBe(12);
  });
});
