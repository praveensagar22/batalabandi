'use client';

import Image from 'next/image';
import { Eye, Edit2, Copy, Trash2, Tag, CheckCircle2, XCircle, Sparkles } from 'lucide-react';
import { ProductItem } from '@/lib/products/types';

interface Props {
  products: ProductItem[];
  selectedIds: string[];
  onSelectRow: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onInspect: (p: ProductItem) => void;
  onEdit: (p: ProductItem) => void;
  onDuplicate: (p: ProductItem) => void;
  onDelete: (p: ProductItem) => void;
  onToggleStatus: (p: ProductItem) => void;
  onBulkAction: (action: 'activate' | 'deactivate' | 'delete' | 'export') => void;
}

export default function ProductTable({
  products,
  selectedIds,
  onSelectRow,
  onSelectAll,
  onInspect,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleStatus,
  onBulkAction,
}: Props) {
  const isAllSelected = products.length > 0 && products.every((p) => selectedIds.includes(p.id));

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col space-y-3 p-4 sm:p-5">
      {/* Bulk Action Toolbar */}
      {selectedIds.length > 0 && (
        <div className="bg-stone-900 text-white px-4 py-2.5 rounded-2xl flex items-center justify-between gap-3 text-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-5 h-5 rounded-full bg-yellow-400 text-stone-950 font-black text-[10px] flex items-center justify-center">
              {selectedIds.length}
            </span>
            <span>products selected</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onBulkAction('activate')}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs transition"
            >
              Activate
            </button>
            <button
              onClick={() => onBulkAction('deactivate')}
              className="px-2.5 py-1 bg-stone-700 hover:bg-stone-600 text-white rounded-lg font-semibold text-xs transition"
            >
              Deactivate
            </button>
            <button
              onClick={() => onBulkAction('delete')}
              className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-xs flex items-center gap-1 transition"
            >
              <Trash2 className="w-3 h-3" /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border border-stone-200/80 rounded-2xl">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200/80 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="p-3.5 w-10 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded border-stone-300 text-yellow-500 cursor-pointer w-4 h-4"
                />
              </th>
              <th className="p-3.5">Product</th>
              <th className="p-3.5">SKU</th>
              <th className="p-3.5">Category & Type</th>
              <th className="p-3.5">Collection / Theme</th>
              <th className="p-3.5 text-right">Price</th>
              <th className="p-3.5 text-center">Stock</th>
              <th className="p-3.5 text-center">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-100">
            {products.length > 0 ? (
              products.map((p) => {
                const isSelected = selectedIds.includes(p.id);
                const thumbnail = p.thumbnail || p.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80';

                return (
                  <tr
                    key={p.id}
                    className={`hover:bg-yellow-50/40 transition ${
                      isSelected ? 'bg-yellow-50/70' : ''
                    }`}
                  >
                    <td className="p-3.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelectRow(p.id)}
                        className="rounded border-stone-300 text-yellow-500 cursor-pointer w-4 h-4"
                      />
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 rounded-xl bg-stone-900 overflow-hidden flex-shrink-0 border border-stone-200">
                          <Image src={thumbnail} alt="" fill unoptimized className="object-cover" />
                        </div>
                        <div>
                          <h4 className="font-extrabold text-stone-900 text-xs line-clamp-1 flex items-center gap-1.5">
                            {p.title}
                            {p.isFeatured && <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />}
                          </h4>
                          <span className="text-[10px] text-stone-400 font-medium block">
                            {p.gender} • {p.colors.join(', ')}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 font-mono font-bold text-stone-600 text-[11px]">{p.sku}</td>

                    <td className="p-3.5">
                      <div className="font-bold text-stone-900">{p.category}</div>
                      <span className="text-[10px] text-stone-400 font-medium">{p.productType}</span>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-1 flex-wrap">
                        {p.collectionName && (
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-900 font-bold text-[10px] rounded-md border border-amber-200">
                            {p.collectionName}
                          </span>
                        )}
                        {p.themeName && (
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-900 font-bold text-[10px] rounded-md border border-purple-200">
                            {p.themeName}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3.5 text-right font-extrabold text-stone-950">
                      ₹{p.price.toLocaleString('en-IN')}
                    </td>

                    <td className="p-3.5 text-center">
                      <span
                        className={`px-2.5 py-1 font-bold rounded-lg text-[11px] border ${
                          p.stock <= p.lowStockThreshold
                            ? 'bg-amber-50 text-amber-900 border-amber-300'
                            : 'bg-stone-100 text-stone-800 border-stone-200'
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </td>

                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => onToggleStatus(p)}
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border transition ${
                          p.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : 'bg-stone-100 text-stone-500 border-stone-300'
                        }`}
                      >
                        {p.status}
                      </button>
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onInspect(p)}
                          className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 transition"
                          title="Inspect Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEdit(p)}
                          className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 transition"
                          title="Edit Product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDuplicate(p)}
                          className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 transition"
                          title="Duplicate"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(p)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-600 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={9} className="py-12 text-center text-xs text-stone-400">
                  No products found matching filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
