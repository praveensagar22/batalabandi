'use client';

import { Plus, PackageOpen } from 'lucide-react';

interface ProductEmptyStateProps {
  onCreateProduct: () => void;
  hasFilters?: boolean;
}

export default function ProductEmptyState({
  onCreateProduct,
  hasFilters,
}: ProductEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4">
      <div className="relative mb-6">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-br from-stone-100 to-stone-50 border border-stone-200 flex items-center justify-center">
          <PackageOpen className="w-10 h-10 sm:w-12 sm:h-12 text-stone-300" />
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#facc15] border-2 border-white flex items-center justify-center">
          <Plus className="w-4 h-4 text-stone-900" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-stone-900">
        {hasFilters ? 'No products found' : 'No products yet'}
      </h3>
      <p className="text-sm text-stone-500 mt-1.5 text-center max-w-sm">
        {hasFilters
          ? 'Try adjusting your search or filters to find what you\'re looking for.'
          : 'Get started by adding your first product to the catalog.'}
      </p>
      {!hasFilters && (
        <button
          onClick={onCreateProduct}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Your First Product
        </button>
      )}
    </div>
  );
}
