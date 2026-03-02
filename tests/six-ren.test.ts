import { describe, it, expect } from 'vitest';
import {
  STEM_LODGING,
  HEAVENLY_GENERALS,
  getMonthlyGeneral,
  buildPlates,
  buildFourLessons,
  computeSixRen,
  computeSixRenForDate,
} from '../src/six-ren';

// ═══════════════════════════════════════════════════════════════
//  Constants
// ═══════════════════════════════════════════════════════════════

describe('STEM_LODGING', () => {
  it('maps each stem to its lodging branch (same as 祿)', () => {
    expect(STEM_LODGING['甲']).toBe('寅');
    expect(STEM_LODGING['乙']).toBe('卯');
    expect(STEM_LODGING['丙']).toBe('巳');
    expect(STEM_LODGING['丁']).toBe('午');
    expect(STEM_LODGING['戊']).toBe('巳');
    expect(STEM_LODGING['己']).toBe('午');
    expect(STEM_LODGING['庚']).toBe('申');
    expect(STEM_LODGING['辛']).toBe('酉');
    expect(STEM_LODGING['壬']).toBe('亥');
    expect(STEM_LODGING['癸']).toBe('子');
  });
});

describe('HEAVENLY_GENERALS', () => {
  it('has exactly 12 values', () => {
    expect(HEAVENLY_GENERALS).toHaveLength(12);
  });

  it('starts with 貴人 and ends with 天后', () => {
    expect(HEAVENLY_GENERALS[0]).toBe('貴人');
    expect(HEAVENLY_GENERALS[11]).toBe('天后');
  });

  it('contains all twelve generals in traditional order', () => {
    expect(HEAVENLY_GENERALS).toEqual([
      '貴人', '螣蛇', '朱雀', '六合', '勾陳', '青龍',
      '天空', '白虎', '太常', '玄武', '太陰', '天后',
    ]);
  });
});

// ═══════════════════════════════════════════════════════════════
//  buildPlates
// ═══════════════════════════════════════════════════════════════

describe('buildPlates', () => {
  it('aligns monthly general over hour branch', () => {
    // 月將=戌 over 時辰=午
    const plates = buildPlates('戌', '午');
    expect(plates['午']).toBe('戌');
  });

  it('rotates all 12 branches correctly (offset 4)', () => {
    // 月將=戌(10), 時辰=午(6) → offset = 4
    const plates = buildPlates('戌', '午');
    expect(plates['子']).toBe('辰');
    expect(plates['丑']).toBe('巳');
    expect(plates['寅']).toBe('午');
    expect(plates['卯']).toBe('未');
    expect(plates['辰']).toBe('申');
    expect(plates['巳']).toBe('酉');
    expect(plates['午']).toBe('戌');
    expect(plates['未']).toBe('亥');
    expect(plates['申']).toBe('子');
    expect(plates['酉']).toBe('丑');
    expect(plates['戌']).toBe('寅');
    expect(plates['亥']).toBe('卯');
  });

  it('offset 8: 月將=亥 over 時辰=卯', () => {
    // 月將=亥(11), 時辰=卯(3) → offset = 8
    const plates = buildPlates('亥', '卯');
    expect(plates['卯']).toBe('亥'); // monthly general aligned
    expect(plates['子']).toBe('申');
    expect(plates['辰']).toBe('子');
    expect(plates['午']).toBe('寅');
  });

  it('伏吟: offset 0 is identity', () => {
    const plates = buildPlates('子', '子');
    expect(plates['子']).toBe('子');
    expect(plates['午']).toBe('午');
    expect(plates['寅']).toBe('寅');
    expect(plates['酉']).toBe('酉');
  });

  it('返吟: offset 6 maps each branch to its clash', () => {
    const plates = buildPlates('午', '子');
    expect(plates['子']).toBe('午');
    expect(plates['午']).toBe('子');
    expect(plates['丑']).toBe('未');
    expect(plates['寅']).toBe('申');
    expect(plates['卯']).toBe('酉');
    expect(plates['辰']).toBe('戌');
    expect(plates['巳']).toBe('亥');
  });
});

// ═══════════════════════════════════════════════════════════════
//  buildFourLessons
// ═══════════════════════════════════════════════════════════════

describe('buildFourLessons', () => {
  it('壬子日 with offset 4 plates', () => {
    const plates = buildPlates('戌', '午');
    const lessons = buildFourLessons('壬', '子', plates);

    // 壬 lodging = 亥
    // L1: plates[亥]=卯 / 亥
    expect(lessons[0]).toEqual({ upper: '卯', lower: '亥' });
    // L2: plates[卯]=未 / 卯
    expect(lessons[1]).toEqual({ upper: '未', lower: '卯' });
    // L3: plates[子]=辰 / 子
    expect(lessons[2]).toEqual({ upper: '辰', lower: '子' });
    // L4: plates[辰]=申 / 辰
    expect(lessons[3]).toEqual({ upper: '申', lower: '辰' });
  });

  it('甲子日 with offset 8 plates', () => {
    const plates = buildPlates('亥', '卯');
    const lessons = buildFourLessons('甲', '子', plates);

    // 甲 lodging = 寅
    // L1: plates[寅]=戌 / 寅
    expect(lessons[0]).toEqual({ upper: '戌', lower: '寅' });
    // L2: plates[戌]=午 / 戌
    expect(lessons[1]).toEqual({ upper: '午', lower: '戌' });
    // L3: plates[子]=申 / 子
    expect(lessons[2]).toEqual({ upper: '申', lower: '子' });
    // L4: plates[申]=辰 / 申
    expect(lessons[3]).toEqual({ upper: '辰', lower: '申' });
  });

  it('辛卯日 with offset 2 plates', () => {
    const plates = buildPlates('辰', '寅');
    const lessons = buildFourLessons('辛', '卯', plates);

    // 辛 lodging = 酉
    // L1: plates[酉]=亥 / 酉
    expect(lessons[0]).toEqual({ upper: '亥', lower: '酉' });
    // L2: plates[亥]=丑 / 亥
    expect(lessons[1]).toEqual({ upper: '丑', lower: '亥' });
    // L3: plates[卯]=巳 / 卯
    expect(lessons[2]).toEqual({ upper: '巳', lower: '卯' });
    // L4: plates[巳]=未 / 巳
    expect(lessons[3]).toEqual({ upper: '未', lower: '巳' });
  });
});

// ═══════════════════════════════════════════════════════════════
//  computeSixRen — 賊剋法 (single match)
// ═══════════════════════════════════════════════════════════════

describe('computeSixRen', () => {
  describe('賊剋法 — single 下賊上', () => {
    it('壬子日 午時 月將戌: L2 下賊上(木剋土) → 初傳=未', () => {
      const chart = computeSixRen('壬', '子', '午', '戌');

      expect(chart.dayStem).toBe('壬');
      expect(chart.dayBranch).toBe('子');
      expect(chart.hourBranch).toBe('午');
      expect(chart.monthlyGeneral).toBe('戌');

      // Verify plates alignment
      expect(chart.plates['午']).toBe('戌');

      // Verify four lessons
      expect(chart.lessons[0]).toEqual({ upper: '卯', lower: '亥' });
      expect(chart.lessons[1]).toEqual({ upper: '未', lower: '卯' });
      expect(chart.lessons[2]).toEqual({ upper: '辰', lower: '子' });
      expect(chart.lessons[3]).toEqual({ upper: '申', lower: '辰' });

      // L2: 卯(木) conquers 未(土) → 下賊上, single match
      expect(chart.method).toBe('賊剋');
      expect(chart.transmissions.initial).toBe('未');
      expect(chart.transmissions.middle).toBe('亥');  // plates[未]=亥
      expect(chart.transmissions.final).toBe('卯');   // plates[亥]=卯
    });

    it('甲子日 卯時 月將亥: L1 下賊上(木剋土) → 初傳=戌', () => {
      const chart = computeSixRen('甲', '子', '卯', '亥');

      expect(chart.method).toBe('賊剋');
      expect(chart.transmissions.initial).toBe('戌');
      expect(chart.transmissions.middle).toBe('午');  // plates[戌]=午
      expect(chart.transmissions.final).toBe('寅');   // plates[午]=寅
    });
  });

  describe('賊剋法 — single 上剋下 (no 下賊上)', () => {
    it('辛卯日 寅時 月將辰: L2 上剋下(土剋水) → 初傳=丑', () => {
      const chart = computeSixRen('辛', '卯', '寅', '辰');

      // L1: 亥(水)/酉(金) → 金生水, no 克
      // L2: 丑(土)/亥(水) → 土剋水, 上剋下
      // L3: 巳(火)/卯(木) → 木生火, no 克
      // L4: 未(土)/巳(火) → 火生土, no 克
      expect(chart.method).toBe('賊剋');
      expect(chart.transmissions.initial).toBe('丑');
      expect(chart.transmissions.middle).toBe('卯');  // plates[丑]=卯
      expect(chart.transmissions.final).toBe('巳');   // plates[卯]=巳
    });
  });

  // ── Generals placement ───────────────────────────────────────

  describe('十二天將 placement', () => {
    it('壬日 daytime(午時): 貴人=巳, 順行', () => {
      const chart = computeSixRen('壬', '子', '午', '戌');

      // 壬 HEAVENLY_NOBLE = ['巳','卯']. 午 = daytime → first = 巳
      // 巳 index = 5 (in 5-10 range) → 順行 (ascending)
      expect(chart.generals['巳']).toBe('貴人');
      expect(chart.generals['午']).toBe('螣蛇');
      expect(chart.generals['未']).toBe('朱雀');
      expect(chart.generals['申']).toBe('六合');
      expect(chart.generals['酉']).toBe('勾陳');
      expect(chart.generals['戌']).toBe('青龍');
      expect(chart.generals['亥']).toBe('天空');
      expect(chart.generals['子']).toBe('白虎');
      expect(chart.generals['丑']).toBe('太常');
      expect(chart.generals['寅']).toBe('玄武');
      expect(chart.generals['卯']).toBe('太陰');
      expect(chart.generals['辰']).toBe('天后');
    });

    it('甲日 daytime(卯時): 貴人=丑, 逆行', () => {
      const chart = computeSixRen('甲', '子', '卯', '亥');

      // 甲 HEAVENLY_NOBLE = ['丑','未']. 卯 = daytime → first = 丑
      // 丑 index = 1 (in 11-4 range) → 逆行 (descending)
      expect(chart.generals['丑']).toBe('貴人');
      expect(chart.generals['子']).toBe('螣蛇');
      expect(chart.generals['亥']).toBe('朱雀');
      expect(chart.generals['戌']).toBe('六合');
      expect(chart.generals['酉']).toBe('勾陳');
      expect(chart.generals['申']).toBe('青龍');
      expect(chart.generals['未']).toBe('天空');
      expect(chart.generals['午']).toBe('白虎');
      expect(chart.generals['巳']).toBe('太常');
      expect(chart.generals['辰']).toBe('玄武');
      expect(chart.generals['卯']).toBe('太陰');
      expect(chart.generals['寅']).toBe('天后');
    });

    it('all 12 branches have exactly one general assigned', () => {
      const chart = computeSixRen('壬', '子', '午', '戌');
      const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;
      const assigned = new Set<string>();
      for (const b of branches) {
        expect(chart.generals[b]).toBeDefined();
        assigned.add(chart.generals[b]);
      }
      expect(assigned.size).toBe(12);
    });
  });
});

// ═══════════════════════════════════════════════════════════════
//  getMonthlyGeneral (requires VSOP87D — slow)
// ═══════════════════════════════════════════════════════════════

describe('getMonthlyGeneral', () => {
  it('returns correct general for dates after known zhongqi', { timeout: 30_000 }, () => {
    // After 大寒 (~Jan 20, 2024): 月將=子
    expect(getMonthlyGeneral(new Date(2024, 0, 25))).toBe('子');
    // After 雨水 (~Feb 19, 2024): 月將=亥
    expect(getMonthlyGeneral(new Date(2024, 1, 25))).toBe('亥');
    // After 夏至 (~Jun 21, 2024): 月將=未
    expect(getMonthlyGeneral(new Date(2024, 5, 25))).toBe('未');
    // After 秋分 (~Sep 22, 2024): 月將=辰
    expect(getMonthlyGeneral(new Date(2024, 8, 25))).toBe('辰');
  });

  it('handles year boundary: before 大寒 falls in previous 冬至 period', { timeout: 30_000 }, () => {
    // 2024-01-05 is before 大寒 (~Jan 20) → after 冬至 2023 (~Dec 22) → 月將=丑
    expect(getMonthlyGeneral(new Date(2024, 0, 5))).toBe('丑');
  });
});

// ═══════════════════════════════════════════════════════════════
//  computeSixRenForDate (requires VSOP87D — slow)
// ═══════════════════════════════════════════════════════════════

describe('computeSixRenForDate', () => {
  it('returns a valid chart for a known date', { timeout: 30_000 }, () => {
    const chart = computeSixRenForDate(new Date(2024, 5, 15), 14); // Jun 15, 2pm
    expect(chart.dayStem).toBeDefined();
    expect(chart.dayBranch).toBeDefined();
    expect(chart.hourBranch).toBeDefined();
    expect(chart.monthlyGeneral).toBeDefined();
    expect(chart.lessons).toHaveLength(4);
    expect(chart.transmissions.initial).toBeDefined();
    expect(chart.transmissions.middle).toBeDefined();
    expect(chart.transmissions.final).toBeDefined();
    expect(chart.method).toBeDefined();
  });

  it('uses date hour when hour param not given', { timeout: 30_000 }, () => {
    const date = new Date(2024, 5, 15, 14, 30); // 2:30pm → 未時
    const chart = computeSixRenForDate(date);
    expect(chart.hourBranch).toBe('未');
  });
});
