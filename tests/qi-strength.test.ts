import { describe, it, expect } from 'vitest';
import { getQiStrength, QI_MOON } from '../src/qi-strength';

describe('getQiStrength', () => {
  it('旺 when element matches month element', () => {
    // 寅月=木, 木=旺
    const result = getQiStrength('木', '寅');
    expect(result.label).toBe('旺');
    expect(result.moon).toBe('🌕');
  });

  it('相 when month generates element', () => {
    // 寅月=木, 木生火, so 火=相
    const result = getQiStrength('火', '寅');
    expect(result.label).toBe('相');
    expect(result.moon).toBe('🌔');
  });

  it('休 when element generates month', () => {
    // 寅月=木, 水生木, so 水=休
    const result = getQiStrength('水', '寅');
    expect(result.label).toBe('休');
    expect(result.moon).toBe('🌓');
  });

  it('囚 when element conquers month', () => {
    // 寅月=木, 金剋木, so 金=囚
    const result = getQiStrength('金', '寅');
    expect(result.label).toBe('囚');
    expect(result.moon).toBe('🌒');
  });

  it('死 when month conquers element', () => {
    // 寅月=木, 木剋土, so 土=死
    const result = getQiStrength('土', '寅');
    expect(result.label).toBe('死');
    expect(result.moon).toBe('🌑');
  });
});

describe('QI_MOON', () => {
  it('has emoji for all 5 levels', () => {
    expect(Object.keys(QI_MOON)).toHaveLength(5);
  });
});
