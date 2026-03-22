#!/usr/bin/env node
/**
 * Generate VSOP87D coefficient TypeScript files for 7 planets (Mercury–Neptune).
 *
 * Downloads raw data from CDS Strasbourg, parses the fixed-format VSOP87D files,
 * and emits TypeScript modules matching the existing vsop87d-earth.ts layout.
 *
 * Usage:  node scripts/generate-vsop87d-planets.mjs
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'src', 'planets');

const CDS_BASE = 'https://cdsarc.cds.unistra.fr/ftp/VI/81/';

const PLANETS = [
  { file: 'VSOP87D.mer', name: 'mercury', label: 'Mercury' },
  { file: 'VSOP87D.ven', name: 'venus',   label: 'Venus' },
  { file: 'VSOP87D.mar', name: 'mars',    label: 'Mars' },
  { file: 'VSOP87D.jup', name: 'jupiter', label: 'Jupiter' },
  { file: 'VSOP87D.sat', name: 'saturn',  label: 'Saturn' },
  { file: 'VSOP87D.ura', name: 'uranus',  label: 'Uranus' },
  { file: 'VSOP87D.nep', name: 'neptune', label: 'Neptune' },
];

/** Variable index → export key suffix */
const VAR_MAP = { 1: 'L', 2: 'B', 3: 'R' };

/**
 * Parse a VSOP87D text file into { L: number[][][], B: number[][][], R: number[][][] }
 * where each variable is [series][term][A, B, C].
 */
function parseVsop87d(text) {
  const result = { L: [], B: [], R: [] };
  const lines = text.split('\n');

  let currentVar = null;   // 'L', 'B', or 'R'
  let currentPower = -1;   // T^n
  let currentTerms = [];   // [A, B, C][]

  for (const line of lines) {
    // Header line: starts with ' VSOP87'
    if (line.startsWith(' VSOP87')) {
      // Flush previous series if any
      if (currentVar && currentTerms.length > 0) {
        result[currentVar].push(currentTerms);
        currentTerms = [];
      }

      // Parse header: variable at 0-indexed 41, power at 0-indexed 59
      const varNum = parseInt(line[41], 10);
      const power = parseInt(line[59], 10);
      currentVar = VAR_MAP[varNum];
      currentPower = power;
      continue;
    }

    // Skip empty lines
    if (line.trim().length === 0) continue;

    // Data line: A at cols 79-96, B at 97-110, C at 111-131 (0-indexed)
    if (line.length < 111) continue;

    const A = parseFloat(line.substring(79, 97).trim());
    const B = parseFloat(line.substring(97, 111).trim());
    const C = parseFloat(line.substring(111, 131).trim());

    if (Number.isFinite(A) && Number.isFinite(B) && Number.isFinite(C)) {
      currentTerms.push([A, B, C]);
    }
  }

  // Flush last series
  if (currentVar && currentTerms.length > 0) {
    result[currentVar].push(currentTerms);
  }

  return result;
}

/**
 * Format a number for output — keep full precision.
 */
function fmt(n) {
  // Use toPrecision for very small numbers, toString otherwise
  const s = String(n);
  // Ensure trailing zero doesn't get lost
  return s;
}

/**
 * Emit a TypeScript constant for one variable (L, B, or R).
 */
function emitVariable(prefix, varName, series) {
  const totalTerms = series.reduce((sum, s) => sum + s.length, 0);
  const lines = [];
  const varLabel = varName === 'L' ? 'longitude' : varName === 'B' ? 'latitude' : 'radius';
  lines.push(`/** Heliocentric ${varLabel} (${varName}) coefficients \u2014 ${totalTerms} terms in ${series.length} series */`);
  lines.push('// prettier-ignore');
  lines.push(`export const ${prefix}_${varName}: readonly (readonly (readonly [number, number, number])[])[] = [`);

  for (const terms of series) {
    lines.push('  [');
    for (const [A, B, C] of terms) {
      lines.push(`    [${fmt(A)}, ${fmt(B)}, ${fmt(C)}],`);
    }
    lines.push('  ],');
  }

  lines.push('];');
  return lines.join('\n');
}

/**
 * Generate the full TypeScript file content for a planet.
 */
function generateFile(label, data) {
  const prefix = label.toUpperCase();
  const totalTerms = ['L', 'B', 'R'].reduce(
    (sum, v) => sum + data[v].reduce((s, series) => s + series.length, 0),
    0,
  );

  const header = `/**
 * VSOP87D ${label} heliocentric spherical coordinates \u2014 ecliptic of date.
 *
 * Source: VSOP87D.${label.substring(0, 3).toLowerCase()} from CDS (Centre de Donnees astronomiques de Strasbourg)
 * Original theory: Bretagnon & Francou (1988), Bureau des Longitudes, Paris.
 *
 * Unlike VSOP87B (J2000 ecliptic), VSOP87D gives coordinates referred to the
 * ecliptic and equinox of the date. This means precession is built into the
 * coefficients, eliminating the need for an external precession formula.
 *
 * Each export is a \`number[][][]\` of shape \`[series][term][A, B, C]\`,
 * where series n is multiplied by tau^n and each term computes \`A * cos(B + C * tau)\`.
 * tau is Julian millennia from J2000.0 (JDE 2451545.0).
 *
 * Term counts: L=${data.L.reduce((s, a) => s + a.length, 0)}, B=${data.B.reduce((s, a) => s + a.length, 0)}, R=${data.R.reduce((s, a) => s + a.length, 0)} (total ${totalTerms}).
 */
`;

  const parts = [
    header,
    emitVariable(prefix, 'L', data.L),
    '',
    emitVariable(prefix, 'B', data.B),
    '',
    emitVariable(prefix, 'R', data.R),
    '',
  ];

  return parts.join('\n');
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  for (const planet of PLANETS) {
    const url = CDS_BASE + planet.file;
    console.log(`Downloading ${url} ...`);

    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`Failed to fetch ${url}: ${resp.status} ${resp.statusText}`);
    }
    const text = await resp.text();
    console.log(`  ${text.split('\n').length} lines downloaded.`);

    console.log(`  Parsing ...`);
    const data = parseVsop87d(text);
    console.log(`  L: ${data.L.length} series, ${data.L.reduce((s, a) => s + a.length, 0)} terms`);
    console.log(`  B: ${data.B.length} series, ${data.B.reduce((s, a) => s + a.length, 0)} terms`);
    console.log(`  R: ${data.R.length} series, ${data.R.reduce((s, a) => s + a.length, 0)} terms`);

    const content = generateFile(planet.label, data);
    const outPath = join(OUT_DIR, `vsop87d-${planet.name}.ts`);
    writeFileSync(outPath, content, 'utf8');
    console.log(`  Wrote ${outPath} (${(content.length / 1024).toFixed(0)} KB)`);
    console.log();
  }

  console.log('Done!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
