'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Layers,
  ShoppingBag,
  TrendingUp,
  Eye,
  Percent,
  Edit2,
  Copy,
  Archive,
  ExternalLink,
  Sparkles,
  BarChart3,
  PackageCheck,
} from 'lucide-react';
import { Collection } from '@/lib/collections/types';
import CollectionProductsTable from './CollectionProductsTable';

interface Props {
  collection: Collection | null;
  onEdit: (col: Collection) => void;
  onDuplicate: (col: Collection) => void;
  onArchive: (col: Collection) => void;
  onRemoveProduct: (productId: string) => void;
}

export default function CollectionDetailsPanel({
  collection,
  onEdit,
  onDuplicate,
  onArchive,
  onRemoveProduct,
}: Props) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'products'>('analytics');

  if (!collection) {
    return (
      <div className="bg-white border border-stone-200/80 rounded-2xl p-12 text-center text-stone-400 space-y-3">
        <Layers className="w-10 h-10 mx-auto text-stone-300" />
        <h3 className="text-sm font-bold text-stone-700">Select a Collection</h3>
        <p className="text-xs text-stone-400 max-w-xs mx-auto">
          Click any collection card on the left to view detailed sales analytics, revenue metrics, and assigned product catalogs.
        </p>
      </div>
    );
  }

  const { analytics } = collection;

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-sm space-y-5">
      {/* Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-stone-900 text-white p-6 min-h-[140px] flex flex-col justify-between shadow-sm">
        {collection.bannerImage && (
          <Image
            src={collection.bannerImage}
            alt=""
            fill
            unoptimized
            className="object-cover opacity-35"
          />
        )}

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-yellow-400 text-stone-950 font-black rounded text-[10px] uppercase">
                {collection.marketing.promoLabel || 'Collection'}
              </span>
              <span className="text-xs text-yellow-300 font-bold">• Priority #{collection.homepagePriority}</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">{collection.name}</h2>
            <p className="text-xs text-stone-200 mt-1 max-w-md line-clamp-2">
              {collection.detailedDescription || collection.shortDescription}
            </p>
          </div>

          <div className="flex items-center gap-2 relative z-10 flex-shrink-0">
            <button
              onClick={() => onDuplicate(collection)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs transition"
              title="Duplicate Collection"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(collection)}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-xs font-extrabold rounded-xl transition shadow-sm"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 gap-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`py-2.5 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'analytics'
              ? 'border-yellow-400 text-stone-950 font-extrabold'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Overview & Analytics
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`py-2.5 flex items-center gap-2 border-b-2 transition ${
            activeTab === 'products'
              ? 'border-yellow-400 text-stone-950 font-extrabold'
              : 'border-transparent text-stone-400 hover:text-stone-700'
          }`}
        >
          <PackageCheck className="w-4 h-4" /> Products ({collection.assignedProducts.length})
        </button>
      </div>

      {/* TAB 1: ANALYTICS & OVERVIEW */}
      {activeTab === 'analytics' && (
        <div className="space-y-5">
          {/* Analytics 5 Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200/80">
              <span className="text-[10px] font-bold text-stone-400 uppercase">Products</span>
              <span className="text-lg font-black text-stone-900 block mt-1">{collection.productsCount}</span>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80">
              <span className="text-[10px] font-bold text-emerald-800 uppercase">Total Revenue</span>
              <span className="text-lg font-black text-emerald-950 block mt-1">{analytics.revenue}</span>
            </div>

            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200/80">
              <span className="text-[10px] font-bold text-amber-800 uppercase">Total Sales</span>
              <span className="text-lg font-black text-amber-950 block mt-1">{analytics.salesCount}</span>
            </div>

            <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200/80">
              <span className="text-[10px] font-bold text-blue-800 uppercase">Store Views</span>
              <span className="text-lg font-black text-blue-950 block mt-1">{analytics.views.toLocaleString()}</span>
            </div>

            <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200/80 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold text-purple-800 uppercase">Conv. Rate</span>
              <span className="text-lg font-black text-purple-950 block mt-1">{analytics.conversionRate}</span>
            </div>
          </div>

          {/* Monthly Performance Visual Chart */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-stone-900">Monthly Sales Revenue Trend</h4>
              <span className="text-[11px] font-bold text-emerald-700">+18.4% growth</span>
            </div>

            <div className="h-32 flex items-end justify-between gap-3 pt-4 px-2 border-b border-stone-200">
              {analytics.monthlySales.map((item) => {
                const max = Math.max(...analytics.monthlySales.map((m) => m.amount));
                const heightPct = Math.round((item.amount / max) * 100);
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-1 group">
                    <span className="text-[9px] font-extrabold text-stone-600 opacity-0 group-hover:opacity-100 transition">
                      ₹{(item.amount / 1000).toFixed(0)}k
                    </span>
                    <div
                      className="w-full bg-[#facc15] hover:bg-[#eab308] rounded-t-lg transition-all"
                      style={{ height: `${heightPct}%` }}
                    />
                    <span className="text-[10px] font-bold text-stone-500 mt-1">{item.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Marketing Button Preview */}
          <div className="p-4 bg-yellow-50/70 border border-yellow-200 rounded-2xl flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] font-bold text-yellow-900 uppercase">Call to Action Button</span>
              <p className="font-extrabold text-stone-950 mt-0.5">"{collection.marketing.buttonText}"</p>
            </div>
            <a
              href={collection.marketing.buttonUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 bg-stone-900 text-yellow-400 font-bold rounded-xl text-xs"
            >
              Test Link <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS TAB */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <h4 className="font-extrabold text-stone-900">Products in "{collection.name}"</h4>
            <span className="text-stone-500">{collection.assignedProducts.length} items linked</span>
          </div>

          <CollectionProductsTable
            products={collection.assignedProducts}
            onRemoveProduct={onRemoveProduct}
          />
        </div>
      )}
    </div>
  );
}
