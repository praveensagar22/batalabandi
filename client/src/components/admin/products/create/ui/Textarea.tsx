'use client';

import FormField, { inputClass, inputErrorClass } from './FormField';
import { cn } from '@/lib/cn';

interface TextareaProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  rows?: number;
}

export default function Textarea({
  label,
  id,
  value,
  onChange,
  placeholder,
  required,
  error,
  hint,
  rows = 4,
}: TextareaProps) {
  return (
    <FormField label={label} htmlFor={id} required={required} error={error} hint={hint}>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={cn(inputClass, 'resize-y min-h-[80px]', error && inputErrorClass)}
      />
    </FormField>
  );
}
