'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Heart,
  Plus,
  Check,
  Star,
  Search,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { fetchProductsAPI } from '@/lib/api/catalog';
import { ProductItem } from '@/lib/products/types';
import { formatImageUrl } from '@/lib/api/client';
import { toggleWishlist, getWishlist } from '@/lib/wishlist/store';
import { addToCart, getCart } from '@/lib/cart/store';
import { ProductGridSkeleton } from '@/components/common/Skeletons';
import DesktopHeader from '@/components/DesktopHeader';
import DesktopFooter from '@/components/DesktopFooter';

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
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const initialGender = searchParams.get('gender') || (['Men', 'Women', 'Unisex'].includes(searchParams.get('search') || '') ? searchParams.get('search') : null);
  const [selectedGenders, setSelectedGenders] = useState<string[]>(initialGender ? [initialGender] : []);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Sync url searchParams to state
  useEffect(() => {
    const g = searchParams.get('gender');
    const s = searchParams.get('search');
    if (g) {
      setSelectedGenders([g]);
    } else if (s && ['Men', 'Women', 'Unisex'].includes(s)) {
      setSelectedGenders([s]);
    }
  }, [searchParams]);

  // Bottom Sheets for Mobile
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

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

  const availableCollections = useMemo(() => {
    const cols = new Set(allProducts.map((p) => p.collectionName).filter(Boolean));
    return Array.from(cols).sort() as string[];
  }, [allProducts]);

  const availableThemes = useMemo(() => {
    const themes = new Set(allProducts.map((p) => p.themeName).filter(Boolean));
    return Array.from(themes).sort() as string[];
  }, [allProducts]);

  // Filter & Sort Logic
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

    // Collection
    if (selectedCollections.length > 0) {
      filtered = filtered.filter((p) => p.collectionName && selectedCollections.includes(p.collectionName));
    }

    // Theme
    if (selectedThemes.length > 0) {
      filtered = filtered.filter((p) => p.themeName && selectedThemes.includes(p.themeName));
    }

    // Gender
    if (selectedGenders.length > 0) {
      filtered = filtered.filter((p) => selectedGenders.includes(p.gender || ''));
    }

    // On Sale Only
    if (onSaleOnly) {
      filtered = filtered.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);
    }

    // Price Range
    if (selectedPriceRange !== 'all') {
      if (selectedPriceRange === 'under999') {
        filtered = filtered.filter((p) => p.price < 1000);
      } else if (selectedPriceRange === '1000to1999') {
        filtered = filtered.filter((p) => p.price >= 1000 && p.price <= 1999);
      } else if (selectedPriceRange === '2000to3999') {
        filtered = filtered.filter((p) => p.price >= 2000 && p.price <= 3999);
      } else if (selectedPriceRange === 'above4000') {
        filtered = filtered.filter((p) => p.price >= 4000);
      }
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
  }, [allProducts, searchQuery, selectedCategories, selectedCollections, selectedThemes, selectedGenders, selectedPriceRange, onSaleOnly, inStockOnly, sortBy]);

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
    selectedCategories.length +
    selectedGenders.length +
    selectedCollections.length +
    selectedThemes.length +
    (selectedPriceRange !== 'all' ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (onSaleOnly ? 1 : 0) +
    (searchQuery ? 1 : 0);

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

  const toggleCollection = (col: string) => {
    setSelectedCollections((prev) =>
      prev.includes(col) ? prev.filter((x) => x !== col) : [...prev, col]
    );
  };

  const toggleTheme = (theme: string) => {
    setSelectedThemes((prev) =>
      prev.includes(theme) ? prev.filter((x) => x !== theme) : [...prev, theme]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedGenders([]);
    setSelectedCollections([]);
    setSelectedThemes([]);
    setSelectedPriceRange('all');
    setInStockOnly(false);
    setOnSaleOnly(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] font-sans selection:bg-amber-400 selection:text-stone-950 relative">
      {/* Visible Kalamkari Telugu Heritage Texture Watermark at z-0 */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-20 mix-blend-multiply pointer-events-none z-0"
        style={{ backgroundImage: "url('/kalamkari-pattern.jpg')" }}
      />
      <div className="relative z-10">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-8 right-8 z-50 bg-stone-950 text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastMsg}
        </div>
      )}

      {/* ===== DESKTOP HEADER (>= 768px) ===== */}
      <div className="hidden md:block">
        <DesktopHeader />
      </div>

      {/* ===== MOBILE HEADER (< 768px) ===== */}
      <header className="block md:hidden sticky top-0 z-30 bg-white border-b border-stone-200 shadow-sm">
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

        {/* Quick Category Chips Mobile */}
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

      {/* ===== MAIN CONTENT ===== */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* Desktop Breadcrumbs & Page Header */}
        <div className="hidden md:block mb-8">
          <div className="flex items-center gap-2 text-xs text-stone-400 font-semibold mb-3">
            <Link href="/" className="hover:text-stone-950 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-stone-900 font-bold">All Garment Drops</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-6">
            <div>
              <h1 className="text-3xl font-black font-serif text-stone-950 tracking-tight flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-500 fill-amber-500" />
                All Garment Drops
              </h1>
              <p className="text-xs text-stone-500 font-medium mt-1">
                Handcrafted streetwear, bio-washed tees, and artisan collections.
              </p>
            </div>

            {/* Sort & Item Count Controls */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-stone-500 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200/60">
                Showing <strong>{processedProducts.length}</strong> Products
              </span>

              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-stone-700">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-white text-stone-900 text-xs font-bold px-3 py-2 rounded-xl border border-stone-200 shadow-2xs outline-none focus:border-amber-400 transition cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Layout (Sidebar + Products) */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* DESKTOP SIDEBAR FILTERS (lg:block) */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-6">
            <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-2xs space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2 text-xs font-black text-stone-950 uppercase tracking-wider">
                  <Filter className="w-4 h-4 text-amber-500" />
                  <span>Filters</span>
                </div>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-[10px] font-bold text-red-500 hover:underline"
                  >
                    Clear All ({activeFilterCount})
                  </button>
                )}
              </div>

              {/* Desktop Search Input */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-stone-700 uppercase tracking-wider">
                  Search Products
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search keywords..."
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-8 py-2 text-xs font-semibold focus:outline-none focus:border-amber-400 focus:bg-white transition"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter */}
              {availableCategories.length > 0 && (
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-stone-700 uppercase tracking-wider">
                    Category
                  </label>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {availableCategories.map((cat) => {
                      const isSelected = selectedCategories.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition ${
                            isSelected
                              ? 'bg-stone-950 text-white'
                              : 'bg-stone-50 text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          <span>{cat}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" strokeWidth={3} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Collections / Art Style Filter */}
              {availableCollections.length > 0 && (
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-stone-700 uppercase tracking-wider">
                    Art Style / Collection
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {availableCollections.map((col) => {
                      const isSelected = selectedCollections.includes(col);
                      return (
                        <button
                          key={col}
                          type="button"
                          onClick={() => toggleCollection(col)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                            isSelected
                              ? 'bg-amber-400 text-stone-950 border-amber-400 shadow-2xs'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {col}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Themes Filter */}
              {availableThemes.length > 0 && (
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-stone-700 uppercase tracking-wider">
                    Theme
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {availableThemes.map((th) => {
                      const isSelected = selectedThemes.includes(th);
                      return (
                        <button
                          key={th}
                          type="button"
                          onClick={() => toggleTheme(th)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                            isSelected
                              ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {th}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Price Range Filter */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-stone-700 uppercase tracking-wider">
                  Price Range
                </label>
                <div className="space-y-1">
                  {[
                    { id: 'all', label: 'All Prices' },
                    { id: 'under999', label: 'Under ₹1,000' },
                    { id: '1000to1999', label: '₹1,000 - ₹1,999' },
                    { id: '2000to3999', label: '₹2,000 - ₹3,999' },
                    { id: 'above4000', label: '₹4,000 & Above' },
                  ].map((pOpt) => (
                    <button
                      key={pOpt.id}
                      type="button"
                      onClick={() => setSelectedPriceRange(pOpt.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        selectedPriceRange === pOpt.id
                          ? 'bg-stone-950 text-white'
                          : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                      }`}
                    >
                      {pOpt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Gender Filter */}
              {availableGenders.length > 0 && (
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-stone-700 uppercase tracking-wider">
                    Gender
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {availableGenders.map((g) => {
                      const isSelected = selectedGenders.includes(g);
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => toggleGender(g)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                            isSelected
                              ? 'bg-amber-400 text-stone-950 border-amber-400 shadow-2xs'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Toggles: In Stock & On Sale */}
              <div className="space-y-2 pt-3 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800">In Stock Only</span>
                  <button
                    type="button"
                    onClick={() => setInStockOnly(!inStockOnly)}
                    className={`w-10 h-5 rounded-full transition-colors ${
                      inStockOnly ? 'bg-emerald-500' : 'bg-stone-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
                        inStockOnly ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800">On Sale / Discount</span>
                  <button
                    type="button"
                    onClick={() => setOnSaleOnly(!onSaleOnly)}
                    className={`w-10 h-5 rounded-full transition-colors ${
                      onSaleOnly ? 'bg-amber-500' : 'bg-stone-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
                        onSaleOnly ? 'translate-x-5' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN PRODUCT GRID SHOWCASE */}
          <div className="flex-1">
            {isLoading ? (
              <ProductGridSkeleton count={8} />
            ) : processedProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
                {processedProducts.map((p) => {
                  const isFav = favs.includes(p.id);
                  const isInCart = cartItems.includes(p.id);
                  const imageSrc = formatImageUrl(
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
                      className="bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-stone-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-between"
                    >
                      {/* Image Container */}
                      <div className="relative h-48 md:h-64 bg-stone-100 overflow-hidden">
                        <Image
                          src={imageSrc}
                          alt={p.title}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        <span className="absolute top-2.5 left-2.5 bg-stone-950/80 backdrop-blur-md text-white text-[8.5px] md:text-[9px] font-extrabold px-2 py-0.5 md:py-1 rounded-lg uppercase">
                          {p.category || 'Drop'}
                        </span>

                        {discount && (
                          <span className="absolute bottom-2.5 left-2.5 bg-[#facc15] text-stone-950 text-[9.5px] md:text-[10px] font-black px-2 py-0.5 rounded shadow-2xs">
                            {discount}% OFF
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={(e) => toggleFav(p.id, p.title, e)}
                          className="absolute top-2.5 right-2.5 w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/90 backdrop-blur-md shadow-xs flex items-center justify-center transition active:scale-90 hover:bg-white"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 md:w-4 md:h-4 ${
                              isFav ? 'fill-red-500 text-red-500' : 'text-stone-500'
                            }`}
                            strokeWidth={2.2}
                          />
                        </button>
                      </div>

                      {/* Info Container */}
                      <div className="p-3 md:p-4 space-y-1.5 md:space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs md:text-sm font-extrabold text-stone-900 line-clamp-1 leading-snug group-hover:text-amber-600 transition-colors">
                            {p.title}
                          </h4>
                          <p className="text-[10px] md:text-xs text-stone-400 font-semibold line-clamp-1 mt-0.5">
                            {p.subtitle || p.collectionName || 'Premium Collection'}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-baseline gap-1.5 md:gap-2">
                            <span className="text-sm md:text-base font-black text-stone-950 font-mono">
                              ₹{p.price.toLocaleString('en-IN')}
                            </span>
                            {p.compareAtPrice && p.compareAtPrice > p.price && (
                              <span className="text-[10px] md:text-xs font-bold text-stone-400 line-through font-mono">
                                ₹{p.compareAtPrice.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-2 md:mt-3 pt-2 md:pt-3 border-t border-stone-100">
                            <div className="flex items-center gap-1 bg-stone-50 px-2 py-0.5 rounded-md text-[10px] md:text-xs font-bold text-stone-800 border border-stone-200/60">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>{p.rating || 4.8}</span>
                              <span className="text-stone-400 font-normal">({p.salesCount || 120})</span>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => handleCartClick(p.id, p.title, e)}
                              aria-label="Add to cart"
                              className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center transition-all shadow-2xs active:scale-90 ${
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
              <div className="py-20 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-3 shadow-2xs">
                <div className="text-4xl">🔍</div>
                <h3 className="text-base font-black text-stone-900">No Products Found</h3>
                <p className="text-xs text-stone-500 font-medium max-w-sm mx-auto">
                  {searchQuery
                    ? `No results found for "${searchQuery}". Try searching with different keywords.`
                    : 'No products match your current selected filters.'}
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-5 py-2.5 bg-stone-950 text-white text-xs font-black rounded-xl shadow-xs hover:bg-stone-800 transition"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ===== MOBILE STICKY BOTTOM SORT | FILTER BAR (< 768px) ===== */}
      <div className="block md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-stone-200 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
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

      {/* Mobile Sort Bottom Sheet */}
      {isSortOpen && (
        <div
          className="fixed inset-0 z-40 bg-stone-950/60 backdrop-blur-sm flex flex-col justify-end font-sans md:hidden"
          onClick={() => setIsSortOpen(false)}
        >
          <div
            className="bg-white rounded-t-3xl max-h-[50vh] p-5 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
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
                  onClick={() => {
                    setSortBy(opt.value);
                    setIsSortOpen(false);
                  }}
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

      {/* Mobile Filter Bottom Sheet */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 z-40 bg-stone-950/60 backdrop-blur-sm flex flex-col justify-end font-sans md:hidden"
          onClick={() => setIsFilterOpen(false)}
        >
          <div
            className="bg-white rounded-t-3xl max-h-[70vh] overflow-y-auto p-5 space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
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
            {availableCategories.length > 0 && (
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
            )}

            {/* Art Style / Collection Filter */}
            {availableCollections.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[11px] font-black text-stone-500 uppercase tracking-wider">Art Style / Collection</h4>
                <div className="flex flex-wrap gap-2">
                  {availableCollections.map((col) => (
                    <button
                      key={col}
                      onClick={() => toggleCollection(col)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        selectedCollections.includes(col)
                          ? 'bg-amber-400 text-stone-950 border-amber-400 font-extrabold'
                          : 'bg-white text-stone-600 border-stone-200'
                      }`}
                    >
                      {col}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Theme Filter */}
            {availableThemes.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-[11px] font-black text-stone-500 uppercase tracking-wider">Theme</h4>
                <div className="flex flex-wrap gap-2">
                  {availableThemes.map((th) => (
                    <button
                      key={th}
                      onClick={() => toggleTheme(th)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        selectedThemes.includes(th)
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-white text-stone-600 border-stone-200'
                      }`}
                    >
                      {th}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range Filter */}
            <div className="space-y-2">
              <h4 className="text-[11px] font-black text-stone-500 uppercase tracking-wider">Price Range</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'all', label: 'All Prices' },
                  { id: 'under999', label: 'Under ₹1,000' },
                  { id: '1000to1999', label: '₹1,000 - ₹1,999' },
                  { id: '2000to3999', label: '₹2,000 - ₹3,999' },
                  { id: 'above4000', label: '₹4,000 & Above' },
                ].map((pOpt) => (
                  <button
                    key={pOpt.id}
                    onClick={() => setSelectedPriceRange(pOpt.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold text-center border transition ${
                      selectedPriceRange === pOpt.id
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    {pOpt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gender Filter */}
            {availableGenders.length > 0 && (
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
            )}

            {/* Stock & Sale Filters */}
            <div className="space-y-3 pt-3 border-t border-stone-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700">In Stock Only</span>
                <button
                  onClick={() => setInStockOnly(!inStockOnly)}
                  className={`w-10 h-5 rounded-full transition-colors ${
                    inStockOnly ? 'bg-emerald-500' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
                      inStockOnly ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700">On Sale / Discount</span>
                <button
                  onClick={() => setOnSaleOnly(!onSaleOnly)}
                  className={`w-10 h-5 rounded-full transition-colors ${
                    onSaleOnly ? 'bg-amber-500' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${
                      onSaleOnly ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
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

      {/* ===== DESKTOP FOOTER (>= 768px) ===== */}
      <div className="hidden md:block">
        <DesktopFooter />
      </div>
      </div>
    </div>
  );
}
