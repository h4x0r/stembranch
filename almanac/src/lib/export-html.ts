import type { DailyAlmanac } from 'stembranch';
import {
  formatPillarsRow,
  formatLunarDate,
  formatSolarTermPair,
  formatFlyingStar,
  formatAlmanacFlags,
  formatElementStrength,
  formatSixRenSummary,
  formatEclipseInfo,
} from './format-almanac';

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function generateAlmanacHTML(almanac: DailyAlmanac): string {
  const d = almanac.date;
  const dateStr = `${d.getUTCFullYear()}-${(d.getUTCMonth() + 1).toString().padStart(2, '0')}-${d.getUTCDate().toString().padStart(2, '0')}`;

  const pillars = formatPillarsRow(almanac.pillars);
  const lunar = formatLunarDate(almanac.lunar);
  const terms = formatSolarTermPair(almanac.solarTerm);
  const flags = formatAlmanacFlags(almanac.almanacFlags);
  const elemStr = formatElementStrength(almanac.dayElement, almanac.dayStrength);
  const sixRen = formatSixRenSummary(almanac.sixRen);
  const eclipse = formatEclipseInfo(almanac.nearestEclipse, almanac.isEclipseDay);

  const auspiciousHTML = flags.auspicious
    .map((f) => `<span class="flag auspicious">${esc(f.name)}</span>`)
    .join(' ');
  const inauspiciousHTML = flags.inauspicious
    .map((f) => `<span class="flag inauspicious">${esc(f.name)}</span>`)
    .join(' ');

  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>日曆總覽 — ${esc(dateStr)}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:"Noto Serif CJK TC","Songti TC","SimSun",serif;background:#faf8f5;color:#2c2c2c;max-width:640px;margin:0 auto;padding:24px 16px}
h1{font-size:1.4em;text-align:center;margin-bottom:4px}
.date{text-align:center;color:#666;margin-bottom:20px;font-size:0.95em}
section{margin-bottom:18px;border:1px solid #e0dcd6;border-radius:8px;padding:14px 16px;background:#fff}
section h2{font-size:1em;color:#8b6914;margin-bottom:8px;border-bottom:1px solid #f0ece4;padding-bottom:4px}
.pillars{display:flex;justify-content:center;gap:24px;margin:8px 0}
.pillar{text-align:center}
.pillar .label{font-size:0.75em;color:#999}
.pillar .value{font-size:1.5em;letter-spacing:2px}
.row{display:flex;justify-content:space-between;padding:3px 0;font-size:0.95em}
.row .k{color:#888}
.flag{display:inline-block;padding:2px 8px;border-radius:4px;font-size:0.85em;margin:2px}
.flag.auspicious{background:#f0faf0;color:#2d7a2d;border:1px solid #c4e8c4}
.flag.inauspicious{background:#fdf0f0;color:#9a3333;border:1px solid #e8c4c4}
.stars{display:flex;justify-content:space-between;gap:8px}
.star{flex:1;text-align:center;padding:6px;background:#faf8f5;border-radius:4px;font-size:0.85em}
.star .num{font-size:1.2em;font-weight:bold}
.transmission{text-align:center;font-size:1.1em;letter-spacing:4px;margin:6px 0}
.lessons{display:flex;justify-content:center;gap:16px;font-size:0.95em}
footer{text-align:center;color:#bbb;font-size:0.8em;margin-top:24px}
</style>
</head>
<body>
<h1>日曆總覽</h1>
<p class="date">${esc(dateStr)}　${esc(lunar)}　${esc(almanac.chineseZodiac.animal)}年　${esc(almanac.westernZodiac.sign)}</p>

<section>
<h2>四柱</h2>
<div class="pillars">
${['年', '月', '日', '時'].map((label, i) => `<div class="pillar"><div class="label">${label}柱</div><div class="value">${esc(pillars[i])}</div></div>`).join('\n')}
</div>
<div class="row"><span class="k">日干五行</span><span>${esc(elemStr)}</span></div>
</section>

<section>
<h2>節氣</h2>
<div class="row"><span class="k">當前</span><span>${esc(terms.current)}</span></div>
<div class="row"><span class="k">下一</span><span>${esc(terms.next)}</span></div>
</section>

<section>
<h2>農曆</h2>
<div class="row"><span class="k">日期</span><span>${esc(lunar)}</span></div>
</section>

<section>
<h2>紫白九星</h2>
<div class="stars">
${(['year', 'month', 'day', 'hour'] as const).map((p, i) => {
  const star = almanac.flyingStars[p];
  const label = ['年', '月', '日', '時'][i];
  return `<div class="star"><div class="num">${star.number}</div>${label} ${esc(star.name)}<br>${esc(star.element)}</div>`;
}).join('\n')}
</div>
</section>

<section>
<h2>建除</h2>
<div class="row"><span class="k">日值</span><span>${esc(almanac.dayFitness.fitness)}${almanac.dayFitness.auspicious ? ' 吉' : ' 凶'}</span></div>
</section>

<section>
<h2>神煞</h2>
${auspiciousHTML ? `<div style="margin-bottom:6px"><span class="k" style="color:#888;font-size:0.85em">吉</span> ${auspiciousHTML}</div>` : ''}
${inauspiciousHTML ? `<div><span class="k" style="color:#888;font-size:0.85em">凶</span> ${inauspiciousHTML}</div>` : ''}
${!auspiciousHTML && !inauspiciousHTML ? '<div style="color:#999">無</div>' : ''}
</section>

<section>
<h2>大六壬</h2>
<div class="row"><span class="k">課法</span><span>${esc(sixRen.method)}</span></div>
<div class="transmission">${esc(sixRen.transmissions)}</div>
<div class="lessons">${sixRen.lessons.map((l) => `<span>${esc(l)}</span>`).join('')}</div>
</section>

<section>
<h2>日月食</h2>
<div class="row"><span>${esc(eclipse)}</span></div>
</section>

<footer>Generated by stembranch · ${esc(dateStr)}</footer>
</body>
</html>`;
}
