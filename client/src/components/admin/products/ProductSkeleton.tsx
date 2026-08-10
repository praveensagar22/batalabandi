'use client';

function SkeletonRow() {
  return (
    <tr className="border-b border-stone-50">
      <td className="p-4">
        <div className="w-4 h-4 bg-stone-100 rounded animate-pulse" />
      </td>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-stone-100 rounded-xl animate-pulse" />
          <div className="space-y-1.5">
            <div className="h-3.5 w-32 bg-stone-100 rounded animate-pulse" />
            <div className="h-2.5 w-16 bg-stone-100 rounded animate-pulse" />
          </div>
        </div>
      </td>
      <td className="p-4 hidden md:table-cell">
        <div className="h-3 w-14 bg-stone-100 rounded animate-pulse" />
      </td>
      <td className="p-4 hidden lg:table-cell">
        <div className="h-3 w-10 bg-stone-100 rounded animate-pulse" />
      </td>
      <td className="p-4 hidden lg:table-cell">
        <div className="h-3 w-16 bg-stone-100 rounded animate-pulse" />
      </td>
      <td className="p-4 hidden xl:table-cell">
        <div className="h-3 w-14 bg-stone-100 rounded animate-pulse" />
      </td>
      <td className="p-4 hidden xl:table-cell">
        <div className="h-3 w-12 bg-stone-100 rounded animate-pulse" />
      </td>
      <td className="p-4">
        <div className="h-3.5 w-14 bg-stone-100 rounded animate-pulse" />
      </td>
      <td className="p-4">
        <div className="h-3 w-8 bg-stone-100 rounded animate-pulse" />
      </td>
      <td className="p-4 hidden md:table-cell">
        <div className="h-5 w-14 bg-stone-100 rounded-full animate-pulse" />
      </td>
      <td className="p-4 hidden lg:table-cell">
        <div className="h-3 w-20 bg-stone-100 rounded animate-pulse" />
      </td>
      <td className="p-4">
        <div className="h-7 w-7 bg-stone-100 rounded-lg animate-pulse ml-auto" />
      </td>
    </tr>
  );
}

export function ProductTableSkeleton() {
  return (
    <div className="hidden sm:block bg-white border border-stone-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50/80 border-b border-stone-100">
            <tr className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
              <th className="p-4 w-10" />
              <th className="p-4">Product</th>
              <th className="p-4 hidden md:table-cell">SKU</th>
              <th className="p-4 hidden lg:table-cell">Gender</th>
              <th className="p-4 hidden lg:table-cell">Type</th>
              <th className="p-4 hidden xl:table-cell">Collection</th>
              <th className="p-4 hidden xl:table-cell">Theme</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4 hidden md:table-cell">Status</th>
              <th className="p-4 hidden lg:table-cell">Created</th>
              <th className="p-4 w-12" />
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonRow key={i} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function ProductMobileSkeleton() {
  return (
    <div className="sm:hidden space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-stone-100 rounded-2xl p-4 shadow-sm animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-stone-100 rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 bg-stone-100 rounded" />
              <div className="h-3 w-24 bg-stone-100 rounded" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="h-4 w-16 bg-stone-100 rounded" />
            <div className="h-5 w-14 bg-stone-100 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
