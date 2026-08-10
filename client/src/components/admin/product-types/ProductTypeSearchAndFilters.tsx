'use client';

import { Search, X, RotateCcw } from 'lucide-react';
import { ProductTypeFilterState } from '@/lib/product-types/types';

interface Props {
  filters: ProductTypeFilterState;
  categoriesList: string[];
  onChange: (filters: ProductTypeFilterState) => void;
  onReset: () => void;
  totalResults: number;
}

export default function ProductTypeSearchAndFilters({
  filters,
  categoriesList,
  onChange,
  onReset,
  totalResults,
}: Props) {
  const isFiltered =
    filters.search !== '' ||
    filters.status !== 'All' ||
    filters.category !== 'All' ||
    filters.gender !== 'All' ||
    filters.featured !== 'All';

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-sm space-y-3">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search product types by name or slug..."
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-9 py-2 text-xs text-stone-900 placeholder-stone-400 outline-none focus:border-yellow-400 focus:bg-white transition"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ ...filters, search: '' })}
              className="absolute right-3 top-2.5 text-stone-400 hover:text-stone-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => onChange({ ...filters, category: e.target.value })}
            className="bg-stone-50 border border-stone-200 text-stone-800 text-xs font-medium rounded-xl px-3 py-2 outline-none focus:border-yellow-400 transition"
          >
            <option value="All">All Categories</option>
            {categoriesList.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Gender Filter */}
          <select
            value={filters.gender}
            onChange={(e) => onChange({ ...filters, gender: e.target.value })}
            className="bg-stone-50 border border-stone-200 text-stone-800 text-xs font-medium rounded-xl px-3 py-2 outline-none focus:border-yellow-400 transition"
          >
            <option value="All">All Genders</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) =>
              onChange({ ...filters, status: e.target.value as ProductTypeFilterState['status'] })
            }
            className="bg-stone-50 border border-stone-200 text-stone-800 text-xs font-medium rounded-xl px-3 py-2 outline-none focus:border-yellow-400 transition"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Archived">Archived</option>
          </select>

          {/* Featured Filter */}
          <select
            value={filters.featured}
            onChange={(e) =>
              onChange({ ...filters, featured: e.target.value as ProductTypeFilterState['featured'] })
            }
            className="bg-stone-50 border border-stone-200 text-stone-800 text-xs font-medium rounded-xl px-3 py-2 outline-none focus:border-yellow-400 transition"
          >
            <option value="All">Featured: All</option>
            <option value="Yes">Featured Only</option>
            <option value="No">Non-Featured</option>
          </select>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              onClick={onReset}
              className="flex items-center gap-1 text-xs text-amber-700 font-bold px-2.5 py-2 bg-amber-50 hover:bg-amber-100 rounded-xl transition border border-amber-200"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
        <span>
          Showing <strong className="text-stone-900">{totalResults}</strong> apparel product types
        </span>
        {isFiltered && <span className="text-[11px] text-amber-600 font-semibold">• Active filters applied</span>}
      </div>
    </div>
  );
}
