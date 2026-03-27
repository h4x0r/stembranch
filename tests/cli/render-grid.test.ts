import { describe, it, expect } from 'vitest';
import {
  displayWidth,
  padRight,
  padCenter,
  truncateToWidth,
  renderGrid,
  renderTitle,
} from '../../src/cli/render-grid';

describe('render-grid', () => {
  describe('displayWidth', () => {
    it('ASCII characters are 1 column each', () => {
      expect(displayWidth('hello')).toBe(5);
      expect(displayWidth('ASC')).toBe(3);
    });

    it('CJK characters are 2 columns each', () => {
      expect(displayWidth('命宮')).toBe(4);
      expect(displayWidth('甲子')).toBe(4);
      expect(displayWidth('紫微斗數')).toBe(8);
    });

    it('mixed CJK and ASCII', () => {
      expect(displayWidth('甲 Wood')).toBe(7); // 2 + 1 + 4
      expect(displayWidth('子 Water')).toBe(8); // 2 + 1 + 5
    });

    it('empty string is 0', () => {
      expect(displayWidth('')).toBe(0);
    });

    it('handles Japanese hiragana/katakana as 2 columns', () => {
      expect(displayWidth('あ')).toBe(2);
      expect(displayWidth('カ')).toBe(2);
    });

    // Issue 10: box-drawing characters are ambiguous-width but render as 1 column
    // in standard terminals (iTerm2, Terminal.app, Windows Terminal, etc.)
    it('box-drawing characters are 1 column each', () => {
      expect(displayWidth('─')).toBe(1);
      expect(displayWidth('│')).toBe(1);
      expect(displayWidth('┌┐└┘')).toBe(4);
      expect(displayWidth('├┤┬┴┼')).toBe(5);
    });
  });

  describe('padRight', () => {
    it('pads ASCII to target width', () => {
      expect(padRight('foo', 6)).toBe('foo   ');
    });

    it('pads CJK to target width', () => {
      // '命宮' is 4 columns wide, pad to 8
      const result = padRight('命宮', 8);
      expect(displayWidth(result)).toBe(8);
      expect(result).toBe('命宮    ');
    });

    it('returns original if already at or past target width', () => {
      expect(padRight('hello', 3)).toBe('hello');
    });
  });

  describe('padCenter', () => {
    it('centers ASCII string', () => {
      expect(padCenter('hi', 6)).toBe('  hi  ');
    });

    it('centers CJK string', () => {
      const result = padCenter('命宮', 8);
      expect(displayWidth(result)).toBe(8);
      expect(result).toBe('  命宮  ');
    });
  });

  describe('truncateToWidth', () => {
    it('returns string if within width', () => {
      expect(truncateToWidth('hello', 10)).toBe('hello');
    });

    it('truncates ASCII string', () => {
      expect(truncateToWidth('hello world', 5)).toBe('hello');
    });

    it('truncates CJK string respecting 2-column width', () => {
      // '紫微斗數' = 8 columns; truncate to 5 should give '紫微' (4 cols) + maybe partial
      const result = truncateToWidth('紫微斗數', 5);
      expect(displayWidth(result)).toBeLessThanOrEqual(5);
      expect(result).toBe('紫微');
    });
  });

  describe('renderGrid', () => {
    it('renders a simple 2x2 grid', () => {
      const cells = [
        [{ lines: ['A'] }, { lines: ['B'] }],
        [{ lines: ['C'] }, { lines: ['D'] }],
      ];
      const output = renderGrid(cells, { cellWidth: 4, padding: 1 });
      // Should produce 5 lines: top, row1, mid, row2, bottom
      expect(output).toHaveLength(5);
      // Top border
      expect(output[0]).toContain('┌');
      expect(output[0]).toContain('┬');
      expect(output[0]).toContain('┐');
      // Content rows contain │
      expect(output[1]).toContain('│');
      expect(output[1]).toContain('A');
      expect(output[1]).toContain('B');
      // Middle separator
      expect(output[2]).toContain('├');
      expect(output[2]).toContain('┼');
      expect(output[2]).toContain('┤');
      // Bottom border
      expect(output[4]).toContain('└');
      expect(output[4]).toContain('┴');
      expect(output[4]).toContain('┘');
    });

    it('handles multi-line cells', () => {
      const cells = [
        [{ lines: ['Line 1', 'Line 2'] }, { lines: ['Single'] }],
      ];
      const output = renderGrid(cells, { cellWidth: 10, padding: 1 });
      // 2 content lines + top + bottom = 4
      expect(output).toHaveLength(4);
      expect(output[1]).toContain('Line 1');
      expect(output[2]).toContain('Line 2');
      expect(output[1]).toContain('Single');
    });

    it('renders 3x3 grid (QiMen layout)', () => {
      const cells = Array.from({ length: 3 }, () =>
        Array.from({ length: 3 }, () => ({ lines: ['test'] })),
      );
      const output = renderGrid(cells, { cellWidth: 12, padding: 1 });
      // 3 rows × 1 line + 2 separators + top + bottom = 7
      expect(output).toHaveLength(7);
    });

    it('CJK content aligns correctly in grid cells', () => {
      const cells = [
        [{ lines: ['甲子'] }, { lines: ['Wood'] }],
      ];
      const output = renderGrid(cells, { cellWidth: 8, padding: 1 });
      // Both cells should have same total width in the output
      const row = output[1];
      // Count │ characters — should be exactly 3 (left, middle, right)
      const pipes = [...row].filter(ch => ch === '│').length;
      expect(pipes).toBe(3);
    });

    it('returns empty array for empty input', () => {
      expect(renderGrid([])).toEqual([]);
      expect(renderGrid([[]])).toEqual([]);
    });
  });

  describe('renderTitle', () => {
    it('renders a centered title with rules', () => {
      const title = renderTitle('Test', 20);
      expect(title).toContain('Test');
      expect(title).toContain('─');
      expect(displayWidth(title)).toBe(20);
    });
  });
});
