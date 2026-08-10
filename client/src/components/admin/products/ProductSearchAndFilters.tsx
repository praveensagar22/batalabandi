'use client';

import { Search, LayoutGrid, List, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { ProductFilterState } from '@/lib/products/types';

interface Props {
  filters: ProductFilterState;
  onChange: (newFilters: ProductFilterState) => void;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  categoryOptions: string[];
  productTypeOptions: string[];
  collectionOptions: string[];
  themeOptions: string[];
}

export default function ProductSearchAndFilters({
  filters,
  onChange,
  viewMode,
  onViewModeChange,
  categoryOptions,
  productTypeOptions,
  collectionOptions,
  themeOptions,
}: Props) {
  const isFiltered =
    filters.search !== '' ||
    filters.status !== 'All' ||
    filters.category !== 'All' ||
    filters.productType !== 'All' ||
    filters.collection !== 'All' ||
    filters.theme !== 'All';

  const handleReset = () => {
    onChange({
      search: '',
      status: 'All',
      category: 'All',
      productType: 'All',
      collection: 'All',
      theme: 'All',
      gender: 'All',
      sortBy: 'createdDate',
    });
  };

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-sm space-y-3">
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search products by title, SKU, or artwork..."
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-900 outline-none focus:border-yellow-400 focus:bg-white transition"
          />
        </div>

        {/* View Mode & Reset Buttons */}
        <div className="flex items-center gap-2 self-end md:self-auto flex-shrink-0">
          {isFiltered && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          )}

          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                viewMode === 'grid'
                  ? 'bg-white text-stone-950 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                viewMode === 'table'
                  ? 'bg-white text-stone-950 shadow-2xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Dropdowns Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 pt-1 border-t border-stone-100">
        <select
          value={filters.status}
          onChange={(e) => onChange({ ...filters, status: e.target.value as any })}
          className="bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none focus:border-yellow-400 transition"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Draft">Draft</option>
          <option value="Out of Stock">Out of Stock</option>
          <option value="Archived">Archived</option>
        </select>

        <select
          value={filters.category}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
          className="bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none focus:border-yellow-400 transition"
        >
          <option value="All">All Categories</option>
          {categoryOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={filters.productType}
          onChange={(e) => onChange({ ...filters, productType: e.target.value })}
          className="bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none focus:border-yellow-400 transition"
        >
          <option value="All">All Product Types</option>
          {productTypeOptions.map((pt) => (
            <option key={pt} value={pt}>
              {pt}
            </option>
          ))}
        </select>

        <select
          value={filters.collection}
          onChange={(e) => onChange({ ...filters, collection: e.target.value })}
          className="bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none focus:border-yellow-400 transition"
        >
          <option value="All">All Collections</option>
          {collectionOptions.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>

        <select
          value={filters.theme}
          onChange={(e) => onChange({ ...filters, theme: e.target.value })}
          className="bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold rounded-xl px-3 py-2 outline-none focus:border-yellow-400 transition"
        >
          <option value="All">All Themes</option>
          {themeOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
