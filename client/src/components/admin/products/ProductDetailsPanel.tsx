'use client';

import Image from 'next/image';
import { X, Edit2, ExternalLink, Tag, Sparkles, Layers, Shirt, IndianRupee, Globe } from 'lucide-react';
import { ProductItem } from '@/lib/products/types';

interface Props {
  product: ProductItem | null;
  onClose: () => void;
  onEdit: (p: ProductItem) => void;
}

export default function ProductDetailsPanel({ product, onClose, onEdit }: Props) {
  if (!product) return null;

  const thumbnail = product.thumbnail || product.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest">
              Product Overview
            </span>
            <h2 className="text-lg font-extrabold text-stone-900 line-clamp-1">{product.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(product)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#facc15] text-stone-950 text-xs font-bold rounded-xl shadow-xs"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Main Cover Image */}
          <div className="relative w-full h-64 rounded-2xl overflow-hidden border border-stone-200 bg-stone-900 shadow-inner">
            <Image src={thumbnail} alt={product.title} fill unoptimized className="object-cover" />
            <div className="absolute top-3 left-3 flex items-center gap-1.5">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500 text-white shadow-xs">
                {product.status}
              </span>
              {product.isFeatured && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-yellow-400 text-stone-950 shadow-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-stone-950" /> Featured
                </span>
              )}
            </div>
          </div>

          {/* Pricing & Sales Metric Box */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200">
            <div>
              <span className="text-[10px] font-bold text-stone-400 block uppercase">Retail Price</span>
              <span className="text-lg font-black text-stone-900">₹{product.price.toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-stone-400 block uppercase">Stock Units</span>
              <span className="text-lg font-black text-emerald-700">{product.stock} units</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-stone-400 block uppercase">Total Sales</span>
              <span className="text-lg font-black text-stone-900">{product.salesCount} sold</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-extrabold text-stone-900 mb-1">Description</h4>
            <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3.5 rounded-xl border border-stone-100">
              {product.description}
            </p>
          </div>

          {/* Catalog Tags */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-stone-900">Catalog Classifications</h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold text-stone-800">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-normal">Category</span>
                {product.category}
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-normal">Product Type</span>
                {product.productType}
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-normal">Collection</span>
                {product.collectionName || 'None'}
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-normal">Theme</span>
                {product.themeName || 'None'}
              </div>
            </div>
          </div>

          {/* Variants Table if any */}
          {product.variants && product.variants.length > 0 && (
            <div>
              <h4 className="text-xs font-extrabold text-stone-900 mb-2">Variant Stock Matrix</h4>
              <div className="border border-stone-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-stone-50 font-bold text-[10px] text-stone-500 uppercase">
                    <tr>
                      <th className="p-2.5">SKU</th>
                      <th className="p-2.5">Color</th>
                      <th className="p-2.5">Size</th>
                      <th className="p-2.5 text-right">Price</th>
                      <th className="p-2.5 text-center">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {product.variants.map((v) => (
                      <tr key={v.id}>
                        <td className="p-2.5 font-mono text-[11px] font-bold text-stone-700">{v.sku}</td>
                        <td className="p-2.5 font-semibold text-stone-800">{v.color}</td>
                        <td className="p-2.5 font-semibold text-stone-800">{v.size}</td>
                        <td className="p-2.5 text-right font-bold text-stone-900">₹{v.price}</td>
                        <td className="p-2.5 text-center font-bold text-emerald-700">{v.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs">
          <span className="font-mono text-stone-400">SKU: {product.sku}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
