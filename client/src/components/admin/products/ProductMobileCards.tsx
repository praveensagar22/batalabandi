'use client';

import Image from 'next/image';
import type { Product } from '@/lib/products/types';
import { formatPrice, formatDate } from '@/lib/products/utils';

interface ProductMobileCardsProps {
  products: Product[];
  selectedIds: Set<string>;
  onSelectOne: (id: string, checked: boolean) => void;
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDuplicate: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export default function ProductMobileCards({
  products,
  selectedIds,
  onSelectOne,
  onView,
  onEdit,
  onDuplicate,
  onDelete,
}: ProductMobileCardsProps) {
  return (
    <div className="divide-y divide-stone-100">
      {products.map((product) => {
        const isSelected = selectedIds.has(product.id);
        const thumbnail = product.thumbnail || product.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80';

        return (
          <div key={product.id} className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onSelectOne(product.id, e.target.checked)}
                className="mt-1 rounded border-stone-300 text-yellow-500 cursor-pointer"
              />
              <div className="relative w-12 h-12 rounded-xl bg-stone-900 overflow-hidden flex-shrink-0">
                <Image src={thumbnail} alt="" fill unoptimized className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-extrabold text-stone-900 text-xs truncate">{product.title || product.name}</h4>
                <p className="text-[10px] font-mono text-stone-500">{product.sku}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold text-xs text-stone-950">{formatPrice(product.price)}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-stone-100 font-bold rounded-md">{product.status}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
