/**
 * DE441 even-polynomial corrections per planet.
 *
 * Each correction is: ΔL = c₀ + c₂τ² + c₄τ⁴ + c₆τ⁶ (arcseconds)
 * where τ is Julian millennia from J2000.0.
 *
 * Coefficients are fitted by scripts/fit-de441-planet-corrections.mjs
 * by least-squares against JPL Horizons DE441 reference data.
 *
 * Returns 0 for planets without fitted corrections yet.
 */

import type { Planet } from '../types';

interface CorrectionCoeffs {
  c0: number;
  c2: number;
  c4: number;
  c6: number;
}

// Placeholder: will be populated by Task 7 (DE441 correction fitting)
const CORRECTIONS: Partial<Record<Planet, CorrectionCoeffs>> = {};

/**
 * Get DE441 longitude correction in arcseconds for a planet at tau.
 * Returns 0 if no correction has been fitted for this planet.
 */
export function getDE441Correction(planet: Planet, tau: number): number {
  const c = CORRECTIONS[planet];
  if (!c) return 0;
  const tau2 = tau * tau;
  return c.c0 + c.c2 * tau2 + c.c4 * tau2 * tau2 + c.c6 * tau2 * tau2 * tau2;
}
