import { describe, it, expect } from 'vitest';
import { STAR_SPIRIT_RULES, evaluateStarSpirits, type StarSpiritContext } from '../../src/seven-governors/data/star-spirits';
import type { GovernorOrRemainder, PalaceName, MansionName } from '../../src/seven-governors';

function makeCtx(bodyIndices: [GovernorOrRemainder, number][], ascIdx: number): StarSpiritContext {
  const palaceNames: PalaceName[] = ['辰宮','卯宮','寅宮','丑宮','子宮','亥宮','戌宮','酉宮','申宮','未宮','午宮','巳宮'];
  const indices = new Map(bodyIndices);
  const palaces = new Map<GovernorOrRemainder, PalaceName>();
  for (const [b, i] of bodyIndices) palaces.set(b, palaceNames[i]);
  return {
    bodyPalaces: palaces,
    bodyMansions: new Map<GovernorOrRemainder, MansionName>(),
    bodyPalaceIndices: indices,
    ascendantPalaceIndex: ascIdx,
  };
}

describe('star spirits', () => {
  it('has at least 3 rules', () => { expect(STAR_SPIRIT_RULES.length).toBeGreaterThanOrEqual(3); });
  it('every rule has a valid spirit', () => {
    for (const r of STAR_SPIRIT_RULES) {
      expect(r.spirit.name).toBeTruthy();
      expect(['auspicious', 'malefic']).toContain(r.spirit.type);
    }
  });
  it('日月夾命 activates when Sun and Moon flank ascendant', () => {
    const ctx = makeCtx([['sun', 2], ['moon', 4]], 3);
    expect(evaluateStarSpirits(ctx).map(s => s.name)).toContain('日月夾命');
  });
  it('日月夾命 does NOT activate when bodies are not adjacent', () => {
    const ctx = makeCtx([['sun', 0], ['moon', 6]], 3);
    expect(evaluateStarSpirits(ctx).map(s => s.name)).not.toContain('日月夾命');
  });
  it('祿存 activates when Jupiter is in 命宮', () => {
    const ctx = makeCtx([['jupiter', 5]], 5);
    expect(evaluateStarSpirits(ctx).map(s => s.name)).toContain('祿存');
  });
});
