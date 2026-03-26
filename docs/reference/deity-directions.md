---
title: "神煞方位 Deity Directions — Daily Compass Directions Reference"
description: "Four deity compass directions (喜神, 福神, 財神, 貴神) derived from the day stem. Lookup tables for feng shui and date selection (擇日)."
head:
  - - meta
    - name: keywords
      content: "神煞方位, deity directions, 喜神, 福神, 財神, 貴神, compass directions, feng shui, 風水, 擇日, date selection, day stem"
---

# 神煞方位 Deity Directions (Shén Shà Fāng Wèi)

In Chinese date selection (擇日) and feng shui practice, four deities are assigned daily compass directions based on the day's Heavenly Stem (日干). The Joy Deity (喜神), Fortune Deity (福神), Wealth Deity (財神), and Noble Deity (貴神) each occupy a specific cardinal or intercardinal direction on any given day. Practitioners consult these directions when choosing orientations for important activities.

See also: [Almanac Flags](/reference/almanac-flags) · [Day Fitness Cycle](/reference/day-fitness) · [Virtue Stars](/reference/virtue-stars)

## The Four Deities

| Deity | Chinese | Purpose |
|-------|---------|---------|
| Wealth God | 財神 | Direction for financial activities |
| Joy God | 喜神 | Direction for celebrations, weddings |
| Fortune God | 福神 | Direction for general blessings |
| Noble God | 貴神 | Direction for seeking help from patrons |

## Direction Tables

### 財神 Wealth God

| Day Stem | 甲 | 乙 | 丙 | 丁 | 戊 | 己 | 庚 | 辛 | 壬 | 癸 |
|----------|---|---|---|---|---|---|---|---|---|---|
| Direction | 東北 | 東北 | 西南 | 西南 | 正北 | 正北 | 正東 | 正東 | 正南 | 正南 |

**Pattern:** Stems pair by yin/yang of same element. 甲乙(木)→東北, 丙丁(火)→西南, 戊己(土)→正北, 庚辛(金)→正東, 壬癸(水)→正南.

### 喜神 Joy God

| Day Stem | 甲 | 乙 | 丙 | 丁 | 戊 | 己 | 庚 | 辛 | 壬 | 癸 |
|----------|---|---|---|---|---|---|---|---|---|---|
| Direction | 東北 | 西北 | 西南 | 正南 | 東南 | 東北 | 西北 | 西南 | 正南 | 東南 |

**Pattern:** Follows a 5-cycle by 五合 pairs: 甲己→東北, 乙庚→西北, 丙辛→西南, 丁壬→正南, 戊癸→東南.

### 福神 Fortune God

| Day Stem | 甲 | 乙 | 丙 | 丁 | 戊 | 己 | 庚 | 辛 | 壬 | 癸 |
|----------|---|---|---|---|---|---|---|---|---|---|
| Direction | 東南 | 東北 | 正東 | 正南 | 正北 | 正北 | 西南 | 東南 | 西北 | 西南 |

### 貴神 Noble God

| Day Stem | 甲 | 乙 | 丙 | 丁 | 戊 | 己 | 庚 | 辛 | 壬 | 癸 |
|----------|---|---|---|---|---|---|---|---|---|---|
| Direction | 西南 | 正北 | 西北 | 正西 | 東北 | 東北 | 西南 | 正南 | 正南 | 東南 |

Based on the primary 天乙貴人 (Heavenly Noble) position.

## API

```typescript
import { getDeityDirections, getDeityDirectionsForDate } from 'stem-branch';

// From day stem
getDeityDirections('甲');
// → { wealth: '東北', joy: '東北', fortune: '東南', noble: '西南' }

// From date (computes day pillar automatically)
getDeityDirectionsForDate(new Date(2024, 5, 15));
// → { wealth: '正南', joy: '正南', fortune: '西北', noble: '正南' }
```

---

## See Also

- [神煞 Almanac Flags](./almanac-flags.md) — 30 symbolic markers for BaZi and date selection
- [建除十二神 Day Fitness Cycle](./day-fitness.md) — The 12-day cycle classifying daily suitability
- [天德月德 Virtue Stars](./virtue-stars.md) — Monthly auspicious stars (Heavenly and Monthly Virtue)
