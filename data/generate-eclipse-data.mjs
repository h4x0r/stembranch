#!/usr/bin/env node
/**
 * Parse NASA Five Millennium Canon eclipse catalogs and generate
 * a compact TypeScript data file for stembranch.
 *
 * Input:  data/solar-catalog.txt, data/lunar-catalog.txt
 * Output: src/eclipse-data.ts
 *
 * Range: 2000 BCE (year -1999) to 3000 CE (full NASA catalog)
 *
 * Note: The NASA catalog uses the Julian calendar for dates before
 * 1582-10-15 and Gregorian calendar after. Our Date objects use
 * proleptic Gregorian throughout, so pre-1582 dates may differ
 * by 10-13 days from the actual Julian calendar date.
 *
 * Attribution: Eclipse Predictions by Fred Espenak and Jean Meeus (NASA's GSFC)
 */

import { readFileSync, writeFileSync } from 'fs';

const MONTHS = {
  Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5, Jun: 6,
  Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
};

const MIN_YEAR = -1999;
const MAX_YEAR = 3000;

function parseSolarCatalog(text) {
  const entries = [];
  for (const line of text.split('\n')) {
    // Solar catalog format (fixed-width):
    // Col 0-4: Cat Num (5 chars)
    // Col 6-8: Cat Plate (3 chars)
    // Col 10-20: Calendar Date (e.g., "-1999 Jun 12" or " 2024 Apr 08")
    // Col 22-29: TD of Greatest Eclipse
    // ... Col 68: Eclipse Type (T/A/P/H with optional modifiers)
    // ... Col 79-84: Magnitude
    const match = line.match(
      /^\s*\d+\s+\d+\s+(-?\d+)\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d+)\s+\d+:\d+:\d+\s+\S+\s+\S+\s+\S+\s+(\S+)\s+\S+\s+(-?\d+\.\d+)\s+(\d+\.\d+)/
    );
    if (!match) continue;

    const year = parseInt(match[1]);
    if (year < MIN_YEAR || year > MAX_YEAR) continue;

    const month = MONTHS[match[2]];
    const day = parseInt(match[3]);
    const typeRaw = match[4]; // e.g., "T", "A", "P", "H", "T+", "Am", etc.
    const type = typeRaw[0]; // Just the main type letter
    const magnitude = parseFloat(match[6]);

    entries.push({ year, month, day, type, magnitude });
  }
  return entries;
}

function parseLunarCatalog(text) {
  const entries = [];
  for (const line of text.split('\n')) {
    // Lunar catalog format (fixed-width):
    // Col 0-4: Cat Num (5 chars)
    // Col 7-17: Calendar Date (e.g., "-1999 Jun 26" or " 2024 Mar 25")
    // Col 19-27: TD of Greatest Eclipse
    // ... Col 47: Eclipse Type (T/P/N with optional modifiers like +/-/m/n)
    // ... Col 63-69: Pen. Mag.
    // ... Col 71-77: Um. Mag.
    const match = line.match(
      /^\s*(\d+)\s+(-?\d+)\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d+)\s+\d+:\d+:\d+\s+\S+\s+\S+\s+\S+\s+(\S+)\s+\S+\s+(-?\d+\.\d+)\s+(-?\d+\.\d+)\s+(-?\d+\.\d+)/
    );
    if (!match) continue;

    const year = parseInt(match[2]);
    if (year < MIN_YEAR || year > MAX_YEAR) continue;

    const month = MONTHS[match[3]];
    const day = parseInt(match[4]);
    const typeRaw = match[5]; // e.g., "T", "T+", "T-", "P", "N", "Nx"
    const type = typeRaw[0]; // Just the main type letter
    const penMag = parseFloat(match[7]);
    const umMag = parseFloat(match[8]);

    // Use umbral magnitude for T/P, penumbral magnitude for N
    const magnitude = type === 'N' ? penMag : umMag;

    entries.push({ year, month, day, type, magnitude });
  }
  return entries;
}

/**
 * Encode eclipses as a compact string.
 * Format: each eclipse = 10 chars: SYYYYMMDDX
 * where S = '+' or '-' (sign), YYYY = 4-digit absolute year,
 *       MM = month, DD = day, X = type char
 *
 * Magnitude stored separately as integers (abs(mag) * 10000).
 */
function encodeCompact(entries) {
  const dateTypes = entries.map(e => {
    const sign = e.year < 0 ? '-' : '+';
    const y = String(Math.abs(e.year)).padStart(4, '0');
    const m = String(e.month).padStart(2, '0');
    const d = String(e.day).padStart(2, '0');
    return `${sign}${y}${m}${d}${e.type}`;
  }).join('');

  const magnitudes = entries.map(e => {
    // Encode magnitude as integer (abs(mag) * 10000)
    // Range: 0 to 20000
    const val = Math.round(Math.abs(e.magnitude) * 10000);
    return val;
  });

  return { dateTypes, magnitudes };
}

// --- Main ---

const solarText = readFileSync('data/solar-catalog.txt', 'utf-8');
const lunarText = readFileSync('data/lunar-catalog.txt', 'utf-8');

const solarEntries = parseSolarCatalog(solarText);
const lunarEntries = parseLunarCatalog(lunarText);

console.log(`Solar eclipses (${MIN_YEAR} to ${MAX_YEAR}): ${solarEntries.length}`);
console.log(`Lunar eclipses (${MIN_YEAR} to ${MAX_YEAR}): ${lunarEntries.length}`);

// Verify known eclipses
const apr8 = solarEntries.find(e => e.year === 2024 && e.month === 4 && e.day === 8);
console.log('2024-04-08 total solar:', apr8 ? `${apr8.type} mag=${apr8.magnitude}` : 'NOT FOUND');

const aug21 = solarEntries.find(e => e.year === 2017 && e.month === 8 && e.day === 21);
console.log('2017-08-21 total solar:', aug21 ? `${aug21.type} mag=${aug21.magnitude}` : 'NOT FOUND');

// Check BCE entries
const bce = solarEntries.filter(e => e.year < 0);
console.log(`BCE solar eclipses: ${bce.length}`);
if (bce.length > 0) {
  console.log(`  First: year ${bce[0].year}, month ${bce[0].month}, day ${bce[0].day}`);
  console.log(`  Last: year ${bce[bce.length - 1].year}, month ${bce[bce.length - 1].month}, day ${bce[bce.length - 1].day}`);
}

const solarEncoded = encodeCompact(solarEntries);
const lunarEncoded = encodeCompact(lunarEntries);

console.log(`Solar encoded string length: ${solarEncoded.dateTypes.length} chars (${solarEntries.length} entries)`);
console.log(`Lunar encoded string length: ${lunarEncoded.dateTypes.length} chars (${lunarEntries.length} entries)`);

// Generate TypeScript file
const tsContent = `/**
 * NASA Five Millennium Canon of Eclipses — Static Dataset
 *
 * Range: ${MIN_YEAR} (${Math.abs(MIN_YEAR) + 1} BCE) to ${MAX_YEAR} CE
 * Solar eclipses: ${solarEntries.length}
 * Lunar eclipses: ${lunarEntries.length}
 *
 * Data source: NASA Technical Publications
 *   Solar: NASA/TP-2008-214170 (Fred Espenak and Jean Meeus)
 *   Lunar: NASA/TP-2009-214173 (Fred Espenak and Jean Meeus)
 *
 * Attribution: Eclipse Predictions by Fred Espenak and Jean Meeus (NASA's GSFC)
 *
 * Note: Pre-1582 dates use the Julian calendar in the NASA catalog but are
 * decoded as proleptic Gregorian dates in JavaScript. This causes a 10-13 day
 * offset for dates before October 1582.
 *
 * Encoding: each eclipse = 10 chars in the packed string: SYYYYMMDDX
 *   S = '+' or '-' (sign), YYYY = 4-digit year, MM = month, DD = day, X = type
 *   Solar types: T=Total, A=Annular, P=Partial, H=Hybrid
 *   Lunar types: T=Total, P=Partial, N=Penumbral
 *
 * Magnitudes: parallel Uint16Array of abs(mag)×10000
 *   Solar: eclipse magnitude (ratio of diameters)
 *   Lunar: umbral magnitude for T/P, penumbral magnitude for N
 */

// prettier-ignore
export const SOLAR_PACKED = '${solarEncoded.dateTypes}';

// prettier-ignore
export const SOLAR_MAGNITUDES = new Uint16Array([${solarEncoded.magnitudes.join(',')}]);

// prettier-ignore
export const LUNAR_PACKED = '${lunarEncoded.dateTypes}';

// prettier-ignore
export const LUNAR_MAGNITUDES = new Uint16Array([${lunarEncoded.magnitudes.join(',')}]);

export const ECLIPSE_DATA_RANGE = { min: ${MIN_YEAR}, max: ${MAX_YEAR} } as const;
`;

writeFileSync('src/eclipse-data.ts', tsContent);
console.log('\\nGenerated src/eclipse-data.ts');
console.log(`  Solar packed: ${solarEncoded.dateTypes.length} chars`);
console.log(`  Lunar packed: ${lunarEncoded.dateTypes.length} chars`);
console.log(`  Estimated total file size: ~${Math.round((tsContent.length) / 1024)}KB`);
