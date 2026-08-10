'use client';

/**
 * 2-Column Product Grid Skeleton Loader (Myntra Style Shimmer)
 */
export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-2 mb-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl overflow-hidden border border-stone-200/80 p-0 flex flex-col justify-between"
        >
          {/* Image Placeholder */}
          <div className="w-full h-[165px] bg-stone-200 relative">
            <div className="absolute top-2 left-2 w-16 h-4 bg-stone-300 rounded" />
            <div className="absolute top-2 right-2 w-7 h-7 bg-stone-300 rounded-full" />
          </div>

          {/* Details Placeholder */}
          <div className="p-2.5 space-y-2">
            <div className="w-3/4 h-3.5 bg-stone-200 rounded" />
            <div className="w-1/2 h-2.5 bg-stone-150 bg-stone-200/60 rounded" />

            <div className="flex items-center justify-between pt-2 border-t border-stone-100">
              <div className="w-14 h-4 bg-stone-200 rounded" />
              <div className="w-6.5 h-6.5 bg-stone-200 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Product Detail Page Full Skeleton Loader
 */
export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-stone-50 animate-pulse font-sans">
      {/* Header Skeleton */}
      <div className="h-12 bg-white border-b border-stone-200 px-4 flex items-center justify-between">
        <div className="w-8 h-8 rounded-full bg-stone-200" />
        <div className="w-20 h-4 bg-stone-200 rounded-full" />
        <div className="w-8 h-8 rounded-full bg-stone-200" />
      </div>

      {/* Hero Image Skeleton */}
      <div className="w-full aspect-[4/5] bg-stone-300" />

      {/* Info Section Skeleton */}
      <div className="p-4 bg-white rounded-t-3xl -mt-4 space-y-4 shadow-xs">
        <div className="space-y-2">
          <div className="w-1/3 h-3 bg-amber-200 rounded" />
          <div className="w-4/5 h-6 bg-stone-300 rounded" />
          <div className="w-1/2 h-4 bg-stone-200 rounded" />
        </div>

        {/* Pricing Skeleton */}
        <div className="flex items-center gap-3">
          <div className="w-24 h-7 bg-stone-300 rounded" />
          <div className="w-16 h-4 bg-stone-200 rounded" />
        </div>

        {/* Sizes Skeleton */}
        <div className="space-y-2 pt-2">
          <div className="w-20 h-3 bg-stone-200 rounded" />
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="w-11 h-11 bg-stone-200 rounded-xl" />
            ))}
          </div>
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2 pt-4 border-t border-stone-100">
          <div className="w-full h-3 bg-stone-200 rounded" />
          <div className="w-5/6 h-3 bg-stone-200 rounded" />
          <div className="w-2/3 h-3 bg-stone-200 rounded" />
        </div>
      </div>
    </div>
  );
}

/**
 * Shopping Bag Cart Page Skeleton Loader
 */
export function CartPageSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2].map((i) => (
        <div key={i} className="bg-white rounded-2xl p-3 border border-stone-200 flex gap-3">
          <div className="w-20 h-24 bg-stone-200 rounded-xl shrink-0" />
          <div className="flex-1 space-y-3 py-1">
            <div className="w-3/4 h-4 bg-stone-200 rounded" />
            <div className="w-1/2 h-3 bg-stone-200 rounded" />
            <div className="flex items-center justify-between pt-2">
              <div className="w-16 h-4 bg-stone-300 rounded" />
              <div className="w-16 h-6 bg-stone-200 rounded-xl" />
            </div>
          </div>
        </div>
      ))}

      {/* Bill Breakdown Skeleton */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 space-y-3">
        <div className="w-1/3 h-4 bg-stone-200 rounded" />
        <div className="w-full h-3 bg-stone-200 rounded" />
        <div className="w-full h-3 bg-stone-200 rounded" />
        <div className="w-full h-5 bg-stone-300 rounded pt-2" />
      </div>
    </div>
  );
}

/**
 * Categories Page Skeleton Loader
 */
export function CategoryPageSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Banner Skeleton */}
      <div className="w-full h-36 bg-stone-200 rounded-3xl" />

      {/* Sections Skeleton */}
      {[1, 2].map((sec) => (
        <div key={sec} className="space-y-3">
          <div className="w-1/3 h-4 bg-stone-300 rounded" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((c) => (
              <div key={c} className="h-28 bg-white rounded-2xl border border-stone-200 p-3 space-y-2">
                <div className="w-10 h-10 bg-stone-200 rounded-full" />
                <div className="w-3/4 h-3.5 bg-stone-200 rounded" />
                <div className="w-1/2 h-2.5 bg-stone-150 rounded" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
