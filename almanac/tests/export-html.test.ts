import { describe, it, expect } from 'vitest';
import { dailyAlmanac } from 'stembranch';
import { generateAlmanacHTML } from '@/lib/export-html';

const TEST_DATE = new Date(Date.UTC(2024, 5, 15, 6, 30));
const almanac = dailyAlmanac(TEST_DATE);

describe('generateAlmanacHTML', () => {
  it('should return a valid HTML document string', () => {
    const html = generateAlmanacHTML(almanac);
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('</html>');
  });

  it('should contain inline styles (self-contained)', () => {
    const html = generateAlmanacHTML(almanac);
    expect(html).toContain('<style>');
  });

  it('should not reference external stylesheets or scripts', () => {
    const html = generateAlmanacHTML(almanac);
    expect(html).not.toMatch(/<link[^>]+rel="stylesheet"/);
    expect(html).not.toMatch(/<script[^>]+src="/);
  });

  it('should include the four pillars', () => {
    const html = generateAlmanacHTML(almanac);
    expect(html).toContain('四柱');
    expect(html).toContain(almanac.pillars.year.stem);
    expect(html).toContain(almanac.pillars.day.stem);
  });

  it('should include lunar date', () => {
    const html = generateAlmanacHTML(almanac);
    expect(html).toContain('農曆');
  });

  it('should include solar terms', () => {
    const html = generateAlmanacHTML(almanac);
    expect(html).toContain('節氣');
  });

  it('should include almanac flags', () => {
    const html = generateAlmanacHTML(almanac);
    expect(html).toContain('神煞');
  });

  it('should include flying stars', () => {
    const html = generateAlmanacHTML(almanac);
    expect(html).toContain('紫白九星');
  });

  it('should include six ren', () => {
    const html = generateAlmanacHTML(almanac);
    expect(html).toContain('大六壬');
  });

  it('should include eclipse info', () => {
    const html = generateAlmanacHTML(almanac);
    expect(html).toMatch(/日食|月食/);
  });

  it('should include the date in the title', () => {
    const html = generateAlmanacHTML(almanac);
    expect(html).toContain('2024');
  });
});
