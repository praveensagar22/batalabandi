'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { fetchCollectionsAPI } from '@/lib/api/catalog';
import { Collection } from '@/lib/collections/types';

interface ShopByArtProps {
  onTabChange?: (tabId: string) => void;
}

const FALLBACK_COLLECTIONS: Partial<Collection>[] = [
  {
    id: 'painted',
    name: 'Painted',
    slug: 'painted',
    shortDescription: 'Hand Crafted Art',
    coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'thread',
    name: 'Thread Work',
    slug: 'thread',
    shortDescription: 'Detailed Embroidery',
    coverImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'printed',
    name: 'Printed',
    slug: 'printed',
    shortDescription: 'Modern Digital Art',
    coverImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
  },
];

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=600&q=80',
];

export default function ShopByArt({ onTabChange }: ShopByArtProps) {
  const router = useRouter();
  const [collections, setCollections] = useState<Partial<Collection>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCollections() {
      try {
        const data = await fetchCollectionsAPI();
        if (data && data.length > 0) {
          const activeCols = data.filter((c) => c.status === 'Active' || (c.status as string) !== 'Draft');
          setCollections(activeCols.length > 0 ? activeCols : data);
        } else {
          setCollections(FALLBACK_COLLECTIONS);
        }
      } catch (err) {
        console.log('Error fetching collections for ShopByArt, using fallback data:', err);
        setCollections(FALLBACK_COLLECTIONS);
      } finally {
        setIsLoading(false);
      }
    }
    loadCollections();
  }, []);

  const handleCardClick = (col: Partial<Collection>) => {
    const slug = col.slug || col.id || col.name?.toLowerCase().replace(/\s+/g, '-');
    if (onTabChange && slug) {
      onTabChange(slug);
    } else if (slug) {
      router.push(`/categories/${slug}`);
    }
  };

  return (
    <section className="px-4 pt-4 pb-2 font-sans">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <h3 className="text-[15px] font-bold text-stone-900 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
          Shop by Art
        </h3>
        <button
          onClick={() => router.push('/products')}
          className="text-[11px] font-semibold text-stone-500 flex items-center gap-1 hover:text-amber-700 transition-colors cursor-pointer"
        >
          See All <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Cards Scroll Container */}
      <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
        <div className="flex gap-3 min-w-max pb-1">
          {isLoading
            ? [1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className="w-[155px] min-w-[155px] h-[160px] rounded-2xl bg-stone-100 animate-pulse border border-stone-200/60"
                />
              ))
            : collections.map((art, idx) => {
                const imageUrl = art.coverImage || art.bannerImage || DEFAULT_IMAGES[idx % DEFAULT_IMAGES.length];

                return (
                  <div
                    key={art.id || art.slug || idx}
                    onClick={() => handleCardClick(art)}
                    className="w-[155px] min-w-[155px] h-[160px] rounded-2xl overflow-hidden relative group cursor-pointer shadow-xs border border-stone-200/80 active:scale-95 transition-all duration-300 bg-stone-100"
                  >
                    {/* Clear, High-Quality Cover Image */}
                    <Image
                      src={imageUrl}
                      alt={art.name || 'Collection'}
                      fill
                      unoptimized
                      priority={idx < 3}
                      className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* Top Right Action Arrow Badge */}
                    <div className="absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs text-stone-900 flex items-center justify-center shadow-xs group-hover:bg-amber-400 transition-colors">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>

                    {/* Minimal Bottom Gradient for Crisp Text Readability */}
                    <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 pt-8 flex flex-col justify-end">
                      <p className="text-[13px] font-black text-white leading-tight line-clamp-1">
                        {art.name}
                      </p>
                      <p className="text-[10px] text-amber-300 font-bold truncate mt-0.5">
                        {art.shortDescription || (art.productsCount ? `${art.productsCount} Items` : 'Collection')}
                      </p>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
}
