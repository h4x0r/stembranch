'use client';

import type { DailyAlmanac } from 'stembranch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  formatPillar,
  formatLunarDate,
  formatSolarTermPair,
  formatFlyingStar,
  formatAlmanacFlags,
  formatElementStrength,
  formatSixRenSummary,
  formatEclipseInfo,
} from '@/lib/format-almanac';

interface AlmanacViewProps {
  almanac: DailyAlmanac;
}

const PILLAR_LABELS = ['年柱', '月柱', '日柱', '時柱'] as const;

export function AlmanacView({ almanac }: AlmanacViewProps) {
  const terms = formatSolarTermPair(almanac.solarTerm);
  const flags = formatAlmanacFlags(almanac.almanacFlags);
  const sixRen = formatSixRenSummary(almanac.sixRen);
  const eclipse = formatEclipseInfo(almanac.nearestEclipse, almanac.isEclipseDay);
  const pillars = [almanac.pillars.year, almanac.pillars.month, almanac.pillars.day, almanac.pillars.hour];

  return (
    <div className="space-y-4" data-testid="almanac-view">
      {/* Header row: lunar date, zodiac, element */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
        <span data-testid="lunar-date">{formatLunarDate(almanac.lunar)}</span>
        <Separator orientation="vertical" className="h-4" />
        <span>{almanac.chineseZodiac.animal}年</span>
        <Separator orientation="vertical" className="h-4" />
        <span>{almanac.westernZodiac.sign}</span>
        <Separator orientation="vertical" className="h-4" />
        <span>JD {almanac.julianDay}</span>
      </div>

      {/* Four Pillars */}
      <Card data-testid="pillars-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">四柱</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            {pillars.map((p, i) => (
              <div key={i}>
                <div className="text-xs text-muted-foreground mb-1">{PILLAR_LABELS[i]}</div>
                <div className="text-2xl tracking-widest">{formatPillar(p)}</div>
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-muted-foreground mt-3">
            日干五行: {formatElementStrength(almanac.dayElement, almanac.dayStrength)}
          </div>
        </CardContent>
      </Card>

      {/* Solar Terms */}
      <Card data-testid="solar-terms-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">節氣</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">當前</span>
            <span>{terms.current}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">下一</span>
            <span>{terms.next}</span>
          </div>
        </CardContent>
      </Card>

      {/* Day Fitness + Flying Stars — side by side on wider screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card data-testid="day-fitness-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">建除</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <span className="text-3xl">{almanac.dayFitness.fitness}</span>
            <Badge variant={almanac.dayFitness.auspicious ? 'default' : 'destructive'} className="ml-3">
              {almanac.dayFitness.auspicious ? '吉' : '凶'}
            </Badge>
          </CardContent>
        </Card>

        <Card data-testid="flying-stars-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">紫白九星</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {(['year', 'month', 'day', 'hour'] as const).map((period, i) => {
                const star = almanac.flyingStars[period];
                return (
                  <div key={period} className="bg-muted rounded-md p-2">
                    <div className="text-lg font-bold">{star.number}</div>
                    <div>{['年', '月', '日', '時'][i]}</div>
                    <div className="text-muted-foreground">{star.name}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Almanac Flags */}
      <Card data-testid="almanac-flags-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">神煞</CardTitle>
        </CardHeader>
        <CardContent>
          {flags.auspicious.length > 0 && (
            <div className="mb-2">
              <span className="text-xs text-muted-foreground mr-2">吉</span>
              {flags.auspicious.map((f) => (
                <Badge key={f.name} variant="outline" className="mr-1 mb-1 border-green-300 text-green-700 bg-green-50">
                  {f.name}
                </Badge>
              ))}
            </div>
          )}
          {flags.inauspicious.length > 0 && (
            <div>
              <span className="text-xs text-muted-foreground mr-2">凶</span>
              {flags.inauspicious.map((f) => (
                <Badge key={f.name} variant="outline" className="mr-1 mb-1 border-red-300 text-red-700 bg-red-50">
                  {f.name}
                </Badge>
              ))}
            </div>
          )}
          {flags.auspicious.length === 0 && flags.inauspicious.length === 0 && (
            <span className="text-sm text-muted-foreground">無</span>
          )}
        </CardContent>
      </Card>

      {/* Six Ren */}
      <Card data-testid="six-ren-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">大六壬</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-muted-foreground">課法</span>
            <span className="font-medium">{sixRen.method}</span>
          </div>
          <div className="text-center text-lg tracking-[0.3em] my-2">
            {sixRen.transmissions}
          </div>
          <div className="flex justify-center gap-4 text-muted-foreground">
            {sixRen.lessons.map((l, i) => (
              <span key={i}>第{['一', '二', '三', '四'][i]}課 {l}</span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Eclipse */}
      <Card data-testid="eclipse-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">日月食</CardTitle>
        </CardHeader>
        <CardContent className="text-sm">
          {eclipse}
        </CardContent>
      </Card>
    </div>
  );
}
