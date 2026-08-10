'use client';

import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import FormField, { inputClass } from './FormField';
import { cn } from '@/lib/cn';

interface TagInputProps {
  label: string;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  hint?: string;
  suggestions?: string[];
}

export default function TagInput({
  label,
  tags,
  onChange,
  placeholder = 'Type and press Enter',
  hint,
  suggestions = [],
}: TagInputProps) {
  const [input, setInput] = useState('');

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === 'Backspace' && !input && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const unusedSuggestions = suggestions.filter((s) => !tags.includes(s));

  return (
    <FormField label={label} hint={hint}>
      <div className={cn(inputClass, 'flex flex-wrap gap-1.5 min-h-[42px] items-center py-1.5')}>
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-100 text-stone-700 text-xs font-medium rounded-lg"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-stone-400 hover:text-stone-700"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-sm placeholder:text-stone-400"
        />
      </div>
      {unusedSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {unusedSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addTag(s)}
              className="px-2 py-0.5 text-xs text-stone-500 bg-stone-50 border border-stone-200 rounded-lg hover:bg-stone-100 transition-colors"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </FormField>
  );
}
