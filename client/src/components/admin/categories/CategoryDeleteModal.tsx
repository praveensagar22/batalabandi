'use client';

import { useState } from 'react';
import { AlertTriangle, Trash2, X, ArrowRight } from 'lucide-react';
import { Category } from '@/lib/categories/types';

interface Props {
  isOpen: boolean;
  category: Category | null;
  allCategories: Category[];
  onClose: () => void;
  onConfirmDelete: (categoryId: string, replacementCategoryId?: string) => void;
}

export default function CategoryDeleteModal({
  isOpen,
  category,
  allCategories,
  onClose,
  onConfirmDelete,
}: Props) {
  const [replacementId, setReplacementId] = useState<string>('');

  if (!isOpen || !category) return null;

  const hasProducts = category.productsCount > 0;
  const candidateReplacements = allCategories.filter((c) => c.id !== category.id);

  const handleDelete = () => {
    onConfirmDelete(category.id, replacementId || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-100 space-y-4 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-2xl text-red-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-stone-900">Delete Category</h3>
              <p className="text-xs text-stone-500">
                Are you sure you want to delete <strong className="text-stone-900">"{category.name}"</strong>?
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning if products exist */}
        {hasProducts ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3">
            <p className="text-xs font-bold text-amber-900">
              ⚠️ This category contains {category.productsCount} products.
            </p>
            <p className="text-[11px] text-amber-800">
              Please move these {category.productsCount} products to another category before deleting.
            </p>

            <div>
              <label className="block text-xs font-extrabold text-stone-800 mb-1">
                Select Replacement Category:
              </label>
              <select
                value={replacementId}
                onChange={(e) => setReplacementId(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900 outline-none focus:border-yellow-400"
              >
                <option value="">-- Choose destination category --</option>
                {candidateReplacements.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.gender || 'Unisex'}) — {cat.productsCount} existing products
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <p className="text-xs text-stone-500">
            This category has 0 products linked to it. Deleting it will permanently remove it from the catalog.
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={hasProducts && !replacementId}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-extrabold rounded-xl transition shadow-xs"
          >
            <Trash2 className="w-4 h-4" /> Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}
