import type { TianGan, DiZhi, GanZhi } from './types';
import { TIANGAN, tianganByIndex } from './tiangan';
import { DIZHI, dizhiByIndex } from './dizhi';

/** Build a GanZhi string from stem and branch */
export function makeGanZhi(stem: TianGan, branch: DiZhi): GanZhi {
  return `${stem}${branch}` as GanZhi;
}

/** Get the GanZhi at position n in the 60-cycle (0=甲子, 1=乙丑, ..., 59=癸亥) */
export function ganzhiByCycleIndex(index: number): { stem: TianGan; branch: DiZhi; ganzhi: GanZhi } {
  const i = ((index % 60) + 60) % 60;
  const stem = tianganByIndex(i);
  const branch = dizhiByIndex(i);
  return { stem, branch, ganzhi: makeGanZhi(stem, branch) };
}

/** Get the 60-cycle index of a stem-branch pair (0-59) */
export function ganzhiCycleIndex(stem: TianGan, branch: DiZhi): number {
  const s = TIANGAN.indexOf(stem);
  const b = DIZHI.indexOf(branch);
  // Both must have same parity (陰配陰, 陽配陽)
  if ((s % 2) !== (b % 2)) return -1;
  // Solve: x ≡ s (mod 10), x ≡ b (mod 12), 0 ≤ x < 60
  for (let x = s; x < 60; x += 10) {
    if (x % 12 === b) return x;
  }
  return -1;
}

/** Parse a two-character GanZhi string into stem and branch */
export function parseGanZhi(gz: string): { stem: TianGan; branch: DiZhi } | null {
  if (gz.length !== 2) return null;
  const stem = gz[0] as TianGan;
  const branch = gz[1] as DiZhi;
  if (!TIANGAN.includes(stem) || !DIZHI.includes(branch)) return null;
  return { stem, branch };
}

/** Generate all 60 GanZhi pairs in cycle order */
export function allSixtyGanZhi(): GanZhi[] {
  return Array.from({ length: 60 }, (_, i) => ganzhiByCycleIndex(i).ganzhi);
}
