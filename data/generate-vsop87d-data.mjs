#!/usr/bin/env node
/**
 * Parse VSOP87D.ear (Earth, ecliptic of date) and generate
 * a TypeScript coefficient file for stembranch.
 *
 * Input:  data/VSOP87D.ear
 * Output: src/vsop87d-earth.ts
 *
 * VSOP87D provides heliocentric ecliptic coordinates referred to
 * the ecliptic and equinox of the date (precession built in).
 *
 * Format: A * cos(B + C * tau), where tau = Julian millennia from J2000.0
 *
 * File code: 43XY where X=variable(1=L,2=B,3=R), Y=power of tau
 */

import { readFileSync, writeFileSync } from 'fs';

const text = readFileSync('data/VSOP87D.ear', 'utf-8');
const lines = text.split('\n');

// Series storage: { L: [[terms_L0], [terms_L1], ...], B: [...], R: [...] }
const series = { L: [], B: [], R: [] };
const varNames = { 1: 'L', 2: 'B', 3: 'R' };

let currentVar = null;
let currentPower = -1;
let currentTerms = [];

for (const line of lines) {
  // Header lines start with " VSOP87"
  if (line.startsWith(' VSOP87')) {
    // Save previous series if any
    if (currentVar && currentTerms.length > 0) {
      while (series[currentVar].length <= currentPower) {
        series[currentVar].push([]);
      }
      series[currentVar][currentPower] = currentTerms;
    }

    // Parse header: extract variable and power from "*T**N" pattern
    const varMatch = line.match(/VARIABLE\s+(\d)/);
    const powMatch = line.match(/\*T\*\*(\d)/);
    const termMatch = line.match(/(\d+)\s+TERMS/);

    if (varMatch && powMatch) {
      const varNum = parseInt(varMatch[1]);
      currentVar = varNames[varNum];
      currentPower = parseInt(powMatch[1]);
      currentTerms = [];
      const numTerms = termMatch ? parseInt(termMatch[1]) : '?';
      console.log(`  ${currentVar}${currentPower}: ${numTerms} terms`);
    }
    continue;
  }

  // Data lines: extract A, B, C from the last three floating point numbers
  // Format: code termNum [12 harmonics] S K A B C
  const trimmed = line.trim();
  if (!trimmed || !currentVar) continue;

  // Parse the fixed-width columns.
  // The last three numbers on each line are A, B, C
  const nums = trimmed.split(/\s+/).map(Number);
  if (nums.length < 5) continue;

  // A (amplitude), B (phase), C (frequency) are the last 3 columns
  const A = nums[nums.length - 3];
  const B = nums[nums.length - 2];
  const C = nums[nums.length - 1];

  if (isNaN(A) || isNaN(B) || isNaN(C)) continue;

  currentTerms.push([A, B, C]);
}

// Save last series
if (currentVar && currentTerms.length > 0) {
  while (series[currentVar].length <= currentPower) {
    series[currentVar].push([]);
  }
  series[currentVar][currentPower] = currentTerms;
}

// Count totals
let totalL = 0, totalB = 0, totalR = 0;
for (const s of series.L) totalL += s.length;
for (const s of series.B) totalB += s.length;
for (const s of series.R) totalR += s.length;

console.log(`\nTotals: L=${totalL}, B=${totalB}, R=${totalR} (grand total: ${totalL + totalB + totalR})`);

// Format a series as TypeScript
function formatSeries(name, data) {
  const lines = [];
  lines.push(`export const EARTH_${name}: readonly (readonly (readonly [number, number, number])[])[] = [`);

  for (let i = 0; i < data.length; i++) {
    const terms = data[i];
    lines.push('  [');
    for (const [A, B, C] of terms) {
      lines.push(`    [${A}, ${B}, ${C}],`);
    }
    lines.push('  ],');
  }

  lines.push('];');
  return lines.join('\n');
}

// Generate TypeScript file
const tsContent = `/**
 * VSOP87D Earth heliocentric spherical coordinates — ecliptic of date.
 *
 * Source: VSOP87D.ear from CDS (Centre de Donnees astronomiques de Strasbourg)
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
 * Term counts: L=${totalL}, B=${totalB}, R=${totalR} (total ${totalL + totalB + totalR}).
 */

/**
 * Evaluate a VSOP87 series: sum over powers of tau, each a sum of A*cos(B + C*tau).
 */
export function evaluateVsopSeries(
  series: readonly (readonly (readonly [number, number, number])[])[],
  tau: number,
): number {
  let result = 0;
  let tauPow = 1;
  for (const terms of series) {
    let sum = 0;
    for (const [A, B, C] of terms) {
      sum += A * Math.cos(B + C * tau);
    }
    result += sum * tauPow;
    tauPow *= tau;
  }
  return result;
}

/** Heliocentric longitude (L) coefficients — ${totalL} terms in ${series.L.length} series */
// prettier-ignore
${formatSeries('L', series.L)}

/** Heliocentric latitude (B) coefficients — ${totalB} terms in ${series.B.length} series */
// prettier-ignore
${formatSeries('B', series.B)}

/** Heliocentric radius (R) coefficients — ${totalR} terms in ${series.R.length} series */
// prettier-ignore
${formatSeries('R', series.R)}
`;

writeFileSync('src/vsop87d-earth.ts', tsContent);
console.log(`\nGenerated src/vsop87d-earth.ts (${Math.round(tsContent.length / 1024)}KB)`);
