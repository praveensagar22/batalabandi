'use client';

import FormField, { inputClass, inputErrorClass } from './FormField';
import { cn } from '@/lib/cn';

interface TextInputProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  disabled?: boolean;
  type?: 'text' | 'email' | 'url' | 'date' | 'datetime-local';
}

export default function TextInput({
  label,
  id,
  value,
  onChange,
  placeholder,
  required,
  error,
  hint,
  disabled,
  type = 'text',
}: TextInputProps) {
  return (
    <FormField label={label} htmlFor={id} required={required} error={error} hint={hint}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(inputClass, error && inputErrorClass)}
      />
    </FormField>
  );
}
