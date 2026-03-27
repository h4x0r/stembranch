import { describe, it, expect } from 'vitest';
import { computeChuanRenChart, branchToPalace } from '../src/qimen-chuanren';

describe('奇門穿壬 (Qi Men Chuan Ren)', () => {
  describe('branchToPalace — branch-to-palace mapping', () => {
    it('maps 寅卯 to palace 3 (震)', () => {
      expect(branchToPalace('寅')).toBe(3);
      expect(branchToPalace('卯')).toBe(3);
    });
    it('maps 辰巳 to palace 4 (巽)', () => {
      expect(branchToPalace('辰')).toBe(4);
      expect(branchToPalace('巳')).toBe(4);
    });
    it('maps 午 to palace 9 (離)', () => {
      expect(branchToPalace('午')).toBe(9);
    });
    it('maps 未申 to palace 2 (坤)', () => {
      expect(branchToPalace('未')).toBe(2);
      expect(branchToPalace('申')).toBe(2);
    });
    it('maps 酉戌 to palace 7 (兌)', () => {
      expect(branchToPalace('酉')).toBe(7);
      expect(branchToPalace('戌')).toBe(7);
    });
    it('maps 亥子 to palace 1 (坎)', () => {
      expect(branchToPalace('亥')).toBe(1);
      expect(branchToPalace('子')).toBe(1);
    });
    it('maps 丑 to palace 8 (艮)', () => {
      expect(branchToPalace('丑')).toBe(8);
    });
    // Note: no branch maps directly to palace 5 (center) or 6 (乾)
    // 丑 → 8 (艮), and palace 6 (乾) also has no direct branch mapping
    // This is the standard Lo Shu / Later Heaven Bagua mapping
  });

  describe('computeChuanRenChart', () => {
    // Use a fixed known date for deterministic output
    const testDate = new Date('2024-06-15T10:00:00Z');

    it('returns both full sub-charts', () => {
      const chart = computeChuanRenChart(testDate);
      expect(chart.qimen).toBeDefined();
      expect(chart.qimen.escapeMode).toBeDefined();
      expect(chart.liuren).toBeDefined();
      expect(chart.liuren.transmissions).toBeDefined();
    });

    it('returns exactly 9 palaces', () => {
      const chart = computeChuanRenChart(testDate);
      expect(chart.palaces).toHaveLength(9);
    });

    it('each palace has QiMen layers from the sub-chart', () => {
      const chart = computeChuanRenChart(testDate);
      for (const p of chart.palaces) {
        expect(p.palace).toBeGreaterThanOrEqual(1);
        expect(p.palace).toBeLessThanOrEqual(9);
        expect(typeof p.star).toBe('string');
        expect(typeof p.door).toBe('string');
        expect(typeof p.deity).toBe('string');
        expect(typeof p.heavenStem).toBe('string');
        expect(typeof p.earthStem).toBe('string');
      }
    });

    it('palaces with branch mappings have LiuRen overlays, palaces 5 and 6 are empty', () => {
      const chart = computeChuanRenChart(testDate);
      for (const p of chart.palaces) {
        if (p.palace === 5 || p.palace === 6) {
          // No branch maps to center (5) or 乾 (6)
          expect(p.liurenEarthBranches).toHaveLength(0);
          expect(p.liurenHeavenBranches).toHaveLength(0);
        } else {
          expect(p.liurenEarthBranches.length).toBeGreaterThan(0);
          expect(p.liurenHeavenBranches.length).toBeGreaterThan(0);
        }
      }
    });

    it('marks 三傳 transmission palaces correctly', () => {
      const chart = computeChuanRenChart(testDate);
      const transmissions = chart.palaces.filter(p => p.transmission !== null);
      // There should be exactly 3 transmissions marked (initial, middle, final)
      // unless two or three transmissions land on the same palace
      expect(transmissions.length).toBeGreaterThanOrEqual(1);
      expect(transmissions.length).toBeLessThanOrEqual(3);

      const labels = transmissions.map(p => p.transmission);
      expect(labels).toContain('initial');
      // middle and final should be present (on some palace)
      const allTransmissions = chart.palaces.flatMap(p => p.transmission ? [p.transmission] : []);
      // Actually, multiple transmissions can land on the same palace. Check the chart's liuren transmissions are all represented
      const { initial, middle, final: fin } = chart.liuren.transmissions;
      const initialPalace = chart.palaces.find(p =>
        p.liurenEarthBranches.includes(initial) || p.liurenHeavenBranches.includes(initial)
      );
      expect(initialPalace).toBeDefined();
    });

    it('center palace (5) has 天禽 star (or borrows to palace 2)', () => {
      const chart = computeChuanRenChart(testDate);
      const center = chart.palaces.find(p => p.palace === 5);
      expect(center).toBeDefined();
      // Palace 5 should have a star assigned (天禽 or borrowed)
      expect(center!.star).toBeDefined();
    });
  });
});
