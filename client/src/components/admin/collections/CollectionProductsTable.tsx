'use client';

import Image from 'next/image';
import { ExternalLink, Trash2, Package } from 'lucide-react';
import { CollectionProductItem } from '@/lib/collections/types';

interface Props {
  products: CollectionProductItem[];
  onRemoveProduct: (productId: string) => void;
}

export default function CollectionProductsTable({ products, onRemoveProduct }: Props) {
  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
              <th className="p-3">Product Name</th>
              <th className="p-3">Product Type</th>
              <th className="p-3">Theme</th>
              <th className="p-3">Price</th>
              <th className="p-3 text-center">Stock</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {products.length > 0 ? (
              products.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/70 transition">
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 flex-shrink-0">
                        <Image src={p.image} alt={p.name} fill unoptimized className="object-cover" />
                      </div>
                      <span className="font-bold text-stone-900 line-clamp-1">{p.name}</span>
                    </div>
                  </td>

                  <td className="p-3 font-semibold text-stone-700">{p.productType}</td>
                  <td className="p-3 font-medium text-stone-500">{p.theme}</td>
                  <td className="p-3 font-black text-stone-950">{p.price}</td>

                  <td className="p-3 text-center font-bold">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] ${
                        p.stock < 10 ? 'bg-red-100 text-red-700' : 'bg-stone-100 text-stone-800'
                      }`}
                    >
                      {p.stock} left
                    </span>
                  </td>

                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                      {p.status}
                    </span>
                  </td>

                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={`/admin/products`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 rounded text-stone-400 hover:text-stone-800"
                        title="Open Product"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => onRemoveProduct(p.id)}
                        className="p-1 rounded text-stone-400 hover:text-red-600"
                        title="Remove from collection"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-stone-400 text-xs">
                  No products currently linked to this collection.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
