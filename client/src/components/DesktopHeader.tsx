'use client';

import { useState, useEffect, useMemo } from 'react';
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
import { fetchCategoriesAPI } from '@/lib/api/catalog';
import { Category } from '@/lib/categories/types';
import CategoriesDrawer from '@/components/common/CategoriesDrawer';

export default function DesktopHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeGender, setActiveGender] = useState<'men' | 'women' | 'unisex' | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const updateCounts = async () => {
    const wishItems = getWishlist();
    setWishlistCount(wishItems.length);

    const cartItems = getLocalCart();
    const totalQty = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(totalQty);
  };

  useEffect(() => {
    updateCounts();
    window.addEventListener('storage', updateCounts);
    window.addEventListener('cart-updated', updateCounts);

    async function loadCats() {
      try {
        const cats = await fetchCategoriesAPI();
        setCategories(cats || []);
      } catch (err) {
        console.warn('Failed to load categories for header dropdown:', err);
      }
    }
    loadCats();

    return () => {
      window.removeEventListener('storage', updateCounts);
      window.removeEventListener('cart-updated', updateCounts);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Group categories dynamically by gender
  const menCategories = useMemo(
    () => categories.filter((c) => c.gender === 'Men' || c.gender === 'Unisex'),
    [categories]
  );

  const womenCategories = useMemo(
    () => categories.filter((c) => c.gender === 'Women'),
    [categories]
  );

  return (
    <header className="sticky top-0 z-50 bg-[#facc15] border-b border-amber-400/80 shadow-xs font-sans">
      {/* Souled Store Style Header Row with Absolute Center Logo */}
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4 relative">
        {/* Left Section: Menu Icon (Triggers Left Drawer Modal) + MEN / WOMEN / UNISEX Tabs */}
        <div className="flex items-center gap-5 shrink-0 z-10">
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="p-1 text-stone-950 hover:bg-stone-950/10 rounded-lg transition active:scale-95"
            title="Open Categories Drawer"
          >
            <Menu className="w-5 h-5" strokeWidth={2.5} />
          </button>

          <nav className="flex items-center gap-6 relative">
            {/* MEN Tab */}
            <div
              className="relative"
              onMouseEnter={() => setActiveGender('men')}
              onMouseLeave={() => setActiveGender(null)}
            >
              <Link
                href="/products?search=Men"
                className="text-xs font-black uppercase tracking-wider py-4 block text-stone-950 hover:text-stone-900 border-b-2 border-transparent hover:border-stone-950 transition-all"
              >
                MEN
              </Link>
            </div>

            {/* WOMEN Tab */}
            <div
              className="relative"
              onMouseEnter={() => setActiveGender('women')}
              onMouseLeave={() => setActiveGender(null)}
            >
              <Link
                href="/products?search=Women"
                className="text-xs font-black uppercase tracking-wider py-4 block text-stone-950 hover:text-stone-900 border-b-2 border-transparent hover:border-stone-950 transition-all"
              >
                WOMEN
              </Link>
            </div>

            {/* UNISEX Tab */}
            <div
              className="relative"
              onMouseEnter={() => setActiveGender('unisex')}
              onMouseLeave={() => setActiveGender(null)}
            >
              <Link
                href="/products?search=Unisex"
                className="text-xs font-black uppercase tracking-wider py-4 block text-stone-950 hover:text-stone-900 border-b-2 border-transparent hover:border-stone-950 transition-all"
              >
                UNISEX
              </Link>
            </div>
          </nav>
        </div>

        {/* True 50% Absolute Center Logo */}
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

        {/* Right Section: Pill Search Bar + Profile / Wishlist / Cart Icons */}
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
              placeholder="What are you looking for?"
              className="w-full bg-amber-50/80 hover:bg-white focus:bg-white text-stone-900 placeholder:text-stone-600/80 text-[11px] font-semibold rounded-full pl-4 pr-8 py-2 outline-none border border-amber-400/80 focus:border-stone-900 shadow-inner transition-all"
            />
            <button
              type="submit"
              className="absolute right-2.5 text-stone-700 hover:text-stone-950"
            >
              <Search className="w-3.5 h-3.5" strokeWidth={2.5} />
            </button>
          </form>

          {/* Action Icons */}
          <div className="flex items-center gap-2">
            {/* User Account */}
            <Link
              href="/checkout"
              className="w-9 h-9 rounded-full hover:bg-black/10 flex items-center justify-center text-stone-950 transition-colors"
              title="Profile"
            >
              <User className="w-5 h-5" strokeWidth={2} />
            </Link>

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
      {activeGender && (
        <div
          className="fixed top-16 left-0 right-0 bg-white border-b border-stone-200 shadow-2xl z-50 animate-in fade-in slide-in-from-top-1 duration-150"
          onMouseEnter={() => setActiveGender(activeGender)}
          onMouseLeave={() => setActiveGender(null)}
        >
          <div className="max-w-6xl mx-auto px-8 py-6 grid grid-cols-4 gap-8">
            {/* Column 1: Topwear */}
            <div className="space-y-2">
              <h4 className="text-[13px] font-bold text-[#ff3f6c] tracking-wide border-b border-stone-100 pb-1">
                Topwear ({activeGender.toUpperCase()})
              </h4>
              <div className="flex flex-col space-y-1.5 pt-1">
                {(activeGender === 'women' ? womenCategories : menCategories).map((c) => (
                  <Link
                    key={c.id || c.slug}
                    href={`/categories/${c.slug}`}
                    onClick={() => setActiveGender(null)}
                    className="text-[12px] text-stone-800 hover:text-[#ff3f6c] hover:font-bold transition-all"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Column 2: Bottomwear */}
            <div className="space-y-2">
              <h4 className="text-[13px] font-bold text-[#ff3f6c] tracking-wide border-b border-stone-100 pb-1">
                Bottomwear
              </h4>
              <div className="flex flex-col space-y-1.5 pt-1">
                {['Cargo Joggers', 'Unisex Pants', 'Shorts & Casuals', 'Palazzo Sets'].map((name) => (
                  <Link
                    key={name}
                    href={`/products?search=${encodeURIComponent(name)}`}
                    onClick={() => setActiveGender(null)}
                    className="text-[12px] text-stone-800 hover:text-[#ff3f6c] hover:font-bold transition-all"
                  >
                    {name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Column 3: Hand Painted & Artisan Drops */}
            <div className="space-y-2">
              <h4 className="text-[13px] font-bold text-[#ff3f6c] tracking-wide border-b border-stone-100 pb-1">
                Artisan & Hand-Painted
              </h4>
              <div className="flex flex-col space-y-1.5 pt-1">
                {['Hand Painted Kurtas', 'Kantha Stitch Tops', 'Printed Graphic Tees', 'Anarkali Sets'].map(
                  (name) => (
                    <Link
                      key={name}
                      href={`/products?search=${encodeURIComponent(name)}`}
                      onClick={() => setActiveGender(null)}
                      className="text-[12px] text-stone-800 hover:text-[#ff3f6c] hover:font-bold transition-all"
                    >
                      {name}
                    </Link>
                  )
                )}
              </div>
            </div>

            {/* Column 4: Dynamic MongoDB Categories */}
            <div className="space-y-2">
              <h4 className="text-[13px] font-bold text-[#ff3f6c] tracking-wide border-b border-stone-100 pb-1">
                All {activeGender.toUpperCase()} Drops ({categories.length})
              </h4>
              <div className="flex flex-col space-y-1.5 pt-1">
                {categories.map((c) => (
                  <Link
                    key={c.id || c.slug}
                    href={`/categories/${c.slug}`}
                    onClick={() => setActiveGender(null)}
                    className="text-[12px] text-stone-800 hover:text-[#ff3f6c] hover:font-bold transition-all"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories Left Slide-In Modal Drawer Component */}
      <CategoriesDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </header>
  );
}
