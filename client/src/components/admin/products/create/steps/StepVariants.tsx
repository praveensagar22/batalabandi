'use client';

import { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import type { ProductCreateForm, StepErrors } from '@/lib/products/create-types';
import { COLOR_PRESETS, SIZE_PRESETS } from '@/lib/products/create-defaults';
import { generateVariants } from '@/lib/products/create-utils';
import VariantTable from '../VariantTable';
import { cn } from '@/lib/cn';

interface StepProps {
  form: ProductCreateForm;
  onChange: (updates: Partial<ProductCreateForm>) => void;
  errors: StepErrors;
}

export default function StepVariants({ form, onChange, errors }: StepProps) {
  const [customColor, setCustomColor] = useState('');
  const [customSize, setCustomSize] = useState('');

  const toggleItem = (list: string[], item: string) =>
    list.includes(item) ? list.filter((i) => i !== item) : [...list, item];

  const addCustomColor = () => {
    if (customColor.trim() && !form.colors.includes(customColor.trim())) {
      onChange({ colors: [...form.colors, customColor.trim()] });
      setCustomColor('');
    }
  };

  const addCustomSize = () => {
    if (customSize.trim() && !form.sizes.includes(customSize.trim())) {
      onChange({ sizes: [...form.sizes, customSize.trim()] });
      setCustomSize('');
    }
  };

  const handleGenerate = () => {
    if (form.colors.length === 0 || form.sizes.length === 0) return;
    const variants = generateVariants(form.colors, form.sizes, form.masterSku);
    onChange({ variants });
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      <div>
        <h2 className="text-lg font-semibold text-stone-900">Product Variants</h2>
        <p className="text-sm text-stone-500 mt-0.5">
          Define colors and sizes, then generate variant combinations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Colors */}
        <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-stone-900 mb-3">Colors</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {COLOR_PRESETS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => onChange({ colors: toggleItem(form.colors, color) })}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-xl border transition-colors',
                  form.colors.includes(color)
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                )}
              >
                {color}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomColor())}
              placeholder="Custom color"
              className="flex-1 text-sm border border-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-900/10"
            />
            <button
              type="button"
              onClick={addCustomColor}
              className="p-2 border border-stone-200 rounded-xl hover:bg-stone-50"
            >
              <Plus className="w-4 h-4 text-stone-500" />
            </button>
          </div>
          {form.colors.length > 0 && (
            <p className="text-xs text-stone-400 mt-2">
              Selected: {form.colors.join(', ')}
            </p>
          )}
        </div>

        {/* Sizes */}
        <div className="bg-white border border-stone-100 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-stone-900 mb-3">Sizes</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {SIZE_PRESETS.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => onChange({ sizes: toggleItem(form.sizes, size) })}
                className={cn(
                  'px-3 py-1.5 text-sm font-medium rounded-xl border transition-colors',
                  form.sizes.includes(size)
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'
                )}
              >
                {size}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={customSize}
              onChange={(e) => setCustomSize(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSize())}
              placeholder="Custom size"
              className="flex-1 text-sm border border-stone-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-stone-900/10"
            />
            <button
              type="button"
              onClick={addCustomSize}
              className="p-2 border border-stone-200 rounded-xl hover:bg-stone-50"
            >
              <Plus className="w-4 h-4 text-stone-500" />
            </button>
          </div>
          {form.sizes.length > 0 && (
            <p className="text-xs text-stone-400 mt-2">
              Selected: {form.sizes.join(', ')}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={form.colors.length === 0 || form.sizes.length === 0}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-stone-900 text-white text-sm font-semibold rounded-xl hover:bg-stone-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-4 h-4" />
          Generate Variants
          {form.colors.length > 0 && form.sizes.length > 0 && (
            <span className="text-white/70">
              ({form.colors.length * form.sizes.length} combinations)
            </span>
          )}
        </button>
      </div>

      <VariantTable
        variants={form.variants}
        onChange={(variants) => onChange({ variants })}
        error={errors.variants as string | undefined}
      />
    </div>
  );
}
