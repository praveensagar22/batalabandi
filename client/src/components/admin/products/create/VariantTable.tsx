'use client';

import { Trash2 } from 'lucide-react';
import type { ProductVariant } from '@/lib/products/create-types';
import { inputClass } from './ui/FormField';
import { cn } from '@/lib/cn';

interface VariantTableProps {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
  error?: string;
}

export default function VariantTable({ variants, onChange, error }: VariantTableProps) {
  const updateVariant = (id: string, field: keyof ProductVariant, value: string | number | null) => {
    onChange(
      variants.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const removeVariant = (id: string) => {
    onChange(variants.filter((v) => v.id !== id));
  };

  if (variants.length === 0) {
    return (
      <div className="border border-dashed border-stone-200 rounded-2xl p-8 text-center">
        <p className="text-sm text-stone-500">No variants generated yet.</p>
        <p className="text-xs text-stone-400 mt-1">
          Select colors and sizes, then click &quot;Generate Variants&quot;.
        </p>
        {error && <p className="text-xs text-red-600 font-medium mt-3">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
      <div className="bg-white border border-stone-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50/80 border-b border-stone-100">
              <tr className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                <th className="p-3 min-w-[140px]">Variant</th>
                <th className="p-3">SKU</th>
                <th className="p-3 hidden md:table-cell">Barcode</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3 hidden lg:table-cell">Weight (g)</th>
                <th className="p-3 hidden md:table-cell">Status</th>
                <th className="p-3 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {variants.map((variant) => (
                <tr key={variant.id} className="hover:bg-stone-50/60">
                  <td className="p-2">
                    <input
                      type="text"
                      value={variant.name}
                      onChange={(e) => updateVariant(variant.id, 'name', e.target.value)}
                      className={cn(inputClass, 'py-1.5 text-xs')}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      value={variant.sku}
                      onChange={(e) => updateVariant(variant.id, 'sku', e.target.value)}
                      className={cn(inputClass, 'py-1.5 text-xs font-mono')}
                    />
                  </td>
                  <td className="p-2 hidden md:table-cell">
                    <input
                      type="text"
                      value={variant.barcode}
                      onChange={(e) => updateVariant(variant.id, 'barcode', e.target.value)}
                      className={cn(inputClass, 'py-1.5 text-xs')}
                      placeholder="Optional"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={variant.priceOverride ?? ''}
                      onChange={(e) =>
                        updateVariant(
                          variant.id,
                          'priceOverride',
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                      placeholder="Default"
                      className={cn(inputClass, 'py-1.5 text-xs w-24 tabular-nums')}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={variant.stock}
                      onChange={(e) =>
                        updateVariant(variant.id, 'stock', Number(e.target.value) || 0)
                      }
                      className={cn(inputClass, 'py-1.5 text-xs w-20 tabular-nums')}
                      min={0}
                    />
                  </td>
                  <td className="p-2 hidden lg:table-cell">
                    <input
                      type="number"
                      value={variant.weight || ''}
                      onChange={(e) =>
                        updateVariant(variant.id, 'weight', Number(e.target.value) || 0)
                      }
                      className={cn(inputClass, 'py-1.5 text-xs w-20 tabular-nums')}
                      min={0}
                    />
                  </td>
                  <td className="p-2 hidden md:table-cell">
                    <select
                      value={variant.status}
                      onChange={(e) =>
                        updateVariant(variant.id, 'status', e.target.value)
                      }
                      className={cn(inputClass, 'py-1.5 text-xs cursor-pointer')}
                    >
                      <option value="Active">Active</option>
                      <option value="Draft">Draft</option>
                    </select>
                  </td>
                  <td className="p-2">
                    <button
                      type="button"
                      onClick={() => removeVariant(variant.id)}
                      className="p-1.5 text-stone-400 hover:text-red-500 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-stone-400">{variants.length} variant{variants.length !== 1 ? 's' : ''}</p>
    </div>
  );
}
