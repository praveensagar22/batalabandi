'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import DesktopHeader from '@/components/DesktopHeader';
import DesktopFooter from '@/components/DesktopFooter';
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

function transformBackendCategories(apiCategories: Category[]): Record<TabKey, TabData> {
  const result: Record<TabKey, TabData> = {
    men: { ...tabConfigs.men, sections: [] },
    women: { ...tabConfigs.women, sections: [] },
    unisex: { ...tabConfigs.unisex, sections: [] },
  };

  (['men', 'women', 'unisex'] as TabKey[]).forEach((tabKey) => {
    const targetGender = tabKey === 'men' ? 'Men' : tabKey === 'women' ? 'Women' : 'Unisex';

    const matchedCategories = apiCategories.filter((c) => {
      if (c.status === 'Inactive') return false;
      if (tabKey === 'unisex') {
        return c.gender === 'Unisex' || c.gender === 'All' || !c.gender;
      }
      return c.gender === targetGender || c.gender === 'All' || c.gender === 'Unisex';
    });

    if (matchedCategories.length === 0) {
      matchedCategories.push(...apiCategories.filter((c) => c.status !== 'Inactive'));
    }

    const parents = matchedCategories.filter((c) => c.level === 1);
    const children = matchedCategories.filter((c) => c.level === 2);

    const sections: CategorySection[] = [];

    if (parents.length > 0) {
      parents.forEach((parent) => {
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
    <div className="min-h-screen bg-[#faf9f6] font-sans selection:bg-amber-400 selection:text-stone-950">
      {/* ===== DESKTOP HEADER (>= 768px) ===== */}
      <div className="hidden md:block">
        <DesktopHeader />
      </div>

      {/* ===== MOBILE HEADER (< 768px) ===== */}
      <div className="block md:hidden">
        <Header activeTab="all" />
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* Breadcrumbs for Desktop */}
        <div className="hidden md:flex items-center gap-2 text-xs text-stone-400 font-semibold mb-6">
          <Link href="/" className="hover:text-stone-950 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-900 font-bold">Categories & Styles</span>
        </div>

        {/* Top Header Card */}
        <section className="rounded-3xl border border-stone-200 bg-white/90 p-4 md:p-6 shadow-xs backdrop-blur">
          <div className={`rounded-2xl bg-gradient-to-br ${activeContent.accent} p-4 md:p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.3em] text-stone-600">Curated Styles</p>
                <h1 className="mt-1 text-xl md:text-3xl font-black text-stone-950">{activeContent.title} Collection</h1>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 shadow-sm">
                <Sparkles className="h-6 w-6 text-amber-700" />
              </div>
            </div>
            <p className="mt-2 text-xs md:text-sm text-stone-600 font-medium">{activeContent.subtitle}</p>
          </div>

          {/* Men / Women / Unisex Pill Tabs */}
          <div className="mt-4 flex rounded-2xl border border-stone-200 bg-stone-50 p-1.5 max-w-md">
            {(['men', 'women', 'unisex'] as TabKey[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 rounded-xl px-4 py-2.5 text-xs md:text-sm font-black transition-all ${
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
          <div className="mt-6">
            <CategoryPageSkeleton />
          </div>
        ) : (
          /* Sections Grid */
          <section className="mt-6 space-y-8">
            {activeContent.sections.length > 0 ? (
              activeContent.sections.map((section) => (
                <div key={section.title} className="rounded-3xl border border-stone-200 bg-white p-5 md:p-8 shadow-xs">
                  <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-4 mb-6">
                    <div>
                      <h2 className="text-lg md:text-xl font-black text-stone-900">{section.title}</h2>
                      <p className="mt-0.5 text-xs md:text-sm text-stone-500 font-medium">{section.note}</p>
                    </div>
                    <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-stone-600 border border-stone-200/60">
                      {section.items.length} styles
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {section.items.map((item) => (
                      <Link
                        key={item.id || item.slug}
                        href={`/categories/${encodeURIComponent(item.slug || item.id || item.name.toLowerCase())}`}
                        className="block rounded-2xl md:rounded-3xl border border-stone-200/90 bg-stone-50/50 p-3 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all group"
                      >
                        <div className={`relative h-32 md:h-44 overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br ${item.gradient} p-3`}>
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              unoptimized
                              className="object-cover rounded-xl md:rounded-2xl group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="absolute inset-0 border border-white/50" />
                          )}
                          <div className="relative flex h-full flex-col justify-between z-10">
                            <span className="w-fit rounded-full bg-stone-950/80 backdrop-blur-md px-2.5 py-0.5 text-[9px] md:text-[10px] font-extrabold text-white shadow-xs">
                              {item.badge}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 p-1">
                          <h3 className="text-xs md:text-sm font-extrabold text-stone-900 group-hover:text-amber-600 transition-colors">
                            {item.name}
                          </h3>
                          <p className="mt-0.5 text-[11px] md:text-xs leading-relaxed text-stone-500 line-clamp-2 font-medium">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-2 max-w-md mx-auto">
                <p className="text-sm font-bold text-stone-800">No categories found in "{tabConfigs[activeTab].title}"</p>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Mobile Dock Navigation */}
      <div className="block md:hidden">
        <BottomNav />
      </div>

      {/* ===== DESKTOP FOOTER (>= 768px) ===== */}
      <div className="hidden md:block">
        <DesktopFooter />
      </div>
    </div>
  );
}
