'use client';

import { AlertTriangle, Trash2, X } from 'lucide-react';
import { ProductItem } from '@/lib/products/types';

interface Props {
  isOpen: boolean;
  product: ProductItem | null;
  onClose: () => void;
  onConfirmDelete: (id: string) => void;
}

export default function ProductDeleteModal({
  isOpen,
  product,
  onClose,
  onConfirmDelete,
}: Props) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-100 space-y-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 rounded-2xl text-red-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-stone-900">Delete Product</h3>
              <p className="text-xs text-stone-500">
                Are you sure you want to delete <strong className="text-stone-900">"{product.title}"</strong>?
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600 space-y-1">
          <div className="flex justify-between">
            <span>SKU:</span>
            <span className="font-mono font-bold text-stone-900">{product.sku}</span>
          </div>
          <div className="flex justify-between">
            <span>Current Stock:</span>
            <span className="font-bold text-stone-900">{product.stock} units</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirmDelete(product.id);
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl transition shadow-xs"
          >
            <Trash2 className="w-4 h-4" /> Delete Product
          </button>
        </div>
      </div>
    </div>
  );
}
