'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import { fetchCategoriesAPI } from '@/lib/api/catalog';
import { Category } from '@/lib/categories/types';
import { formatImageUrl } from '@/lib/api/client';
import { CategoryPageSkeleton } from '@/components/common/Skeletons';

type TabKey = 'men' | 'women' | 'unisex';

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  gradient: string;
  badge: string;
  image?: string;
};

type CategorySection = {
  title: string;
  note: string;
  items: CategoryItem[];
};

type TabData = {
  title: string;
  subtitle: string;
  accent: string;
  sections: CategorySection[];
};

const gradientsList = [
  'from-amber-200 via-orange-100 to-yellow-50',
  'from-yellow-100 via-amber-50 to-orange-50',
  'from-rose-100 via-orange-50 to-amber-50',
  'from-violet-100 via-fuchsia-50 to-amber-50',
  'from-lime-100 via-emerald-50 to-yellow-50',
  'from-sky-100 via-cyan-50 to-amber-50',
  'from-emerald-100 via-lime-50 to-stone-50',
  'from-orange-100 via-amber-50 to-stone-50',
];

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

// Robust Transformer: Group flat backend Category[] into UI TabData structure
function transformBackendCategories(apiCategories: Category[]): Record<TabKey, TabData> {
  const result: Record<TabKey, TabData> = {
    men: { ...tabConfigs.men, sections: [] },
    women: { ...tabConfigs.women, sections: [] },
    unisex: { ...tabConfigs.unisex, sections: [] },
  };

  (['men', 'women', 'unisex'] as TabKey[]).forEach((tabKey) => {
    const targetGender = tabKey === 'men' ? 'Men' : tabKey === 'women' ? 'Women' : 'Unisex';

    // 1. Filter active categories relevant to this tab
    const matchedCategories = apiCategories.filter((c) => {
      if (c.status === 'Inactive') return false;
      if (tabKey === 'unisex') {
        return c.gender === 'Unisex' || c.gender === 'All' || !c.gender;
      }
      return c.gender === targetGender || c.gender === 'All' || c.gender === 'Unisex';
    });

    if (matchedCategories.length === 0) {
      // Fallback if no specific gender match, include all active categories
      matchedCategories.push(...apiCategories.filter((c) => c.status !== 'Inactive'));
    }

    // 2. Identify parents vs children vs standalone categories
    const parents = matchedCategories.filter((c) => c.level === 1);
    const children = matchedCategories.filter((c) => c.level === 2);
    const level0OrOther = matchedCategories.filter((c) => c.level !== 1 && c.level !== 2);

    const sections: CategorySection[] = [];

    // Case A: Structured Parents & Children exist
    if (parents.length > 0) {
      parents.forEach((parent) => {
        // Find children belonging to this parent (by parentId, slug, or ID)
        const parentIdOrSlug = parent.slug || parent.id;
        const subItems = children.filter(
          (child) =>
            child.parentId === parentIdOrSlug ||
            child.parentId === parent.id ||
            child.parentId === parent.slug
        );

        const formattedItems: CategoryItem[] = (subItems.length > 0 ? subItems : [parent]).map(
          (item, idx) => ({
            id: item.id,
            name: item.name,
            slug: item.slug,
            description: item.description || 'Artistic handcrafted style',
            gradient: gradientsList[idx % gradientsList.length],
            badge: item.featured ? 'Featured' : item.productsCount > 0 ? `${item.productsCount} items` : 'Live',
            image: formatImageUrl(item.image || item.banner || ''),
          })
        );

        sections.push({
          title: parent.name,
          note: parent.description || `Artistic ${parent.name.toLowerCase()} collections`,
          items: formattedItems,
        });
      });
    }

    // Case B: Add any remaining children or standalone categories not grouped above
    const groupedIds = new Set(sections.flatMap((s) => s.items.map((i) => i.id)));
    const unmapped = matchedCategories.filter((c) => !groupedIds.has(c.id) && c.level !== 0);

    if (unmapped.length > 0) {
      const standaloneItems: CategoryItem[] = unmapped.map((item, idx) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description || 'Handcrafted statement piece',
        gradient: gradientsList[idx % gradientsList.length],
        badge: item.featured ? 'Featured' : item.productsCount > 0 ? `${item.productsCount} items` : 'New Drop',
        image: formatImageUrl(item.image || item.banner || ''),
      }));

      sections.push({
        title: tabKey === 'men' ? 'Men Styles' : tabKey === 'women' ? 'Women Styles' : 'Unisex Essentials',
        note: 'Featured category collections',
        items: standaloneItems,
      });
    }

    // Case C: If still no sections, render all matched categories directly
    if (sections.length === 0 && matchedCategories.length > 0) {
      const allItems: CategoryItem[] = matchedCategories.map((item, idx) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description || 'Handcrafted statement piece',
        gradient: gradientsList[idx % gradientsList.length],
        badge: item.featured ? 'Featured' : 'Live',
        image: formatImageUrl(item.image || item.banner || ''),
      }));

      sections.push({
        title: 'All Categories',
        note: 'Browse all available category drops',
        items: allItems,
      });
    }

    result[tabKey].sections = sections;
  });

  return result;
}

export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('men');
  const [tabData, setTabData] = useState<Record<TabKey, TabData> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBackendCategories() {
      setIsLoading(true);
      try {
        const categories = await fetchCategoriesAPI().catch(() => []);
        if (categories && categories.length > 0) {
          const transformed = transformBackendCategories(categories);
          setTabData(transformed);
        }
      } catch (err) {
        console.warn('Failed to load categories from backend:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadBackendCategories();
  }, []);

  const activeContent = tabData ? tabData[activeTab] : { ...tabConfigs[activeTab], sections: [] };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.14),_transparent_40%),linear-gradient(180deg,#fffdf7_0%,#fefce8_100%)]">
      <Header activeTab="all" />

      <main className="px-4 pb-24 pt-4 max-w-md mx-auto">
        {/* Top Header Card */}
        <section className="rounded-[28px] border border-stone-200 bg-white/90 p-4 shadow-[0_10px_30px_rgba(0,0,0,0.05)] backdrop-blur">
          <div className={`rounded-[22px] bg-gradient-to-br ${activeContent.accent} p-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-600">Curated styles</p>
                <h1 className="mt-1 text-xl font-black text-stone-950">{activeContent.title} collection</h1>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/80 shadow-sm">
                <Sparkles className="h-5 w-5 text-amber-700" />
              </div>
            </div>
            <p className="mt-2 text-sm text-stone-600">{activeContent.subtitle}</p>
          </div>

          {/* Men / Women / Unisex Pill Tabs */}
          <div className="mt-4 flex rounded-full border border-stone-200 bg-stone-50 p-1">
            {(['men', 'women', 'unisex'] as TabKey[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-stone-950 text-white shadow-sm'
                    : 'text-stone-600 hover:bg-white hover:text-stone-900'
                }`}
              >
                {tabConfigs[tab].title}
              </button>
            ))}
          </div>
        </section>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="mt-4">
            <CategoryPageSkeleton />
          </div>
        ) : (
          /* Sections Grid populated 100% from Backend */
          <section className="mt-4 space-y-4">
            {activeContent.sections.length > 0 ? (
              activeContent.sections.map((section) => (
                <div key={section.title} className="rounded-[24px] border border-stone-200 bg-white p-3 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-base font-black text-stone-900">{section.title}</h2>
                      <p className="mt-1 text-[12px] text-stone-500">{section.note}</p>
                    </div>
                    <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-600">
                      {section.items.length} styles
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    {section.items.map((item) => (
                      <Link
                        key={item.id || item.slug}
                        href={`/categories/${encodeURIComponent(item.slug || item.id || item.name.toLowerCase())}`}
                        className="block rounded-[20px] border border-stone-200 bg-stone-50 p-2 active:scale-98 transition-transform"
                      >
                        <div className={`relative h-24 overflow-hidden rounded-[16px] bg-gradient-to-br ${item.gradient} p-3`}>
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              unoptimized
                              className="object-cover rounded-[16px]"
                            />
                          ) : (
                            <div className="absolute inset-0 border border-white/50" />
                          )}
                          <div className="relative flex h-full flex-col justify-between z-10">
                            <span className="w-fit rounded-full bg-white/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-stone-800 shadow-xs">
                              {item.badge}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <h3 className="text-sm font-bold text-stone-900">{item.name}</h3>
                          <p className="mt-0.5 text-[11px] leading-4 text-stone-500 line-clamp-2">{item.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center bg-white rounded-3xl border border-stone-200 p-6 space-y-2">
                <p className="text-xs font-bold text-stone-800">No categories found in "{tabConfigs[activeTab].title}"</p>
                <p className="text-[11px] text-stone-500">
                  Go to Admin CMS &gt; Categories to create categories.
                </p>
              </div>
            )}
          </section>
        )}

        {/* Bottom Ideas Section */}
        <section className="mt-4 rounded-[24px] border border-dashed border-[#facc15]/70 bg-[#fffdf5] p-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-sm font-black text-stone-900">Want more ideas?</p>
              <p className="mt-1 text-[11px] text-stone-600">We can add mood boards, new arrivals, or festive edit next.</p>
            </div>
            <button className="rounded-full bg-stone-950 px-3 py-2 text-[11px] font-semibold text-white">
              See more
            </button>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
