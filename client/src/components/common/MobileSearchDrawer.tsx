'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, TrendingUp, Sparkles, ChevronRight, Clock, ArrowRight, Trash2 } from 'lucide-react';
import { fetchProductsAPI } from '@/lib/api/catalog';
import { ProductItem } from '@/lib/products/types';
import { formatImageUrl } from '@/lib/api/client';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const TRENDING_TAGS = [
  'Anime Hoodie',
  'Cyberpunk Tee',
  'Hand Painted Kurta',
  'Printed Art',
  'Thread Work',
  'Marvel Hoodie',
  'Oversized Shirt',
];

const RECENT_KEY = 'batalabandi_recent_searches';

export default function MobileSearchDrawer({ isOpen, onClose }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState<ProductItem[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoadingProducts(true);
      try {
        const prods = await fetchProductsAPI();
        if (prods && prods.length > 0) {
          setAllProducts(prods);
        }
      } catch (err) {
        console.log('Failed to fetch search dataset');
      } finally {
        setIsLoadingProducts(false);
      }
    }
    if (isOpen) {
      loadData();
      setTimeout(() => inputRef.current?.focus(), 300);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(RECENT_KEY);
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch (e) {}
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const next = [term.trim(), ...recentSearches.filter((s) => s.toLowerCase() !== term.toLowerCase())].slice(0, 8);
    setRecentSearches(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(RECENT_KEY);
    }
  };

  const handleSelectTag = (tag: string) => {
    setQuery(tag);
    saveRecentSearch(tag);
  };

  const handleSeeAll = () => {
    if (query.trim()) {
      saveRecentSearch(query.trim());
      onClose();
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleProductClick = (productId: string) => {
    if (query.trim()) saveRecentSearch(query.trim());
    onClose();
  };

  const searchResults = query.trim()
    ? allProducts.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.collectionName?.toLowerCase().includes(q) ||
          p.themeName?.toLowerCase().includes(q) ||
          p.subtitle?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
        );
      })
    : [];

  const topResults = searchResults.slice(0, 6);
  const hasMore = searchResults.length > 6;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/70 backdrop-blur-sm flex flex-col justify-end animate-in fade-in duration-200 font-sans">
      {/* Backdrop overlay trigger to close */}
      <div className="flex-1" onClick={onClose} />

      {/* Slide-Up Bottom Drawer Card */}
      <div className="bg-white rounded-t-3xl max-h-[85vh] h-[85vh] flex flex-col w-full shadow-2xl border-t border-stone-200 animate-in slide-in-from-bottom duration-300">
        
        {/* Drawer Drag Bar Header */}
        <div className="p-3 pb-2 flex flex-col items-center">
          <div className="w-12 h-1 bg-stone-300 rounded-full mb-2" />
          <div className="w-full flex items-center justify-between px-2">
            <h3 className="text-sm font-black text-stone-900 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500" /> Instant Search
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Input Field Bar */}
        <div className="px-4 py-2">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-stone-400" />
            <input
              ref={inputRef}
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && query.trim()) {
                  saveRecentSearch(query.trim());
                  onClose();
                  router.push(`/products?search=${encodeURIComponent(query.trim())}`);
                }
              }}
              placeholder="Search by product, anime, painted, hoodie, SKU..."
              className="w-full bg-stone-100 border border-stone-200/80 rounded-2xl pl-10 pr-9 py-3 text-xs text-stone-900 font-semibold placeholder:text-stone-400 outline-none focus:border-yellow-400 focus:bg-white transition"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 p-1 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Drawer Body Scroll Area */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-5 custom-scrollbar">
          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-stone-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-stone-400" /> Recent Searches
                </span>
                <button
                  onClick={clearRecentSearches}
                  className="text-[10px] font-bold text-red-400 hover:text-red-600 flex items-center gap-0.5 transition"
                >
                  <Trash2 className="w-2.5 h-2.5" /> Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSelectTag(term)}
                    className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold rounded-xl transition flex items-center gap-1"
                  >
                    <Clock className="w-2.5 h-2.5 text-stone-400" />
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Search Tags */}
          {!query && (
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-amber-600" /> Trending Search Tags
              </span>
              <div className="flex flex-wrap gap-2">
                {TRENDING_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleSelectTag(tag)}
                    className="px-3 py-1.5 bg-yellow-100/70 hover:bg-yellow-200 border border-yellow-300/60 text-stone-950 text-xs font-bold rounded-xl transition shadow-2xs"
                  >
                    ⚡ {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Browse All Products Link */}
          {!query && (
            <Link
              href="/products"
              onClick={onClose}
              className="flex items-center justify-between p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl transition hover:bg-amber-100"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-200/60 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-stone-900">Browse All Products</h4>
                  <p className="text-[10px] text-stone-500 font-semibold">{allProducts.length} items available</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-amber-700" />
            </Link>
          )}

          {/* Loading Shimmer */}
          {query.trim() && isLoadingProducts && (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse flex items-center gap-3 p-2.5 bg-stone-50 rounded-2xl">
                  <div className="w-12 h-12 bg-stone-200 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="w-3/4 h-3 bg-stone-200 rounded" />
                    <div className="w-1/2 h-2.5 bg-stone-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Live Search Results */}
          {query.trim() && !isLoadingProducts && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold text-stone-900">
                  Results for &ldquo;{query}&rdquo;
                </span>
                <span className="text-[10px] font-bold text-stone-400">
                  {searchResults.length} items found
                </span>
              </div>

              {topResults.length > 0 ? (
                <div className="space-y-2">
                  {topResults.map((p) => {
                    const thumbnail = formatImageUrl(
                      p.thumbnail ||
                        p.images?.[0] ||
                        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80'
                    );

                    const discount =
                      p.compareAtPrice && p.compareAtPrice > p.price
                        ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)
                        : null;

                    return (
                      <Link
                        key={p.id}
                        href={`/product/${p.id}`}
                        onClick={() => handleProductClick(p.id)}
                        className="flex items-center justify-between p-2.5 bg-stone-50 hover:bg-yellow-50/60 border border-stone-200/80 rounded-2xl transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl bg-stone-200 overflow-hidden flex-shrink-0 border border-stone-200">
                            <Image src={thumbnail} alt="" fill unoptimized className="object-cover" />
                            {discount && (
                              <span className="absolute bottom-0 left-0 bg-yellow-400 text-[7px] font-black text-stone-900 px-1 py-px">
                                {discount}%
                              </span>
                            )}
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-stone-900 line-clamp-1">{p.title}</h4>
                            <span className="text-[10px] text-stone-400 font-semibold">{p.category}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-right">
                          <div>
                            <span className="text-xs font-black text-stone-950 font-mono">
                              ₹{p.price.toLocaleString('en-IN')}
                            </span>
                            {p.compareAtPrice && p.compareAtPrice > p.price && (
                              <span className="block text-[9px] font-bold text-stone-400 line-through font-mono">
                                ₹{p.compareAtPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 text-stone-400" />
                        </div>
                      </Link>
                    );
                  })}

                  {/* See All Results Button */}
                  {hasMore && (
                    <button
                      onClick={handleSeeAll}
                      className="w-full py-3 bg-stone-900 text-white text-xs font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-stone-800 active:scale-98 transition-all shadow-sm"
                    >
                      See All {searchResults.length} Results
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ) : (
                <div className="py-10 text-center space-y-2">
                  <div className="text-3xl">🔍</div>
                  <p className="text-xs font-bold text-stone-700">No garments found matching &ldquo;{query}&rdquo;</p>
                  <p className="text-[11px] text-stone-400">Try searching for &ldquo;Hoodie&rdquo;, &ldquo;Painted&rdquo;, &ldquo;Anime&rdquo;, or &ldquo;Kurta&rdquo;</p>
                  <Link
                    href="/products"
                    onClick={onClose}
                    className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 mt-2"
                  >
                    Browse All Products <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
