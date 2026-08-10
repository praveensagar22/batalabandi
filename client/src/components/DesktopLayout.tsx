'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  Plus,
  Check,
  Star,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import DesktopHeader from './DesktopHeader';
import DesktopHeroBanner from './DesktopHeroBanner';
import { fetchProductsAPI, fetchCollectionsAPI } from '@/lib/api/catalog';
import { ProductItem } from '@/lib/products/types';
import { Collection } from '@/lib/collections/types';
import { formatImageUrl } from '@/lib/api/client';
import { toggleWishlist, getWishlist } from '@/lib/wishlist/store';
import { addToCart, getCart } from '@/lib/cart/store';
import { ProductGridSkeleton } from '@/components/common/Skeletons';

export default function DesktopLayout() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favs, setFavs] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [prodsData, colsData] = await Promise.all([
          fetchProductsAPI(),
          fetchCollectionsAPI(),
        ]);
        setProducts(prodsData || []);
        setCollections(
          (colsData || []).filter((c) => c.coverImage || c.bannerImage || c.shortDescription)
        );
      } catch (err) {
        console.warn('Failed to load data for desktop layout:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();

    async function loadStates() {
      const list = getWishlist();
      setFavs(list.map((i) => i.id));
      const cart = await getCart();
      setCartItems(cart.map((i) => i.productId));
    }
    loadStates();
  }, []);

  const handleToggleFav = (p: ProductItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const added = toggleWishlist({
      id: p.id,
      title: p.title,
      subtitle: p.subtitle,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      image: p.thumbnail || p.images?.[0] || '',
      category: p.category,
      collectionName: p.collectionName,
      rating: p.rating,
    });

    if (added) {
      setFavs((prev) => [...prev, p.id]);
      showToast(`Added "${p.title}" to Wishlist! ❤️`);
    } else {
      setFavs((prev) => prev.filter((id) => id !== p.id));
      showToast(`Removed "${p.title}" from Wishlist`);
    }
  };

  const handleCartClick = async (p: ProductItem, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (cartItems.includes(p.id)) {
      router.push('/cart');
      return;
    }

    await addToCart({
      productId: p.id,
      title: p.title,
      subtitle: p.subtitle,
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      image: p.thumbnail || p.images?.[0] || '',
      color: 'Standard',
      size: 'M',
      quantity: 1,
    });

    setCartItems((prev) => [...prev, p.id]);
    showToast(`Added "${p.title}" to Bag! 🛍️`);
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] font-sans">
      {/* Navbar Header */}
      <DesktopHeader />

      {/* Hero Banner Carousel */}
      <DesktopHeroBanner />

      {/* 100% MongoDB Backend Powered Collections Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-black font-serif text-stone-950 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-500" />
              Shop by Artisan Collections
            </h3>
            <p className="text-xs text-stone-500 font-semibold mt-0.5">
              Live collections fetched directly from your MongoDB database
            </p>
          </div>
          <Link
            href="/categories"
            className="text-xs font-black text-stone-700 hover:text-stone-950 border border-stone-200 bg-white px-4 py-2 rounded-xl transition shadow-2xs"
          >
            View All Collections ({collections.length}) →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {collections.length > 0 ? (
            collections.slice(0, 3).map((col) => {
              const colImage = formatImageUrl(
                col.coverImage ||
                  col.bannerImage ||
                  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
              );

              return (
                <Link
                  key={col.id || col.slug}
                  href={`/products?search=${encodeURIComponent(col.name)}`}
                  className="relative rounded-3xl overflow-hidden min-h-[250px] border border-stone-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-between p-7 bg-stone-900 text-white"
                >
                  {/* Real Photo from MongoDB */}
                  <Image
                    src={colImage}
                    alt={col.name}
                    fill
                    unoptimized
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-75"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

                  {/* Top Badge */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[10px] font-black tracking-widest uppercase bg-amber-400 text-stone-950 px-3 py-1 rounded-full shadow-2xs">
                      {col.marketing?.promoLabel || 'Featured Drop'}
                    </span>
                    <span className="text-[10px] font-bold bg-stone-950/80 backdrop-blur-md text-amber-300 px-3 py-1 rounded-full border border-amber-400/30">
                      {col.productsCount || 12} Drops Available
                    </span>
                  </div>

                  {/* Info */}
                  <div className="relative z-10 space-y-2 mt-auto pt-8">
                    <h4 className="text-2xl font-black font-serif text-white tracking-tight drop-shadow-md">
                      {col.name}
                    </h4>
                    <p className="text-xs text-stone-200 font-medium line-clamp-2 leading-relaxed">
                      {col.shortDescription || col.detailedDescription || 'Artisan handcrafted apparel drop.'}
                    </p>
                    <div className="pt-2 flex items-center gap-2 text-xs font-black text-amber-400 group-hover:text-amber-300 transition-colors">
                      <span>Explore Collection</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-60 bg-stone-200 animate-pulse rounded-3xl" />
              ))}
            </>
          )}
        </div>
      </section>

      {/* Trending Products Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-black font-serif text-stone-950">Trending Garment Drops</h3>
            <p className="text-xs text-stone-500 font-semibold mt-0.5">
              Live products fetched directly from MongoDB database
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs font-black text-stone-700 hover:text-stone-950 border border-stone-200 bg-white px-4 py-2 rounded-xl transition shadow-2xs flex items-center gap-1.5"
          >
            Explore All Products <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : products.length > 0 ? (
          <div className="grid grid-cols-4 gap-6">
            {products.map((p) => {
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
                  className="bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-between"
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

                    {/* Category Tag */}
                    <span className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md text-white text-[9px] font-extrabold px-2.5 py-1 rounded-lg uppercase">
                      {p.category || 'Drop'}
                    </span>

                    {/* Discount Badge */}
                    {discount && (
                      <span className="absolute bottom-3 left-3 bg-[#facc15] text-stone-950 text-[10px] font-black px-2 py-0.5 rounded shadow-2xs">
                        {discount}% OFF
                      </span>
                    )}

                    {/* Heart Wishlist Trigger */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleFav(p, e)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-sm flex items-center justify-center transition active:scale-90"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFav ? 'fill-red-500 text-red-500' : 'text-stone-500'
                        }`}
                        strokeWidth={2.2}
                      />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-sm font-extrabold text-stone-900 line-clamp-1 leading-snug">
                        {p.title}
                      </h4>
                      <p className="text-xs text-stone-400 font-semibold line-clamp-1 mt-0.5">
                        {p.subtitle || p.collectionName || 'Premium Collection'}
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
                          onClick={(e) => handleCartClick(p, e)}
                          aria-label="Add to cart"
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-2xs active:scale-90 ${
                            isInCart
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#facc15] text-stone-950 hover:bg-[#eab308]'
                          }`}
                        >
                          {isInCart ? (
                            <Check className="w-4 h-4" strokeWidth={3} />
                          ) : (
                            <Plus className="w-4 h-4" strokeWidth={2.5} />
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
          <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 space-y-2">
            <p className="text-sm font-black text-stone-900">No products found</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-stone-950 text-stone-400 py-12 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black font-serif text-white tracking-tight">
              BatalaBandi
            </h2>
            <p className="text-xs text-stone-500 font-semibold mt-1">
              ✦ Handcrafted Streetwear & Artisan Apparel ✦
            </p>
          </div>
          <p className="text-xs text-stone-500 font-bold">
            © 2026 BatalaBandi. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-8 right-8 z-50 bg-stone-950 text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastMsg}
        </div>
      )}
    </div>
  );
}
