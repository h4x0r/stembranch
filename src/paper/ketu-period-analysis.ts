/**
 * Ketu ephemeris comparison: apogee-based vs node-based.
 *
 * Generates time-series data demonstrating that the 七曜攘災訣 (806 CE)
 * Ketu ephemeris tracks the lunar apogee (~8.85-year period), not the
 * descending node (~18.6-year period). Confirms Niu Weixing (1994).
 */

import { getKetuPosition } from '../seven-governors/four-remainders';

export interface KetuEphemerisEntry {
  date: Date;
  /** Ketu longitude computed as osculating lunar apogee (《果老星宗》 convention) */
  apogeeLon: number;
  /** Ketu longitude computed as descending node (Qing/Jesuit convention) */
  nodeLon: number;
  /** Absolute angular difference between the two, 0–180° */
  divergenceDeg: number;
}

/**
 * Generate a Ketu ephemeris comparing apogee-based and node-based positions.
 */
export function generateKetuEphemeris(
  startDate: Date,
  endDate: Date,
  intervalDays: number,
): KetuEphemerisEntry[] {
  const entries: KetuEphemerisEntry[] = [];
  const msPerDay = 86400000;
  let t = startDate.getTime();

  while (t <= endDate.getTime()) {
    const date = new Date(t);
    const apogee = getKetuPosition(date, 'apogee');
    const node = getKetuPosition(date, 'descending-node');

    let diff = apogee.longitude - node.longitude;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    entries.push({
      date,
      apogeeLon: apogee.longitude,
      nodeLon: node.longitude,
      divergenceDeg: Math.abs(diff),
    });

    t += intervalDays * msPerDay;
  }

  return entries;
}

/**
 * Estimate the orbital period by finding consecutive 0°-crossings.
 *
 * For the apogee (prograde motion), detects when longitude wraps from >270° to <90°.
 * For the node (retrograde motion), detects when longitude wraps from <90° to >270°.
 *
 * @returns Period in years, or NaN if fewer than 2 crossings found.
 */
export function estimateOrbitalPeriod(
  entries: KetuEphemerisEntry[],
  mode: 'apogee' | 'node',
): number {
  const lons = entries.map(e => mode === 'apogee' ? e.apogeeLon : e.nodeLon);
  const crossings: number[] = [];

  for (let i = 1; i < lons.length; i++) {
    if (mode === 'apogee') {
      if (lons[i - 1] > 270 && lons[i] < 90) {
        crossings.push(i);
      }
    } else {
      if (lons[i - 1] < 90 && lons[i] > 270) {
        crossings.push(i);
      }
    }
  }

  if (crossings.length < 2) return NaN;

  let totalMs = 0;
  for (let i = 1; i < crossings.length; i++) {
    totalMs += entries[crossings[i]].date.getTime() - entries[crossings[i - 1]].date.getTime();
  }
  const avgMs = totalMs / (crossings.length - 1);
  return avgMs / (365.25 * 86400000);
}
