'use client';

import FormField, { inputClass, inputErrorClass } from './FormField';
import { cn } from '@/lib/cn';
import { ChevronDown } from 'lucide-react';

interface SelectInputProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  hint?: string;
}

export default function SelectInput({
  label,
  id,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  required,
  error,
  hint,
}: SelectInputProps) {
  return (
    <FormField label={label} htmlFor={id} required={required} error={error} hint={hint}>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            inputClass,
            'appearance-none pr-10 cursor-pointer',
            !value && 'text-stone-400',
            error && inputErrorClass
          )}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
      </div>
    </FormField>
  );
}
