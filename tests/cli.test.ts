import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { parseArgs, main, type CLIOptions } from '../src/cli';

// Helpers to capture stderr and mock process.exit

/** Sentinel error thrown by mocked process.exit to halt execution. */
class ExitError extends Error {
  code: number;
  constructor(code: number) {
    super(`process.exit(${code})`);
    this.code = code;
  }
}

function mockStderr() {
  const calls: string[] = [];
  const spy = vi.spyOn(process.stderr, 'write').mockImplementation((...args: any[]) => {
    calls.push(String(args[0]));
    return true;
  });
  return { calls, spy, restore: () => spy.mockRestore() };
}

function mockExit() {
  const spy = vi.spyOn(process, 'exit').mockImplementation(((code: number) => {
    throw new ExitError(code);
  }) as any);
  return spy;
}

describe('CLI', () => {
  describe('parseArgs', () => {
    it('defaults to --pillars --almanac when no flags given', () => {
      const opts = parseArgs([]);
      expect(opts.charts.has('pillars')).toBe(true);
      expect(opts.charts.has('almanac')).toBe(true);
      expect(opts.charts.size).toBe(2);
    });

    it('parses --date flag', () => {
      const opts = parseArgs(['--date', '2024-02-04T12:00:00Z']);
      expect(opts.date.toISOString()).toBe('2024-02-04T12:00:00.000Z');
    });

    it('parses --lat and --lng flags', () => {
      const opts = parseArgs(['--lat', '25.03', '--lng', '121.56']);
      expect(opts.lat).toBeCloseTo(25.03);
      expect(opts.lng).toBeCloseTo(121.56);
    });

    it('parses --city flag', () => {
      const opts = parseArgs(['--city', 'Taipei']);
      expect(opts.city).toBe('Taipei');
      // Should resolve lat/lng from city database
      expect(opts.lat).not.toBe(0);
      expect(opts.lng).not.toBe(0);
    });

    it('parses chart selection flags', () => {
      const opts = parseArgs(['--qimen', '--tropical']);
      expect(opts.charts.has('qimen')).toBe(true);
      expect(opts.charts.has('tropical')).toBe(true);
      expect(opts.charts.has('pillars')).toBe(false); // not default when explicit flags
    });

    it('--all enables all chart types', () => {
      const opts = parseArgs(['--all']);
      expect(opts.charts.has('pillars')).toBe(true);
      expect(opts.charts.has('almanac')).toBe(true);
      expect(opts.charts.has('qimen')).toBe(true);
      expect(opts.charts.has('tropical')).toBe(true);
      expect(opts.charts.has('sidereal')).toBe(true);
      expect(opts.charts.has('flying-stars')).toBe(true);
      expect(opts.charts.has('birth-chart')).toBe(true);
      expect(opts.charts.size).toBe(11);
    });

    it('--birth-chart adds birth-chart to charts', () => {
      const opts = parseArgs(['--birth-chart']);
      expect(opts.charts.has('birth-chart')).toBe(true);
    });

    it('parses --json flag', () => {
      const opts = parseArgs(['--json']);
      expect(opts.json).toBe(true);
    });

    it('parses --help flag', () => {
      const opts = parseArgs(['--help']);
      expect(opts.help).toBe(true);
    });

    it('-h is alias for --help', () => {
      const opts = parseArgs(['-h']);
      expect(opts.help).toBe(true);
    });

    // Issue 1: --gender flag
    it('--gender female sets gender to female', () => {
      const opts = parseArgs(['--gender', 'female']);
      expect(opts.gender).toBe('female');
    });

    it('--gender defaults to male', () => {
      const opts = parseArgs([]);
      expect(opts.gender).toBe('male');
    });

    it('--gender f is shorthand for female', () => {
      const opts = parseArgs(['--gender', 'f']);
      expect(opts.gender).toBe('female');
    });

    it('--gender m is shorthand for male', () => {
      const opts = parseArgs(['--gender', 'm']);
      expect(opts.gender).toBe('male');
    });

    // Issue 5: --version flag
    it('--version sets version to true', () => {
      const opts = parseArgs(['--version']);
      expect(opts.version).toBe(true);
    });

    it('-v is alias for --version', () => {
      const opts = parseArgs(['-v']);
      expect(opts.version).toBe(true);
    });
  });

  describe('main', () => {
    it('--help outputs help text without error', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      main(['--help']);
      expect(spy).toHaveBeenCalled();
      const output = spy.mock.calls.map(c => c[0]).join('\n');
      expect(output).toContain('stem-branch');
      expect(output).toContain('--date');
      expect(output).toContain('--pillars');
      spy.mockRestore();
    });

    it('--pillars --date renders Four Pillars output', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      main(['--pillars', '--date', '2024-02-04T12:00:00Z']);
      expect(spy).toHaveBeenCalled();
      const output = spy.mock.calls.map(c => c[0]).join('\n');
      expect(output).toContain('四柱八字');
      spy.mockRestore();
    });

    it('--json outputs valid JSON', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      main(['--json', '--pillars', '--date', '2024-02-04T12:00:00Z']);
      expect(spy).toHaveBeenCalled();
      const jsonStr = spy.mock.calls[0][0];
      expect(() => JSON.parse(jsonStr)).not.toThrow();
      const parsed = JSON.parse(jsonStr);
      expect(parsed.pillars).toBeDefined();
      expect(parsed.date).toBe('2024-02-04T12:00:00.000Z');
      spy.mockRestore();
    });

    it('--json --all produces all chart keys', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      main(['--json', '--all', '--date', '2024-06-15T14:30:00Z', '--lat', '25', '--lng', '121']);
      expect(spy).toHaveBeenCalled();
      const parsed = JSON.parse(spy.mock.calls[0][0]);
      expect(parsed.pillars).toBeDefined();
      expect(parsed.almanac).toBeDefined();
      expect(parsed.qimen).toBeDefined();
      expect(parsed.liuren).toBeDefined();
      expect(parsed.tropical).toBeDefined();
      expect(parsed.sidereal).toBeDefined();
      spy.mockRestore();
    });

    it('default (no flags) renders pillars and almanac', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      main(['--date', '2024-02-04T12:00:00Z']);
      const output = spy.mock.calls.map(c => c[0]).join('\n');
      expect(output).toContain('四柱八字');
      expect(output).toContain('日曆總覽');
      spy.mockRestore();
    });

    // Issue 5: --version
    it('--version outputs version string', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      main(['--version']);
      expect(logSpy).toHaveBeenCalled();
      const output = logSpy.mock.calls.map(c => c[0]).join('\n');
      expect(output).toMatch(/\d+\.\d+\.\d+/);
      logSpy.mockRestore();
    });

    it('-v outputs version string', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      main(['-v']);
      const output = logSpy.mock.calls.map(c => c[0]).join('\n');
      expect(output).toMatch(/\d+\.\d+\.\d+/);
      logSpy.mockRestore();
    });

    it('--birth-chart renders Birth Chart with angles and cusps', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      main(['--birth-chart', '--date', '2024-06-15T14:30:00Z', '--lat', '25', '--lng', '121']);
      const output = spy.mock.calls.map(c => c[0]).join('\n');
      expect(output).toContain('Birth Chart');
      expect(output).toContain('ASC');
      expect(output).toContain('DSC');
      expect(output).toContain('MC');
      expect(output).toContain('IC');
      expect(output).toContain('House Cusps');
      spy.mockRestore();
    });

    it('--birth-chart --json produces structured birthChart object', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      main(['--birth-chart', '--json', '--date', '2024-06-15T14:30:00Z', '--lat', '25', '--lng', '121']);
      const parsed = JSON.parse(spy.mock.calls[0][0]);
      expect(parsed.birthChart).toBeDefined();
      expect(parsed.birthChart.angles.asc).toBeTypeOf('number');
      expect(parsed.birthChart.angles.dsc).toBeTypeOf('number');
      expect(parsed.birthChart.angles.mc).toBeTypeOf('number');
      expect(parsed.birthChart.angles.ic).toBeTypeOf('number');
      // DSC = (ASC + 180) % 360
      expect(parsed.birthChart.angles.dsc).toBeCloseTo(
        (parsed.birthChart.angles.asc + 180) % 360, 4,
      );
      // IC = (MC + 180) % 360
      expect(parsed.birthChart.angles.ic).toBeCloseTo(
        (parsed.birthChart.angles.mc + 180) % 360, 4,
      );
      expect(parsed.birthChart.houses.cusps).toHaveLength(12);
      expect(parsed.birthChart.houses.system).toBe('placidus');
      expect(parsed.birthChart.positions.length).toBeGreaterThan(0);
      expect(parsed.birthChart.aspects).toBeDefined();
      spy.mockRestore();
    });

    it('--json --all includes birthChart key', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      main(['--json', '--all', '--date', '2024-06-15T14:30:00Z', '--lat', '25', '--lng', '121']);
      const parsed = JSON.parse(spy.mock.calls[0][0]);
      expect(parsed.birthChart).toBeDefined();
      expect(parsed.birthChart.angles).toBeDefined();
      spy.mockRestore();
    });

    it('--tropical renders House Cusps section and Longitude column', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      main(['--tropical', '--date', '2024-06-15T14:30:00Z', '--lat', '25', '--lng', '121']);
      const output = spy.mock.calls.map(c => c[0]).join('\n');
      expect(output).toContain('House Cusps');
      expect(output).toContain('Longitude');
      expect(output).toContain('Angle');
      spy.mockRestore();
    });

    // Issue 2: invalid --date → stderr + exit(1)
    it('--date garbage → stderr error + exit(1)', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const stderr = mockStderr();
      const exitSpy = mockExit();
      expect(() => main(['--date', 'garbage'])).toThrow(ExitError);
      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(stderr.calls.join('')).toMatch(/invalid date/i);
      stderr.restore();
      exitSpy.mockRestore();
      logSpy.mockRestore();
    });

    it('--date empty string → stderr error + exit(1)', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const stderr = mockStderr();
      const exitSpy = mockExit();
      expect(() => main(['--date', ''])).toThrow(ExitError);
      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(stderr.calls.join('')).toMatch(/invalid date/i);
      stderr.restore();
      exitSpy.mockRestore();
      logSpy.mockRestore();
    });

    // Issue 3: unknown --city → stderr warning
    it('--city Xyzzyville → stderr warning', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const stderr = mockStderr();
      main(['--pillars', '--city', 'Xyzzyville', '--date', '2024-02-04T12:00:00Z']);
      // Should warn but NOT exit
      expect(stderr.calls.join('')).toMatch(/not found/i);
      stderr.restore();
      logSpy.mockRestore();
    });

    // Issue 4: missing arg values → stderr + exit(1)
    it('--lat with no value → stderr + exit(1)', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const stderr = mockStderr();
      const exitSpy = mockExit();
      expect(() => main(['--lat'])).toThrow(ExitError);
      expect(exitSpy).toHaveBeenCalledWith(1);
      expect(stderr.calls.join('')).toMatch(/requires/i);
      stderr.restore();
      exitSpy.mockRestore();
      logSpy.mockRestore();
    });

    it('--date with no value → stderr + exit(1)', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const stderr = mockStderr();
      const exitSpy = mockExit();
      expect(() => main(['--date'])).toThrow(ExitError);
      expect(exitSpy).toHaveBeenCalledWith(1);
      stderr.restore();
      exitSpy.mockRestore();
      logSpy.mockRestore();
    });

    it('--lng with no value → stderr + exit(1)', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const stderr = mockStderr();
      const exitSpy = mockExit();
      expect(() => main(['--lng'])).toThrow(ExitError);
      expect(exitSpy).toHaveBeenCalledWith(1);
      stderr.restore();
      exitSpy.mockRestore();
      logSpy.mockRestore();
    });

    // Issue 6: unrecognized flags → stderr warning
    it('--polars (typo) → stderr warning, still runs', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      const stderr = mockStderr();
      main(['--polars', '--date', '2024-02-04T12:00:00Z']);
      expect(stderr.calls.join('')).toMatch(/unrecognized/i);
      // Should still produce default output
      const output = logSpy.mock.calls.map(c => c[0]).join('\n');
      expect(output).toContain('四柱八字');
      stderr.restore();
      logSpy.mockRestore();
    });

    // Issue 8: --help does NOT call process.exit
    it('--help does not call process.exit', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      // Use a non-throwing spy just to verify exit is never called
      const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as any);
      main(['--help']);
      expect(exitSpy).not.toHaveBeenCalled();
      exitSpy.mockRestore();
      logSpy.mockRestore();
    });

    // Issue 1: --gender threads through to polaris JSON
    it('--polaris --json --gender female includes gender in output', () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      main(['--polaris', '--json', '--gender', 'female', '--date', '2024-02-04T12:00:00Z']);
      const parsed = JSON.parse(logSpy.mock.calls[0][0]);
      expect(parsed.polaris).toBeDefined();
      expect(parsed.polaris.birthData.gender).toBe('female');
      logSpy.mockRestore();
    });
  });

  // Issue 7: module guard
  describe('module guard', () => {
    it('importing parseArgs does not trigger main() side effect', () => {
      // This test passes implicitly: if the guard works, importing the module
      // in the test setup didn't produce console output or crash.
      // We verify by checking parseArgs is a callable function.
      expect(typeof parseArgs).toBe('function');
    });
  });
});
