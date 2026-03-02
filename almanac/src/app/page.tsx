'use client';

import { useState, useMemo } from 'react';
import {
  dailyAlmanac, computeQiMenForDate, computeZiWei, gregorianToLunar,
} from 'stembranch';
import { AlmanacView } from '@/components/almanac-view';
import { DateNav } from '@/components/date-nav';
import { ExportButton } from '@/components/export-button';
import { UnifiedChart } from '@/components/unified-chart';

function toLocalDateString(d: Date): string {
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function fromLocalDateString(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d, 6, 0)); // noon CST ~ 06:00 UTC
}

/** Current hour branch index (0=子 23-01, 1=丑 01-03, ... 11=亥 21-23) */
function currentHourIndex(): number {
  const h = new Date().getHours();
  // 子時 = 23:00-01:00, 丑時 = 01:00-03:00, ...
  return Math.floor(((h + 1) % 24) / 2);
}

export default function Home() {
  const [dateStr, setDateStr] = useState(() => toLocalDateString(new Date()));

  const date = useMemo(() => fromLocalDateString(dateStr), [dateStr]);
  const almanac = useMemo(() => dailyAlmanac(date), [date]);
  const qimen = useMemo(() => computeQiMenForDate(date), [date]);

  // 紫微斗數: 排 from the selected date's lunar data + current hour
  const polaris = useMemo(() => {
    try {
      const lunar = gregorianToLunar(date);
      return computeZiWei({
        year: lunar.year,
        month: lunar.month,
        day: lunar.day,
        hour: currentHourIndex(),
        gender: 'male',
      });
    } catch {
      return null;
    }
  }, [date]);

  const handlePrev = () => {
    const d = fromLocalDateString(dateStr);
    d.setUTCDate(d.getUTCDate() - 1);
    setDateStr(toLocalDateString(new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())));
  };

  const handleNext = () => {
    const d = fromLocalDateString(dateStr);
    d.setUTCDate(d.getUTCDate() + 1);
    setDateStr(toLocalDateString(new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())));
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-center text-2xl font-bold tracking-wide mb-1">
          日曆總覽
        </h1>
        <p className="text-center text-sm text-muted-foreground mb-6">
          stembranch almanac
        </p>

        <DateNav
          dateStr={dateStr}
          onChange={setDateStr}
          onPrev={handlePrev}
          onNext={handleNext}
        />

        {/* ── 三式合盤 ──────────────────────────────────── */}
        <section className="my-6">
          <h2 className="text-center text-lg font-semibold mb-3">三式合盤</h2>
          <UnifiedChart
            polaris={polaris}
            sixRen={almanac.sixRen}
            qimen={qimen}
          />
        </section>

        <AlmanacView almanac={almanac} />

        <div className="flex justify-center mt-6">
          <ExportButton almanac={almanac} />
        </div>

        <footer className="text-center text-xs text-muted-foreground mt-8">
          Powered by{' '}
          <a
            href="https://github.com/h4x0r/stembranch"
            className="underline hover:text-foreground"
            target="_blank"
            rel="noopener noreferrer"
          >
            stembranch
          </a>
        </footer>
      </div>
    </main>
  );
}
