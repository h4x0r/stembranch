/* c8 ignore next */
import type { Stem, Branch, StemBranch } from './types';
import { STEMS, stemByIndex } from './stems';
import { BRANCHES, branchByIndex } from './branches';

/** Build a StemBranch string from stem and branch */
export function makeStemBranch(stem: Stem, branch: Branch): StemBranch {
  return `${stem}${branch}` as StemBranch;
}

/** Get the StemBranch at position n in the 60-cycle (0=甲子, 1=乙丑, ..., 59=癸亥) */
export function stemBranchByCycleIndex(index: number): { stem: Stem; branch: Branch; stemBranch: StemBranch } {
  const i = ((index % 60) + 60) % 60;
  const stem = stemByIndex(i);
  const branch = branchByIndex(i);
  return { stem, branch, stemBranch: makeStemBranch(stem, branch) };
}

/** Get the 60-cycle index of a stem-branch pair (0-59), or -1 if invalid */
export function stemBranchCycleIndex(stem: Stem, branch: Branch): number {
  const s = STEMS.indexOf(stem);
  const b = BRANCHES.indexOf(branch);
  // Both must have same parity (陰配陰, 陽配陽)
  if ((s % 2) !== (b % 2)) return -1;
  // CRT: find x in [0,60) such that x ≡ s (mod 10) and x ≡ b (mod 12)
  for (let x = s; x < 60; x += 10) {
    if (x % 12 === b) return x;
  /* c8 ignore next 3 */
  }
  return -1;
}

/** Parse a two-character StemBranch string into stem and branch */
export function parseStemBranch(gz: string): { stem: Stem; branch: Branch } | null {
  if (gz.length !== 2) return null;
  const stem = gz[0] as Stem;
  const branch = gz[1] as Branch;
  if (!STEMS.includes(stem) || !BRANCHES.includes(branch)) return null;
  return { stem, branch };
}

/** Generate all 60 StemBranch pairs in cycle order */
export function allSixtyStemBranch(): StemBranch[] {
  return Array.from({ length: 60 }, (_, i) => stemBranchByCycleIndex(i).stemBranch);
}
