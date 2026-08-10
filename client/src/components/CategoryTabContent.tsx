'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, Plus, Star, Palette, Scissors, Printer, Filter, Sparkles } from "lucide-react";
import TrustFeatures from "@/components/TrustFeatures";
import { fetchProductsAPI, fetchBannersAPI } from "@/lib/api/catalog";
import { ProductItem } from "@/lib/products/types";
import { BannerItem } from "@/lib/marketing/types";

interface CategoryTabContentProps {
  activeTab: string;
  onBackToAll: () => void;
}

const tabMeta: Record<string, {
  title: string;
  subtitle: string;
  icon: typeof Palette;
  bannerGradient: string;
}> = {
  painted: {
    title: "Hand Painted Collection",
    subtitle: "Artisanal hand-crafted patterns & floral strokes by master Indian artists",
    icon: Palette,
    bannerGradient: "from-amber-300 via-yellow-200 to-yellow-100",
  },
  thread: {
    title: "Thread Work Collection",
    subtitle: "Intricate embroidery, zari work & traditional Kantha stitch detailing",
    icon: Scissors,
    bannerGradient: "from-yellow-200 via-amber-100 to-yellow-50",
  },
  printed: {
    title: "Printed Art Collection",
    subtitle: "Authentic block prints, Ajrakh motifs & vibrant contemporary designs",
    icon: Printer,
    bannerGradient: "from-orange-200 via-amber-100 to-yellow-100",
  },
};

export default function CategoryTabContent({ activeTab, onBackToAll }: CategoryTabContentProps) {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categoryBanner, setCategoryBanner] = useState<BannerItem | null>(null);
  const [favs, setFavs] = useState<string[]>([]);
  const currentMeta = tabMeta[activeTab] || tabMeta.painted;
  const Icon = currentMeta.icon;

  useEffect(() => {
    async function loadData() {
      try {
        const allProds = await fetchProductsAPI();
        if (allProds && allProds.length > 0) {
          const tabLower = activeTab.toLowerCase();
          // Strict filtering per selected Art Style / Collection
          const filtered = allProds.filter((p) => {
            const matchCol = p.collectionName?.toLowerCase().includes(tabLower);
            const matchTheme = p.themeName?.toLowerCase().includes(tabLower);
            const matchCat = p.category?.toLowerCase().includes(tabLower);
            const matchType = p.productType?.toLowerCase().includes(tabLower);
            const matchTitle = p.title?.toLowerCase().includes(tabLower);
            return matchCol || matchTheme || matchCat || matchType || matchTitle;
          });
          setProducts(filtered);
        }

        // Fetch category banner from Marketing API if available
        const banners = await fetchBannersAPI();
        if (banners && banners.length > 0) {
          const matchedBanner = banners.find(
            (b) =>
              b.status === 'Active' &&
              (b.position === 'Category Top' || b.title.toLowerCase().includes(activeTab))
          );
          if (matchedBanner) setCategoryBanner(matchedBanner);
        }
      } catch (err) {
        console.log("Using fallback tab products");
      }
    }
    loadData();
  }, [activeTab]);

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavs((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  return (
    <div className="px-4 pt-4 pb-2 animate-fadeIn font-sans">
      {/* Dynamic Category Top Banner */}
      {categoryBanner ? (
        <div className="relative rounded-3xl overflow-hidden min-h-[160px] shadow-sm border border-stone-200 mb-4 group">
          <Image
            src={categoryBanner.image}
            alt={categoryBanner.title}
            fill
            unoptimized
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/60 to-transparent p-4 flex flex-col justify-between z-10 text-white">
            <div className="flex items-center justify-between">
              <button
                onClick={onBackToAll}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-900 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-2xs hover:bg-white transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to All
              </button>
              <span className="text-[10px] font-black text-stone-950 bg-[#facc15] px-2.5 py-1 rounded-full shadow-2xs">
                {products.length} Items Available
              </span>
            </div>

            <div>
              <h2 className="text-base font-black text-white leading-tight">
                {categoryBanner.title}
              </h2>
              {categoryBanner.subtitle && (
                <p className="text-[11px] text-stone-300 font-medium line-clamp-1 mt-0.5">
                  {categoryBanner.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Fallback Art Header Banner */
        <div className={`rounded-3xl p-5 bg-gradient-to-br ${currentMeta.bannerGradient} border border-yellow-300/60 shadow-xs relative overflow-hidden mb-4`}>
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onBackToAll}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-stone-900 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-2xs hover:bg-white transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to All
            </button>
            <span className="text-[10px] font-black text-stone-950 bg-[#facc15] px-3 py-1 rounded-full shadow-2xs">
              {products.length} Items Available
            </span>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/90 flex items-center justify-center flex-shrink-0 shadow-xs">
              <Icon className="w-5 h-5 text-amber-900" strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="text-lg font-black text-stone-950 leading-tight">
                {currentMeta.title}
              </h2>
              <p className="text-[11px] text-stone-700 mt-1 leading-snug font-medium">
                {currentMeta.subtitle}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter / Sort Bar */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-[12px] font-extrabold text-stone-900">
          Showing {products.length} {activeTab.toUpperCase()} Products
        </span>
        <button className="flex items-center gap-1 text-[11px] font-bold text-stone-700 bg-white border border-stone-200 px-3 py-1.5 rounded-xl shadow-2xs">
          <Filter className="w-3 h-3 text-stone-500" /> Filter
        </button>
      </div>

      {/* Filtered Product Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 mb-4">
          {products.map((p) => {
            const isFav = favs.includes(p.id);
            const imageSrc =
              p.thumbnail ||
              p.images?.[0] ||
              "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80";

            const discount =
              p.compareAtPrice && p.compareAtPrice > p.price
                ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)
                : null;

            return (
              <Link
                key={p.id}
                href={`/product/${p.id}`}
                className="bg-white rounded-2xl overflow-hidden shadow-2xs border border-stone-200/80 active:scale-98 transition-transform flex flex-col justify-between"
              >
                {/* Image Area */}
                <div className="h-[145px] bg-stone-100 relative overflow-hidden group">
                  <Image
                    src={imageSrc}
                    alt={p.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  <span className="absolute top-2 left-2 bg-stone-950/80 backdrop-blur-md text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md shadow-2xs">
                    {p.category}
                  </span>

                  {discount && (
                    <span className="absolute bottom-2 left-2 bg-yellow-400 text-stone-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow-2xs">
                      {discount}% OFF
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={(e) => toggleFav(p.id, e)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md shadow-xs flex items-center justify-center transition active:scale-90"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isFav ? "fill-red-500 text-red-500" : "text-stone-500"
                      }`}
                      strokeWidth={2.2}
                    />
                  </button>
                </div>

                {/* Info Area */}
                <div className="p-3 space-y-1 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[11px] font-extrabold text-stone-900 line-clamp-1 leading-snug">
                      {p.title}
                    </h4>
                    <p className="text-[10px] text-stone-400 font-medium line-clamp-1">
                      {p.collectionName || p.themeName || "Handcrafted Edition"}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[13px] font-black text-stone-950">
                        ₹{p.price.toLocaleString("en-IN")}
                      </span>
                      {p.compareAtPrice && p.compareAtPrice > p.price && (
                        <span className="text-[10px] font-bold text-stone-400 line-through">
                          ₹{p.compareAtPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
                      <div className="flex items-center gap-0.5 text-[10px] text-stone-700 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{p.rating || 4.9}</span>
                      </div>
                      <button
                        type="button"
                        aria-label="Add to cart"
                        className="w-7 h-7 rounded-full bg-[#facc15] hover:bg-[#eab308] active:scale-90 transition-all flex items-center justify-center shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5 text-stone-950" strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="py-12 text-center bg-white rounded-3xl border border-stone-200 p-6 space-y-2 mb-4">
          <p className="text-xs font-bold text-stone-800">No products found in "{activeTab.toUpperCase()}"</p>
          <p className="text-[11px] text-stone-500">
            Select "Painted", "Thread Work", or "Printed" collection when creating garments in the Admin CMS to show them here!
          </p>
        </div>
      )}

      <TrustFeatures />
    </div>
  );
}
