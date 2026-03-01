import { describe, it, expect } from 'vitest';
import { computeFourPillars } from '../src/four-pillars';

describe('computeFourPillars', () => {
  describe('approximate mode', () => {
    it('computes 2024-06-15 12:00 correctly', () => {
      const p = computeFourPillars(new Date(2024, 5, 15, 12, 0), { exact: false });
      expect(p.year.stem).toBe('甲');
      expect(p.year.branch).toBe('辰');
      expect(p.day.stem).toBeDefined();
      expect(p.day.branch).toBeDefined();
      expect(p.hour.branch).toBe('午'); // 12:00 = 午時
    });

    it('handles year boundary at 立春 (before Feb 4)', () => {
      const p = computeFourPillars(new Date(2024, 0, 15, 12, 0), { exact: false });
      // Before 立春 → still previous year (癸卯)
      expect(p.year.stem).toBe('癸');
      expect(p.year.branch).toBe('卯');
    });

    it('handles year boundary at 立春 (after Feb 4)', () => {
      const p = computeFourPillars(new Date(2024, 1, 5, 12, 0), { exact: false });
      // After 立春 → new year (甲辰)
      expect(p.year.stem).toBe('甲');
      expect(p.year.branch).toBe('辰');
    });

    it('handles 子時 at 23:00 (early 子)', () => {
      const p = computeFourPillars(new Date(2024, 5, 15, 23, 0), { exact: false });
      expect(p.hour.branch).toBe('子');
    });

    it('handles 子時 at 00:30 (late 子)', () => {
      const p = computeFourPillars(new Date(2024, 5, 15, 0, 30), { exact: false });
      expect(p.hour.branch).toBe('子');
    });

    // Cover all 12 month branches in getSolarMonthApprox
    it('寅月 (Feb 4 - Mar 5): monthIndex 0', () => {
      const p = computeFourPillars(new Date(2024, 1, 15, 12, 0), { exact: false });
      expect(p.month.branch).toBe('寅'); // monthIndex 0 → branch index 2
    });

    it('卯月 (Mar 6 - Apr 4): monthIndex 1', () => {
      const p = computeFourPillars(new Date(2024, 2, 15, 12, 0), { exact: false });
      expect(p.month.branch).toBe('卯'); // monthIndex 1 → branch index 3
    });

    it('辰月 (Apr 5 - May 5): monthIndex 2', () => {
      const p = computeFourPillars(new Date(2024, 3, 15, 12, 0), { exact: false });
      expect(p.month.branch).toBe('辰'); // monthIndex 2 → branch index 4
    });

    it('巳月 (May 6 - Jun 5): monthIndex 3', () => {
      const p = computeFourPillars(new Date(2024, 4, 15, 12, 0), { exact: false });
      expect(p.month.branch).toBe('巳'); // monthIndex 3 → branch index 5
    });

    it('午月 (Jun 6 - Jul 6): monthIndex 4', () => {
      const p = computeFourPillars(new Date(2024, 5, 15, 12, 0), { exact: false });
      expect(p.month.branch).toBe('午'); // monthIndex 4 → branch index 6
    });

    it('未月 (Jul 7 - Aug 7): monthIndex 5', () => {
      const p = computeFourPillars(new Date(2024, 6, 15, 12, 0), { exact: false });
      expect(p.month.branch).toBe('未'); // monthIndex 5 → branch index 7
    });

    it('申月 (Aug 8 - Sep 7): monthIndex 6', () => {
      const p = computeFourPillars(new Date(2024, 7, 15, 12, 0), { exact: false });
      expect(p.month.branch).toBe('申'); // monthIndex 6 → branch index 8
    });

    it('酉月 (Sep 8 - Oct 7): monthIndex 7', () => {
      const p = computeFourPillars(new Date(2024, 8, 15, 12, 0), { exact: false });
      expect(p.month.branch).toBe('酉'); // monthIndex 7 → branch index 9
    });

    it('戌月 (Oct 8 - Nov 6): monthIndex 8', () => {
      const p = computeFourPillars(new Date(2024, 9, 15, 12, 0), { exact: false });
      expect(p.month.branch).toBe('戌'); // monthIndex 8 → branch index 10
    });

    it('亥月 (Nov 7 - Dec 6): monthIndex 9', () => {
      const p = computeFourPillars(new Date(2024, 10, 15, 12, 0), { exact: false });
      expect(p.month.branch).toBe('亥'); // monthIndex 9 → branch index 11
    });

    it('子月 (Dec 7+): monthIndex 10', () => {
      const p = computeFourPillars(new Date(2024, 11, 15, 12, 0), { exact: false });
      expect(p.month.branch).toBe('子'); // monthIndex 10 → branch index 0
    });

    it('子月 continued (before Jan 6): monthIndex 10', () => {
      const p = computeFourPillars(new Date(2024, 0, 3, 12, 0), { exact: false });
      expect(p.month.branch).toBe('子'); // md < 106 → monthIndex 10
    });

    it('丑月 (Jan 6 - Feb 3): monthIndex 11', () => {
      const p = computeFourPillars(new Date(2024, 0, 15, 12, 0), { exact: false });
      expect(p.month.branch).toBe('丑'); // monthIndex 11 → branch index 1
    });
  });

  describe('exact mode', () => {
    it('computes 2024-06-15 12:00 (same as approximate for mid-year)', () => {
      const p = computeFourPillars(new Date(2024, 5, 15, 12, 0));
      expect(p.year.stem).toBe('甲');
      expect(p.year.branch).toBe('辰');
    });

    it('computes known date: 2000-01-07 = 甲子日', () => {
      const p = computeFourPillars(new Date(2000, 0, 7, 12, 0));
      expect(p.day.stem).toBe('甲');
      expect(p.day.branch).toBe('子');
    });

    it('day pillar advances by 1 each day', () => {
      const p1 = computeFourPillars(new Date(2000, 0, 7, 12, 0)); // 甲子
      const p2 = computeFourPillars(new Date(2000, 0, 8, 12, 0)); // 乙丑
      expect(p1.day.stem).toBe('甲');
      expect(p1.day.branch).toBe('子');
      expect(p2.day.stem).toBe('乙');
      expect(p2.day.branch).toBe('丑');
    });

    it('month stem follows 甲己之年丙作首 rule', () => {
      const p = computeFourPillars(new Date(2024, 2, 1, 12, 0));
      expect(p.month.stem).toBe('丙');
      expect(p.month.branch).toBe('寅');
    });

    it('handles 子時 at 23:00 in exact mode', () => {
      const p = computeFourPillars(new Date(2024, 5, 15, 23, 30));
      expect(p.hour.branch).toBe('子');
      // hour >= 23 uses next day's stem for hour calculation
    });

    it('handles hour < 23 various times', () => {
      // 丑時 (01:00-02:59)
      const p1 = computeFourPillars(new Date(2024, 5, 15, 1, 0));
      expect(p1.hour.branch).toBe('丑');

      // 卯時 (05:00-06:59)
      const p2 = computeFourPillars(new Date(2024, 5, 15, 5, 0));
      expect(p2.hour.branch).toBe('卯');

      // 酉時 (17:00-18:59)
      const p3 = computeFourPillars(new Date(2024, 5, 15, 17, 0));
      expect(p3.hour.branch).toBe('酉');

      // 亥時 (21:00-22:59)
      const p4 = computeFourPillars(new Date(2024, 5, 15, 22, 0));
      expect(p4.hour.branch).toBe('亥');
    });

    it('year boundary in exact mode — before 立春', () => {
      const p = computeFourPillars(new Date(2024, 0, 15, 12, 0));
      expect(p.year.stem).toBe('癸');
      expect(p.year.branch).toBe('卯');
    });
  });

  describe('reference dates', () => {
    it('2024-02-10 (甲辰年 丙寅月)', () => {
      const p = computeFourPillars(new Date(2024, 1, 10, 12, 0));
      expect(p.year.stem).toBe('甲');
      expect(p.year.branch).toBe('辰');
      expect(p.month.stem).toBe('丙');
      expect(p.month.branch).toBe('寅');
    });

    it('1984-01-01 — before 立春 so still 癸亥年', () => {
      const p = computeFourPillars(new Date(1984, 0, 1, 12, 0));
      expect(p.year.stem).toBe('癸');
      expect(p.year.branch).toBe('亥');
    });

    it('2000-02-05 — after 立春 so 庚辰年', () => {
      const p = computeFourPillars(new Date(2000, 1, 5, 12, 0));
      expect(p.year.stem).toBe('庚');
      expect(p.year.branch).toBe('辰');
    });
  });
});
