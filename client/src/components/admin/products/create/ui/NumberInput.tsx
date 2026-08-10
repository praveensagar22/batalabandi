'use client';

import FormField, { inputClass, inputErrorClass } from './FormField';
import { cn } from '@/lib/cn';

interface NumberInputProps {
  label: string;
  id: string;
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  prefix?: string;
  suffix?: string;
  min?: number;
  step?: number;
  disabled?: boolean;
}

export default function NumberInput({
  label,
  id,
  value,
  onChange,
  placeholder,
  required,
  error,
  hint,
  prefix,
  suffix,
  min = 0,
  step = 1,
  disabled,
}: NumberInputProps) {
  return (
    <FormField label={label} htmlFor={id} required={required} error={error} hint={hint}>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-stone-400">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="number"
          value={value || ''}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          placeholder={placeholder}
          min={min}
          step={step}
          disabled={disabled}
          className={cn(
            inputClass,
            'tabular-nums',
            prefix && 'pl-8',
            suffix && 'pr-12',
            error && inputErrorClass
          )}
        />
        {suffix && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-stone-400">
            {suffix}
          </span>
        )}
      </div>
    </FormField>
  );
}
