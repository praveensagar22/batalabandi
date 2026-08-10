'use client';

import { Search, RotateCcw, MapPin } from 'lucide-react';
import { InventoryFilterState } from '@/lib/inventory/types';

interface Props {
  filters: InventoryFilterState;
  onChange: (filters: InventoryFilterState) => void;
  locationOptions: string[];
}

export default function InventorySearchAndFilters({
  filters,
  onChange,
  locationOptions,
}: Props) {
  const isFiltered =
    filters.search !== '' || filters.status !== 'All' || filters.location !== 'All';

  const handleReset = () => {
    onChange({
      search: '',
      status: 'All',
      location: 'All',
      category: 'All',
      sortBy: 'availableStock',
    });
  };

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-sm space-y-3">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search inventory by SKU, product title, barcode..."
            className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-stone-900 outline-none focus:border-yellow-400 focus:bg-white transition"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {isFiltered && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 px-3 py-2 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
          )}

          <select
            value={filters.status}
            onChange={(e) => onChange({ ...filters, status: e.target.value as any })}
            className="bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold rounded-xl px-3 py-2.5 outline-none focus:border-yellow-400 transition"
          >
            <option value="All">All Stock Statuses</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>

          <select
            value={filters.location}
            onChange={(e) => onChange({ ...filters, location: e.target.value })}
            className="bg-stone-50 border border-stone-200 text-stone-800 text-xs font-semibold rounded-xl px-3 py-2.5 outline-none focus:border-yellow-400 transition"
          >
            <option value="All">All Warehouse Locations</option>
            {locationOptions.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
