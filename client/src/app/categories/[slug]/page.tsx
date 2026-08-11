'use client';

import { use, useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Heart,
  Plus,
  Star,
  Search,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  Check,
  CheckCircle2,
  ShoppingBag,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Infinity as InfinityIcon,
  LayoutGrid,
  Sparkles,
  Filter,
  RotateCcw,
} from 'lucide-react';
import { fetchProductsAPI, fetchCategoriesAPI } from '@/lib/api/catalog';
import { ProductItem } from '@/lib/products/types';
import { useRouter, useSearchParams } from 'next/navigation';
import { Category } from '@/lib/categories/types';
import { formatImageUrl } from '@/lib/api/client';
import { toggleWishlist, getWishlist } from '@/lib/wishlist/store';
import { addToCart, getCart } from '@/lib/cart/store';
import { ProductGridSkeleton } from '@/components/common/Skeletons';
import DesktopHeader from '@/components/DesktopHeader';
import DesktopFooter from '@/components/DesktopFooter';

interface CategoryDetailPageProps {
  params: Promise<{ slug: string }>;
}

type SortOption = 'recommended' | 'lowToHigh' | 'highToLow' | 'rating' | 'newest';
type PaginationMode = 'infinite' | 'paged';

export default function CategoryDetailPage({ params }: CategoryDetailPageProps) {
  const { slug } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [category, setCategory] = useState<Category | null>(null);
  const [allProducts, setAllProducts] = useState<ProductItem[]>([]);
  const [favs, setFavs] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter States
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const initialUrlGender = searchParams.get('gender');
  const formattedInitialGender = initialUrlGender
    ? initialUrlGender.charAt(0).toUpperCase() + initialUrlGender.slice(1).toLowerCase()
    : 'All';
  const [selectedGender, setSelectedGender] = useState<string>(formattedInitialGender);

  useEffect(() => {
    const urlGender = searchParams.get('gender');
    if (urlGender) {
      const formatted = urlGender.charAt(0).toUpperCase() + urlGender.slice(1).toLowerCase();
      setSelectedGender(formatted);
    }
  }, [searchParams]);

  const [selectedCollection, setSelectedCollection] = useState<string>('All');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under1500' | '1500to2500' | 'above2500'>('all');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [quickChip, setQuickChip] = useState<'all' | 'sale' | 'featured' | 'topRated'>('all');

  // Sorting State
  const [sortBy, setSortBy] = useState<SortOption>('recommended');

  // Pagination & Infinite Scroll States
  const [paginationMode, setPaginationMode] = useState<PaginationMode>('infinite');
  const [pageSize] = useState(12);
  const [visibleCount, setVisibleCount] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  // Drawers UI State for Mobile
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [allCats, fetchedProds] = await Promise.all([
          fetchCategoriesAPI().catch(() => []),
          fetchProductsAPI().catch(() => []),
        ]);

        const decodedSlug = decodeURIComponent(slug).toLowerCase();

        // Match category metadata
        const matchedCat = allCats.find(
          (c) =>
            c.slug.toLowerCase() === decodedSlug ||
            c.id.toLowerCase() === decodedSlug ||
            c.name.toLowerCase() === decodedSlug
        );
        if (matchedCat) {
          setCategory(matchedCat);
        }

        // Filter products for this specific category page
        const categoryProds = fetchedProds.filter((p) => {
          const catName = p.category?.toLowerCase() || '';
          const prodType = p.productType?.toLowerCase() || '';
          const colName = p.collectionName?.toLowerCase() || '';
          const title = p.title?.toLowerCase() || '';

          return (
            catName.includes(decodedSlug) ||
            prodType.includes(decodedSlug) ||
            colName.includes(decodedSlug) ||
            title.includes(decodedSlug) ||
            (matchedCat && catName.includes(matchedCat.name.toLowerCase()))
          );
        });

        setAllProducts(categoryProds.length > 0 ? categoryProds : fetchedProds);
      } catch (err) {
        console.error('Failed to load category products:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [slug]);

  // Show Toast Message Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  useEffect(() => {
    async function loadStates() {
      const list = getWishlist();
      setFavs(list.map((i) => i.id));
      const cart = await getCart();
      setCartItems(cart.map((i) => i.productId));
    }
    loadStates();
  }, []);

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

  // Compute Active Filter Count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedGender !== 'All') count++;
    if (selectedCollection !== 'All') count++;
    if (priceFilter !== 'all') count++;
    if (onlyInStock) count++;
    if (searchQuery.trim() !== '') count++;
    if (quickChip !== 'all') count++;
    return count;
  }, [selectedGender, selectedCollection, priceFilter, onlyInStock, searchQuery, quickChip]);

  // Filter & Sort Logic
  const processedProducts = useMemo(() => {
    let result = [...allProducts];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q) ||
          p.collectionName?.toLowerCase().includes(q)
      );
    }

    // Gender Filter
    if (selectedGender !== 'All') {
      result = result.filter((p) => p.gender === selectedGender || p.gender === 'Unisex');
    }

    // Collection Filter
    if (selectedCollection !== 'All') {
      result = result.filter((p) => p.collectionName?.toLowerCase() === selectedCollection.toLowerCase());
    }

    // Price Filter
    if (priceFilter === 'under1500') {
      result = result.filter((p) => p.price < 1500);
    } else if (priceFilter === '1500to2500') {
      result = result.filter((p) => p.price >= 1500 && p.price <= 2500);
    } else if (priceFilter === 'above2500') {
      result = result.filter((p) => p.price > 2500);
    }

    // Stock Filter
    if (onlyInStock) {
      result = result.filter((p) => (p.stock || 0) > 0);
    }

    // Quick Chips
    if (quickChip === 'sale') {
      result = result.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);
    } else if (quickChip === 'featured') {
      result = result.filter((p) => p.isFeatured);
    } else if (quickChip === 'topRated') {
      result = result.filter((p) => (p.rating || 0) >= 4.8);
    }

    // Sorting
    if (sortBy === 'lowToHigh') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'highToLow') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    } else {
      result.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
    }

    return result;
  }, [allProducts, searchQuery, selectedGender, selectedCollection, priceFilter, onlyInStock, quickChip, sortBy]);

  // Reset pagination when filters or sort changes
  useEffect(() => {
    setVisibleCount(pageSize);
    setCurrentPage(1);
  }, [searchQuery, selectedGender, selectedCollection, priceFilter, onlyInStock, quickChip, sortBy, pageSize]);

  const totalPages = Math.ceil(processedProducts.length / pageSize) || 1;

  const displayedProducts = useMemo(() => {
    if (paginationMode === 'infinite') {
      return processedProducts.slice(0, visibleCount);
    } else {
      const start = (currentPage - 1) * pageSize;
      return processedProducts.slice(start, start + pageSize);
    }
  }, [processedProducts, paginationMode, visibleCount, currentPage, pageSize]);

  const clearAllFilters = () => {
    setSelectedGender('All');
    setSelectedCollection('All');
    setPriceFilter('all');
    setOnlyInStock(false);
    setSearchQuery('');
    setQuickChip('all');
  };

  const categoryTitle = category?.name || decodeURIComponent(slug).replace(/-/g, ' ').toUpperCase();

  return (
    <div className="min-h-screen bg-[#faf9f5] font-sans text-stone-900 selection:bg-stone-950 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 bg-stone-950 text-white text-xs font-bold px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ===== DESKTOP LAYOUT (>= 768px) ===== */}
      <div className="hidden md:block">
        <DesktopHeader />

        <main className="max-w-7xl mx-auto px-6 py-10 space-y-8">
          {/* Breadcrumb Navigation & Category Title */}
          <div className="space-y-2 border-b border-stone-200/80 pb-6">
            <nav className="flex items-center gap-2 text-xs font-semibold text-stone-400">
              <Link href="/" className="hover:text-stone-950 transition">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/categories" className="hover:text-stone-950 transition">Categories</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-stone-950 font-bold capitalize">{categoryTitle}</span>
            </nav>

            <div className="flex items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-black text-stone-950 tracking-tight capitalize">
                  {categoryTitle}
                </h1>
                <p className="text-xs text-stone-500 font-semibold mt-1">
                  Showing {processedProducts.length} handcrafted items in {categoryTitle}
                </p>
              </div>

              {/* Desktop Sort Selector */}
              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-stone-600 uppercase tracking-wider">Sort By:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-white border border-stone-200 rounded-full px-4 py-2 text-xs font-bold text-stone-900 outline-none focus:border-stone-950 shadow-2xs cursor-pointer"
                >
                  <option value="recommended">Popularity (Recommended)</option>
                  <option value="lowToHigh">Price: Low to High</option>
                  <option value="highToLow">Price: High to Low</option>
                  <option value="rating">Highest Rating</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2-Column Desktop Layout: Left Filter Sidebar + Right Product Grid */}
          <div className="grid grid-cols-12 gap-8 items-start">
            {/* Left Filter Sidebar (3 cols) */}
            <aside className="col-span-3 bg-white p-6 rounded-3xl border border-stone-200/90 shadow-2xs space-y-6 sticky top-24">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-stone-950 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-stone-950" /> Filters
                </h3>
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-[11px] font-bold text-stone-500 hover:text-stone-950 underline"
                  >
                    Reset ({activeFilterCount})
                  </button>
                )}
              </div>

              {/* Category Search Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Search Items</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search in ${categoryTitle}...`}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold outline-none focus:border-stone-950 focus:bg-white transition"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-950"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Gender Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Gender</label>
                <div className="grid grid-cols-2 gap-2">
                  {['All', 'Men', 'Women', 'Unisex'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGender(g)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        selectedGender === g
                          ? 'bg-stone-950 text-white border-stone-950 shadow-2xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Price Range</label>
                <div className="space-y-1.5">
                  {[
                    { id: 'all', label: 'All Prices' },
                    { id: 'under1500', label: 'Under ₹1,500' },
                    { id: '1500to2500', label: '₹1,500 - ₹2,500' },
                    { id: 'above2500', label: 'Above ₹2,500' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setPriceFilter(p.id as any)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold border text-left transition-all ${
                        priceFilter === p.id
                          ? 'bg-stone-950 text-white border-stone-950 shadow-2xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Toggle */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800">In Stock Only</span>
                <button
                  type="button"
                  onClick={() => setOnlyInStock(!onlyInStock)}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 ${
                    onlyInStock ? 'bg-stone-950' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      onlyInStock ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </aside>

            {/* Right Product Grid (9 cols) */}
            <main className="col-span-9 space-y-6">
              {isLoading ? (
                <ProductGridSkeleton count={8} />
              ) : displayedProducts.length > 0 ? (
                <div className="grid grid-cols-3 gap-6">
                  {displayedProducts.map((p) => {
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
                        className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
                      >
                        {/* Image Container */}
                        <div className="h-64 bg-stone-100 relative overflow-hidden">
                          <Image
                            src={imageSrc}
                            alt={p.title}
                            fill
                            unoptimized
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />

                          <span className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md text-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {p.category || 'Drop'}
                          </span>

                          {discount && (
                            <span className="absolute bottom-3 left-3 bg-stone-950 text-white text-[10px] font-black px-2.5 py-1 rounded-full">
                              {discount}% OFF
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={(e) => toggleFav(p.id, p.title, e)}
                            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-xs flex items-center justify-center transition active:scale-90 hover:bg-white"
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                isFav ? 'fill-red-500 text-red-500' : 'text-stone-600'
                              }`}
                              strokeWidth={1.8}
                            />
                          </button>
                        </div>

                        {/* Product Info */}
                        <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="text-xs font-extrabold text-stone-950 line-clamp-1 leading-snug group-hover:text-stone-600 transition-colors">
                              {p.title}
                            </h4>
                            <p className="text-[11px] text-stone-400 font-medium line-clamp-1 mt-0.5">
                              {p.subtitle || p.productType || 'Handcrafted Edition'}
                            </p>
                          </div>

                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-base font-black text-stone-950 font-mono">
                                ₹{p.price.toLocaleString('en-IN')}
                              </span>
                              {p.compareAtPrice && p.compareAtPrice > p.price && (
                                <span className="text-xs font-bold text-stone-400 line-through font-mono">
                                  ₹{p.compareAtPrice.toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
                              <div className="flex items-center gap-1 text-xs font-bold text-stone-800 bg-stone-50 px-2 py-0.5 rounded-lg border border-stone-200/60">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                <span>{p.rating || 4.8}</span>
                                <span className="text-stone-400 font-normal">
                                  ({p.salesCount || 120})
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => handleCartClick(p.id, p.title, e)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-2xs active:scale-90 ${
                                  isInCart
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-stone-950 text-white hover:bg-stone-800'
                                }`}
                              >
                                {isInCart ? (
                                  <Check className="w-4 h-4" strokeWidth={3} />
                                ) : (
                                  <Plus className="w-4 h-4" strokeWidth={2} />
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
                <div className="py-20 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-3 shadow-xs">
                  <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
                  <h3 className="text-sm font-black text-stone-900">No products found in {categoryTitle}</h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Try adjusting your filters or search term to discover more apparel drops.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="mt-2 inline-flex items-center gap-1 px-5 py-2.5 bg-stone-950 text-white rounded-full text-xs font-bold shadow-xs hover:bg-stone-800 transition-all"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </main>
          </div>
        </main>

        <DesktopFooter />
      </div>

      {/* ===== MOBILE LAYOUT (< 768px) ===== */}
      <div className="block md:hidden">
        {/* Sticky Mobile Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-stone-200 shadow-2xs max-w-md mx-auto">
          <div className="px-3 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Link
                href="/categories"
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-800 active:scale-90 transition-transform"
              >
                <ArrowLeft className="w-4.5 h-4.5" />
              </Link>

              {isSearchActive ? (
                <div className="relative flex-1">
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${categoryTitle}...`}
                    className="w-full pl-3 pr-7 py-1.5 bg-stone-100 rounded-lg text-xs font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ) : (
                <div>
                  <h1 className="text-sm font-black text-stone-950 capitalize line-clamp-1">
                    {categoryTitle}
                  </h1>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wide">
                    {processedProducts.length} ITEMS
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsSearchActive(!isSearchActive)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-stone-700 active:scale-90 transition-transform"
              >
                {isSearchActive ? <X className="w-4.5 h-4.5" /> : <Search className="w-4.5 h-4.5" />}
              </button>

              <Link
                href="/wishlist"
                className="relative w-8 h-8 rounded-full flex items-center justify-center text-stone-700 active:scale-90 transition-transform"
              >
                <Heart className="w-4.5 h-4.5" />
                {favs.length > 0 && (
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center">
                    {favs.length}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                className="relative w-8 h-8 rounded-full flex items-center justify-center text-stone-700 active:scale-90 transition-transform"
              >
                <ShoppingBag className="w-4.5 h-4.5" />
                {cartItems.length > 0 && (
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#facc15] text-stone-950 text-[8px] font-black rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-between px-3 pb-2.5 border-t border-stone-100 pt-2 gap-2">
            <div className="flex gap-2 overflow-x-auto no-scrollbar flex-1">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'sale', label: '🔥 On Sale' },
                { id: 'featured', label: '✨ Featured' },
                { id: 'topRated', label: '⭐ 4.8+ Rating' },
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setQuickChip(chip.id as any)}
                  className={`px-3 py-1 rounded-full text-[10.5px] font-bold shrink-0 transition-all border ${
                    quickChip === chip.id
                      ? 'bg-stone-950 text-white border-stone-950 shadow-2xs'
                      : 'bg-white text-stone-600 border-stone-200'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Mobile Main Content */}
        <main className="max-w-md mx-auto px-2 pt-2.5">
          {isLoading ? (
            <ProductGridSkeleton count={6} />
          ) : processedProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 mb-4">
              {displayedProducts.map((p) => {
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
                  <div
                    key={p.id}
                    className="bg-white rounded-xl overflow-hidden border border-stone-200/80 shadow-2xs flex flex-col justify-between group"
                  >
                    <Link href={`/product/${p.id}`} className="block h-[165px] bg-stone-100 relative overflow-hidden">
                      <Image
                        src={imageSrc}
                        alt={p.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      <span className="absolute top-2 left-2 bg-stone-950/80 backdrop-blur-md text-white text-[8.5px] font-extrabold px-1.5 py-0.5 rounded shadow-2xs uppercase tracking-wider">
                        {p.collectionName || p.category || 'Collection'}
                      </span>

                      {discount && (
                        <span className="absolute bottom-2 left-2 bg-[#ff5722] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-2xs">
                          {discount}% OFF
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => toggleFav(p.id, p.title, e)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md shadow-xs flex items-center justify-center transition active:scale-90 hover:bg-white"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            isFav ? 'fill-red-500 text-red-500' : 'text-stone-600'
                          }`}
                          strokeWidth={2.2}
                        />
                      </button>
                    </Link>

                    <div className="p-2.5 space-y-1 flex-1 flex flex-col justify-between">
                      <div>
                        <Link href={`/product/${p.id}`}>
                          <h3 className="text-[11.5px] font-extrabold text-stone-950 line-clamp-1 group-hover:text-amber-600 transition-colors">
                            {p.title}
                          </h3>
                        </Link>
                        <p className="text-[9.5px] text-stone-400 font-medium line-clamp-1 mt-0.5">
                          {p.subtitle || p.productType || 'Handcrafted Edition'}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-baseline gap-1.5 mt-1">
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
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-14 text-center bg-white rounded-2xl border border-stone-200 p-6 space-y-3 mb-6 shadow-xs">
              <ShoppingBag className="w-9 h-9 text-stone-300 mx-auto" />
              <h3 className="text-xs font-extrabold text-stone-900">No matching products found</h3>
              <button
                onClick={clearAllFilters}
                className="mt-2 inline-flex items-center gap-1 px-4 py-2 bg-stone-950 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all"
              >
                Reset Filters
              </button>
            </div>
          )}
        </main>

        {/* Sticky Mobile Bottom Filter Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] max-w-md mx-auto">
          <div className="flex items-center h-12 divide-x divide-stone-200 text-xs font-black uppercase tracking-wider text-stone-900">
            <button
              onClick={() => setIsSortOpen(true)}
              className="flex-1 h-full flex items-center justify-center gap-2 hover:bg-stone-50 transition-colors"
            >
              <ArrowUpDown className="w-4 h-4 text-stone-700" />
              <span>Sort</span>
            </button>

            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex-1 h-full flex items-center justify-center gap-2 hover:bg-stone-50 transition-colors relative"
            >
              <SlidersHorizontal className="w-4 h-4 text-stone-700" />
              <span>Filter</span>
              {activeFilterCount > 0 && (
                <span className="w-4.5 h-4.5 rounded-full bg-[#ff5722] text-white text-[9.5px] font-black flex items-center justify-center shadow-2xs">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Sort Sheet */}
        {isSortOpen && (
          <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-end justify-center">
            <div className="bg-white rounded-t-3xl w-full max-w-md p-4 space-y-3 border-t border-stone-200">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <h3 className="text-xs font-black text-stone-950 uppercase tracking-wider">Sort By</h3>
                <button onClick={() => setIsSortOpen(false)} className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1">
                {[
                  { id: 'recommended', label: 'Popularity (Recommended)' },
                  { id: 'lowToHigh', label: 'Price: Low to High' },
                  { id: 'highToLow', label: 'Price: High to Low' },
                  { id: 'rating', label: 'Customer Rating' },
                  { id: 'newest', label: 'Newest Arrivals' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setSortBy(opt.id as any);
                      setIsSortOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold ${
                      sortBy === opt.id ? 'bg-amber-50 text-amber-950' : 'text-stone-700'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {sortBy === opt.id && <Check className="w-4 h-4 text-amber-600" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Filter Sheet */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-end justify-center">
            <div className="bg-white rounded-t-3xl w-full max-w-md p-4 space-y-4 max-h-[85vh] overflow-y-auto border-t border-stone-200">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="text-xs font-black text-stone-950 uppercase tracking-wider">Filter Products</h3>
                <button onClick={() => setIsFilterOpen(false)} className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-wider text-stone-700">Gender</label>
                <div className="grid grid-cols-4 gap-2">
                  {['All', 'Men', 'Women', 'Unisex'].map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGender(g)}
                      className={`py-2 rounded-xl text-xs font-bold border text-center ${
                        selectedGender === g ? 'bg-stone-950 text-white' : 'bg-stone-50 text-stone-700'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
