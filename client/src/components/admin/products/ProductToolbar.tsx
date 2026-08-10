'use client';

import {
  Search,
  Plus,
  Upload,
  Download,
  SlidersHorizontal,
} from 'lucide-react';
import { FilterButton } from './ProductFilterDrawer';

interface ProductToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onAddProduct: () => void;
  onOpenFilters: () => void;
  activeFilterCount: number;
  resultCount: number;
}

export default function ProductToolbar({
  search,
  onSearchChange,
  onAddProduct,
  onOpenFilters,
  activeFilterCount,
  resultCount,
}: ProductToolbarProps) {
  return (
    <div className="bg-white border border-stone-100 rounded-2xl p-3 sm:p-4 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, SKU, or theme..."
            className="w-full bg-stone-50 border border-stone-200 text-stone-800 text-sm rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-300 transition"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <FilterButton onClick={onOpenFilters} activeCount={activeFilterCount} />

          <button
            type="button"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 bg-white text-stone-700 text-sm font-medium rounded-xl border border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-colors shadow-sm"
          >
            <Upload className="w-4 h-4 text-stone-500" />
            Import
          </button>

          <button
            type="button"
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 bg-white text-stone-700 text-sm font-medium rounded-xl border border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 text-stone-500" />
            Export
          </button>

          <button
            type="button"
            onClick={onOpenFilters}
            className="hidden xl:inline-flex items-center gap-2 px-3.5 py-2 bg-white text-stone-700 text-sm font-medium rounded-xl border border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-colors shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-stone-500" />
            Filters
          </button>

          <button
            type="button"
            onClick={onAddProduct}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors ml-auto sm:ml-0"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      <p className="text-xs text-stone-400 mt-2.5 font-medium">
        {resultCount} product{resultCount !== 1 ? 's' : ''} found
      </p>
    </div>
  );
}
