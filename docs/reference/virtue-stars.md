---
title: "天德月德 Virtue Stars — Monthly Auspicious Stars Reference"
description: "Heavenly Virtue (天德) and Monthly Virtue (月德) stars with combination partners. Lookup tables by month branch for Chinese calendar date selection."
head:
  - - meta
    - name: keywords
      content: "天德, 月德, virtue stars, 德星, heavenly virtue, monthly virtue, Chinese calendar, 擇日, date selection, auspicious"
---

# 天德月德 Virtue Stars (Tiān Dé Yuè Dé)

The Virtue Stars (德星) are among the most auspicious markers in the Chinese calendar system. Each month has a Heavenly Virtue (天德) and a Monthly Virtue (月德), determined by the month's Earthly Branch. When a day's stem or branch matches a virtue star, it is considered especially favorable for important activities. Each virtue star also has a combination partner (合), derived through the Five Combinations (五合) relationship.

See also: [Almanac Flags](/reference/almanac-flags) · [Day Fitness Cycle](/reference/day-fitness) · [Deity Directions](/reference/deity-directions)

## 月德 Monthly Virtue

Derived from the yang stem of the month's three-harmony element.

| Three-Harmony Group | Month Branches | 月德 (Stem) |
|--------------------|---------------|-------------|
| 火 Fire | 寅, 午, 戌 | 丙 |
| 木 Wood | 亥, 卯, 未 | 甲 |
| 水 Water | 申, 子, 辰 | 壬 |
| 金 Metal | 巳, 酉, 丑 | 庚 |

**月德合** is the 五合 (stem combination) partner of the 月德 stem:

| 月德 | 丙 | 甲 | 壬 | 庚 |
|------|---|---|---|---|
| 月德合 | 辛 | 己 | 丁 | 乙 |

## 天德 Heavenly Virtue

A traditional 12-entry lookup. The value can be either a stem or a branch.

| Month Branch | 寅 | 卯 | 辰 | 巳 | 午 | 未 | 申 | 酉 | 戌 | 亥 | 子 | 丑 |
|-------------|---|---|---|---|---|---|---|---|---|---|---|---|
| 天德 | 丁 | 申 | 壬 | 辛 | 亥 | 甲 | 癸 | 寅 | 丙 | 乙 | 巳 | 庚 |

**天德合:** When 天德 is a stem, the partner is its 五合 pair. When 天德 is a branch, the partner is its 六合 pair.

| Month Branch | 天德 | 天德合 | Combination Type |
|-------------|------|-------|-----------------|
| 寅 | 丁 | 壬 | 五合 (stem) |
| 卯 | 申 | 巳 | 六合 (branch) |
| 辰 | 壬 | 丁 | 五合 (stem) |
| 巳 | 辛 | 丙 | 五合 (stem) |
| 午 | 亥 | 寅 | 六合 (branch) |
| 未 | 甲 | 己 | 五合 (stem) |
| 申 | 癸 | 戊 | 五合 (stem) |
| 酉 | 寅 | 亥 | 六合 (branch) |
| 戌 | 丙 | 辛 | 五合 (stem) |
| 亥 | 乙 | 庚 | 五合 (stem) |
| 子 | 巳 | 申 | 六合 (branch) |
| 丑 | 庚 | 乙 | 五合 (stem) |

## Stem Combinations (五合)

| Pair | Element Produced |
|------|-----------------|
| 甲 ↔ 己 | 土 Earth |
| 乙 ↔ 庚 | 金 Metal |
| 丙 ↔ 辛 | 水 Water |
| 丁 ↔ 壬 | 木 Wood |
| 戊 ↔ 癸 | 火 Fire |

## Branch Combinations (六合)

| Pair | Element Produced |
|------|-----------------|
| 子 ↔ 丑 | 土 Earth |
| 寅 ↔ 亥 | 木 Wood |
| 卯 ↔ 戌 | 火 Fire |
| 辰 ↔ 酉 | 金 Metal |
| 巳 ↔ 申 | 水 Water |
| 午 ↔ 未 | 火 Fire |

## API

```typescript
import {
  getMonthlyVirtue,       // Branch → Stem
  getMonthlyVirtueCombo,  // Branch → Stem
  getHeavenlyVirtue,      // Branch → Stem | Branch
  getHeavenlyVirtueCombo, // Branch → Stem | Branch
} from 'stem-branch';

getMonthlyVirtue('寅');      // → '丙'
getMonthlyVirtueCombo('寅'); // → '辛'
getHeavenlyVirtue('寅');     // → '丁'
getHeavenlyVirtueCombo('寅'); // → '壬'
```

---

## See Also

- [神煞 Almanac Flags](./almanac-flags.md) — 30 symbolic markers for BaZi and date selection
- [建除十二神 Day Fitness Cycle](./day-fitness.md) — The 12-day cycle classifying daily suitability
- [神煞方位 Deity Directions](./deity-directions.md) — Daily compass directions for four deities
