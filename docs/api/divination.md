---
title: "Divination Systems (三式) — stem-branch API Reference"
description: "Three classical divination systems: 大六壬 (Six Ren), 奇門遁甲 (Mystery Gates), 紫微斗數 (Zi Wei Dou Shu)."
---

# Divination Systems (三式)

The three classical Chinese divination systems (三式). Six Ren (大六壬) derives a chart from the day pillar and hour branch via heaven/earth plate rotation and four-lesson extraction with nine transmission methods. Mystery Gates (奇門遁甲) arranges nine stars, eight doors, and eight deities on earth and heaven plates keyed to the current 局數. Polaris Astrology (紫微斗數) places 14 major stars across 12 palaces from lunar birth data with 四化 transformations.

### Six Ren (大六壬)

| Export | Description |
|---|---|
| `STEM_LODGING` | 日干寄宮: stem lodging branches |
| `HEAVENLY_GENERALS` | 十二天將 in traditional order |
| `getMonthlyGeneral(date)` | 月將: shifts at each 中氣 boundary |
| `buildPlates(monthlyGeneral, hourBranch)` | Build 天地盤 (heaven/earth plate rotation) |
| `buildFourLessons(dayStem, dayBranch, plates)` | Derive 四課 (four lessons) |
| `computeSixRen(dayStem, dayBranch, hourBranch, monthlyGeneral)` | Full chart from parameters |
| `computeSixRenForDate(date, hour?)` | Full chart for a date |

### Mystery Gates (奇門遁甲)

| Export | Description |
|---|---|
| `NINE_STARS` | 九星: 天蓬 through 天英 |
| `EIGHT_DOORS` | 八門: 休 through 開 |
| `EIGHT_DEITIES` | 八神: 值符 through 天禽 |
| `SAN_QI_LIU_YI` | 三奇六儀: 戊己庚辛壬癸丁丙乙 |
| `getEscapeMode(date)` | 陰遁 or 陽遁 for a date |
| `getJuShu(date)` | 局數 (1-9) for a date |
| `buildEarthPlate(juShu)` | 地盤: Lo Shu base layout |
| `buildHeavenPlate(earthPlate, ...)` | 天盤: rotated overlay |
| `computeQiMen(...)` | Full chart from parameters |
| `computeQiMenForDate(date)` | Full chart for a date |

### Polaris Astrology (紫微斗數)

| Export | Description |
|---|---|
| `MAJOR_STARS` | 14 major stars (紫微 through 破軍) |
| `PALACE_NAMES` | 12 palace names (命宮 through 父母宮) |
| `getFatepalace(lunarMonth, hourIndex)` | Fate palace branch index |
| `getElementPattern(fatePalaceIndex, yearStem)` | 五行局 from 納音 (2-6) |
| `getZiWeiPosition(birthDay, elementPattern)` | 紫微 star palace index |
| `computeZiWei(birthData)` | Full chart: 12 palaces, 14 stars, 四化, 流太歲 |

## Types

```typescript
type TransmissionMethod = '賊剋' | '比用' | '涉害' | '遙剋' | '昴星' | '別責' | '八專' | '返吟' | '伏吟';
type HeavenlyGeneral = '貴人' | '螣蛇' | '朱雀' | '六合' | '勾陳' | '青龍' | '天空' | '白虎' | '太常' | '玄武' | '太陰' | '天后';

interface SixRenLesson { upper: Branch; lower: Branch; }
interface SixRenChart { dayStem: Stem; dayBranch: Branch; hourBranch: Branch; monthlyGeneral: Branch; plates: Record<Branch, Branch>; lessons: SixRenLesson[]; transmissions: { initial: Branch; middle: Branch; final: Branch }; method: TransmissionMethod; generals: Record<Branch, HeavenlyGeneral>; }

interface QiMenChart { earthPlate: Record<number, string>; heavenPlate: Record<number, string>; stars: Record<number, string>; doors: Record<number, string>; deities: Record<number, string>; escapeMode: string; juShu: number; zhiFu: { star: string; palace: number }; zhiShi: { door: string; palace: number }; }

interface ZiWeiBirthData { year: number; month: number; day: number; hour: number; gender: 'male' | 'female'; }
interface ZiWeiPalace { name: string; branch: Branch; stem: Stem; majorStars: string[]; }
interface SiHua { lu: string; quan: string; ke: string; ji: string; }
interface ZiWeiChart { palaces: ZiWeiPalace[]; elementPattern: number; siHua: SiHua; birthData: ZiWeiBirthData; fatePalaceIndex: number; bodyPalaceIndex: number; taiSuiIndex: number; }
```
