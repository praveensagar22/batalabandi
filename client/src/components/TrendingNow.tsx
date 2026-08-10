'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Heart, Plus, Star, Sparkles } from 'lucide-react';
import { fetchProductsAPI } from '@/lib/api/catalog';
import { ProductItem } from '@/lib/products/types';

export default function TrendingNow() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [favs, setFavs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProductsAPI();
        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (err) {
        console.log('Using fallback trending products');
      } finally {
        setIsLoading(false);
      }
    }
    loadProducts();
  }, []);

  const toggleFav = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavs((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };

  return (
    <section className="px-4 pt-4 pb-2 font-sans">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <h3 className="text-[15px] font-black text-stone-900 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" /> Trending Drops
        </h3>
        <Link
          href="/categories"
          className="text-[11px] font-bold text-stone-500 flex items-center gap-1 hover:text-stone-900 transition-colors"
        >
          See All <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Product Carousel */}
      <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
        <div className="flex gap-3 min-w-max pb-1">
          {products.map((p) => {
            const isFav = favs.includes(p.id);
            const imageSrc =
              p.thumbnail ||
              p.images?.[0] ||
              'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80';

            const discount =
              p.compareAtPrice && p.compareAtPrice > p.price
                ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)
                : null;

            return (
              <Link
                key={p.id}
                href={`/product/${p.id}`}
                className="w-[185px] min-w-[185px] bg-white rounded-3xl overflow-hidden shadow-xs border border-stone-200/80 active:scale-98 transition-all duration-200 flex flex-col justify-between"
              >
                {/* Image Area */}
                <div className="h-[155px] bg-stone-100 relative overflow-hidden group">
                  <Image
                    src={imageSrc}
                    alt={p.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Category Tag */}
                  <span className="absolute top-2 left-2 bg-stone-950/80 backdrop-blur-md text-white text-[9px] font-extrabold px-2 py-0.5 rounded-lg shadow-2xs">
                    {p.category || 'Drop'}
                  </span>

                  {/* Discount Badge */}
                  {discount && (
                    <span className="absolute bottom-2 left-2 bg-yellow-400 text-stone-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow-2xs">
                      {discount}% OFF
                    </span>
                  )}

                  {/* Heart Wishlist Trigger */}
                  <button
                    type="button"
                    onClick={(e) => toggleFav(p.id, e)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md shadow-xs flex items-center justify-center transition active:scale-90"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isFav ? 'fill-red-500 text-red-500' : 'text-stone-500'
                      }`}
                      strokeWidth={2.2}
                    />
                  </button>
                </div>

                {/* Info Area */}
                <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[11px] font-extrabold text-stone-900 line-clamp-1 leading-snug">
                      {p.title}
                    </h4>
                    <p className="text-[10px] text-stone-400 font-medium line-clamp-1">
                      {p.subtitle || p.collectionName || 'Premium Collection'}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[13px] font-black text-stone-950">
                        ₹{p.price.toLocaleString('en-IN')}
                      </span>
                      {p.compareAtPrice && p.compareAtPrice > p.price && (
                        <span className="text-[10px] font-bold text-stone-400 line-through">
                          ₹{p.compareAtPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
                      <div className="flex items-center gap-0.5 text-[10px] text-stone-700 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{p.rating || 4.9}</span>
                        <span className="text-stone-400 font-normal">
                          ({p.salesCount || 120})
                        </span>
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
      </div>
    </section>
  );
}
