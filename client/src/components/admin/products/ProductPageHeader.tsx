'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export default function ProductPageHeader() {
  return (
    <div className="space-y-1">
      <nav className="flex items-center gap-1.5 text-xs text-stone-400">
        <Link
          href="/admin"
          className="flex items-center gap-1 hover:text-stone-600 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
          Admin
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-stone-600 font-medium">Products</span>
      </nav>
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-stone-950 tracking-tight">
          Products
        </h1>
        <p className="text-sm text-stone-500 mt-0.5">
          Manage your catalog, inventory, and product listings.
        </p>
      </div>
    </div>
  );
}
