'use client';

import { cn } from '@/lib/cn';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export default function FormField({
  label,
  htmlFor,
  required,
  error,
  hint,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-stone-700"
      >
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
      {!error && hint && (
        <p className="text-xs text-stone-400">{hint}</p>
      )}
    </div>
  );
}

export const inputClass = cn(
  'w-full bg-white border border-stone-200 text-stone-800 text-sm rounded-xl px-3.5 py-2.5',
  'focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-300 transition',
  'placeholder:text-stone-400 disabled:opacity-50 disabled:cursor-not-allowed'
);

export const inputErrorClass = 'border-red-300 focus:ring-red-100 focus:border-red-400';
