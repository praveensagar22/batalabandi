'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  ChevronDown,
  X,
  Sparkles,
} from 'lucide-react';
import { getWishlist } from '@/lib/wishlist/store';
import { getCart, getLocalCart } from '@/lib/cart/store';
import { fetchCategoriesAPI, fetchProductsAPI } from '@/lib/api/catalog';
import { Category } from '@/lib/categories/types';
import { ProductItem } from '@/lib/products/types';
import CategoriesDrawer from '@/components/common/CategoriesDrawer';
import AuthModal from '@/components/common/AuthModal';
import { getStoredUser, UserProfile } from '@/lib/api/auth';

export default function DesktopHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeGender, setActiveGender] = useState<'men' | 'women' | 'unisex' | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnterGender = (gender: 'men' | 'women' | 'unisex') => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setActiveGender(gender);
  };

  const handleMouseLeaveGender = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }
    hoverTimerRef.current = setTimeout(() => {
      setActiveGender(null);
    }, 250);
  };

  const updateCounts = async () => {
    const wishItems = getWishlist();
    setWishlistCount(wishItems.length);

    const cartItems = getLocalCart();
    const totalQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(totalQty);

    const u = getStoredUser();
    setUser(u);
  };

  const [products, setProducts] = useState<ProductItem[]>([]);

  useEffect(() => {
    updateCounts();
    window.addEventListener('storage', updateCounts);
    window.addEventListener('cart-updated', updateCounts);

    async function loadData() {
      try {
        const [cats, prods] = await Promise.all([
          fetchCategoriesAPI().catch(() => []),
          fetchProductsAPI().catch(() => []),
        ]);
        setCategories(cats || []);
        setProducts(prods || []);
      } catch (err) {
        console.warn('Failed to load header data:', err);
      }
    }
    loadData();

    return () => {
      window.removeEventListener('storage', updateCounts);
      window.removeEventListener('cart-updated', updateCounts);
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Filter categories dynamically by active gender hover tab
  const activeGenderCategories = useMemo(() => {
    if (!activeGender) return [];
    const target = activeGender.toLowerCase();
    return categories.filter((c) => {
      const g = (c.gender || 'unisex').toLowerCase();
      if (target === 'unisex') return g === 'unisex';
      return g === target || g === 'unisex' || g === 'all';
    });
  }, [categories, activeGender]);

  // Build dynamic mega-menu columns based 100% on MongoDB Admin Categories
  const megaMenuColumns = useMemo(() => {
    if (!activeGender || categories.length === 0) return [];
    
    const level1Parents = categories.filter((c) => c.level === 0 || c.level === 1 || !c.parentId);
    const result: { title: string; items: Category[] }[] = [];

    level1Parents.forEach((parent) => {
      const subcats = categories.filter((c) => c.parentId === parent.id || c.parentId === parent.slug);
      const matchingSubcats = (subcats.length > 0 ? subcats : [parent]).filter((c) => {
        const g = (c.gender || 'unisex').toLowerCase();
        if (activeGender === 'unisex') return g === 'unisex';
        return g === activeGender.toLowerCase() || g === 'unisex' || g === 'all';
      });

      if (matchingSubcats.length > 0) {
        result.push({
          title: parent.name,
          items: matchingSubcats,
        });
      }
    });

    if (result.length === 0) {
      const filtered = activeGenderCategories.length > 0 ? activeGenderCategories : categories;
      const chunkSize = Math.max(2, Math.ceil(filtered.length / 4));
      for (let i = 0; i < filtered.length; i += chunkSize) {
        const chunk = filtered.slice(i, i + chunkSize);
        result.push({
          title: i === 0 ? `${activeGender.toUpperCase()} Collection` : `Explore Drops`,
          items: chunk,
        });
      }
    }

    return result.slice(0, 4);
  }, [categories, activeGender, activeGenderCategories]);

  return (
    <header className="sticky top-0 z-50 bg-[#facc15] border-b border-amber-400/80 shadow-xs font-sans relative">
      {/* Header Row with Centered Logo */}
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4 relative">
        {/* Left Section: Menu Drawer Button + Navigation Tabs */}
        <div className="flex items-center gap-6 shrink-0 z-10 h-full">
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="p-1.5 text-stone-950 hover:bg-stone-950/10 rounded-lg transition active:scale-95"
            title="Open Categories Drawer"
          >
            <Menu className="w-5 h-5" strokeWidth={2.2} />
          </button>

          <nav className="flex items-center gap-6 h-full relative">
            {/* MEN Tab */}
            <div
              className="h-full flex items-center relative"
              onMouseEnter={() => handleMouseEnterGender('men')}
              onMouseLeave={handleMouseLeaveGender}
            >
              <Link
                href="/products?gender=Men"
                className={`text-xs font-black uppercase tracking-widest h-full flex items-center border-b-2 transition-all ${
                  activeGender === 'men'
                    ? 'border-stone-950 text-stone-950'
                    : 'border-transparent text-stone-950 hover:text-stone-900 hover:border-stone-950/60'
                }`}
              >
                MEN
              </Link>
            </div>

            {/* WOMEN Tab */}
            <div
              className="h-full flex items-center relative"
              onMouseEnter={() => handleMouseEnterGender('women')}
              onMouseLeave={handleMouseLeaveGender}
            >
              <Link
                href="/products?gender=Women"
                className={`text-xs font-black uppercase tracking-widest h-full flex items-center border-b-2 transition-all ${
                  activeGender === 'women'
                    ? 'border-stone-950 text-stone-950'
                    : 'border-transparent text-stone-950 hover:text-stone-900 hover:border-stone-950/60'
                }`}
              >
                WOMEN
              </Link>
            </div>

            {/* UNISEX Tab */}
            <div
              className="h-full flex items-center relative"
              onMouseEnter={() => handleMouseEnterGender('unisex')}
              onMouseLeave={handleMouseLeaveGender}
            >
              <Link
                href="/products?gender=Unisex"
                className={`text-xs font-black uppercase tracking-widest h-full flex items-center border-b-2 transition-all ${
                  activeGender === 'unisex'
                    ? 'border-stone-950 text-stone-950'
                    : 'border-transparent text-stone-950 hover:text-stone-900 hover:border-stone-950/60'
                }`}
              >
                UNISEX
              </Link>
            </div>
          </nav>
        </div>

        {/* 50% Absolute Center Logo */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-10 pointer-events-auto">
          <Link href="/" className="flex items-center group">
            <div className="relative h-12 w-48 sm:w-56 overflow-hidden group-hover:scale-105 transition-transform">
              <Image
                src="/logo.png"
                alt="BatalaBandi - బట్టల బండి"
                fill
                unoptimized
                priority
                className="object-contain object-center"
              />
            </div>
          </Link>
        </div>

        {/* Right Section: Search Bar + Account / Wishlist / Cart Icons */}
        <div className="flex items-center gap-3 shrink-0 z-10">
          {/* Pill Search Input */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex relative items-center w-52 lg:w-64"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search drops & art..."
              className="w-full bg-amber-50/90 hover:bg-white focus:bg-white text-stone-950 placeholder:text-stone-600/80 text-xs font-semibold rounded-full pl-4 pr-8 py-2 outline-none border border-amber-400/80 focus:border-stone-950 shadow-inner transition-all"
            />
            <button
              type="submit"
              className="absolute right-2.5 text-stone-700 hover:text-stone-950"
            >
              <Search className="w-3.5 h-3.5" strokeWidth={2.2} />
            </button>
          </form>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            {/* User Account */}
            {user ? (
              <Link
                href="/profile"
                className="flex items-center gap-2 transition-all group"
                title={`Profile: ${user.name}`}
              >
                <div className="w-8 h-8 rounded-full bg-stone-950 text-amber-300 flex items-center justify-center text-xs font-black shadow-xs group-hover:scale-105 transition-transform">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden xl:inline text-xs font-extrabold text-stone-950 whitespace-nowrap">
                  {user.name.split(' ')[0]}
                </span>
              </Link>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-950/10 hover:bg-stone-950/20 text-stone-950 text-xs font-extrabold transition active:scale-95"
                title="Log In / Register"
              >
                <User className="w-4 h-4" strokeWidth={2.2} />
                <span className="hidden sm:inline">Log In</span>
              </button>
            )}

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="relative w-9 h-9 rounded-full hover:bg-black/10 flex items-center justify-center text-stone-950 transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" strokeWidth={2} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-stone-950 text-amber-300 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-[#facc15]">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Shopping Cart */}
            <Link
              href="/cart"
              className="relative w-9 h-9 rounded-full hover:bg-black/10 flex items-center justify-center text-stone-950 transition-colors"
              title="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={2} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-stone-950 text-amber-300 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-[#facc15]">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Dynamic Hover Mega Menu for MEN / WOMEN / UNISEX */}
      {activeGender && megaMenuColumns.length > 0 && (
        <div
          className="absolute top-full left-0 right-0 bg-white border-b-2 border-stone-950 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150"
          onMouseEnter={() => activeGender && handleMouseEnterGender(activeGender)}
          onMouseLeave={handleMouseLeaveGender}
        >
          <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {megaMenuColumns.map((col, idx) => (
              <div key={idx} className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-stone-950 border-b border-stone-200 pb-2 flex items-center justify-between">
                  <span>{col.title}</span>
                  <span className="text-[10px] font-extrabold text-stone-400">({col.items.length})</span>
                </h4>
                <div className="flex flex-col space-y-2 pt-1">
                  {col.items.map((c) => {
                    const count =
                      c.productsCount && c.productsCount > 0
                        ? c.productsCount
                        : products.filter((p) => {
                            const pCat = p.category?.toLowerCase() || '';
                            const pType = p.productType?.toLowerCase() || '';
                            const cSlug = c.slug.toLowerCase();
                            const cName = c.name.toLowerCase();
                            return (
                              pCat.includes(cSlug) ||
                              pCat.includes(cName) ||
                              pType.includes(cSlug) ||
                              pType.includes(cName)
                            );
                          }).length;

                    return (
                      <Link
                        key={c.id || c.slug}
                        href={`/categories/${c.slug}?gender=${activeGender}`}
                        onClick={() => setActiveGender(null)}
                        className="text-xs font-bold text-stone-700 hover:text-stone-950 hover:translate-x-1 transition-all flex items-center justify-between group"
                      >
                        <span>{c.name}</span>
                        {count > 0 && (
                          <span className="text-[10px] text-stone-400 group-hover:text-stone-950 font-mono">
                            {count}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories Left Slide-In Modal Drawer Component */}
      <CategoriesDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Login & Register Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(u) => {
          setUser(u);
          window.dispatchEvent(new Event('cart-updated'));
        }}
      />
    </header>
  );
}
