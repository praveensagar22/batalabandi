'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  BarChart3,
  PackageCheck,
  Layers,
  Globe,
  Edit2,
  Copy,
  Archive,
  ExternalLink,
  Star,
  Heart,
  TrendingUp,
  Share2,
} from 'lucide-react';
import { Theme } from '@/lib/themes/types';
import ThemeProductsTable from './ThemeProductsTable';
import ThemeCollectionsBreakdown from './ThemeCollectionsBreakdown';

interface Props {
  theme: Theme | null;
  onEdit: (t: Theme) => void;
  onDuplicate: (t: Theme) => void;
  onArchive: (t: Theme) => void;
  onRemoveProduct: (productId: string) => void;
}

export default function ThemeDetailsPanel({
  theme,
  onEdit,
  onDuplicate,
  onArchive,
  onRemoveProduct,
}: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'collections' | 'analytics' | 'seo'>('overview');

  if (!theme) {
    return (
      <div className="bg-white border border-stone-200/80 rounded-2xl p-12 text-center text-stone-400 space-y-3">
        <Sparkles className="w-10 h-10 mx-auto text-stone-300" />
        <h3 className="text-sm font-bold text-stone-700">Select a Theme</h3>
        <p className="text-xs text-stone-400 max-w-xs mx-auto">
          Click any artwork theme card on the left to inspect landing page settings, analytics, collection compatibility, and assigned products.
        </p>
      </div>
    );
  }

  const { analytics } = theme;

  return (
    <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-sm space-y-5">
      {/* Banner Header */}
      <div className="relative rounded-2xl overflow-hidden bg-stone-900 text-white p-6 min-h-[140px] flex flex-col justify-between shadow-sm">
        {theme.bannerImage && (
          <Image
            src={theme.bannerImage}
            alt=""
            fill
            unoptimized
            className="object-cover opacity-40"
          />
        )}

        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-yellow-400 text-stone-950 font-black rounded text-[10px] uppercase">
                {theme.marketing.campaignLabel || 'Artwork Theme'}
              </span>
              <span className="text-xs text-yellow-300 font-bold">• Rating ★ {analytics.averageRating}</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">{theme.name}</h2>
            <p className="text-xs text-stone-200 mt-1 max-w-md line-clamp-2">
              {theme.fullDescription || theme.shortDescription}
            </p>
          </div>

          <div className="flex items-center gap-2 relative z-10 flex-shrink-0">
            <button
              onClick={() => onDuplicate(theme)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs transition"
              title="Duplicate Theme"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(theme)}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-xs font-extrabold rounded-xl transition shadow-sm"
            >
              <Edit2 className="w-3.5 h-3.5" /> Edit
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 gap-4 text-xs font-bold overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: Sparkles },
          { id: 'products', label: `Products (${theme.assignedProducts.length})`, icon: PackageCheck },
          { id: 'collections', label: 'Collections', icon: Layers },
          { id: 'analytics', label: 'Analytics & Revenue', icon: BarChart3 },
          { id: 'seo', label: 'SEO & Social', icon: Globe },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-2.5 flex items-center gap-1.5 border-b-2 whitespace-nowrap transition ${
                active
                  ? 'border-yellow-400 text-stone-950 font-extrabold'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
              <span className="text-[10px] font-bold text-stone-400 uppercase">Products</span>
              <span className="text-xl font-black text-stone-900 block mt-1">{theme.productsCount}</span>
            </div>
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-800 uppercase">Revenue</span>
              <span className="text-xl font-black text-emerald-950 block mt-1">{analytics.revenue}</span>
            </div>
            <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200">
              <span className="text-[10px] font-bold text-blue-800 uppercase">Landing Views</span>
              <span className="text-xl font-black text-blue-950 block mt-1">{analytics.views.toLocaleString()}</span>
            </div>
            <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200">
              <span className="text-[10px] font-bold text-purple-800 uppercase">Wishlist Adds</span>
              <span className="text-xl font-black text-purple-950 block mt-1">{analytics.wishlistCount}</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-extrabold text-stone-900 mb-1">Marketing Tagline & Banner Link</h4>
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-amber-950">{theme.marketing.tagline}</p>
                <p className="text-[11px] font-mono text-stone-600 mt-0.5">{theme.marketing.buttonUrl}</p>
              </div>
              <a
                href={theme.marketing.buttonUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 bg-stone-900 text-yellow-400 font-bold rounded-xl text-xs"
              >
                View Page <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <ThemeProductsTable products={theme.assignedProducts} onRemoveProduct={onRemoveProduct} />
        </div>
      )}

      {/* TAB 3: COLLECTIONS */}
      {activeTab === 'collections' && (
        <div className="space-y-4">
          <ThemeCollectionsBreakdown theme={theme} />
        </div>
      )}

      {/* TAB 4: ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-5">
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-stone-900">Monthly Sales Revenue Trend</h4>
              <span className="text-[11px] font-bold text-emerald-700">+22.1% growth</span>
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
        </div>
      )}

      {/* TAB 5: SEO */}
      {activeTab === 'seo' && (
        <div className="space-y-4 text-xs">
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
            <span className="text-[10px] font-extrabold text-stone-400 uppercase tracking-widest">
              Google Search Snippet Preview
            </span>
            <h5 className="text-sm font-bold text-blue-700 hover:underline cursor-pointer truncate">
              {theme.seo.metaTitle || `${theme.name} Graphic Apparel | BatalaBandi`}
            </h5>
            <p className="text-[11px] font-mono text-emerald-800 truncate">
              https://batalabandi.com{theme.marketing.buttonUrl || `/themes/${theme.slug}`}
            </p>
            <p className="text-xs text-stone-600 line-clamp-2">
              {theme.seo.metaDescription || theme.shortDescription}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
