---
title: "建除十二神 Day Fitness Cycle — Chinese Almanac Day Classification"
description: "The 12-day fitness cycle (建除十二神) used in Chinese almanacs to classify daily suitability. Complete cycle with auspicious/inauspicious ratings and derivation from day and month branches."
head:
  - - meta
    - name: keywords
      content: "建除十二神, day fitness, 建除, Chinese almanac, 通書, 黃曆, auspicious days, 擇日, date selection"
---

# 建除十二神 Day Fitness Cycle (Jiàn Chú Shí'èr Shén)

The Day Fitness cycle (建除十二神) is a twelve-day repeating cycle used in traditional Chinese almanacs (通書/黃曆) to classify each day's suitability for various activities. Each of the twelve positions — 建 (Establish), 除 (Remove), 滿 (Full), 平 (Balance), 定 (Stable), 執 (Grasp), 破 (Break), 危 (Danger), 成 (Succeed), 收 (Receive), 開 (Open), 閉 (Close) — carries traditional associations that guide date selection (擇日) for important events.

See also: [Almanac Flags](/reference/almanac-flags) · [Virtue Stars](/reference/virtue-stars) · [Deity Directions](/reference/deity-directions)

## The Cycle

The cycle starts on the day whose branch matches the month branch (建日), then advances through 12 values:

| # | Fitness | Meaning | Auspicious |
|---|---------|---------|-----------|
| 1 | 建 | Establishing | Yes |
| 2 | 除 | Removing | Yes |
| 3 | 滿 | Fullness | Yes |
| 4 | 平 | Leveling | No |
| 5 | 定 | Settling | Yes |
| 6 | 執 | Grasping | No |
| 7 | 破 | Breaking | No |
| 8 | 危 | Danger | No |
| 9 | 成 | Completion | Yes |
| 10 | 收 | Collecting | No |
| 11 | 開 | Opening | Yes |
| 12 | 閉 | Closing | No |

**Six auspicious (吉):** 建, 除, 滿, 定, 成, 開

**Six inauspicious (凶):** 平, 執, 破, 危, 收, 閉

## Determination Rule

```
offset = (dayBranchIndex - monthBranchIndex) mod 12
fitness = DAY_FITNESS_CYCLE[offset]
```

The month branch is determined by solar month boundaries (節氣), the same as the month pillar in 四柱.

**Example:** If the month branch is 寅 (index 2) and the day branch is 辰 (index 4):
- offset = (4 - 2) mod 12 = 2
- fitness = 滿 (fullness, auspicious)

## API

```typescript
import { getDayFitness, getDayFitnessForDate } from 'stem-branch';

// From branches directly
getDayFitness('辰', '寅'); // → '滿'

// From a date (computes pillars automatically)
getDayFitnessForDate(new Date(2024, 5, 15));
// → { fitness: '成', auspicious: true }
```

---

## See Also

- [神煞 Almanac Flags](./almanac-flags.md) — 30 symbolic markers for BaZi and date selection
- [天德月德 Virtue Stars](./virtue-stars.md) — Monthly auspicious stars (Heavenly and Monthly Virtue)
- [神煞方位 Deity Directions](./deity-directions.md) — Daily compass directions for four deities
