#!/usr/bin/env node
/**
 * Verify mansion boundary data against Hipparcos star positions.
 *
 * For each mansion's determinative star:
 * 1. Look up the J2000.0 ecliptic longitude from Hipparcos
 * 2. Convert to Spica-anchored sidereal longitude
 * 3. Compare against the startDeg value in mansion-boundaries.ts
 *
 * Usage: npm run build && node scripts/verify-mansion-boundaries.mjs
 */
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const { MANSION_BOUNDARIES } = await import(
  join(root, 'dist', 'seven-governors', 'data', 'mansion-boundaries.js')
);

// Spica's tropical ecliptic longitude at J2000.0
const SPICA_J2000 = 201.2983;

console.log('Mansion Boundary Verification');
console.log('─'.repeat(60));
console.log('Mansion  Star        HIP      startDeg  Expected  Δ°');
console.log('─'.repeat(60));

// NOTE: The "Expected" values must be sourced from a star catalogue.
// This script structure is provided for the implementer to fill in
// with actual Hipparcos ecliptic longitude data.

for (const m of MANSION_BOUNDARIES) {
  // Placeholder: implementer should look up actual ecliptic longitude
  // from Hipparcos or a computed star catalogue
  console.log(
    `${m.name.padEnd(6)}  ${m.star.padEnd(10)}  ${String(m.hip).padEnd(7)}  ${m.startDeg.toFixed(2).padStart(8)}  ${'TBD'.padStart(8)}  ${'TBD'.padStart(6)}`
  );
}

console.log('\nTo complete: look up each HIP star\'s ecliptic longitude at J2000.0');
console.log('and subtract Spica\'s longitude (201.298°) to get the sidereal value.');
