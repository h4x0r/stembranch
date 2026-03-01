/**
 * Apparent geocentric ecliptic longitude of the Sun, computed from VSOP87D
 * Earth heliocentric coordinates with aberration and nutation corrections.
 *
 * VSOP87D provides coordinates in the ecliptic of date (precession built in),
 * eliminating the need for an external precession formula and avoiding the
 * frame-mismatch issue that occurs with VSOP87B + separate precession.
 *
 * Includes sxwnl's DE405 correction polynomial to compensate for VSOP87
 * truncation errors, achieving sub-second solar term precision.
 */

import { EARTH_L, EARTH_R, evaluateVsopSeries } from './vsop87d-earth';
import { deltaT } from './delta-t';

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;
const ARCSEC_TO_RAD = Math.PI / 180 / 3600;

/**
 * Convert a UT Date to Julian Date in Terrestrial Time (JD_TT).
 *
 * VSOP87 is formulated in TT (Terrestrial Time), but JavaScript Date
 * objects are in UT. We add ΔT to convert:  TT = UT + ΔT
 */
function dateToJD_TT(date: Date): number {
  const jdUT = date.getTime() / 86400000 + 2440587.5;
  const dtSeconds = deltaT(date);
  return jdUT + dtSeconds / 86400;
}

/**
 * Convert a UT Date to Julian millennia from J2000.0 in TT (for VSOP87).
 */
function dateToJulianMillennia(date: Date): number {
  return (dateToJD_TT(date) - 2451545.0) / 365250.0;
}

/**
 * Convert a UT Date to Julian centuries from J2000.0 in TT (for nutation formulas).
 */
function dateToJulianCenturies(date: Date): number {
  return (dateToJD_TT(date) - 2451545.0) / 36525.0;
}

// ── IAU2000B Nutation (77 lunisolar terms) ─────────────────────────────
// Source: IERS Conventions (2010), SOFA iauNut00b
// Each row: [l, l', F, D, Ω, Δψ_sin (0.1μas), Δψ_sin·T (0.1μas)]
// l=Moon's mean anomaly, l'=Sun's mean anomaly, F=Moon's latitude arg,
// D=mean elongation, Ω=longitude of ascending node
// We only store the longitude nutation coefficients (Δψ), not obliquity (Δε).
// prettier-ignore
const NUT_COEFFS: readonly number[][] = [
  [ 0, 0, 0, 0, 1,-172064161,-174666],
  [ 0, 0, 2,-2, 2, -13170906,  -1675],
  [ 0, 0, 2, 0, 2,  -2276413,   -234],
  [ 0, 0, 0, 0, 2,   2074554,    207],
  [ 0, 1, 0, 0, 0,   1475877,  -3633],
  [ 0, 1, 2,-2, 2,   -516821,   1226],
  [ 1, 0, 0, 0, 0,    711159,     73],
  [ 0, 0, 2, 0, 1,   -387298,   -367],
  [ 1, 0, 2, 0, 2,   -301461,    -36],
  [ 0,-1, 2,-2, 2,    215829,   -494],
  [ 0, 0, 2,-2, 1,    128227,    137],
  [-1, 0, 2, 0, 2,    123457,     11],
  [-1, 0, 0, 2, 0,    156994,     10],
  [ 1, 0, 0, 0, 1,     63110,     63],
  [-1, 0, 0, 0, 1,    -57976,    -63],
  [-1, 0, 2, 2, 2,    -59641,    -11],
  [ 1, 0, 2, 0, 1,    -51613,    -42],
  [-2, 0, 2, 0, 1,     45893,     50],
  [ 0, 0, 0, 2, 0,     63384,     11],
  [ 0, 0, 2, 2, 2,    -38571,     -1],
  [ 0,-2, 2,-2, 2,     32481,      0],
  [-2, 0, 0, 2, 0,    -47722,      0],
  [ 2, 0, 2, 0, 2,    -31046,     -1],
  [ 1, 0, 2,-2, 2,     28593,      0],
  [-1, 0, 2, 0, 1,     20441,     21],
  [ 2, 0, 0, 0, 0,     29243,      0],
  [ 0, 0, 2, 0, 0,     25887,      0],
  [ 0, 1, 0, 0, 1,    -14053,    -25],
  [-1, 0, 0, 2, 1,     15164,     10],
  [ 0, 2, 2,-2, 2,    -15794,     72],
  [ 0, 0,-2, 2, 0,     21783,      0],
  [ 1, 0, 0,-2, 1,    -12873,    -10],
  [ 0,-1, 0, 0, 1,    -12654,     11],
  [-1, 0, 2, 2, 1,    -10204,      0],
  [ 0, 2, 0, 0, 0,     16707,    -85],
  [ 1, 0, 2, 2, 2,     -7691,      0],
  [-2, 0, 2, 0, 0,    -11024,      0],
  [ 0, 1, 2, 0, 2,      7566,    -21],
  [ 0, 0, 2, 2, 1,     -6637,    -11],
  [ 0,-1, 2, 0, 2,     -7141,     21],
  [ 0, 0, 0, 2, 1,     -6302,    -11],
  [ 1, 0, 2,-2, 1,      5800,     10],
  [ 2, 0, 2,-2, 2,      6443,      0],
  [-2, 0, 0, 2, 1,     -5774,    -11],
  [ 2, 0, 2, 0, 1,     -5350,      0],
  [ 0,-1, 2,-2, 1,     -4752,    -11],
  [ 0, 0, 0,-2, 1,     -4940,    -11],
  [-1,-1, 0, 2, 0,      7350,      0],
  [ 2, 0, 0,-2, 1,      4065,      0],
  [ 1, 0, 0, 2, 0,      6579,      0],
  [ 0, 1, 2,-2, 1,      3579,      0],
  [ 1,-1, 0, 0, 0,      4725,      0],
  [-2, 0, 2, 0, 2,     -3075,      0],
  [ 3, 0, 2, 0, 2,     -2904,      0],
  [ 0,-1, 0, 2, 0,      4348,      0],
  [ 1,-1, 2, 0, 2,     -2878,      0],
  [ 0, 0, 0, 1, 0,     -4230,      0],
  [-1,-1, 2, 2, 2,     -2819,      0],
  [-1, 0, 2, 0, 0,     -4056,      0],
  [ 0,-1, 2, 2, 2,     -2647,      0],
  [-2, 0, 0, 0, 1,     -2294,      0],
  [ 1, 1, 2, 0, 2,      2481,      0],
  [ 2, 0, 0, 0, 1,      2179,      0],
  [-1, 1, 0, 1, 0,      3276,      0],
  [ 1, 1, 0, 0, 0,     -3389,      0],
  [ 1, 0, 2, 0, 0,      3339,      0],
  [-1, 0, 2,-2, 1,     -1987,      0],
  [ 1, 0, 0, 0, 2,     -1981,      0],
  [-1, 0, 0, 1, 0,      4026,      0],
  [ 0, 0, 2, 1, 2,      1660,      0],
  [-1, 0, 2, 4, 2,     -1521,      0],
  [-1, 1, 0, 1, 1,      1314,      0],
  [ 0,-2, 2,-2, 1,     -1283,      0],
  [ 1, 0, 2, 2, 1,     -1331,      0],
  [-2, 0, 2, 2, 2,      1383,      0],
  [-1, 0, 0, 0, 2,      1405,      0],
  [ 1, 1, 2,-2, 2,      1290,      0],
];

/**
 * Compute nutation in longitude (Δψ) in arcseconds using IAU2000B (77 terms).
 *
 * Arguments are the Delaunay fundamental arguments in radians,
 * matching the column order of NUT_COEFFS: l, l', F, D, Ω.
 */
function nutationDpsi(
  l: number, lp: number, F: number, D: number, Om: number, T: number,
): number {
  let dpsi = 0;
  for (const row of NUT_COEFFS) {
    const arg = row[0] * l + row[1] * lp + row[2] * F + row[3] * D + row[4] * Om;
    dpsi += (row[5] + row[6] * T) * Math.sin(arg);
  }
  // Convert from 0.1 microarcseconds to arcseconds: ÷ 10,000,000
  return dpsi / 1e7;
}

/**
 * Normalize an angle in degrees to [0, 360).
 */
function normalizeDegrees(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

/**
 * Normalize an angle in radians to [0, 2*PI).
 */
function normalizeRadians(rad: number): number {
  const TWO_PI = 2 * Math.PI;
  return ((rad % TWO_PI) + TWO_PI) % TWO_PI;
}

/**
 * Compute apparent geocentric ecliptic longitude of the Sun in degrees [0, 360).
 *
 * VSOP87D gives heliocentric coordinates referred to the ecliptic of date
 * (precession is built into the coefficients). We apply:
 * 1. Evaluate VSOP87D heliocentric longitude L and radius R
 * 2. Apply sxwnl's DE405 correction (compensates for VSOP87 truncation)
 * 3. Convert to geocentric: lon = L + PI
 * 4. Apply nutation in longitude (IAU2000B, 77 lunisolar terms)
 * 5. Apply aberration correction
 * 6. Normalize to [0, 360)
 *
 * No external precession or FK5 correction needed with VSOP87D.
 *
 * @param date - The moment to compute longitude for
 * @returns Solar longitude in degrees [0, 360)
 */
export function getSunLongitude(date: Date): number {
  const tau = dateToJulianMillennia(date);
  const T = dateToJulianCenturies(date);

  // Heliocentric longitude and radius from VSOP87D (radians / AU)
  let L = evaluateVsopSeries(EARTH_L, tau);
  const R = evaluateVsopSeries(EARTH_R, tau);

  // sxwnl's DE405-fitted correction for VSOP87D longitude.
  // Source: 許劍偉 (Xu Jianwei), DE405-fitted polynomial correction.
  // Compensates for VSOP87 truncation and precession rate offset vs DE405.
  // Units: radians (the polynomial gives arcseconds, divided by 206264.806)
  L += (-0.0728 - 2.7702 * tau - 1.1019 * tau * tau - 0.0996 * tau * tau * tau)
    / 206264.806;

  // Convert heliocentric to geocentric: add 180 degrees (PI radians)
  let lon = L + Math.PI;

  // Nutation in longitude (IAU2000B, 77 lunisolar terms)
  // Fundamental arguments (Delaunay parameters, IERS Conventions 2010):
  const T2 = T * T;
  const T3 = T2 * T;
  const T4 = T3 * T;
  const l  = ((485868.249036 + 1717915923.2178 * T + 31.8792 * T2
    + 0.051635 * T3 - 0.00024470 * T4) % 1296000) * ARCSEC_TO_RAD;
  const lp = ((1287104.79305 + 129596581.0481 * T - 0.5532 * T2
    + 0.000136 * T3 - 0.00001149 * T4) % 1296000) * ARCSEC_TO_RAD;
  const F  = ((335779.526232 + 1739527262.8478 * T - 12.7512 * T2
    - 0.001037 * T3 + 0.00000417 * T4) % 1296000) * ARCSEC_TO_RAD;
  const D  = ((1072260.70369 + 1602961601.2090 * T - 6.3706 * T2
    + 0.006593 * T3 - 0.00003169 * T4) % 1296000) * ARCSEC_TO_RAD;
  const Om = ((450160.398036 - 6962890.5431 * T + 7.4722 * T2
    + 0.007702 * T3 - 0.00005939 * T4) % 1296000) * ARCSEC_TO_RAD;

  // NUT_COEFFS column order: [l, l', F, D, Ω, ...]
  const dpsi = nutationDpsi(l, lp, F, D, Om, T);
  lon += dpsi * ARCSEC_TO_RAD;

  // Aberration correction (Ron & Vondrak, ~20.4898" constant of aberration)
  lon += (-20.4898 / R) * ARCSEC_TO_RAD;

  // Normalize to [0, 2*PI) then convert to degrees
  lon = normalizeRadians(lon);
  return lon * RAD_TO_DEG;
}

/**
 * Determine if the sun's longitude crossed the target value between two longitudes,
 * accounting for the 360->0 degree wrap.
 */
function crossesTarget(lon1: number, lon2: number, target: number): boolean {
  // Normalize all values
  lon1 = normalizeDegrees(lon1);
  lon2 = normalizeDegrees(lon2);
  target = normalizeDegrees(target);

  // Compute forward angular distance from lon1 to lon2
  const forward = normalizeDegrees(lon2 - lon1);

  // If the sun moved backwards (more than 180 degrees forward = actually backward),
  // something is wrong; skip this bracket
  if (forward > 180) return false;

  // Compute forward angular distance from lon1 to target
  const toTarget = normalizeDegrees(target - lon1);

  // Target is crossed if it lies within the forward arc from lon1 to lon2
  return toTarget <= forward;
}

/**
 * Find the exact moment when the Sun's apparent longitude reaches a target value.
 *
 * Uses a coarse daily scan followed by binary search to ~1 second precision.
 *
 * @param targetLongitude - Target solar ecliptic longitude in degrees [0, 360)
 * @param startDate - Start of the search window
 * @param searchDays - Number of days to search from startDate
 * @returns The Date when the Sun reaches the target longitude, or null if not found
 */
export function findSunLongitudeMoment(
  targetLongitude: number,
  startDate: Date,
  searchDays: number,
): Date | null {
  const target = normalizeDegrees(targetLongitude);
  const startMs = startDate.getTime();
  const dayMs = 86400000;

  // Coarse scan: step 1 day at a time, find the bracket where longitude crosses target
  let prevLon = getSunLongitude(startDate);
  let bracketStartMs: number | null = null;
  let bracketEndMs: number | null = null;

  for (let d = 1; d <= searchDays; d++) {
    const currentMs = startMs + d * dayMs;
    const currentLon = getSunLongitude(new Date(currentMs));

    if (crossesTarget(prevLon, currentLon, target)) {
      bracketStartMs = startMs + (d - 1) * dayMs;
      bracketEndMs = currentMs;
      break;
    }

    prevLon = currentLon;
  }

  if (bracketStartMs === null || bracketEndMs === null) return null;

  // Binary search within the bracket to ~1 second precision (1000ms)
  let lo = bracketStartMs;
  let hi = bracketEndMs;

  while (hi - lo > 1000) {
    const mid = lo + Math.floor((hi - lo) / 2);
    const midLon = getSunLongitude(new Date(mid));

    if (crossesTarget(getSunLongitude(new Date(lo)), midLon, target)) {
      hi = mid;
    } else {
      lo = mid;
    }
  }

  // Return the midpoint of the final bracket
  return new Date(lo + Math.floor((hi - lo) / 2));
}
