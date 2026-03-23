#!/usr/bin/env node
/**
 * Download ELP/MPP02 data files from ytliu0's repository and generate
 * TypeScript coefficient arrays for the Moon ephemeris module.
 *
 * Data source: https://github.com/ytliu0/ElpMpp02
 * License: MIT
 *
 * Usage: node scripts/generate-elpmpp02.mjs
 *
 * Truncation thresholds (arcseconds for lon/lat, km for distance):
 *   Main problem: keep all terms (relatively few: ~2645 total)
 *   Perturbation: keep terms with |amplitude| > threshold
 *     - lon: > 0.5" (~1500 terms of 12734 kept)
 *     - lat: > 0.5" (~800 terms of 7030 kept)
 *     - dist: > 0.5 km (~1500 terms of 13492 kept)
 *
 * This gives ~0.001° accuracy for modern dates (1900-2100).
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = 'https://raw.githubusercontent.com/ytliu0/ElpMpp02/master/';
const OUT_DIR = join(__dirname, '..', 'src', 'moon');
const OUT_FILE = join(OUT_DIR, 'elpmpp02-data.ts');

// Data files to download
const MAIN_FILES = [
  { name: 'elp_main.long', key: 'MAIN_LONG', trig: 'sine' },
  { name: 'elp_main.lat', key: 'MAIN_LAT', trig: 'sine' },
  { name: 'elp_main.dist', key: 'MAIN_DIST', trig: 'cosine' },
];

const PERT_FILES = [
  { name: 'elp_pert.longT0', key: 'PERT_LONG_T0' },
  { name: 'elp_pert.longT1', key: 'PERT_LONG_T1' },
  { name: 'elp_pert.longT2', key: 'PERT_LONG_T2' },
  { name: 'elp_pert.longT3', key: 'PERT_LONG_T3' },
  { name: 'elp_pert.latT0', key: 'PERT_LAT_T0' },
  { name: 'elp_pert.latT1', key: 'PERT_LAT_T1' },
  { name: 'elp_pert.latT2', key: 'PERT_LAT_T2' },
  { name: 'elp_pert.distT0', key: 'PERT_DIST_T0' },
  { name: 'elp_pert.distT1', key: 'PERT_DIST_T1' },
  { name: 'elp_pert.distT2', key: 'PERT_DIST_T2' },
  { name: 'elp_pert.distT3', key: 'PERT_DIST_T3' },
];

// Truncation thresholds for perturbation terms
// Main problem terms are all kept (small number, large amplitudes)
// Perturbation amplitudes: lon/lat in RADIANS, dist in KM
// 1e-7 rad ≈ 0.02 arcsec — sufficient for calendar accuracy
const PERT_THRESHOLD = {
  LONG: 1e-7,   // radians (~0.02 arcsec)
  LAT: 1e-7,    // radians (~0.02 arcsec)
  DIST: 1e-4,   // km (~0.1 m)
};

async function fetchFile(name) {
  const url = BASE_URL + name;
  console.log(`  Downloading ${name}...`);
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`Failed to fetch ${url}: ${resp.status}`);
  return resp.text();
}

/**
 * Parse main problem data file.
 * Format: first line = N, then N rows of:
 *   D F L Lp A B1 B2 B3 B4 B5 B6
 * Returns array of [D, F, L, Lp, A, B1, B2, B3, B4, B5] (B6 unused)
 */
function parseMainFile(text) {
  const lines = text.trim().split('\n');
  const n = parseInt(lines[0].trim());
  const terms = [];
  for (let i = 1; i <= n; i++) {
    const parts = lines[i].trim().split(/\s+/);
    const D = parseInt(parts[0]);
    const F = parseInt(parts[1]);
    const L = parseInt(parts[2]);
    const Lp = parseInt(parts[3]);
    const A = parseFloat(parts[4]);
    const B1 = parseFloat(parts[5]);
    const B2 = parseFloat(parts[6]);
    const B3 = parseFloat(parts[7]);
    const B4 = parseFloat(parts[8]);
    const B5 = parseFloat(parts[9]);
    // B6 unused
    terms.push([D, F, L, Lp, A, B1, B2, B3, B4, B5]);
  }
  return terms;
}

/**
 * Parse perturbation data file.
 * Format: first line = N, then N rows of:
 *   i0 i1 i2 i3 i4 i5 i6 i7 i8 i9 i10 i11 i12 amplitude phase
 * Returns array of [i0..i12, amplitude, phase]
 */
function parsePertFile(text, threshold) {
  const lines = text.trim().split('\n');
  const n = parseInt(lines[0].trim());
  const terms = [];
  let skipped = 0;
  for (let i = 1; i <= n; i++) {
    const parts = lines[i].trim().split(/\s+/);
    const ints = [];
    for (let j = 0; j < 13; j++) {
      ints.push(parseInt(parts[j]));
    }
    const amplitude = parseFloat(parts[13]);
    const phase = parseFloat(parts[14]);

    if (Math.abs(amplitude) < threshold) {
      skipped++;
      continue;
    }
    terms.push([...ints, amplitude, phase]);
  }
  if (skipped > 0) {
    console.log(`    Truncated: kept ${terms.length} of ${n} terms (skipped ${skipped})`);
  }
  return terms;
}

function formatArray(terms, indent = '  ') {
  const rows = terms.map(t => {
    const parts = t.map(v => {
      if (Number.isInteger(v) && Math.abs(v) < 100) return String(v);
      return String(v);
    });
    return `${indent}[${parts.join(',')}]`;
  });
  return rows.join(',\n');
}

async function main() {
  console.log('ELP/MPP02 Coefficient Generator');
  console.log('================================\n');

  if (!existsSync(OUT_DIR)) {
    mkdirSync(OUT_DIR, { recursive: true });
  }

  // Download all files
  console.log('Downloading data files...');
  const mainData = {};
  for (const f of MAIN_FILES) {
    const text = await fetchFile(f.name);
    mainData[f.key] = parseMainFile(text);
    console.log(`    ${f.key}: ${mainData[f.key].length} terms`);
  }

  const pertData = {};
  for (const f of PERT_FILES) {
    const text = await fetchFile(f.name);
    const category = f.key.includes('LONG') ? 'LONG' :
                     f.key.includes('LAT') ? 'LAT' : 'DIST';
    pertData[f.key] = parsePertFile(text, PERT_THRESHOLD[category]);
  }

  // Count total terms
  let totalMain = 0, totalPert = 0;
  for (const k of Object.keys(mainData)) totalMain += mainData[k].length;
  for (const k of Object.keys(pertData)) totalPert += pertData[k].length;
  console.log(`\nTotal: ${totalMain} main + ${totalPert} perturbation = ${totalMain + totalPert} terms\n`);

  // Generate TypeScript
  console.log('Generating TypeScript...');

  let ts = `/**
 * ELP/MPP02 Moon ephemeris coefficient data.
 *
 * AUTO-GENERATED by scripts/generate-elpmpp02.mjs — do not edit manually.
 *
 * Source: https://github.com/ytliu0/ElpMpp02 (MIT License)
 * Theory: Chapront & Francou, "The lunar theory ELP revisited" (2003)
 *
 * Main problem terms: [D, F, L, Lp, A, B1, B2, B3, B4, B5]
 *   - D,F,L,Lp: Delaunay multipliers (integers)
 *   - A: base amplitude (arcsec for lon/lat, km for dist)
 *   - B1-B5: correction coefficients for parameter fitting
 *
 * Perturbation terms: [i0..i12, amplitude, phase]
 *   - i0-i3: Delaunay multipliers (D,F,L,Lp)
 *   - i4-i11: planetary mean longitude multipliers (Me,Ve,EM,Ma,Ju,Sa,Ur,Ne)
 *   - i12: zeta multiplier
 *   - amplitude: in arcsec (lon/lat) or km (dist)
 *   - phase: phase offset in radians
 */

// prettier-ignore

`;

  // Main problem arrays
  for (const f of MAIN_FILES) {
    ts += `/** Main problem ${f.trig} series: ${f.name} (${mainData[f.key].length} terms) */\n`;
    ts += `export const ${f.key}: readonly (readonly number[])[] = [\n`;
    ts += formatArray(mainData[f.key]);
    ts += '\n];\n\n';
  }

  // Perturbation arrays
  for (const f of PERT_FILES) {
    ts += `/** Perturbation series: ${f.name} (${pertData[f.key].length} terms) */\n`;
    ts += `export const ${f.key}: readonly (readonly number[])[] = [\n`;
    ts += formatArray(pertData[f.key]);
    ts += '\n];\n\n';
  }

  writeFileSync(OUT_FILE, ts);
  const sizeKB = (Buffer.byteLength(ts) / 1024).toFixed(1);
  console.log(`Written to ${OUT_FILE} (${sizeKB} KB)`);
  console.log('Done.');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
