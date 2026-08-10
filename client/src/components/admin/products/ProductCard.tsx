'use client';

import Image from 'next/image';
import { Eye, Edit2, Copy, Trash2, Tag, Layers, Sparkles } from 'lucide-react';
import { ProductItem } from '@/lib/products/types';

interface Props {
  product: ProductItem;
  onInspect: (p: ProductItem) => void;
  onEdit: (p: ProductItem) => void;
  onDuplicate: (p: ProductItem) => void;
  onDelete: (p: ProductItem) => void;
}

export default function ProductCard({
  product,
  onInspect,
  onEdit,
  onDuplicate,
  onDelete,
}: Props) {
  const thumbnail = product.thumbnail || product.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80';

  const discountPercent =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : 0;

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
      {/* Cover Image & Badges */}
      <div className="relative w-full h-56 bg-stone-900 overflow-hidden">
        <Image
          src={thumbnail}
          alt={product.title}
          fill
          unoptimized
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Status Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-xs ${
              product.status === 'Active'
                ? 'bg-emerald-500 text-white'
                : product.status === 'Out of Stock'
                ? 'bg-red-500 text-white'
                : 'bg-stone-700 text-stone-200'
            }`}
          >
            {product.status}
          </span>
          {product.isFeatured && (
            <span className="px-2 py-0.5 bg-yellow-400 text-stone-950 font-black text-[10px] rounded-full shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-stone-950" /> Featured
            </span>
          )}
        </div>

        {discountPercent > 0 && (
          <span className="absolute top-3 right-3 px-2 py-0.5 bg-red-600 text-white font-extrabold text-[10px] rounded-md shadow-xs">
            {discountPercent}% OFF
          </span>
        )}

        {/* Hover Quick Actions */}
        <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={() => onInspect(product)}
            className="p-2.5 rounded-xl bg-white text-stone-900 hover:bg-yellow-400 transition shadow-lg text-xs font-bold flex items-center gap-1"
            title="Inspect Product"
          >
            <Eye className="w-4 h-4" /> Inspect
          </button>
          <button
            onClick={() => onEdit(product)}
            className="p-2.5 rounded-xl bg-stone-900 text-white hover:bg-stone-800 transition shadow-lg text-xs font-bold flex items-center gap-1"
            title="Edit Product"
          >
            <Edit2 className="w-4 h-4" /> Edit
          </button>
        </div>
      </div>

      {/* Body Info */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] text-stone-400 font-bold mb-1">
            <span className="font-mono text-stone-600">{product.sku}</span>
            <span>{product.category}</span>
          </div>

          <h3 className="font-extrabold text-stone-900 text-sm line-clamp-1 group-hover:text-amber-800 transition">
            {product.title}
          </h3>
          <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5">{product.subtitle || product.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className="px-2 py-0.5 bg-stone-100 text-stone-800 font-bold text-[10px] rounded-md border border-stone-200">
              {product.productType}
            </span>
            {product.collectionName && (
              <span className="px-2 py-0.5 bg-amber-50 text-amber-900 font-bold text-[10px] rounded-md border border-amber-200">
                {product.collectionName}
              </span>
            )}
            {product.themeName && (
              <span className="px-2 py-0.5 bg-purple-50 text-purple-900 font-bold text-[10px] rounded-md border border-purple-200">
                {product.themeName}
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-stone-950">₹{product.price.toLocaleString('en-IN')}</span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-xs text-stone-400 line-through">₹{product.compareAtPrice.toLocaleString('en-IN')}</span>
              )}
            </div>
            <span className="text-[10px] text-stone-400 font-semibold">Stock: {product.stock} units</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onDuplicate(product)}
              className="p-2 rounded-lg hover:bg-stone-100 text-stone-600 transition"
              title="Duplicate"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(product)}
              className="p-2 rounded-lg hover:bg-red-50 text-stone-400 hover:text-red-600 transition"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
