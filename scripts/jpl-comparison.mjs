#!/usr/bin/env node
/**
 * JPL Horizons 3-way comparison script
 *
 * Compares stembranch's VSOP87D-based computations against JPL Horizons DE441
 * for both Equation of Time and solar ecliptic longitude.
 *
 * Usage: node scripts/jpl-comparison.mjs
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

// Import stembranch from dist
const sb = await import(join(root, 'dist', 'index.js'));

// ═══════════════════════════════════════════════════════════════
//  Helpers
// ═══════════════════════════════════════════════════════════════

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

/** Parse JPL Horizons data file (CAL format with degree RA/DEC or EcLon/EcLat) */
function parseJplData(filePath) {
  const lines = readFileSync(filePath, 'utf8').trim().split('\n');
  return lines.map(line => {
    const parts = line.trim().split(/\s+/);
    // Format: "2024-Jan-01 12:00     281.472075822 -23.019198118"
    const dateStr = parts[0]; // "2024-Jan-01"
    const timeStr = parts[1]; // "12:00"
    const val1 = parseFloat(parts[2]); // RA or EcLon (degrees)
    const val2 = parseFloat(parts[3]); // DEC or EcLat (degrees)

    // Parse date
    const months = { Jan:0, Feb:1, Mar:2, Apr:3, May:4, Jun:5,
                     Jul:6, Aug:7, Sep:8, Oct:9, Nov:10, Dec:11 };
    const [yearStr, monStr, dayStr] = dateStr.split('-');
    const [hh, mm] = timeStr.split(':').map(Number);
    const date = new Date(Date.UTC(+yearStr, months[monStr], +dayStr, hh, mm, 0));

    return { date, val1, val2, dateStr, timeStr };
  });
}

/** Normalize degrees to [0, 360) */
function normDeg(d) { return ((d % 360) + 360) % 360; }

/** Julian centuries from J2000.0 (TT) */
function T(date) {
  const JD = 2451545.0 + (date.getTime() / 86400000 - 10957.5);
  return (JD - 2451545.0) / 36525;
}

/** Mean Sun longitude (L₀) — same formula as in stembranch */
function meanSunLongitude(date) {
  const t = T(date);
  return normDeg(280.46646 + 36000.76983 * t + 0.0003032 * t * t);
}

/** Compute EoT from apparent RA (JPL) — our convention: positive = sundial ahead */
function eotFromRA(date, apparentRA_deg) {
  const L0 = meanSunLongitude(date);
  let E = apparentRA_deg - L0 + 0.0057183;
  E = ((E + 180) % 360 + 360) % 360 - 180;
  return E * 4; // degrees to minutes
}

/** Percentile of sorted array */
function percentile(sorted, p) {
  const idx = (p / 100) * (sorted.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

/** Format ±value with fixed decimals */
function fmt(v, d = 3) {
  return (v >= 0 ? '+' : '') + v.toFixed(d);
}

// ═══════════════════════════════════════════════════════════════
//  1. Equation of Time comparison
// ═══════════════════════════════════════════════════════════════

console.log('═══════════════════════════════════════════════════════════');
console.log('  1. EQUATION OF TIME: stembranch VSOP87D vs JPL DE441');
console.log('═══════════════════════════════════════════════════════════\n');

const raData = parseJplData(join(__dirname, 'jpl-ra-2024.txt'));

const eotResults = [];

for (const { date, val1: jplRA, dateStr } of raData) {
  const jplEoT = eotFromRA(date, jplRA);
  const sbEoT = sb.equationOfTimeVSOP(date);
  const diff = sbEoT - jplEoT;

  eotResults.push({ dateStr, jplRA, jplEoT, sbEoT, diff, absDiff: Math.abs(diff) });
}

// Statistics
const diffs = eotResults.map(r => r.diff);
const absDiffs = eotResults.map(r => r.absDiff);
const sortedAbs = [...absDiffs].sort((a, b) => a - b);

const meanDiff = diffs.reduce((s, d) => s + d, 0) / diffs.length;
const meanAbsDiff = absDiffs.reduce((s, d) => s + d, 0) / absDiffs.length;
const maxAbsDiff = Math.max(...absDiffs);
const stdDev = Math.sqrt(diffs.reduce((s, d) => s + (d - meanDiff) ** 2, 0) / diffs.length);
const p50 = percentile(sortedAbs, 50);
const p95 = percentile(sortedAbs, 95);
const p99 = percentile(sortedAbs, 99);
const maxEntry = eotResults.find(r => r.absDiff === maxAbsDiff);

console.log('Date range: 2024-01-01 to 2024-12-31 (366 daily samples at 12:00 TT)');
console.log('JPL source: DE441 ephemeris, apparent RA (airless), geocentric\n');

console.log('╔════════════════════════════════════════════════╗');
console.log('║  EoT Residual Statistics (stembranch − JPL)   ║');
console.log('╠════════════════════════════════════════════════╣');
console.log(`║  Mean bias:      ${fmt(meanDiff, 4).padStart(10)} min           ║`);
console.log(`║  Mean |residual|: ${meanAbsDiff.toFixed(4).padStart(9)} min           ║`);
console.log(`║  Std deviation:  ${stdDev.toFixed(4).padStart(10)} min           ║`);
console.log(`║  Max |residual|: ${maxAbsDiff.toFixed(4).padStart(10)} min           ║`);
console.log(`║    (at ${maxEntry.dateStr})                    ║`);
console.log(`║  P50:            ${p50.toFixed(4).padStart(10)} min           ║`);
console.log(`║  P95:            ${p95.toFixed(4).padStart(10)} min           ║`);
console.log(`║  P99:            ${p99.toFixed(4).padStart(10)} min           ║`);
console.log('╚════════════════════════════════════════════════╝\n');

// Monthly breakdown
console.log('Monthly EoT comparison (stembranch vs JPL, at 15th of each month):');
console.log('┌────────────┬──────────┬──────────┬──────────┐');
console.log('│ Date       │ JPL EoT  │ SB EoT   │ Δ (sec)  │');
console.log('├────────────┼──────────┼──────────┼──────────┤');

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
for (let m = 0; m < 12; m++) {
  const target = `2024-${monthNames[m]}-15`;
  const r = eotResults.find(e => e.dateStr === target);
  if (r) {
    const diffSec = (r.diff * 60).toFixed(1);
    console.log(`│ ${r.dateStr} │ ${fmt(r.jplEoT, 3).padStart(8)} │ ${fmt(r.sbEoT, 3).padStart(8)} │ ${diffSec.padStart(8)} │`);
  }
}
console.log('└────────────┴──────────┴──────────┴──────────┘');
console.log('(Δ = stembranch − JPL, in seconds)\n');

// ═══════════════════════════════════════════════════════════════
//  2. Solar ecliptic longitude comparison
// ═══════════════════════════════════════════════════════════════

console.log('═══════════════════════════════════════════════════════════');
console.log('  2. SOLAR ECLIPTIC LONGITUDE: stembranch vs JPL DE441');
console.log('═══════════════════════════════════════════════════════════\n');

const eclData = parseJplData(join(__dirname, 'jpl-eclon-2024.txt'));

const lonResults = [];

for (const { date, val1: jplLon, dateStr } of eclData) {
  // stembranch getSunLongitude returns apparent ecliptic longitude (VSOP87D + nutation + aberration)
  const sbLon = sb.equationOfTimeVSOP; // We need getSunLongitude... check exports
  lonResults.push({ dateStr, jplLon, date });
}

// getSunLongitude isn't exported directly — use the internal solar-longitude module
// We'll compute the difference using the EoT approach instead:
// If EoT matches, then α matches, which implies λ (ecliptic lon) matches too
// since α = atan2(cos(ε)·sin(λ), cos(λ)).

// Instead, let's compare solar longitude at the 4 cardinal solar term moments
console.log('Cardinal solar term timing comparison (2024):\n');
console.log('JPL crossing moments determined by linear interpolation of');
console.log('1-minute ecliptic longitude data from Horizons DE441.\n');

// JPL DE441 crossing moments (from minute-level data above)
const jplCardinal = [
  { name: '春分 (Vernal Equinox)',  lon: 0,   jplTT: '2024-03-20 03:07:30 TT' },
  { name: '夏至 (Summer Solstice)', lon: 90,  jplTT: '2024-06-20 20:52:10 TT' },
  { name: '秋分 (Autumnal Equinox)',lon: 180, jplTT: '2024-09-22 12:44:36 TT' },
  { name: '冬至 (Winter Solstice)', lon: 270, jplTT: '2024-12-21 09:21:44 TT' },
];

// Compute stembranch's predictions for these solar terms
// Solar term indices: 春分=0, 清明=1, ... (starting from 0° = 春分)
// Actually in stembranch, solar term longitudes are indexed differently.
// findSolarTermMoment finds the moment the sun reaches a given longitude.

console.log('┌──────────────────────────────┬───────────────────────┬───────────────────────┬───────────┐');
console.log('│ Solar Term                   │ JPL DE441 (TT)        │ stembranch VSOP87D    │ Δ (sec)   │');
console.log('├──────────────────────────────┼───────────────────────┼───────────────────────┼───────────┤');

// stembranch solar term longitudes: index 0 = 小寒 (285°), so we need to find the right index
// Or we can use findSolarTermMoment directly with the target longitude
const solarTermLongitudes = sb.SOLAR_TERM_LONGITUDES;
const solarTermNames = sb.SOLAR_TERM_NAMES;

// Map cardinal longitudes to solar term indices
const cardinalMap = [
  { name: '春分 (Vernal Equinox)',  targetLon: 0,   jplMinA: '2024-03-20 03:07', jplMinB: '2024-03-20 03:08', lonA: 359.9996037, lonB: 0.0002936 },
  { name: '夏至 (Summer Solstice)', targetLon: 90,  jplMinA: '2024-06-20 20:52', jplMinB: '2024-06-20 20:53', lonA: 89.9998879, lonB: 90.0005503 },
  { name: '秋分 (Autumnal Equinox)',targetLon: 180, jplMinA: '2024-09-22 12:44', jplMinB: '2024-09-22 12:45', lonA: 179.9994352, lonB: 180.0001145 },
  { name: '冬至 (Winter Solstice)', targetLon: 270, jplMinA: '2024-12-21 09:21', jplMinB: '2024-12-21 09:22', lonA: 269.9994759, lonB: 270.0001830 },
];

for (const c of cardinalMap) {
  // Interpolate JPL crossing time
  const parseTime = (s) => {
    const [date, time] = s.split(' ');
    const [y, mon, d] = date.split('-');
    const [hh, mm] = time.split(':').map(Number);
    return new Date(Date.UTC(+y, +mon - 1, +d, hh, mm, 0));
  };

  const tA = parseTime(c.jplMinA);
  const tB = parseTime(c.jplMinB);

  // Handle 0°/360° wrap for spring equinox
  let lonA = c.lonA, lonB = c.lonB;
  if (c.targetLon === 0 && lonA > 350) {
    lonA = lonA - 360; // -0.0003963
  }

  // Linear interpolation: find t where lon = targetLon
  const frac = (c.targetLon - lonA) / (lonB - lonA);
  const jplMs = tA.getTime() + frac * (tB.getTime() - tA.getTime());
  const jplDate = new Date(jplMs);

  // stembranch: findSolarTermMoment(targetLongitude, year, startMonth)
  // Need to provide a startMonth hint for the search
  const startMonths = { 0: 2, 90: 5, 180: 8, 270: 11 };
  let sbDate;
  try {
    sbDate = sb.findSolarTermMoment(c.targetLon, 2024, startMonths[c.targetLon]);
  } catch (_) {
    // fallback without startMonth hint
    sbDate = sb.findSolarTermMoment(c.targetLon, 2024);
  }

  if (sbDate) {
    // JPL times are in TT; stembranch returns UT (JavaScript Date = UTC).
    // Convert JPL TT → UT by subtracting ΔT so both are on the same timescale.
    const dtSec = sb.deltaT(jplDate); // ΔT in seconds (~69.2s for 2024)
    const jplUT = new Date(jplDate.getTime() - dtSec * 1000);

    const diffMs = sbDate.getTime() - jplUT.getTime();
    const diffSec = diffMs / 1000;

    const fmtDate = (d) => {
      const pad = (n) => String(n).padStart(2, '0');
      return `${d.getUTCFullYear()}-${pad(d.getUTCMonth()+1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
    };

    console.log(`│ ${c.name.padEnd(28)} │ ${fmtDate(jplUT).padStart(21)} │ ${fmtDate(sbDate).padStart(21)} │ ${fmt(diffSec, 1).padStart(9)} │`);
  }
}

console.log('└──────────────────────────────┴───────────────────────┴───────────────────────┴───────────┘');
console.log(`(JPL TT converted to UT via ΔT ≈ ${sb.deltaT(new Date(Date.UTC(2024, 6, 1))).toFixed(1)}s; Δ = stembranch − JPL in seconds)\n`);

// ═══════════════════════════════════════════════════════════════
//  3. Summary for accuracy.md
// ═══════════════════════════════════════════════════════════════

console.log('═══════════════════════════════════════════════════════════');
console.log('  3. SUMMARY');
console.log('═══════════════════════════════════════════════════════════\n');

const within1s = sortedAbs.filter(d => d * 60 <= 1).length;
const within5s = sortedAbs.filter(d => d * 60 <= 5).length;
const within10s = sortedAbs.filter(d => d * 60 <= 10).length;

console.log('EoT accuracy (366 daily samples, 2024):');
console.log(`  Within 1 second:  ${within1s}/${sortedAbs.length} (${(within1s/sortedAbs.length*100).toFixed(1)}%)`);
console.log(`  Within 5 seconds: ${within5s}/${sortedAbs.length} (${(within5s/sortedAbs.length*100).toFixed(1)}%)`);
console.log(`  Within 10 seconds:${within10s}/${sortedAbs.length} (${(within10s/sortedAbs.length*100).toFixed(1)}%)`);
console.log(`  Max deviation:    ${(maxAbsDiff * 60).toFixed(2)} seconds (at ${maxEntry.dateStr})`);
console.log(`  RMS:              ${(stdDev * 60).toFixed(2)} seconds`);
