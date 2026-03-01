// ── Types ──────────────────────────────────────────────────
export type {
  Stem,
  Branch,
  StemBranch,
  Element,
  ElementRelation,
  Strength,
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
export { STEMS, STEM_ELEMENT, stemPolarity, stemByIndex } from './stems';

// ── 地支 (Earthly Branches) ────────────────────────────────
export { BRANCHES, BRANCH_ELEMENT, branchPolarity, branchByIndex, branchFromHour, branchFromMonth } from './branches';

// ── 五行 (Five Elements) ───────────────────────────────────
export { GENERATIVE_CYCLE, CONQUERING_CYCLE, getElementRelation, ELEMENT_ORDER } from './elements';

// ── 干支 (Sexagenary Cycle) ────────────────────────────────
export { makeStemBranch, stemBranchByCycleIndex, stemBranchCycleIndex, parseStemBranch, allSixtyStemBranch } from './stem-branch';

// ── 地支關係 (Branch Relations) ─────────────────────────────
export {
  HARMONY_PAIRS, CLASH_PAIRS,
  isHarmony, isClash, getDayRelation,
} from './branch-relations';

// ── 旺相休囚死 (Element Strength) ───────────────────────────
export { STRENGTH, getStrength } from './element-strength';

// ── 旬空 (Void Branches) ──────────────────────────────────
export { computeVoidBranches } from './void-branches';

// ── 節氣 (Solar Terms) ─────────────────────────────────────
export {
  SOLAR_TERM_NAMES, SOLAR_TERM_LONGITUDES, MONTH_BOUNDARY_INDICES,
  findSolarTermMoment, getSolarTermsForYear, findSpringStart,
  getMonthBoundaryTerms, getSolarMonthExact,
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
  getChineseZodiac, getZodiacBySpringStart, getChineseZodiacLunarNewYear,
} from './chinese-zodiac';

// ── 星座 (Western Zodiac) ──────────────────────────────────
export { getWesternZodiac } from './western-zodiac';
