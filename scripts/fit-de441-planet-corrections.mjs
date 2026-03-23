#!/usr/bin/env node
/**
 * Fit DE441 correction polynomials for planetary ecliptic longitudes.
 *
 * For each planet:
 * 1. Query JPL Horizons API for apparent RA & Dec at sampled epochs
 * 2. Convert JPL RA/Dec to ecliptic longitude (mean obliquity, < 1" error)
 * 3. Compare with getPlanetPosition() ecliptic longitude (DE441 correction = 0)
 * 4. Fit even polynomial c₀ + c₂τ² + c₄τ⁴ + c₆τ⁶ via least squares
 *
 * Coordinate conversion note: Using mean obliquity for the equatorial →
 * ecliptic conversion introduces < 1" error for planets near the ecliptic
 * (error ∝ tan(β) × Δε ≈ 0.06° × 9.2" ≈ 0.5"). The polynomial absorbs this.
 *
 * Usage: npm run build && node scripts/fit-de441-planet-corrections.mjs
 */

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const sb = await import(join(root, 'dist', 'index.js'));

const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;

const PLANETS = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];
const JPL_IDS = {
  mercury: '199', venus: '299', mars: '499', jupiter: '599',
  saturn: '699', uranus: '799', neptune: '899',
};

// ── Mean obliquity (IAU 2006), in radians ──────────────────────
function meanObliquity(T) {
  const arcsec = 84381.406 - 46.836769 * T - 0.0001831 * T * T
    + 0.00200340 * T * T * T;
  return arcsec / 3600 * DEG_TO_RAD;
}

// ── Equatorial (RA, Dec) → ecliptic longitude ─────────────────
// Returns degrees in [0, 360)
function raDecToEclipticLon(ra_deg, dec_deg, eps_rad) {
  const a = ra_deg * DEG_TO_RAD;
  const d = dec_deg * DEG_TO_RAD;
  let lon = Math.atan2(
    Math.sin(a) * Math.cos(eps_rad) + Math.tan(d) * Math.sin(eps_rad),
    Math.cos(a),
  );
  return ((lon % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) * RAD_TO_DEG;
}

// ── JPL Horizons API ───────────────────────────────────────────
const JPL_API = 'https://ssd.jpl.nasa.gov/api/horizons.api';

async function queryJPL(planetId, start, stop, stepDays) {
  const url = `${JPL_API}?format=text`
    + `&COMMAND='${planetId}'`
    + `&OBJ_DATA='NO'`
    + `&MAKE_EPHEM='YES'`
    + `&EPHEM_TYPE='OBSERVER'`
    + `&CENTER='500@399'`
    + `&START_TIME='${start}'`
    + `&STOP_TIME='${stop}'`
    + `&STEP_SIZE='${stepDays}%20DAYS'`
    + `&QUANTITIES='2'`
    + `&ANG_FORMAT='DEG'`
    + `&APPARENT='AIRLESS'`
    + `&CAL_FORMAT='CAL'`
    + `&TIME_DIGITS='MINUTES'`
    + `&SUPPRESS_RANGE_RATE='YES'`;

  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
  const text = await resp.text();

  const lines = text.split('\n');
  const soe = lines.findIndex(l => l.trim() === '$$SOE');
  const eoe = lines.findIndex(l => l.trim() === '$$EOE');
  if (soe === -1 || eoe === -1) {
    // Print response for debugging
    console.error('Response (first 50 lines):');
    lines.slice(0, 50).forEach(l => console.error('  ', l));
    throw new Error('No $$SOE/$$EOE markers in JPL response');
  }

  const months = {
    Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
    Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
  };

  const data = [];
  for (let i = soe + 1; i < eoe; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(/\s+/).filter(Boolean);
    if (parts.length < 4) continue;

    const [yearStr, monStr, dayStr] = parts[0].split('-');
    const year = parseInt(yearStr);
    const mon = months[monStr];
    if (mon === undefined) continue;
    const day = parseInt(dayStr);
    const [hh, mm] = parts[1].split(':').map(Number);

    // Collect numeric values after date/time (skip flags like '*', 'm', 'C')
    const nums = [];
    for (let j = 2; j < parts.length && nums.length < 2; j++) {
      const v = parseFloat(parts[j]);
      if (!isNaN(v) && isFinite(v)) nums.push(v);
    }
    if (nums.length < 2) continue;

    const date = new Date(Date.UTC(year, mon, day, hh, mm));
    data.push({ date, ra: nums[0], dec: nums[1] });
  }

  return data;
}

// ── Least-squares even polynomial fitting ──────────────────────
// Fits: y = c₀ + c₂τ² + c₄τ⁴ + c₆τ⁶
function fitEvenPoly(taus, residuals) {
  const n = taus.length;
  const k = 4;
  const XtX = Array.from({ length: k }, () => Array(k).fill(0));
  const Xty = Array(k).fill(0);

  for (let i = 0; i < n; i++) {
    const t2 = taus[i] * taus[i];
    const basis = [1, t2, t2 * t2, t2 * t2 * t2];
    for (let j = 0; j < k; j++) {
      for (let l = 0; l < k; l++) XtX[j][l] += basis[j] * basis[l];
      Xty[j] += basis[j] * residuals[i];
    }
  }

  // Gaussian elimination with partial pivoting
  const aug = XtX.map((row, i) => [...row, Xty[i]]);
  for (let c = 0; c < k; c++) {
    let mx = c;
    for (let r = c + 1; r < k; r++) {
      if (Math.abs(aug[r][c]) > Math.abs(aug[mx][c])) mx = r;
    }
    [aug[c], aug[mx]] = [aug[mx], aug[c]];
    for (let r = c + 1; r < k; r++) {
      const f = aug[r][c] / aug[c][c];
      for (let j = c; j <= k; j++) aug[r][j] -= f * aug[c][j];
    }
  }
  const x = Array(k).fill(0);
  for (let i = k - 1; i >= 0; i--) {
    x[i] = aug[i][k];
    for (let j = i + 1; j < k; j++) x[i] -= aug[i][j] * x[j];
    x[i] /= aug[i][i];
  }
  return x; // [c0, c2, c4, c6]
}

// ── Utilities ──────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fmt = (v, d = 6) => (v >= 0 ? ' ' : '') + v.toFixed(d);

// ── Main ───────────────────────────────────────────────────────
async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  DE441 Correction Polynomial Fitting for Planets');
  console.log('  Range: 1700–2300 CE, step: 60 days');
  console.log('  Source: JPL Horizons DE441, apparent RA/Dec (airless)');
  console.log('═══════════════════════════════════════════════════════════\n');

  const results = {};

  for (const planet of PLANETS) {
    console.log(`\n── ${planet.toUpperCase()} (JPL ID: ${JPL_IDS[planet]}) ──`);

    // Query JPL Horizons
    let jplData;
    try {
      jplData = await queryJPL(JPL_IDS[planet], '1700-01-01', '2300-12-31', 60);
      console.log(`  JPL data: ${jplData.length} epochs`);
    } catch (e) {
      console.error(`  JPL query failed: ${e.message}`);
      continue;
    }

    // Compute residuals: JPL ecliptic lon - our ecliptic lon
    const taus = [];
    const residuals = [];
    let skip = 0;

    for (const { date, ra, dec } of jplData) {
      try {
        const pos = sb.getPlanetPosition(planet, date);
        const JD = 2451545.0 + (date.getTime() / 86400000 - 10957.5);
        const T = (JD - 2451545.0) / 36525;
        const tau = T / 10;
        const eps = meanObliquity(T);

        // Convert JPL apparent RA/Dec to ecliptic longitude of date
        const jplLon = raDecToEclipticLon(ra, dec, eps);

        // Residual (degrees)
        let diff = jplLon - pos.longitude;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        // Skip obvious outliers (> 0.5° — likely a parsing or computation error)
        if (Math.abs(diff) > 0.5) { skip++; continue; }

        taus.push(tau);
        residuals.push(diff * 3600); // degrees → arcseconds
      } catch {
        skip++;
      }
    }

    console.log(`  Valid: ${taus.length}, skipped: ${skip}`);

    if (taus.length < 100) {
      console.error(`  Too few valid points, skipping ${planet}`);
      continue;
    }

    // Pre-fit statistics
    const absRes = residuals.map(Math.abs);
    const meanPre = absRes.reduce((a, b) => a + b) / absRes.length;
    const maxPre = Math.max(...absRes);
    console.log(`  Pre-correction:  mean=${meanPre.toFixed(2)}", max=${maxPre.toFixed(2)}"`);

    // Fit even polynomial
    const [c0, c2, c4, c6] = fitEvenPoly(taus, residuals);
    results[planet] = { c0, c2, c4, c6 };

    // Post-fit statistics
    const postRes = residuals.map((r, i) => {
      const t2 = taus[i] * taus[i];
      return Math.abs(r - (c0 + c2 * t2 + c4 * t2 * t2 + c6 * t2 * t2 * t2));
    });
    const meanPost = postRes.reduce((a, b) => a + b) / postRes.length;
    const maxPost = Math.max(...postRes);
    console.log(`  Post-correction: mean=${meanPost.toFixed(2)}", max=${maxPost.toFixed(2)}"`);
    console.log(`  Coefficients: c0=${fmt(c0)}, c2=${fmt(c2)}, c4=${fmt(c4)}, c6=${fmt(c6)}`);

    // Rate limit: wait 3s between API calls
    await sleep(3000);
  }

  // ── Output TypeScript code ─────────────────────────────────
  console.log('\n\n═══════════════════════════════════════════════════════════');
  console.log('  TypeScript output for src/planets/de441-corrections.ts');
  console.log('═══════════════════════════════════════════════════════════\n');

  console.log('const CORRECTIONS: Partial<Record<Planet, CorrectionCoeffs>> = {');
  for (const [planet, c] of Object.entries(results)) {
    console.log(`  ${planet}: { c0: ${c.c0.toFixed(6)}, c2: ${c.c2.toFixed(6)}, c4: ${c.c4.toFixed(6)}, c6: ${c.c6.toFixed(6)} },`);
  }
  console.log('};');

  // ── Summary table ──────────────────────────────────────────
  console.log('\n\n═══════════════════════════════════════════════════════════');
  console.log('  Summary');
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('┌──────────┬──────────┬──────────┬──────────┬──────────┐');
  console.log('│ Planet   │    c₀    │    c₂    │    c₄    │    c₆    │');
  console.log('├──────────┼──────────┼──────────┼──────────┼──────────┤');
  for (const [planet, c] of Object.entries(results)) {
    console.log(`│ ${planet.padEnd(8)} │${fmt(c.c0, 4).padStart(9)} │${fmt(c.c2, 4).padStart(9)} │${fmt(c.c4, 4).padStart(9)} │${fmt(c.c6, 4).padStart(9)} │`);
  }
  console.log('└──────────┴──────────┴──────────┴──────────┴──────────┘');
}

main().catch(console.error);
