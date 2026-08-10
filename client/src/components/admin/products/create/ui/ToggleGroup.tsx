'use client';

import { cn } from '@/lib/cn';

interface ToggleGroupProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  hint?: string;
}

export default function ToggleGroup({ label, value, onChange, hint }: ToggleGroupProps) {
  return (
    <div className="space-y-1.5">
      <span className="block text-sm font-medium text-stone-700">{label}</span>
      <div className="inline-flex rounded-xl border border-stone-200 p-0.5 bg-stone-50">
        {[true, false].map((option) => (
          <button
            key={String(option)}
            type="button"
            onClick={() => onChange(option)}
            className={cn(
              'px-4 py-1.5 text-sm font-medium rounded-lg transition-colors',
              value === option
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-700'
            )}
          >
            {option ? 'Yes' : 'No'}
          </button>
        ))}
      </div>
      {hint && <p className="text-xs text-stone-400">{hint}</p>}
    </div>
  );
}

interface ToggleOptionProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function ToggleOption({ label, options, value, onChange, error }: ToggleOptionProps) {
  return (
    <div className="space-y-1.5">
      <span className="block text-sm font-medium text-stone-700">{label}</span>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'px-3.5 py-1.5 text-sm font-medium rounded-xl border transition-colors',
              value === opt.value
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}
