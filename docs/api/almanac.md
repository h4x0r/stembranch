---
title: "Almanac Features (曆書) — stem-branch API Reference"
description: "Daily almanac features: day fitness (建除), flying stars (紫白九星), Peng Zu taboos, deity directions, zodiac, true solar time."
---

# Almanac Features (曆書)

Traditional Chinese almanac (通書/通勝) features for daily date selection. Includes the 12-value day fitness cycle, nine flying stars at four time scales, Peng Zu taboos, clash/direction lookups, fetal deity position, duty deity rotation, 28 lunar mansions, Chinese and Western zodiac, and true solar time correction via the equation of time.

### Day Fitness (建除十二神)

| Export | Description |
|---|---|
| `DAY_FITNESS_CYCLE` | `['建','除','滿','平','定','執','破','危','成','收','開','閉']` |
| `DAY_FITNESS_AUSPICIOUS` | Auspicious/inauspicious classification per fitness value |
| `getDayFitness(dayBranch, monthBranch)` | Fitness value from day and month branches |
| `getDayFitnessForDate(date)` | Fitness and auspicious flag for a date |

### Flying Stars (紫白九星)

| Export | Description |
|---|---|
| `FLYING_STARS` | Nine stars: 一白 through 九紫 with element and color |
| `getYearStar(date)` | Year star (changes at 立春) |
| `getMonthStar(date)` | Month star (from year star group + solar month) |
| `getDayStar(date)` | Day star (continuous 9-day cycle) |
| `getHourStar(date)` | Hour star (from day star group + hour branch) |
| `getFlyingStars(date)` | All four stars (year, month, day, hour) |

### Peng Zu Taboos (彭祖百忌)

| Export | Description |
|---|---|
| `getPengZuTaboo(stem, branch)` | Stem taboo + branch taboo strings |
| `getPengZuTabooForDate(date)` | Taboos for a date |

### Day Clash (沖煞)

| Export | Description |
|---|---|
| `getDayClash(dayBranch)` | Clash branch + direction |
| `getDayClashForDate(date)` | Clash info for a date |

### Deity Directions (神煞方位)

| Export | Description |
|---|---|
| `getDeityDirections(dayStem)` | 喜神/福神/財神 directions from day stem |
| `getDeityDirectionsForDate(date)` | Directions for a date |

### Fetal Deity (胎神)

| Export | Description |
|---|---|
| `getFetalDeity(stem, branch)` | 胎神 location from day pillar |
| `getFetalDeityForDate(date)` | Fetal deity location for a date |

### Duty Deity (值神)

| Export | Description |
|---|---|
| `DUTY_DEITIES` | The 12 duty deities in cycle order |
| `getDutyDeity(dayFitness, ...)` | Which deity is on duty |
| `getDutyDeityForDate(date)` | Duty deity for a date |

### Lunar Mansions (二十八星宿)

| Export | Description |
|---|---|
| `LUNAR_MANSIONS` | 28 mansions with luminary and element |
| `getLunarMansion(jd)` | Mansion from Julian Day (JD mod 28) |
| `getLunarMansionForDate(date)` | Mansion for a date |

### Chinese Zodiac (生肖)

| Export | Description |
|---|---|
| `ZODIAC_ANIMALS` | `['鼠','牛','虎','兔','龍','蛇','馬','羊','猴','雞','狗','豬']` |
| `ZODIAC_ENGLISH` | `Record<ChineseZodiacAnimal, string>` (鼠→Rat, etc.) |
| `getChineseZodiac(date, boundary?)` | Zodiac with configurable year boundary (立春 or 初一) |

### Western Zodiac (星座)

| Export | Description |
|---|---|
| `getWesternZodiac(date)` | Sign, symbol, Chinese name, Western element |

### True Solar Time (真太陽時)

| Export | Description |
|---|---|
| `equationOfTime(date)` | EoT in minutes (Spencer 1971) |
| `trueSolarTime(clockTime, longitude, standardMeridian?)` | Corrected solar time with breakdown |

For timezone-aware true solar time (wall clock → UTC → solar time with DST handling), see [`wallClockToSolarTime`](./timezone.md) in the Timezone module.

## Types

```typescript
type FlyingStar = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
interface FlyingStarInfo { number: FlyingStar; name: string; element: Element; color: string; }
```
