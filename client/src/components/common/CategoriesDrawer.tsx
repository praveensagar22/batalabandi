'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Sparkles, ChevronRight, Layers } from 'lucide-react';
import { fetchCategoriesAPI } from '@/lib/api/catalog';
import { Category } from '@/lib/categories/types';
import { formatImageUrl } from '@/lib/api/client';
import { CategoryPageSkeleton } from '@/components/common/Skeletons';

type TabKey = 'men' | 'women' | 'unisex';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const tabConfigs: Record<TabKey, { title: string; subtitle: string; accent: string }> = {
  men: {
    title: 'Men',
    subtitle: 'Clean essentials, bold prints, and handcrafted details.',
    accent: 'from-amber-100 via-yellow-50 to-orange-50',
  },
  women: {
    title: 'Women',
    subtitle: 'Soft silhouettes, elegant layers, and modern comfort.',
    accent: 'from-pink-100 via-rose-50 to-orange-50',
  },
  unisex: {
    title: 'Unisex',
    subtitle: 'Versatile staples with a creative edge for everyday wear.',
    accent: 'from-slate-100 via-stone-50 to-amber-50',
  },
};

const gradientsList = [
  'from-amber-200 via-orange-100 to-yellow-50',
  'from-yellow-100 via-amber-50 to-orange-50',
  'from-rose-100 via-orange-50 to-amber-50',
  'from-violet-100 via-fuchsia-50 to-amber-50',
  'from-lime-100 via-emerald-50 to-yellow-50',
];

export default function CategoriesDrawer({ isOpen, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('men');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      async function loadCats() {
        setIsLoading(true);
        try {
          const fetched = await fetchCategoriesAPI();
          setCategories(fetched || []);
        } catch (err) {
          console.warn('Failed to load categories for drawer:', err);
        } finally {
          setIsLoading(false);
        }
      }
      loadCats();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter categories by active gender tab
  const activeCategories = categories.filter((c) => {
    if (c.status === 'Inactive') return false;
    if (activeTab === 'men') return c.gender === 'Men' || c.gender === 'Unisex' || !c.gender;
    if (activeTab === 'women') return c.gender === 'Women' || c.gender === 'Unisex';
    return c.gender === 'Unisex' || c.featured;
  });

  const activeContent = tabConfigs[activeTab];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/70 backdrop-blur-sm flex justify-start animate-in fade-in duration-200 font-sans">
      {/* Backdrop overlay trigger to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Left Slide-In Drawer Card */}
      <div className="relative z-10 w-full max-w-md bg-[#faf9f6] h-full shadow-2xl flex flex-col border-r border-stone-200 animate-in slide-in-from-left duration-300">
        {/* Header Bar */}
        <div className="bg-[#facc15] px-5 py-4 flex items-center justify-between border-b border-amber-400">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-stone-950" />
            <h2 className="text-base font-black text-stone-950 uppercase tracking-wider">
              Browse Categories
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-stone-950/10 hover:bg-stone-950/20 text-stone-950 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Drawer Content */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 custom-scrollbar">
          {/* Top Header Card */}
          <section className="rounded-3xl border border-stone-200 bg-white p-4 shadow-xs">
            <div className={`rounded-2xl bg-gradient-to-br ${activeContent.accent} p-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-stone-600">
                    Curated styles
                  </p>
                  <h3 className="mt-0.5 text-lg font-black text-stone-950">
                    {activeContent.title} Collection
                  </h3>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 shadow-xs">
                  <Sparkles className="h-4 w-4 text-amber-700" />
                </div>
              </div>
              <p className="mt-1.5 text-xs text-stone-600 font-medium">
                {activeContent.subtitle}
              </p>
            </div>

            {/* Men / Women / Unisex Pill Tabs */}
            <div className="mt-3 flex rounded-full border border-stone-200 bg-stone-50 p-1">
              {(['men', 'women', 'unisex'] as TabKey[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 rounded-full px-3 py-1.5 text-xs font-black transition-all ${
                    activeTab === tab
                      ? 'bg-stone-950 text-white shadow-xs'
                      : 'text-stone-600 hover:bg-white hover:text-stone-900'
                  }`}
                >
                  {tabConfigs[tab].title}
                </button>
              ))}
            </div>
          </section>

          {/* Category Cards Grid */}
          {isLoading ? (
            <CategoryPageSkeleton />
          ) : activeCategories.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {activeCategories.map((c, idx) => {
                const gradient = gradientsList[idx % gradientsList.length];
                const imageSrc = formatImageUrl(c.image || c.banner || '');

                return (
                  <Link
                    key={c.id || c.slug}
                    href={`/categories/${c.slug}`}
                    onClick={onClose}
                    className="block rounded-2xl border border-stone-200 bg-white p-2.5 shadow-2xs hover:border-amber-400 active:scale-98 transition-all group"
                  >
                    <div className={`relative h-28 overflow-hidden rounded-xl bg-gradient-to-br ${gradient} p-2`}>
                      {imageSrc ? (
                        <Image
                          src={imageSrc}
                          alt={c.name}
                          fill
                          unoptimized
                          className="object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-2xl opacity-20">
                          👘
                        </div>
                      )}
                      <span className="relative z-10 w-fit rounded-full bg-stone-950/80 backdrop-blur-md px-2 py-0.5 text-[9px] font-black text-amber-300 shadow-xs">
                        {c.productsCount > 0 ? `${c.productsCount} items` : 'Live'}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-stone-900 line-clamp-1">{c.name}</h4>
                        <p className="text-[10px] text-stone-400 font-medium line-clamp-1">
                          {c.description || 'Handcrafted style'}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-950 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center bg-white rounded-2xl border border-stone-200 p-4 space-y-2">
              <p className="text-xs font-bold text-stone-800">
                No categories found in "{tabConfigs[activeTab].title}"
              </p>
            </div>
          )}

          {/* Explore All Products Link */}
          <Link
            href="/products"
            onClick={onClose}
            className="flex items-center justify-between p-3.5 bg-stone-950 text-white rounded-2xl shadow-sm hover:bg-stone-900 transition"
          >
            <div>
              <p className="text-xs font-black">Browse All Products</p>
              <p className="text-[10px] text-stone-400">View complete apparel catalog</p>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}
