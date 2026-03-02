'use client';

import { Download } from 'lucide-react';
import type { DailyAlmanac } from 'stembranch';
import { generateAlmanacHTML } from '@/lib/export-html';

interface ExportButtonProps {
  almanac: DailyAlmanac;
}

export function ExportButton({ almanac }: ExportButtonProps) {
  const handleExport = () => {
    const html = generateAlmanacHTML(almanac);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const d = almanac.date;
    const dateStr = `${d.getUTCFullYear()}-${(d.getUTCMonth() + 1).toString().padStart(2, '0')}-${d.getUTCDate().toString().padStart(2, '0')}`;
    const a = document.createElement('a');
    a.href = url;
    a.download = `almanac-${dateStr}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm border border-border rounded-md hover:bg-accent transition-colors"
    >
      <Download className="h-4 w-4" />
      Download HTML
    </button>
  );
}
