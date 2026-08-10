'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchBannersAPI } from '@/lib/api/catalog';
import { BannerItem } from '@/lib/marketing/types';

export default function HeroBanner() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBanners() {
      try {
        const data = await fetchBannersAPI();
        if (data && data.length > 0) {
          const activeBanners = data.filter((b) => b.status === 'Active');
          if (activeBanners.length > 0) {
            setBanners(activeBanners);
          }
        }
      } catch (err) {
        console.log('Using fallback hero banner');
      } finally {
        setIsLoading(false);
      }
    }
    loadBanners();
  }, []);

  // Auto-advance carousel every 5 seconds if multiple banners exist
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (isLoading || banners.length === 0) {
    return (
      <section className="px-4 pt-4 pb-2 font-sans">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-stone-900 to-stone-950 min-h-[190px] p-5 shadow-xs border border-stone-800 text-white flex flex-col justify-between">
          <div className="space-y-1 max-w-[70%]">
            <span className="inline-block text-[10px] font-extrabold tracking-widest text-yellow-400 uppercase">
              New Collection 2026
            </span>
            <h2 className="text-xl font-black text-white leading-snug">
              Cyberpunk Streetwear <br /> & Artisan Apparel
            </h2>
            <p className="text-[11px] text-stone-300 italic font-medium">
              Hand-crafted heavy cotton garments
            </p>
          </div>
          <div>
            <Link
              href="/categories"
              className="inline-flex items-center gap-1.5 bg-[#facc15] text-stone-950 text-xs font-black px-4 py-2.5 rounded-xl shadow-md"
            >
              SHOP NOW <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    <section className="px-4 pt-4 pb-2 font-sans">
      <div className="relative rounded-3xl overflow-hidden min-h-[195px] max-h-[220px] shadow-md border border-stone-200/80 group">
        
        {/* Background Banner Image */}
        <Image
          src={currentBanner.image}
          alt={currentBanner.title}
          fill
          unoptimized
          priority
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/60 to-transparent p-5 flex flex-col justify-between z-10">
          
          <div className="space-y-1 max-w-[75%]">
            <span className="inline-flex items-center gap-1 text-[10px] font-extrabold tracking-widest text-yellow-400 uppercase bg-stone-950/60 backdrop-blur-md px-2.5 py-0.5 rounded-md">
              <Sparkles className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              {currentBanner.position || 'Featured Drop'}
            </span>
            <h2 className="text-xl font-black text-white leading-tight line-clamp-2">
              {currentBanner.title}
            </h2>
            {currentBanner.subtitle && (
              <p className="text-[11px] text-stone-300 font-medium line-clamp-2 leading-snug">
                {currentBanner.subtitle}
              </p>
            )}
          </div>

          <div>
            <Link
              href={currentBanner.targetLink || '/categories'}
              className="inline-flex items-center gap-1.5 bg-[#facc15] hover:bg-[#eab308] active:scale-95 text-stone-950 text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-md"
            >
              <span>{currentBanner.ctaText || 'Shop Collection'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        {banners.length > 1 && (
          <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 bg-stone-950/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-stone-800">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`w-2 h-2 rounded-full transition-all ${
                  currentIndex === idx ? 'bg-yellow-400 w-4' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
