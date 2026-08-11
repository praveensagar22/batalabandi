'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  ShoppingBag,
  Trash2,
  Sparkles,
  ArrowRight,
  Star,
  CheckCircle2,
  ArrowLeft,
  ChevronRight,
} from 'lucide-react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import DesktopHeader from '@/components/DesktopHeader';
import DesktopFooter from '@/components/DesktopFooter';
import { getWishlist, removeFromWishlist, WishlistItem } from '@/lib/wishlist/store';
import { addToCart } from '@/lib/cart/store';
import { formatImageUrl } from '@/lib/api/client';

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadWishlist = () => {
    const list = getWishlist();
    setItems(list);
    setIsLoading(false);
  };

  useEffect(() => {
    loadWishlist();
    window.addEventListener('storage', loadWishlist);
    return () => window.removeEventListener('storage', loadWishlist);
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleRemove = (id: string, title: string) => {
    const updated = removeFromWishlist(id);
    setItems(updated);
    showToast(`Removed "${title}" from Wishlist`);
  };

  const handleMoveToBag = async (item: WishlistItem) => {
    await addToCart({
      productId: item.id,
      title: item.title,
      subtitle: item.subtitle,
      price: item.price,
      compareAtPrice: item.compareAtPrice,
      image: item.image,
      color: 'Standard',
      size: 'M',
      quantity: 1,
    });

    const updatedWishlist = removeFromWishlist(item.id);
    setItems(updatedWishlist);
    showToast(`Moved "${item.title}" to Bag! 🛍️`);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] font-sans text-stone-900 selection:bg-amber-400 selection:text-stone-950">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-stone-950 text-white text-xs font-bold px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-bounce border border-amber-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ===== DESKTOP HEADER (>= 768px) ===== */}
      <div className="hidden md:block">
        <DesktopHeader />
      </div>

      {/* ===== MOBILE HEADER (< 768px) ===== */}
      <div className="block md:hidden">
        <Header activeTab="all" />
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* Desktop Breadcrumbs & Page Header */}
        <div className="hidden md:flex items-center justify-between pb-6 border-b border-stone-200 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-400 font-semibold mb-2">
              <Link href="/" className="hover:text-stone-950 transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-stone-900 font-bold">Wishlist</span>
            </div>
            <h1 className="text-3xl font-black font-serif text-stone-950 flex items-center gap-2">
              <Heart className="w-7 h-7 text-red-500 fill-red-500" />
              Saved Wishlist ({items.length} Items)
            </h1>
          </div>

          <Link
            href="/products"
            className="text-xs font-black text-stone-700 hover:text-stone-950 border border-stone-200 bg-white px-4 py-2.5 rounded-xl transition shadow-2xs hover:shadow-xs flex items-center gap-1.5"
          >
            Explore More Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Header Card */}
        <section className="block md:hidden rounded-3xl border border-stone-200 bg-white/90 p-4 shadow-xs backdrop-blur mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link
                href="/categories"
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 active:scale-90 transition-transform"
              >
                <ArrowLeft className="w-4.5 h-4.5" />
              </Link>
              <div>
                <h1 className="text-lg font-black text-stone-950">My Wishlist</h1>
                <p className="text-[10px] font-bold text-stone-500">
                  {items.length} {items.length === 1 ? 'Saved Item' : 'Saved Items'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-extrabold text-stone-900 bg-red-50 px-3 py-1.5 rounded-full border border-red-200">
              <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
              <span>{items.length}</span>
            </div>
          </div>
        </section>

        {isLoading ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-4 shadow-xs max-w-md mx-auto">
            <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-stone-700">Loading Wishlist...</p>
          </div>
        ) : items.length > 0 ? (
          /* Wishlist 4-Column Desktop Grid */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {items.map((item) => {
              const imageSrc = formatImageUrl(item.image);
              const discount =
                item.compareAtPrice && item.compareAtPrice > item.price
                  ? Math.round(((item.compareAtPrice - item.price) / item.compareAtPrice) * 100)
                  : null;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl md:rounded-3xl overflow-hidden border border-stone-200/90 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-between"
                >
                  {/* Image Container */}
                  <div className="relative h-44 md:h-64 bg-stone-100 overflow-hidden">
                    <Link href={`/product/${item.id}`} className="block w-full h-full">
                      <Image
                        src={imageSrc}
                        alt={item.title}
                        fill
                        unoptimized
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>

                    {/* Category Tag */}
                    <span className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md text-white text-[8.5px] md:text-[9px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                      {item.collectionName || item.category || 'Wishlist'}
                    </span>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemove(item.id, item.title)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-xs flex items-center justify-center text-red-500 hover:bg-white active:scale-90 transition-transform"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {/* Discount Badge */}
                    {discount && (
                      <span className="absolute bottom-3 left-3 bg-[#facc15] text-stone-950 text-[9.5px] md:text-[10px] font-black px-2 py-0.5 rounded shadow-2xs">
                        {discount}% OFF
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-3 md:p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <Link href={`/product/${item.id}`}>
                        <h3 className="text-xs md:text-sm font-extrabold text-stone-950 line-clamp-1 group-hover:text-amber-600 transition-colors">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-[10px] md:text-xs text-stone-400 font-medium line-clamp-1 mt-0.5">
                        {item.subtitle || 'Handcrafted Edition'}
                      </p>
                    </div>

                    <div>
                      {/* Price Section */}
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-sm md:text-base font-black text-stone-950 font-mono">
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>
                        {item.compareAtPrice && item.compareAtPrice > item.price && (
                          <span className="text-xs font-bold text-stone-400 line-through font-mono">
                            ₹{item.compareAtPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {/* Move to Bag Action Button */}
                      <button
                        onClick={() => handleMoveToBag(item)}
                        className="w-full mt-3 py-2.5 md:py-3 bg-stone-950 hover:bg-stone-800 text-white rounded-xl md:rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all"
                      >
                        <ShoppingBag className="w-4 h-4 text-yellow-400" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty Wishlist State */
          <div className="py-20 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-4 shadow-2xs max-w-md mx-auto">
            <Heart className="w-16 h-16 text-red-300 mx-auto fill-red-50" />
            <h2 className="text-xl font-black text-stone-950">Your Wishlist is empty</h2>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              Save your favorite streetwear, hoodies, and hand-painted collections here to review later!
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#facc15] text-stone-950 text-xs font-black rounded-xl shadow-xs hover:bg-[#eab308] active:scale-95 transition-all mt-2"
            >
              Explore Collections <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </main>

      {/* Mobile Dock Navigation */}
      <div className="block md:hidden">
        <BottomNav />
      </div>

      {/* ===== DESKTOP FOOTER (>= 768px) ===== */}
      <div className="hidden md:block">
        <DesktopFooter />
      </div>
    </div>
  );
}
