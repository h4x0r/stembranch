// ── 天干 (Heavenly Stems) ──────────────────────────────────
export type Stem = '甲' | '乙' | '丙' | '丁' | '戊' | '己' | '庚' | '辛' | '壬' | '癸';

// ── 地支 (Earthly Branches) ────────────────────────────────
export type Branch = '子' | '丑' | '寅' | '卯' | '辰' | '巳' | '午' | '未' | '申' | '酉' | '戌' | '亥';

// ── 干支 (Stem-Branch pair) ────────────────────────────────
export type StemBranch = `${Stem}${Branch}`;

// ── 五行 (Five Elements) ───────────────────────────────────
export type Element = '金' | '木' | '水' | '火' | '土';

export type ElementRelation = '生' | '剋' | '被生' | '被剋' | '比和';

// ── 旺相休囚死 (Qi Strength) ───────────────────────────────
export type Strength = '旺' | '相' | '休' | '囚' | '死';

// ── 四柱 (Four Pillars) ────────────────────────────────────
export interface Pillar {
  stem: Stem;
  branch: Branch;
}

export interface FourPillars {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
}

// ── 地支關係 ────────────────────────────────────────────────
export type DayRelation = '生' | '剋' | '合' | '沖' | '比和';

// ── 節氣 (Solar Terms) ─────────────────────────────────────
export interface SolarTerm {
  name: string;
  longitude: number; // solar ecliptic longitude in degrees
  date: Date;        // exact moment of this term
}

// ── 生肖 (Chinese Zodiac) ──────────────────────────────────
export type ChineseZodiacAnimal =
  | '鼠' | '牛' | '虎' | '兔' | '龍' | '蛇'
  | '馬' | '羊' | '猴' | '雞' | '狗' | '豬';

export type YearBoundary = 'spring-start' | 'lunar-new-year';

export interface ChineseZodiacResult {
  animal: ChineseZodiacAnimal;
  branch: Branch;
  yearBoundary: YearBoundary;
  effectiveYear: number;
}

// ── 星座 (Western Zodiac) ──────────────────────────────────
export type WesternZodiacSign =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer'
  | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio'
  | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export interface WesternZodiacResult {
  sign: WesternZodiacSign;
  symbol: string;
  chineseName: string;
  element: string; // Western element (Fire/Earth/Air/Water)
}

// ── True Solar Time ────────────────────────────────────────
export interface TrueSolarTimeResult {
  trueSolarTime: Date;
  equationOfTime: number;    // minutes
  longitudeCorrection: number; // minutes
  totalCorrection: number;     // minutes
}
