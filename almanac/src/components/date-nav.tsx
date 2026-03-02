'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateNavProps {
  dateStr: string;
  onChange: (v: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

export function DateNav({ dateStr, onChange, onPrev, onNext }: DateNavProps) {
  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      <button
        onClick={onPrev}
        className="p-2 rounded-md hover:bg-accent transition-colors"
        aria-label="Previous day"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <input
        type="date"
        value={dateStr}
        onChange={(e) => onChange(e.target.value)}
        className="border border-border rounded-md px-3 py-1.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <button
        onClick={onNext}
        className="p-2 rounded-md hover:bg-accent transition-colors"
        aria-label="Next day"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
