'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { fetchBannersAPI } from '@/lib/api/catalog';

const defaultBanners = [
  {
    id: 'hero-1',
    title: 'Hand Painted Masterpiece Series',
    subtitle: '350 GSM Cotton • Artisan Painted Drops',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=85',
    targetLink: '/products?search=Painted',
    ctaText: 'Shop Hand Painted',
  },
  {
    id: 'hero-2',
    title: 'Cyberpunk & Anime Streetwear',
    subtitle: 'Futuristic Graphic Drops & Kanji Hoodies',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1600&q=85',
    targetLink: '/products?search=Cyber',
    ctaText: 'Shop Streetwear',
  },
  {
    id: 'hero-3',
    title: 'Ethnic Thread Work & Kantha Art',
    subtitle: 'Traditional Indian Art Meets Modern Streetwear',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1600&q=85',
    targetLink: '/products',
    ctaText: 'Discover Art',
  },
];

export default function DesktopHeroBanner() {
  const [banners, setBanners] = useState(defaultBanners);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    async function loadBanners() {
      try {
        const fetched = await fetchBannersAPI();
        if (fetched && fetched.length > 0) {
          const formatted = fetched.map((b) => ({
            id: b.id,
            title: b.title,
            subtitle: b.subtitle || 'Premium Handcrafted Apparel',
            image: b.image,
            targetLink: b.targetLink || '/products',
            ctaText: b.ctaText || 'Shop Drop',
          }));
          setBanners(formatted);
        }
      } catch (err) {
        console.warn('Using default full-screen hero banners');
      }
    }
    loadBanners();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [banners.length]);

  const active = banners[currentSlide] || banners[0];

  return (
    <section className="relative w-full h-[480px] lg:h-[540px] bg-stone-950 font-sans overflow-hidden select-none">
      {/* Full Bleed Hero Image */}
      {banners.map((b, idx) => (
        <div
          key={b.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={b.image}
            alt={b.title}
            fill
            unoptimized
            priority={idx === 0}
            className="object-cover object-top"
          />

          {/* Minimal Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
        </div>
      ))}

      {/* Minimalist Overlay Content Card (Bottom Left) */}
      <div className="absolute bottom-10 left-8 lg:bottom-14 lg:left-14 z-20 max-w-xl space-y-4">
        <div className="space-y-2">
          <span className="inline-block text-[10px] md:text-xs font-semibold uppercase tracking-[0.3em] text-stone-300 bg-stone-950/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
            ✦ Artisan Apparel Drop 2026 ✦
          </span>
          <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {active.title}
          </h2>
          <p className="text-xs lg:text-sm text-stone-200 font-medium tracking-wide max-w-md">
            {active.subtitle}
          </p>
        </div>

        <div className="pt-1">
          <Link
            href={active.targetLink}
            className="inline-flex items-center gap-2.5 bg-white hover:bg-stone-100 active:scale-95 text-stone-950 px-7 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest shadow-2xl transition-all"
          >
            <span>{active.ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Previous / Next Arrow Controls */}
      <button
        onClick={() =>
          setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1))
        }
        aria-label="Previous Slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-stone-950/30 hover:bg-stone-950/80 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-all active:scale-90"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
        aria-label="Next Slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-stone-950/30 hover:bg-stone-950/80 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-all active:scale-90"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Minimal Dot Indicators (Bottom Right) */}
      <div className="absolute bottom-10 right-8 lg:bottom-14 lg:right-14 z-20 flex items-center gap-2 bg-stone-950/60 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10">
        {banners.map((b, idx) => (
          <button
            key={b.id}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentSlide
                ? 'w-8 bg-white'
                : 'w-2 bg-white/40 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
