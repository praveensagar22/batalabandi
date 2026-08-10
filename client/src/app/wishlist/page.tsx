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
  Plus,
} from 'lucide-react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.12),_transparent_40%),linear-gradient(180deg,#fffdf7_0%,#fefce8_100%)] font-sans text-stone-900 pb-28">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-stone-950 text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-bounce border border-amber-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      <Header activeTab="all" />

      <main className="px-4 pb-24 pt-4 max-w-md mx-auto">
        {/* Top Header Card */}
        <section className="rounded-3xl border border-stone-200 bg-white/90 p-4 shadow-xs backdrop-blur mb-4">
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
          <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 p-6 space-y-3 shadow-xs">
            <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-stone-700">Loading Wishlist...</p>
          </div>
        ) : items.length > 0 ? (
          /* Wishlist 2-Column Grid */
          <div className="grid grid-cols-2 gap-3 mb-6">
            {items.map((item) => {
              const imageSrc = formatImageUrl(item.image);
              const discount =
                item.compareAtPrice && item.compareAtPrice > item.price
                  ? Math.round(((item.compareAtPrice - item.price) / item.compareAtPrice) * 100)
                  : null;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-2xs flex flex-col justify-between group"
                >
                  {/* Image Container */}
                  <div className="relative h-[155px] bg-stone-100 overflow-hidden">
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
                    <span className="absolute top-2 left-2 bg-stone-950/80 backdrop-blur-md text-white text-[8.5px] font-extrabold px-1.5 py-0.5 rounded shadow-2xs uppercase tracking-wider">
                      {item.collectionName || item.category || 'Wishlist'}
                    </span>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemove(item.id, item.title)}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md shadow-xs flex items-center justify-center text-red-500 active:scale-90 transition-transform"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Discount Badge */}
                    {discount && (
                      <span className="absolute bottom-2 left-2 bg-[#ff5722] text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-2xs">
                        {discount}% OFF
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <Link href={`/product/${item.id}`}>
                        <h3 className="text-xs font-extrabold text-stone-950 line-clamp-1 group-hover:text-amber-600 transition-colors">
                          {item.title}
                        </h3>
                      </Link>
                      <p className="text-[9.5px] text-stone-400 font-medium line-clamp-1 mt-0.5">
                        {item.subtitle || 'Handcrafted Edition'}
                      </p>
                    </div>

                    <div>
                      {/* Price Section */}
                      <div className="flex items-baseline gap-1.5 mt-1">
                        <span className="text-[13px] font-black text-stone-950">
                          ₹{item.price.toLocaleString('en-IN')}
                        </span>
                        {item.compareAtPrice && item.compareAtPrice > item.price && (
                          <span className="text-[9.5px] font-bold text-stone-400 line-through">
                            ₹{item.compareAtPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {/* Move to Bag Action Button */}
                      <button
                        onClick={() => handleMoveToBag(item)}
                        className="w-full mt-2.5 py-2 bg-stone-950 hover:bg-stone-800 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-2xs active:scale-95 transition-all"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-yellow-400" />
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
          <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 p-6 space-y-3 shadow-2xs mb-6">
            <Heart className="w-12 h-12 text-red-300 mx-auto fill-red-50" />
            <h2 className="text-base font-black text-stone-950">Your Wishlist is empty</h2>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              Save your favorite streetwear, hoodies, and hand-painted collections here to review later!
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center gap-1 px-5 py-2.5 bg-[#facc15] text-stone-950 text-xs font-black rounded-xl shadow-xs active:scale-95 transition-all mt-2"
            >
              Explore Collections <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
