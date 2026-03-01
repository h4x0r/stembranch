// ── Types ──────────────────────────────────────────────────
export type {
  TianGan,
  DiZhi,
  GanZhi,
  WuXing,
  WuXingRelationship,
  QiStrength,
  Pillar,
  FourPillars,
  DayRelation,
  SolarTerm,
  ChineseZodiacAnimal,
  YearBoundary,
  ChineseZodiacResult,
  WesternZodiacSign,
  WesternZodiacResult,
  TrueSolarTimeResult,
} from './types';

// ── 天干 (Heavenly Stems) ──────────────────────────────────
export { TIANGAN, TIANGAN_ELEMENT, tianganYinYang, tianganByIndex } from './tiangan';

// ── 地支 (Earthly Branches) ────────────────────────────────
export { DIZHI, DIZHI_ELEMENT, dizhiYinYang, dizhiByIndex, dizhiFromHour, dizhiFromMonth } from './dizhi';

// ── 五行 (Five Elements) ───────────────────────────────────
export { SHENG_CYCLE, KE_CYCLE, getRelationship, WUXING_ORDER } from './wuxing';

// ── 干支 (Sexagenary Cycle) ────────────────────────────────
export { makeGanZhi, ganzhiByCycleIndex, ganzhiCycleIndex, parseGanZhi, allSixtyGanZhi } from './ganzhi';

// ── 地支關係 (Branch Relations) ─────────────────────────────
export {
  LIUHE_PAIRS, LIUCHONG_PAIRS,
  isLiuHe, isLiuChong, getDayRelation,
} from './dizhi-relations';

// ── 旺相休囚死 (Qi Strength) ───────────────────────────────
export { QI_MOON, getQiStrength } from './qi-strength';

// ── 旬空 (Void Branches) ──────────────────────────────────
export { computeXunKong } from './xunkong';

// ── 節氣 (Solar Terms) ─────────────────────────────────────
export {
  SOLAR_TERM_NAMES, SOLAR_TERM_LONGITUDES, JIE_INDICES,
  findSolarTermMoment, getSolarTermsForYear, findLichun,
  getJieTermsForYear, getSolarMonthExact,
} from './solar-terms';

// ── 四柱 (Four Pillars) ────────────────────────────────────
export { computeFourPillars } from './four-pillars';
export type { ComputeOptions } from './four-pillars';

// ── 真太陽時 (True Solar Time) ─────────────────────────────
export { equationOfTime, trueSolarTime } from './true-solar-time';

// ── 生肖 (Chinese Zodiac) ──────────────────────────────────
export {
  ZODIAC_ANIMALS, ZODIAC_ENGLISH,
  animalFromBranch, branchFromAnimal,
  getChineseZodiac, getChineseZodiacLichun, getChineseZodiacLunarNewYear,
} from './chinese-zodiac';

// ── 星座 (Western Zodiac) ──────────────────────────────────
export { getWesternZodiac } from './western-zodiac';
