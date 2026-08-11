'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Heart, ShieldCheck, Shirt, Award, Users, ChevronRight, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import DesktopHeader from '@/components/DesktopHeader';
import DesktopFooter from '@/components/DesktopFooter';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#faf9f6] font-sans text-stone-900 selection:bg-amber-400 selection:text-stone-950">
      {/* ===== DESKTOP HEADER ===== */}
      <div className="hidden md:block">
        <DesktopHeader />
      </div>

      {/* ===== MOBILE HEADER ===== */}
      <div className="block md:hidden">
        <Header activeTab="all" />
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-14">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-stone-400 font-semibold mb-6">
          <Link href="/" className="hover:text-stone-950 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-900 font-bold">About Us</span>
        </div>

        {/* Hero Section */}
        <div className="bg-stone-950 text-white rounded-3xl p-8 md:p-14 border border-stone-800 shadow-2xl mb-12 relative overflow-hidden text-center md:text-left">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-400 bg-stone-900/80 border border-amber-400/20 px-4 py-1.5 rounded-full">
              <Sparkles className="w-4 h-4 fill-amber-400 text-amber-400" />
              Artisan Streetwear Movement
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black font-serif text-white leading-tight">
              Where Traditional Indian Craft Meets Modern Street Culture.
            </h1>
            
            <p className="text-sm md:text-base text-stone-300 font-medium leading-relaxed">
              <strong>BatalaBandi (బట్టల బండి)</strong> was born out of a passion for authentic handcrafted clothing—fusing traditional block prints, Kantha embroidery, and bio-washed heavy organic cotton into limited-edition streetwear.
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-600 flex items-center justify-center">
              <Shirt className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-stone-950">Bio-Washed Cotton</h3>
            <p className="text-xs text-stone-600 font-medium leading-relaxed">
              We exclusively source 240+ GSM super-combed organic cotton that is pre-shrunk, bio-washed, and built to maintain shape drop after drop.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-600 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-stone-950">Artisan Empowerment</h3>
            <p className="text-xs text-stone-600 font-medium leading-relaxed">
              Every drop directly supports skilled master weavers, block printers, and Kantha stitch artists across Telangana and South India.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-600 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-stone-950">Limited Micro-Drops</h3>
            <p className="text-xs text-stone-600 font-medium leading-relaxed">
              We reject mass fast fashion. Our collections are released in small, limited batches to preserve uniqueness and eliminate waste.
            </p>
          </div>
        </div>

        {/* Brand Story Details */}
        <div className="bg-white rounded-3xl p-8 md:p-12 border border-stone-200/90 shadow-2xs space-y-6 text-xs md:text-sm text-stone-700 leading-relaxed">
          <div className="space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              The Name & Legacy
            </span>
            <h2 className="text-xl md:text-2xl font-black text-stone-950 font-serif">
              What Does &ldquo;BatalaBandi&rdquo; Mean?
            </h2>
            <p>
              In Telugu, <strong>&ldquo;బట్టల బండి&rdquo; (Batala Bandi)</strong> translates to the iconic &ldquo;Clothing Cart&rdquo;—a staple of local Indian culture where authentic textiles and handcrafted wear were brought directly to neighborhood doorsteps.
            </p>
            <p>
              We took that timeless cultural spirit and elevated it into a modern streetwear brand for a modern generation that demands premium quality, bold oversized silhouettes, and deep connection to Indian roots.
            </p>
          </div>

          <hr className="border-stone-100" />

          <div className="space-y-3">
            <h2 className="text-xl font-black text-stone-950 font-serif">Our Quality Guarantee</h2>
            <p>
              When you wear a BatalaBandi hoodie or oversized tee, you feel the weight of genuine 240+ GSM fabric, reinforced double-needle stitching, vibrant non-toxic prints, and comfortable relaxed fits tailored for everyday wear.
            </p>
          </div>

          {/* CTA Banner */}
          <div className="mt-8 bg-stone-950 text-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <h4 className="text-sm font-black text-white">Ready to explore our latest drop?</h4>
              <p className="text-xs text-stone-400 font-medium">Browse our new handcrafted menswear, women&apos;s tops, and unisex streetwear.</p>
            </div>
            <Link
              href="/products"
              className="px-6 py-3 bg-[#facc15] text-stone-950 text-xs font-black rounded-xl hover:bg-amber-400 transition shrink-0 flex items-center gap-1.5"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      {/* Mobile Dock Navigation */}
      <div className="block md:hidden">
        <BottomNav />
      </div>

      {/* ===== DESKTOP FOOTER ===== */}
      <div className="hidden md:block">
        <DesktopFooter />
      </div>
    </div>
  );
}
