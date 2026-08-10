'use client';

import { X, Shirt, SlidersHorizontal, PackageCheck, TrendingUp, Sparkles, Edit2, Copy, Archive } from 'lucide-react';
import Image from 'next/image';
import { ProductType } from '@/lib/product-types/types';

interface Props {
  productType: ProductType | null;
  onClose: () => void;
  onEdit: (pt: ProductType) => void;
  onDuplicate: (pt: ProductType) => void;
  onArchive: (pt: ProductType) => void;
}

export default function ProductTypeDetailsPanel({
  productType,
  onClose,
  onEdit,
  onDuplicate,
  onArchive,
}: Props) {
  if (!productType) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-yellow-400 text-stone-950 font-black flex items-center justify-center text-sm shadow-sm">
              <Shirt className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest">
                Product Type Detail
              </span>
              <h2 className="text-lg font-extrabold text-stone-900">{productType.name}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-stone-200 text-stone-500 hover:text-stone-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-center">
              <span className="text-[10px] font-bold text-stone-400 block uppercase">Products</span>
              <span className="text-lg font-black text-stone-900">{productType.productsCount}</span>
            </div>
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-center">
              <span className="text-[10px] font-bold text-amber-800 block uppercase">Category</span>
              <span className="text-xs font-extrabold text-amber-950">{productType.parentCategory}</span>
            </div>
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
              <span className="text-[10px] font-bold text-emerald-800 block uppercase">Status</span>
              <span className="text-xs font-extrabold text-emerald-950">{productType.status}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-extrabold text-stone-900 mb-1">Description & Characteristics</h4>
            <p className="text-xs text-stone-600 bg-stone-50 p-3.5 rounded-2xl border border-stone-200/60 leading-relaxed">
              {productType.fullDescription || productType.shortDescription}
            </p>
          </div>

          {/* Defaults Card */}
          <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-2">
            <div className="flex items-center gap-2 text-amber-950 text-xs font-bold mb-1">
              <SlidersHorizontal className="w-4 h-4 text-amber-600" />
              <span>Automatic Pre-fill Defaults</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-amber-100">
                <span className="text-[10px] text-stone-400 block font-bold">Size Chart</span>
                <span className="font-semibold text-stone-800">{productType.defaults.sizeChart}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-amber-100">
                <span className="text-[10px] text-stone-400 block font-bold">Fabric & Material</span>
                <span className="font-semibold text-stone-800">{productType.defaults.material}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-amber-100">
                <span className="text-[10px] text-stone-400 block font-bold">Tax Class</span>
                <span className="font-semibold text-stone-800">{productType.defaults.taxClass}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-amber-100">
                <span className="text-[10px] text-stone-400 block font-bold">Shipping Class</span>
                <span className="font-semibold text-stone-800">{productType.defaults.shippingClass}</span>
              </div>
            </div>
          </div>

          {/* Assigned Products Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-extrabold text-stone-900">Products using this Product Type</h4>
              <span className="text-[11px] font-bold text-amber-700">{productType.productsCount} items</span>
            </div>

            <div className="space-y-2">
              {productType.assignedProducts && productType.assignedProducts.length > 0 ? (
                productType.assignedProducts.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-stone-200 flex-shrink-0">
                        <Image src={p.image} alt={p.name} fill unoptimized className="object-cover" />
                      </div>
                      <div>
                        <h5 className="font-bold text-stone-900">{p.name}</h5>
                        <span className="text-[10px] text-stone-400">Added {p.createdDate}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-stone-950 block">{p.price}</span>
                      <span className="text-[10px] text-emerald-700 font-semibold">{p.salesCount} sold</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-center text-xs text-stone-400">
                  No sample products linked yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Quick Actions */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onArchive(productType);
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-xl transition"
          >
            <Archive className="w-3.5 h-3.5" /> Archive
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onDuplicate(productType);
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-xl transition"
            >
              <Copy className="w-3.5 h-3.5" /> Duplicate
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(productType);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-xs font-extrabold rounded-xl shadow-xs transition"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
