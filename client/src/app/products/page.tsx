'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft, Heart, Plus, Check, Star, Search, X,
  SlidersHorizontal, ArrowUpDown, Sparkles,
} from 'lucide-react';
import { fetchProductsAPI } from '@/lib/api/catalog';
import { ProductItem } from '@/lib/products/types';
import { formatImageUrl } from '@/lib/api/client';
import { toggleWishlist, getWishlist, WishlistItem } from '@/lib/wishlist/store';
import { addToCart, getCart } from '@/lib/cart/store';
import { ProductGridSkeleton } from '@/components/common/Skeletons';

type SortOption = 'recommended' | 'lowToHigh' | 'highToLow' | 'rating' | 'newest';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'lowToHigh', label: 'Price: Low to High' },
  { value: 'highToLow', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'newest', label: 'Newest First' },
];

export default function AllProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [allProducts, setAllProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [favs, setFavs] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<string[]>([]);

  // Filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Bottom Sheets
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 2500); };

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        const data = await fetchProductsAPI();
        setAllProducts(data || []);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    async function loadStates() {
      const list = getWishlist();
      setFavs(list.map((i) => i.id));
      const cart = await getCart();
      setCartItems(cart.map((i) => i.productId));
    }
    loadStates();
  }, []);

  // Available filter values from products
  const availableCategories = useMemo(() => {
    const cats = new Set(allProducts.map((p) => p.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [allProducts]);

  const availableGenders = useMemo(() => {
    const genders = new Set(allProducts.map((p) => p.gender).filter(Boolean));
    return Array.from(genders).sort();
  }, [allProducts]);

  // Filter & Sort
  const processedProducts = useMemo(() => {
    let filtered = [...allProducts];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.collectionName?.toLowerCase().includes(q) ||
          p.themeName?.toLowerCase().includes(q) ||
          p.subtitle?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((p) => selectedCategories.includes(p.category));
    }

    // Gender
    if (selectedGenders.length > 0) {
      filtered = filtered.filter((p) => selectedGenders.includes(p.gender || ''));
    }

    // In Stock
    if (inStockOnly) {
      filtered = filtered.filter((p) => (p.stock || 0) > 0);
    }

    // Sort
    switch (sortBy) {
      case 'lowToHigh':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'highToLow':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdDate || 0).getTime() - new Date(a.createdDate || 0).getTime());
        break;
    }

    return filtered;
  }, [allProducts, searchQuery, selectedCategories, selectedGenders, inStockOnly, sortBy]);

  const toggleFav = (id: string, title: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const prod = allProducts.find((p) => p.id === id);
    if (!prod) return;

    const added = toggleWishlist({
      id: prod.id,
      title: prod.title,
      subtitle: prod.subtitle,
      price: prod.price,
      compareAtPrice: prod.compareAtPrice,
      image: prod.thumbnail || prod.images?.[0] || '',
      category: prod.category,
      collectionName: prod.collectionName,
      rating: prod.rating,
    });

    if (added) {
      setFavs((p) => [...p, id]);
      showToast(`Added "${title}" to Wishlist! ❤️`);
    } else {
      setFavs((p) => p.filter((x) => x !== id));
      showToast(`Removed "${title}" from Wishlist`);
    }
  };

  const handleCartClick = async (id: string, title: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (cartItems.includes(id)) {
      router.push('/cart');
      return;
    }

    const prod = allProducts.find((p) => p.id === id);
    if (!prod) return;

    await addToCart({
      productId: prod.id,
      title: prod.title,
      subtitle: prod.subtitle,
      price: prod.price,
      compareAtPrice: prod.compareAtPrice,
      image: prod.thumbnail || prod.images?.[0] || '',
      color: 'Standard',
      size: 'M',
      quantity: 1,
    });

    setCartItems((p) => [...p, id]);
    showToast(`Added "${title}" to Bag! 🛍️`);
  };

  const activeFilterCount =
    selectedCategories.length + selectedGenders.length + (inStockOnly ? 1 : 0);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleGender = (g: string) => {
    setSelectedGenders((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedGenders([]);
    setInStockOnly(false);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] font-sans pb-14">
      {/* Sticky Top Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-md mx-auto flex items-center gap-2 px-3 py-2.5">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 active:scale-90 transition shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search all products..."
              className="w-full bg-stone-100 border border-stone-200/80 rounded-xl pl-9 pr-8 py-2 text-xs text-stone-900 font-semibold placeholder:text-stone-400 outline-none focus:border-yellow-400 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="shrink-0 text-right">
            <span className="text-[10px] font-black text-stone-500 uppercase tracking-wider">
              {processedProducts.length}
            </span>
            <p className="text-[8px] font-bold text-stone-400 uppercase">items</p>
          </div>
        </div>

        {/* Quick Category Chips */}
        {availableCategories.length > 0 && (
          <div className="overflow-x-auto no-scrollbar px-3 pb-2">
            <div className="flex gap-1.5 min-w-max">
              <button
                onClick={() => setSelectedCategories([])}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition border ${
                  selectedCategories.length === 0
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                All
              </button>
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition border ${
                    selectedCategories.includes(cat)
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-2 pt-2.5">
        {isLoading ? (
          <ProductGridSkeleton count={6} />
        ) : processedProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {processedProducts.map((p) => {
              const isFav = favs.includes(p.id);
              const isInCart = cartItems.includes(p.id);
              const imageSrc = formatImageUrl(
                p.thumbnail || p.images?.[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80'
              );
              const discount =
                p.compareAtPrice && p.compareAtPrice > p.price
                  ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100)
                  : null;

              return (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="bg-white rounded-xl overflow-hidden border border-stone-200/80 shadow-xs flex flex-col justify-between active:scale-[0.98] transition-all"
                >
                  {/* Image */}
                  <div className="relative h-[175px] bg-stone-100 overflow-hidden group">
                    <Image
                      src={imageSrc}
                      alt={p.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    <span className="absolute top-2 left-2 bg-stone-950/80 backdrop-blur-md text-white text-[8px] font-extrabold px-2 py-0.5 rounded-lg uppercase">
                      {p.category || 'Drop'}
                    </span>

                    {discount && (
                      <span className="absolute bottom-2 left-2 bg-yellow-400 text-stone-950 text-[9px] font-black px-1.5 py-0.5 rounded shadow-2xs">
                        {discount}% OFF
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={(e) => toggleFav(p.id, p.title, e)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md shadow-xs flex items-center justify-center transition active:scale-90"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${isFav ? 'fill-red-500 text-red-500' : 'text-stone-500'}`}
                        strokeWidth={2.2}
                      />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-2.5 space-y-1 flex-1 flex flex-col justify-between">
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
                          <span className="text-[9.5px] font-bold text-stone-400 line-through">
                            ₹{p.compareAtPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
                        <div className="flex items-center gap-0.5 bg-stone-50 px-1 py-0.5 rounded text-[9.5px] font-bold text-stone-800">
                          <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                          <span>{p.rating || 4.8}</span>
                          <span className="text-stone-400 font-normal">({p.salesCount || 120})</span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleCartClick(p.id, p.title, e)}
                          aria-label="Add to cart"
                          className={`w-6.5 h-6.5 rounded-full flex items-center justify-center transition-all shadow-2xs active:scale-90 ${
                            isInCart
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#facc15] text-stone-950 hover:bg-[#eab308]'
                          }`}
                        >
                          {isInCart ? (
                            <Check className="w-3.5 h-3.5" strokeWidth={3} />
                          ) : (
                            <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center space-y-3">
            <div className="text-4xl">🔍</div>
            <h3 className="text-sm font-black text-stone-900">No Products Found</h3>
            <p className="text-xs text-stone-400 font-semibold">
              {searchQuery
                ? `No results for "${searchQuery}". Try a different search term.`
                : 'No products match your current filters.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                clearAllFilters();
              }}
              className="px-4 py-2 bg-stone-900 text-white text-xs font-black rounded-xl"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </main>

      {/* Sticky Bottom Sort | Filter Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-stone-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <div className="max-w-md mx-auto flex">
          <button
            onClick={() => setIsSortOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black text-stone-800 uppercase tracking-wider border-r border-stone-200 active:bg-stone-50 transition"
          >
            <ArrowUpDown className="w-4 h-4" />
            Sort
          </button>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-black text-stone-800 uppercase tracking-wider active:bg-stone-50 transition relative"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
            {activeFilterCount > 0 && (
              <span className="absolute top-1.5 right-6 w-4 h-4 bg-amber-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Sort Bottom Sheet */}
      {isSortOpen && (
        <div className="fixed inset-0 z-40 bg-stone-950/60 backdrop-blur-sm flex flex-col justify-end font-sans" onClick={() => setIsSortOpen(false)}>
          <div className="bg-white rounded-t-3xl max-h-[50vh] p-5 space-y-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider">Sort By</h3>
              <button onClick={() => setIsSortOpen(false)} className="p-1.5 rounded-full bg-stone-100">
                <X className="w-4 h-4 text-stone-500" />
              </button>
            </div>
            <div className="space-y-1">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setSortBy(opt.value); setIsSortOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition ${
                    sortBy === opt.value
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filter Bottom Sheet */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-40 bg-stone-950/60 backdrop-blur-sm flex flex-col justify-end font-sans" onClick={() => setIsFilterOpen(false)}>
          <div className="bg-white rounded-t-3xl max-h-[70vh] overflow-y-auto p-5 space-y-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-stone-900 uppercase tracking-wider">Filters</h3>
              <div className="flex items-center gap-2">
                {activeFilterCount > 0 && (
                  <button onClick={clearAllFilters} className="text-[10px] font-bold text-red-500">
                    Clear All
                  </button>
                )}
                <button onClick={() => setIsFilterOpen(false)} className="p-1.5 rounded-full bg-stone-100">
                  <X className="w-4 h-4 text-stone-500" />
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-black text-stone-500 uppercase tracking-wider">Category</h4>
              <div className="flex flex-wrap gap-2">
                {availableCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                      selectedCategories.includes(cat)
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-600 border-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender Filter */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-black text-stone-500 uppercase tracking-wider">Gender</h4>
              <div className="flex flex-wrap gap-2">
                {availableGenders.map((g) => (
                  <button
                    key={g}
                    onClick={() => toggleGender(g)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                      selectedGenders.includes(g)
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white text-stone-600 border-stone-200'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Filter */}
            <div className="flex items-center justify-between py-2 border-t border-stone-100">
              <span className="text-xs font-bold text-stone-700">In Stock Only</span>
              <button
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`w-10 h-5 rounded-full transition-colors ${inStockOnly ? 'bg-emerald-500' : 'bg-stone-300'}`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${inStockOnly ? 'translate-x-5' : 'translate-x-0.5'}`}
                />
              </button>
            </div>

            <button
              onClick={() => setIsFilterOpen(false)}
              className="w-full py-3 bg-stone-900 text-white text-xs font-black rounded-2xl active:scale-98 transition"
            >
              Show {processedProducts.length} Products
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200 whitespace-nowrap">
          {toastMsg}
        </div>
      )}
    </div>
  );
}
