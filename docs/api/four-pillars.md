---
title: "Four Pillars & Derivations (四柱八字) — stem-branch API Reference"
description: "Four Pillars computation, hidden stems, stem/branch relations, ten relations, life stages, almanac flags, luck periods. Complete BaZi analysis API."
---

# Four Pillars & Derivations (四柱八字)

Complete BaZi (Eight Characters) analysis API. Computes the four pillars (year, month, day, hour) from a date, then derives all classical relationships: hidden stems, stem combinations and clashes, branch harmonies/clashes/punishments, ten relations, twelve life stages, element strength, void branches, virtue stars, and 30 almanac flags. Includes major and minor luck period computation.

### Four Pillars (四柱)

| Export | Description |
|---|---|
| `computeFourPillars(date)` | Compute year, month, day, and hour pillars |

### Hidden Stems (地支藏干)

| Export | Description |
|---|---|
| `HIDDEN_STEMS` | `Record<Branch, HiddenStem[]>` — main, middle, residual stems |
| `getHiddenStems(branch)` | Hidden stems for a branch (main stem first) |

### Stem Relations (天干五合/相衝)

| Export | Description |
|---|---|
| `STEM_COMBINATIONS` | Five stem combinations with transformed elements |
| `STEM_CLASHES` | Four stem clash pairs |
| `isStemCombination(a, b)` | Check if two stems form a 五合 |
| `isStemClash(a, b)` | Check if two stems clash |
| `getCombinedElement(a, b)` | Transformed element of a combination, or null |

### Branch Relations (地支六合/六衝/三合/刑/害/破)

| Export | Description |
|---|---|
| `HARMONY_PAIRS` | 六合: 子丑, 寅亥, 卯戌, 辰酉, 巳申, 午未 |
| `CLASH_PAIRS` | 六衝: 子午, 丑未, 寅申, 卯酉, 辰戌, 巳亥 |
| `THREE_HARMONIES` | 三合: 申子辰水, 寅午戌火, 巳酉丑金, 亥卯未木 |
| `SEASONAL_UNIONS` | 三會: 寅卯辰木, 巳午未火, 申酉戌金, 亥子丑水 |
| `HALF_HARMONIES` | 半合: pairs from three-harmony groups |
| `PUNISHMENT_GROUPS` | 刑: 寅巳申無恩, 丑戌未恃勢, 子卯無禮 |
| `SELF_PUNISHMENT` | 自刑: 辰午酉亥 |
| `HARM_PAIRS` | 六害: 子未, 丑午, 寅巳, 卯辰, 申亥, 酉戌 |
| `DESTRUCTION_PAIRS` | 六破: 子酉, 丑辰, 寅亥, 卯午, 巳申, 未戌 |
| `isThreeHarmony(a, b, c)` | Check three-harmony group |
| `isPunishment(a, b)` | Check punishment relationship |
| `isSelfPunishment(branch)` | Check self-punishment |
| `isHarm(a, b)` | Check harm pair |
| `isDestruction(a, b)` | Check destruction pair |

### Hidden Harmony (暗合)

| Export | Description |
|---|---|
| `HIDDEN_HARMONY_PAIRS` | Pre-computed pairs where main hidden stems form 五合 |
| `isHiddenHarmony(a, b)` | Check if two branches have 暗合 |

### Ten Relations (十神)

| Export | Description |
|---|---|
| `TEN_RELATION_NAMES` | All 10 relation names |
| `getTenRelation(dayStem, otherStem)` | Derive the ten-relation |
| `getTenRelationForBranch(dayStem, branch)` | Ten-relation using main hidden stem |

### Twelve Life Stages (長生十二神)

| Export | Description |
|---|---|
| `TWELVE_STAGES` | `['長生','沐浴','冠帶','臨官','帝旺','衰','病','死','墓','絕','胎','養']` |
| `getLifeStage(stem, branch)` | Life stage of a stem at a branch |

### Element Strength (旺相休囚死)

| Export | Description |
|---|---|
| `STRENGTH` | `Record<Strength, string>` with descriptive labels |
| `getStrength(element, monthBranch)` | Seasonal strength: 旺, 相, 休, 囚, or 死 |

### Earth Types (濕土/燥土)

| Export | Description |
|---|---|
| `EARTH_BRANCHES` | `['辰','丑','戌','未']` |
| `isWetEarth(branch)` | 辰丑 are wet earth |
| `isDryEarth(branch)` | 戌未 are dry earth |
| `getStorageElement(branch)` | 庫/墓: 辰→水, 戌→火, 丑→金, 未→木 |

### Void Branches (旬空)

| Export | Description |
|---|---|
| `computeVoidBranches(dayStem, dayBranch)` | `{ true: Branch, partial: Branch }` — 正空 (polarity match) and 偏空 |

### Salary Star (祿神)

| Export | Description |
|---|---|
| `SALARY_STAR` | `Record<Stem, Branch>` — stem → 臨官 branch |
| `getSalaryStar(stem)` | Get the 祿 branch for a stem |

### Virtue Stars (天德/月德)

| Export | Description |
|---|---|
| `getMonthlyVirtue(monthBranch)` | 月德: yang stem of the three-harmony element |
| `getHeavenlyVirtue(monthBranch)` | 天德: traditional 12-entry lookup (stem or branch) |
| `getMonthlyVirtueCombo(monthBranch)` | 月德合: 五合 partner of 月德 |
| `getHeavenlyVirtueCombo(monthBranch)` | 天德合: combination partner of 天德 |

### Almanac Flags (神煞)

30 symbolic markers derived from stem-branch combinatorics:

| Export | Description |
|---|---|
| `ALMANAC_FLAG_REGISTRY` | Full registry of all 30 flags with metadata |
| `getAlmanacFlags(date)` | All active flags for a date |
| `getAlmanacFlagsForPillars(pillars, season)` | All active flags from pre-computed pillars |

Day stem derivations:

| Export | Description |
|---|---|
| `getHeavenlyNoble(stem)` | 天乙貴人: two noble branches |
| `getSupremeNoble(stem)` | 太極貴人: supreme noble branches |
| `getLiteraryStar(stem)` | 文昌貴人: literary star branch |
| `getProsperityStar(stem)` | 祿神: prosperity branch |
| `getRamBlade(stem)` | 羊刃: ram blade branch |
| `getGoldenCarriage(stem)` | 金輿: golden carriage branch |
| `getStudyHall(stem)` | 學堂: study hall (長生 position) |

Branch derivations (三合 based):

| Export | Description |
|---|---|
| `getTravelingHorse(branch)` | 驛馬: from 三合 group |
| `getPeachBlossom(branch)` | 桃花: from 三合 group |
| `getCanopy(branch)` | 華蓋: from 三合 group |
| `getGeneralStar(branch)` | 將星: from 三合 group |
| `getRobberyStar(branch)` | 劫煞: from 三合 group |
| `getDeathSpirit(branch)` | 亡神: from 三合 group |

Branch derivations (other):

| Export | Description |
|---|---|
| `getRedPhoenix(branch)` | 紅鸞: red phoenix |
| `getHeavenlyJoy(branch)` | 天喜: heavenly joy (紅鸞 + 6) |
| `getLonelyStar(branch)` | 孤辰: lonely star |
| `getWidowStar(branch)` | 寡宿: widow star |
| `getHeavenlyDoctor(branch)` | 天醫: heavenly doctor (year branch + 1) |

Day pillar predicates:

| Export | Description |
|---|---|
| `isCommandingStar(stem, branch)` | 魁罡: 庚辰/壬辰/庚戌/戊戌 |
| `isTenEvils(stem, branch)` | 十惡大敗: 10 specific day pillars |
| `isYinYangError(stem, branch)` | 陰差陽錯: 12 specific day pillars |
| `isGoldSpirit(stem, branch)` | 金神: 己巳/癸酉/乙丑 |
| `isTenSpirits(stem, branch)` | 十靈日: 10 specific day pillars |
| `isHeavenNet(branch)` | 天羅: 戌/亥 |
| `isEarthTrap(branch)` | 地網: 辰/巳 |

Calendar predicates:

| Export | Description |
|---|---|
| `isHeavensPardon(stem, branch, season)` | 天赦日: seasonal pardon day |
| `isMonthBreak(dayBranch, monthBranch)` | 月破: day clashes month |
| `isYearBreak(dayBranch, yearBranch)` | 歲破: day clashes year |
| `isFourWaste(stem, branch, season)` | 四廢: element dead in season |

Multi-pillar patterns:

| Export | Description |
|---|---|
| `getThreeWonders(pillars)` | 三奇貴人: 乙丙丁 (天) / 甲戊庚 (地) / 壬癸辛 (人) |

### Luck Periods (大運/小運)

| Export | Description |
|---|---|
| `getLuckDirection(yearStem, gender)` | Yang+male or yin+female → forward; opposite → backward |
| `computeMajorLuck(birthDate, gender, count?)` | 大運: 10-year periods from month pillar (default 8 periods) |
| `computeMinorLuck(hourPillar, direction, fromAge, toAge)` | 小運: year-by-year pillars from hour pillar |

## Types

```typescript
interface Pillar { stem: Stem; branch: Branch; }
interface FourPillars { year: Pillar; month: Pillar; day: Pillar; hour: Pillar; }
type TenRelation = '比肩' | '劫財' | '食神' | '傷官' | '偏財' | '正財' | '七殺' | '正官' | '偏印' | '正印';
type LifeStage = '長生' | '沐浴' | '冠帶' | '臨官' | '帝旺' | '衰' | '病' | '死' | '墓' | '絕' | '胎' | '養';
type DayFitness = '建' | '除' | '滿' | '平' | '定' | '執' | '破' | '危' | '成' | '收' | '開' | '閉';
type AlmanacCategory = 'noble' | 'academic' | 'romance' | 'travel' | 'wealth' | 'protection' | 'health' | 'inauspicious';
interface AlmanacFlagInfo { name: string; english: string; auspicious: boolean; category: AlmanacCategory; }
interface AlmanacFlagResult extends AlmanacFlagInfo { positions: ('year' | 'month' | 'day' | 'hour')[]; }
type LuckDirection = 'forward' | 'backward';
interface MajorLuckPeriod { pillar: { stem: Stem; branch: Branch; stemBranch: StemBranch }; startAge: number; endAge: number; }
interface MajorLuckResult { direction: LuckDirection; startAge: number; periods: MajorLuckPeriod[]; }
interface MinorLuckYear { age: number; pillar: { stem: Stem; branch: Branch; stemBranch: StemBranch }; }
type PunishmentType = '無恩' | '恃勢' | '無禮';
type EarthType = '濕' | '燥';
type DayRelation = '生' | '剋' | '合' | '衝' | '比和';
```
