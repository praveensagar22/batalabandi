'use client';

import { Search, X, RotateCcw, LayoutGrid, Table } from 'lucide-react';
import { ThemeFilterState } from '@/lib/themes/types';

interface Props {
  filters: ThemeFilterState;
  viewMode: 'grid' | 'table';
  onViewModeChange: (mode: 'grid' | 'table') => void;
  onChange: (filters: ThemeFilterState) => void;
  onReset: () => void;
  totalResults: number;
}

export default function ThemeSearchAndFilters({
  filters,
  viewMode,
  onViewModeChange,
  onChange,
  onReset,
  totalResults,
}: Props) {
  const isFiltered =
    filters.search !== '' ||
    filters.status !== 'All' ||
    filters.featured !== 'All' ||
    filters.collection !== 'All' ||
    filters.sortBy !== 'name';

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-sm space-y-3">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search themes by name, slug or keywords..."
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

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) =>
              onChange({ ...filters, status: e.target.value as ThemeFilterState['status'] })
            }
            className="bg-stone-50 border border-stone-200 text-stone-800 text-xs font-medium rounded-xl px-3 py-2 outline-none focus:border-yellow-400 transition"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Archived">Archived</option>
          </select>

          {/* Featured Filter */}
          <select
            value={filters.featured}
            onChange={(e) =>
              onChange({ ...filters, featured: e.target.value as ThemeFilterState['featured'] })
            }
            className="bg-stone-50 border border-stone-200 text-stone-800 text-xs font-medium rounded-xl px-3 py-2 outline-none focus:border-yellow-400 transition"
          >
            <option value="All">Featured: All</option>
            <option value="Yes">Featured Only</option>
            <option value="No">Non-Featured</option>
          </select>

          {/* Collection Compatibility Filter */}
          <select
            value={filters.collection}
            onChange={(e) => onChange({ ...filters, collection: e.target.value })}
            className="bg-stone-50 border border-stone-200 text-stone-800 text-xs font-medium rounded-xl px-3 py-2 outline-none focus:border-yellow-400 transition"
          >
            <option value="All">All Collections</option>
            <option value="Painted">Painted</option>
            <option value="Thread">Thread</option>
            <option value="Printed">Printed</option>
            <option value="Limited Edition">Limited Edition</option>
          </select>

          {/* Sort By Filter */}
          <select
            value={filters.sortBy}
            onChange={(e) =>
              onChange({ ...filters, sortBy: e.target.value as ThemeFilterState['sortBy'] })
            }
            className="bg-stone-50 border border-stone-200 text-stone-800 text-xs font-medium rounded-xl px-3 py-2 outline-none focus:border-yellow-400 transition"
          >
            <option value="name">Alphabetical</option>
            <option value="productsCount">Most Products</option>
            <option value="views">Most Viewed</option>
            <option value="createdDate">Recently Added</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => onViewModeChange('grid')}
              title="Grid / Split View"
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-white text-stone-950 font-bold shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onViewModeChange('table')}
              title="Table View"
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table'
                  ? 'bg-white text-stone-950 font-bold shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
            </button>
          </div>

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
          Showing <strong className="text-stone-900">{totalResults}</strong> artwork themes
        </span>
        {isFiltered && <span className="text-[11px] text-amber-600 font-semibold">• Active filters applied</span>}
      </div>
    </div>
  );
}
