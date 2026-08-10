'use client';

import { useState } from 'react';
import { AlertTriangle, Trash2, X, GitMerge } from 'lucide-react';
import { AttributeGroup, AttributeValueItem } from '@/lib/attributes/types';

interface Props {
  isOpen: boolean;
  group: AttributeGroup | null;
  valueItem: AttributeValueItem | null;
  onClose: () => void;
  onConfirmDelete: (valueId: string, replacementValueId?: string) => void;
  onMergeValues: (sourceId: string, targetId: string) => void;
}

export default function AttributeDeleteModal({
  isOpen,
  group,
  valueItem,
  onClose,
  onConfirmDelete,
  onMergeValues,
}: Props) {
  const [replacementId, setReplacementId] = useState<string>('');

  if (!isOpen || !group || !valueItem) return null;

  const hasProducts = valueItem.productsCount > 0;
  const candidateReplacements = group.values.filter((v) => v.id !== valueItem.id);

  const handleDelete = () => {
    onConfirmDelete(valueItem.id, replacementId || undefined);
    onClose();
  };

  const handleMerge = () => {
    if (!replacementId) return;
    onMergeValues(valueItem.id, replacementId);
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
              <h3 className="text-base font-extrabold text-stone-900">Delete Attribute Value</h3>
              <p className="text-xs text-stone-500">
                Are you sure you want to delete <strong className="text-stone-900">"{valueItem.name}"</strong>?
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning if products exist */}
        {hasProducts ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-3">
            <p className="text-xs font-bold text-amber-900">
              ⚠️ This value is currently assigned to {valueItem.productsCount} products.
            </p>
            <p className="text-[11px] text-amber-800">
              To prevent orphaned product options, please select a replacement value to reassign or merge these products.
            </p>

            <div>
              <label className="block text-xs font-extrabold text-stone-800 mb-1">
                Replace / Merge Products With:
              </label>
              <select
                value={replacementId}
                onChange={(e) => setReplacementId(e.target.value)}
                className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900 outline-none focus:border-yellow-400"
              >
                <option value="">-- Choose replacement value --</option>
                {candidateReplacements.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.displayLabel}) — {v.productsCount} products
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <p className="text-xs text-stone-500">
            This option value is used by 0 products. Deleting it will permanently remove it from your catalog options.
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100">
          {hasProducts && (
            <button
              onClick={handleMerge}
              disabled={!replacementId}
              className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition"
            >
              <GitMerge className="w-3.5 h-3.5" /> Merge Value
            </button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition"
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
    </div>
  );
}
