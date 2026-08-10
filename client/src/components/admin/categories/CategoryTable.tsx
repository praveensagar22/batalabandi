'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  ArrowUpDown,
  ExternalLink,
  Layers,
  Sparkles,
  PackageCheck,
  CheckCircle2,
  XCircle,
  Download,
} from 'lucide-react';
import { Category } from '@/lib/categories/types';

interface CategoryTableProps {
  categories: Category[];
  allCategoriesMap: Map<string, Category>;
  selectedIds: string[];
  onSelectRow: (id: string) => void;
  onSelectAll: (checked: boolean) => void;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  onToggleStatus: (category: Category) => void;
  onBulkAction: (action: 'activate' | 'deactivate' | 'delete' | 'export') => void;
}

export default function CategoryTable({
  categories,
  allCategoriesMap,
  selectedIds,
  onSelectRow,
  onSelectAll,
  onEdit,
  onDelete,
  onToggleStatus,
  onBulkAction,
}: CategoryTableProps) {
  const isAllSelected =
    categories.length > 0 && categories.every((c) => selectedIds.includes(c.id));

  const levelBadge = (level: number) => {
    switch (level) {
      case 0:
        return (
          <span className="px-2 py-0.5 bg-purple-100 text-purple-900 border border-purple-200 rounded-md text-[10px] font-extrabold uppercase tracking-wider">
            Level 0 (Root)
          </span>
        );
      case 1:
        return (
          <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-200 rounded-md text-[10px] font-bold">
            Level 1 (Parent)
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded-md text-[10px] font-medium">
            Level 2 (Child)
          </span>
        );
    }
  };

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-stone-900 text-white px-5 py-3 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-5 h-5 rounded-full bg-yellow-400 text-stone-950 font-black text-[10px] flex items-center justify-center">
              {selectedIds.length}
            </span>
            <span>selected categories</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onBulkAction('activate')}
              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition text-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Activate
            </button>
            <button
              onClick={() => onBulkAction('deactivate')}
              className="flex items-center gap-1 px-3 py-1.5 bg-stone-700 hover:bg-stone-600 text-white rounded-lg font-semibold transition text-xs"
            >
              <XCircle className="w-3.5 h-3.5" /> Deactivate
            </button>
            <button
              onClick={() => onBulkAction('export')}
              className="flex items-center gap-1 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-yellow-400 rounded-lg font-semibold transition text-xs"
            >
              <Download className="w-3.5 h-3.5" /> Export Selected
            </button>
            <button
              onClick={() => onBulkAction('delete')}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition text-xs"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200/80 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="p-4 w-10 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded border-stone-300 text-yellow-500 focus:ring-yellow-400 cursor-pointer w-4 h-4"
                />
              </th>
              <th className="p-4">Category</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Parent</th>
              <th className="p-4">Level</th>
              <th className="p-4 text-center">Products</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Sort Order</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-100">
            {categories.length > 0 ? (
              categories.map((cat) => {
                const isSelected = selectedIds.includes(cat.id);
                const parentCat = cat.parentId ? allCategoriesMap.get(cat.parentId) : null;

                return (
                  <tr
                    key={cat.id}
                    className={`hover:bg-yellow-50/40 transition ${
                      isSelected ? 'bg-yellow-50/70' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="p-4 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onSelectRow(cat.id)}
                        className="rounded border-stone-300 text-yellow-500 focus:ring-yellow-400 cursor-pointer w-4 h-4"
                      />
                    </td>

                    {/* Category Image & Info */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0 flex items-center justify-center">
                          {cat.image ? (
                            <Image
                              src={cat.image}
                              alt={cat.name}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <Layers className="w-5 h-5 text-stone-400" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-stone-900 text-xs">{cat.name}</h4>
                            {cat.featured && (
                              <span className="px-1.5 py-0.2 bg-amber-100 text-amber-900 text-[9px] font-extrabold rounded">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-stone-400 line-clamp-1 max-w-[200px]">
                            {cat.description || 'No description provided.'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Slug */}
                    <td className="p-4">
                      <code className="bg-stone-100 text-stone-700 font-mono text-[11px] px-2 py-0.5 rounded-md border border-stone-200/60">
                        {cat.slug}
                      </code>
                    </td>

                    {/* Parent Category */}
                    <td className="p-4 font-medium text-stone-700">
                      {parentCat ? (
                        <span className="flex items-center gap-1 text-xs">
                          <span className="w-2 h-2 rounded-full bg-yellow-400" />
                          {parentCat.name}
                        </span>
                      ) : (
                        <span className="text-stone-400 italic text-[11px]">— None (Root)</span>
                      )}
                    </td>

                    {/* Level */}
                    <td className="p-4">{levelBadge(cat.level)}</td>

                    {/* Products Count */}
                    <td className="p-4 text-center">
                      <span className="px-2.5 py-1 bg-stone-100 text-stone-800 font-bold rounded-lg text-xs border border-stone-200/60 inline-flex items-center gap-1">
                        <PackageCheck className="w-3.5 h-3.5 text-stone-500" />
                        {cat.productsCount}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => onToggleStatus(cat)}
                        className={`px-3 py-1 rounded-full text-[11px] font-extrabold border transition inline-flex items-center gap-1 ${
                          cat.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200'
                            : 'bg-stone-100 text-stone-500 border-stone-300 hover:bg-stone-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            cat.status === 'Active' ? 'bg-emerald-600' : 'bg-stone-400'
                          }`}
                        />
                        {cat.status}
                      </button>
                    </td>

                    {/* Sort Order */}
                    <td className="p-4 text-center font-mono font-bold text-stone-700">
                      {cat.sortOrder}
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          title="Edit Category"
                          onClick={() => onEdit(cat)}
                          className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Delete Category"
                          onClick={() => onDelete(cat)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-600 transition"
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
                <td colSpan={9} className="py-12 text-center">
                  <div className="max-w-xs mx-auto text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                      <Layers className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-stone-900">No Categories Found</h3>
                    <p className="text-xs text-stone-500">
                      Try adjusting your search criteria or create a new category.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
