import type {
  Pillar, FourPillars, Element, Strength, Eclipse,
} from 'stembranch';
import type { LunarDate, FlyingStarInfo, AlmanacFlagResult, SixRenChart } from 'stembranch';

// ── Pillars ──────────────────────────────────────────────────

export function formatPillar(pillar: Pillar): string {
  return `${pillar.stem}${pillar.branch}`;
}

export function formatPillarsRow(pillars: FourPillars): [string, string, string, string] {
  return [
    formatPillar(pillars.year),
    formatPillar(pillars.month),
    formatPillar(pillars.day),
    formatPillar(pillars.hour),
  ];
}

// ── Lunar date ───────────────────────────────────────────────

const LUNAR_MONTH_NAMES = [
  '', '正', '二', '三', '四', '五', '六',
  '七', '八', '九', '十', '十一', '十二',
];
const LUNAR_DAY_NAMES = [
  '', '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十',
];

export function formatLunarDate(lunar: LunarDate): string {
  const leap = lunar.isLeapMonth ? '閏' : '';
  const month = LUNAR_MONTH_NAMES[lunar.month] ?? `${lunar.month}`;
  const day = LUNAR_DAY_NAMES[lunar.day] ?? `${lunar.day}日`;
  return `${leap}${month}月${day}`;
}

// ── Solar terms ──────────────────────────────────────────────

function formatTermDate(d: Date): string {
  const m = d.getUTCMonth() + 1;
  const day = d.getUTCDate();
  const h = d.getUTCHours().toString().padStart(2, '0');
  const min = d.getUTCMinutes().toString().padStart(2, '0');
  return `${m}/${day} ${h}:${min} UTC`;
}

export function formatSolarTermPair(
  solarTerm: { current: { name: string; date: Date } | null; next: { name: string; date: Date } },
): { current: string; next: string } {
  const current = solarTerm.current
    ? `${solarTerm.current.name} (${formatTermDate(solarTerm.current.date)})`
    : '—';
  const next = `${solarTerm.next.name} (${formatTermDate(solarTerm.next.date)})`;
  return { current, next };
}

// ── Flying stars ─────────────────────────────────────────────

export function formatFlyingStar(star: FlyingStarInfo): string {
  return `${star.number} ${star.name} ${star.element} ${star.color}`;
}

// ── Almanac flags ────────────────────────────────────────────

export function formatAlmanacFlags(flags: AlmanacFlagResult[]): {
  auspicious: AlmanacFlagResult[];
  inauspicious: AlmanacFlagResult[];
} {
  return {
    auspicious: flags.filter((f) => f.auspicious),
    inauspicious: flags.filter((f) => !f.auspicious),
  };
}

// ── Element strength ─────────────────────────────────────────

export function formatElementStrength(element: Element, strength: Strength): string {
  return `${element} ${strength}`;
}

// ── Six Ren ──────────────────────────────────────────────────

export function formatSixRenSummary(chart: SixRenChart): {
  method: string;
  transmissions: string;
  lessons: string[];
} {
  const t = chart.transmissions;
  return {
    method: chart.method,
    transmissions: `${t.initial} → ${t.middle} → ${t.final}`,
    lessons: chart.lessons.map((l) => `${l.upper}/${l.lower}`),
  };
}

// ── Eclipse ──────────────────────────────────────────────────

export function formatEclipseInfo(eclipse: Eclipse, isToday: boolean): string {
  const kind = eclipse.kind === 'solar' ? '日食' : '月食';
  const d = eclipse.date;
  const dateStr = `${d.getUTCFullYear()}-${(d.getUTCMonth() + 1).toString().padStart(2, '0')}-${d.getUTCDate().toString().padStart(2, '0')}`;
  if (isToday) {
    return `當日${kind} (${dateStr})`;
  }
  return `最近${kind}: ${dateStr}`;
}
