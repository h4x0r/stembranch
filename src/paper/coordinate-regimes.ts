/**
 * Four-regime coordinate comparison for the Silk Road astronomy paper.
 *
 * Computes the same celestial body position in all four historical
 * coordinate systems used by the Seven Governors (七政四餘) across dynasties:
 *
 * 1. 黃道恆星製 (ecliptic sidereal) — Song 《三辰通載》
 * 2. 赤道恆星製 (equatorial sidereal) — Yuan 《鄭氏星案》
 * 3. 似黃道恆星製 (quasi-ecliptic sidereal) — Ming 《果老星宗》
 * 4. 黃道迴歸製 (ecliptic tropical) — Qing (Jesuit reform)
 */

import {
  dateToJulianCenturies,
  meanObliquity,
  eclipticToEquatorial,
  DEG_TO_RAD,
  RAD_TO_DEG,
} from '../astro';
import { toSiderealLongitude } from '../seven-governors/sidereal';
import { quasiEclipticBoundaries, quasiEclipticHouse } from './quasi-ecliptic';

export interface RegimePosition {
  /** Longitude in this system's coordinates (degrees) */
  lon: number;
  /** Sign/house number 1–12 (each system divides the circle into 12) */
  sign: number;
}

export interface FourRegimeResult {
  eclipticSidereal: RegimePosition;
  equatorialSidereal: RegimePosition;
  quasiEcliptic: RegimePosition;
  eclipticTropical: RegimePosition;
}

export interface FourRegimeTableRow extends FourRegimeResult {
  bodyName: string;
}

function signFromLon(lon: number): number {
  return Math.floor(((lon % 360 + 360) % 360) / 30) + 1;
}

/**
 * Compute a single body's position in all four coordinate regimes.
 *
 * @param tropicalLon - Body's tropical ecliptic longitude in degrees
 * @param date - Date of observation (for ayanamsa and obliquity)
 */
export function computeFourRegimes(tropicalLon: number, date: Date): FourRegimeResult {
  const T = dateToJulianCenturies(date);
  const eps = meanObliquity(T);

  // 1. Ecliptic sidereal: tropical - ayanamsa
  const eclSidLon = toSiderealLongitude(tropicalLon, date, { type: 'modern' });

  // 2. Equatorial sidereal: convert ecliptic→RA, then subtract ayanamsa
  const tropRad = tropicalLon * DEG_TO_RAD;
  const [raRad] = eclipticToEquatorial(tropRad, 0, eps);
  const raTropDeg = ((raRad * RAD_TO_DEG) + 360) % 360;
  // Equatorial ayanamsa: same offset as ecliptic (Spica-based)
  const ayanamsaDeg = tropicalLon - eclSidLon;
  const raSidDeg = ((raTropDeg - ayanamsaDeg) + 360) % 360;

  // 3. Quasi-ecliptic sidereal: ecliptic sidereal longitude, but sign from RA projection
  const boundaries = quasiEclipticBoundaries(eps);
  // Shift boundaries by ayanamsa to get sidereal quasi-ecliptic boundaries
  const sidBoundaries = boundaries.map(b => ((b - ayanamsaDeg) + 360) % 360);
  sidBoundaries.sort((a, b) => a - b);
  const qeSign = quasiEclipticHouse(eclSidLon, sidBoundaries);

  // 4. Ecliptic tropical: raw tropical longitude
  const eclTropLon = ((tropicalLon % 360) + 360) % 360;

  return {
    eclipticSidereal: { lon: eclSidLon, sign: signFromLon(eclSidLon) },
    equatorialSidereal: { lon: raSidDeg, sign: signFromLon(raSidDeg) },
    quasiEcliptic: { lon: eclSidLon, sign: qeSign },
    eclipticTropical: { lon: eclTropLon, sign: signFromLon(eclTropLon) },
  };
}

/**
 * Generate a comparison table for multiple bodies.
 */
export function generateFourRegimeTable(
  bodies: Array<{ name: string; tropicalLon: number }>,
  date: Date,
): FourRegimeTableRow[] {
  return bodies.map(({ name, tropicalLon }) => ({
    bodyName: name,
    ...computeFourRegimes(tropicalLon, date),
  }));
}
