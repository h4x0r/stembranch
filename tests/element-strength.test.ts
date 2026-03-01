import { describe, it, expect } from 'vitest';
import { getStrength, STRENGTH } from '../src/element-strength';

describe('getStrength', () => {
  it('旺 when element matches month element', () => {
    // 寅月=木, 木=旺
    const result = getStrength('木', '寅');
    expect(result.label).toBe('旺');
    expect(result.moon).toBe('🌕');
  });

  it('相 when month generates element', () => {
    // 寅月=木, 木生火, so 火=相
    const result = getStrength('火', '寅');
    expect(result.label).toBe('相');
    expect(result.moon).toBe('🌔');
  });

  it('休 when element generates month', () => {
    // 寅月=木, 水生木, so 水=休
    const result = getStrength('水', '寅');
    expect(result.label).toBe('休');
    expect(result.moon).toBe('🌓');
  });

  it('囚 when element conquers month', () => {
    // 寅月=木, 金剋木, so 金=囚
    const result = getStrength('金', '寅');
    expect(result.label).toBe('囚');
    expect(result.moon).toBe('🌒');
  });

  it('死 when month conquers element', () => {
    // 寅月=木, 木剋土, so 土=死
    const result = getStrength('土', '寅');
    expect(result.label).toBe('死');
    expect(result.moon).toBe('🌑');
  });
});

describe('STRENGTH', () => {
  it('has emoji for all 5 levels', () => {
    expect(Object.keys(STRENGTH)).toHaveLength(5);
  });
});

describe('getStrength edge cases', () => {
  it('returns 休 fallback for invalid monthBranch', () => {
    // Cast an invalid branch value to trigger the !monthElement guard
    const result = getStrength('木', 'X' as any);
    expect(result.label).toBe('休');
    expect(result.moon).toBe('🌓');
  });
});
