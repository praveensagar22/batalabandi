'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X, SlidersHorizontal } from 'lucide-react';
import type { ProductFilters } from '@/lib/products/types';
import {
  GENDER_OPTIONS,
  PRODUCT_TYPE_OPTIONS,
  COLLECTION_OPTIONS,
  THEME_OPTIONS,
  STATUS_OPTIONS,
  STOCK_OPTIONS,
} from '@/lib/products/constants';
import { countActiveFilters } from '@/lib/products/utils';
import { cn } from '@/lib/cn';

interface ProductFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onClear: () => void;
}

interface FilterGroupProps<T extends string> {
  label: string;
  options: T[];
  selected: T[];
  onChange: (selected: T[]) => void;
}

function FilterGroup<T extends string>({
  label,
  options,
  selected,
  onChange,
}: FilterGroupProps<T>) {
  const toggle = (option: T) => {
    onChange(
      selected.includes(option)
        ? selected.filter((s) => s !== option)
        : [...selected, option]
    );
  };

  return (
    <div>
      <h4 className="text-xs font-semibold text-stone-700 mb-2.5">{label}</h4>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              className={cn(
                'px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors',
                isSelected
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300 hover:bg-stone-50'
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FilterContent({
  filters,
  onFiltersChange,
  onClear,
  activeCount,
}: {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  onClear: () => void;
  activeCount: number;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-stone-500" />
          <h3 className="text-sm font-semibold text-stone-900">Filters</h3>
          {activeCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-stone-900 text-white rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
        <FilterGroup
          label="Gender"
          options={GENDER_OPTIONS}
          selected={filters.gender}
          onChange={(gender) => onFiltersChange({ ...filters, gender })}
        />
        <FilterGroup
          label="Product Type"
          options={PRODUCT_TYPE_OPTIONS}
          selected={filters.productType}
          onChange={(productType) => onFiltersChange({ ...filters, productType })}
        />
        <FilterGroup
          label="Collection"
          options={COLLECTION_OPTIONS}
          selected={filters.collection}
          onChange={(collection) => onFiltersChange({ ...filters, collection })}
        />
        <FilterGroup
          label="Theme"
          options={THEME_OPTIONS}
          selected={filters.theme}
          onChange={(theme) => onFiltersChange({ ...filters, theme })}
        />
        <FilterGroup
          label="Status"
          options={STATUS_OPTIONS}
          selected={filters.status}
          onChange={(status) => onFiltersChange({ ...filters, status })}
        />
        <FilterGroup
          label="Stock"
          options={STOCK_OPTIONS}
          selected={filters.stock}
          onChange={(stock) => onFiltersChange({ ...filters, stock })}
        />
      </div>
    </div>
  );
}

export default function ProductFilterDrawer({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  onClear,
}: ProductFilterDrawerProps) {
  const activeCount = countActiveFilters(filters);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden xl:block w-64 shrink-0">
        <div className="bg-white border border-stone-100 rounded-2xl shadow-sm sticky top-20 overflow-hidden">
          <FilterContent
            filters={filters}
            onFiltersChange={onFiltersChange}
            onClear={onClear}
            activeCount={activeCount}
          />
        </div>
      </aside>

      {/* Mobile / tablet drawer */}
      <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-stone-950/40 backdrop-blur-sm xl:hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl xl:hidden flex flex-col data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right duration-300">
            <Dialog.Close className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors">
              <X className="w-4 h-4" />
              <span className="sr-only">Close filters</span>
            </Dialog.Close>
            <FilterContent
              filters={filters}
              onFiltersChange={onFiltersChange}
              onClear={onClear}
              activeCount={activeCount}
            />
            <div className="p-4 border-t border-stone-100">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="w-full py-2.5 bg-stone-900 text-white text-sm font-semibold rounded-xl hover:bg-stone-800 transition-colors"
                >
                  Apply Filters
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

export function FilterButton({
  onClick,
  activeCount,
}: {
  onClick: () => void;
  activeCount: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="xl:hidden inline-flex items-center gap-2 px-3.5 py-2 bg-white text-stone-700 text-sm font-medium rounded-xl border border-stone-200 hover:border-stone-300 hover:bg-stone-50 transition-colors shadow-sm"
    >
      <SlidersHorizontal className="w-4 h-4 text-stone-500" />
      Filters
      {activeCount > 0 && (
        <span className="px-1.5 py-0.5 text-[10px] font-bold bg-stone-900 text-white rounded-full">
          {activeCount}
        </span>
      )}
    </button>
  );
}
