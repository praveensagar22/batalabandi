'use client';

import { useState, useEffect, useMemo } from 'react';
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
  Palette,
  Scissors,
  Flame,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';
import DesktopHeader from './DesktopHeader';
import DesktopHeroBanner from './DesktopHeroBanner';
import DesktopFooter from './DesktopFooter';
import { fetchProductsAPI, fetchCollectionsAPI } from '@/lib/api/catalog';
import { ProductItem } from '@/lib/products/types';
import { Collection } from '@/lib/collections/types';
import { formatImageUrl } from '@/lib/api/client';
import { toggleWishlist, getWishlist } from '@/lib/wishlist/store';
import { addToCart, getCart } from '@/lib/cart/store';
import { ProductGridSkeleton } from '@/components/common/Skeletons';



const TESTIMONIALS = [
  {
    quote: "The 240 GSM heavyweight cotton feel is incredible. It has the exact boxy, drop-shoulder fit I was looking for.",
    author: "Karthik R.",
    city: "Hyderabad",
    rating: 5,
    verified: "Verified Buyer",
  },
  {
    quote: "Hand-painted artwork is super detailed. It didn't fade or crack after bio-washing. Highly recommended!",
    author: "Ananya S.",
    city: "Bengaluru",
    rating: 5,
    verified: "Verified Buyer",
  },
  {
    quote: "Lightning fast shipping. Got my order in 3 days. Clean packaging and top quality fabric.",
    author: "Vikram Mehta",
    city: "Mumbai",
    rating: 5,
    verified: "Verified Buyer",
  },
];

export default function DesktopLayout() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favs, setFavs] = useState<string[]>([]);
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
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

  // Filter products by homepage category tab
  const filteredProducts = useMemo(() => {
    if (activeCategoryFilter === 'all') return products;
    if (activeCategoryFilter === 'men') return products.filter((p) => p.gender === 'Men' || p.gender === 'Unisex');
    if (activeCategoryFilter === 'women') return products.filter((p) => p.gender === 'Women');
    if (activeCategoryFilter === 'unisex') return products.filter((p) => p.gender === 'Unisex' || p.category?.toLowerCase().includes('hoodie'));
    if (activeCategoryFilter === 'bestsellers') return products.filter((p) => (p.rating || 0) >= 4.8);
    return products;
  }, [products, activeCategoryFilter]);

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900 font-sans selection:bg-amber-400 selection:text-stone-950 relative">
      {/* Kalamkari Telugu Heritage Watermark at z-0 */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-20 mix-blend-multiply pointer-events-none z-0"
        style={{ backgroundImage: "url('/kalamkari-pattern.jpg')" }}
      />

      {/* Main Content Sections wrapped at z-10 */}
      <div className="relative z-10">
        {/* Top Minimalist Ticker Banner */}
      <div className="bg-stone-950 text-stone-300 text-[11px] font-medium tracking-[0.2em] uppercase py-2.5 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="bg-amber-400 text-stone-950 text-[9.5px] font-black tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
              తెలుగు సంస్కృతి • NEW DROPS
            </span>
            <p className="text-stone-300 font-semibold tracking-wide">
              Free Express Shipping Across India &gt; ₹999 • Code: <span className="text-white font-bold underline">WELCOME10</span>
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-8 text-[10px] text-stone-400 font-semibold tracking-widest">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-stone-300" /> 100% ORGANIC COTTON
            </span>
            <span className="flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-stone-300" /> 7-DAY EASY RETURNS
            </span>
          </div>
        </div>
      </div>

      {/* Navbar Header */}
      <DesktopHeader />

      {/* Hero Banner Carousel */}
      <DesktopHeroBanner />

      {/* ===== SECTION 2: MONGODB BACKEND COLLECTIONS SPOTLIGHT ===== */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="bg-stone-950 text-white rounded-3xl p-10 md:p-14 border border-stone-800 shadow-2xl relative overflow-hidden">
          {/* Muggu Traditional Pattern Watermark Overlay */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-15 mix-blend-screen pointer-events-none"
            style={{ backgroundImage: "url('/muggu-pattern.jpg')" }}
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400 bg-amber-950/80 px-3 py-0.5 rounded-full border border-amber-500/30">
                  తెలుగు సంస్కృతి • Official Release
                </span>
                <span className="text-[10px] text-stone-400 font-semibold hidden sm:inline">
                  (Kalamkari • Ikat • Muggu Craft)
                </span>
              </div>
              <h3 className="text-3xl font-black text-white tracking-tight">
                Featured Artisan Collections
              </h3>
              <p className="text-xs text-stone-400 font-medium mt-1">
                Handcrafted limited edition Telugu heritage & streetwear drops
              </p>
            </div>

            <Link
              href="/products"
              className="text-xs font-bold uppercase tracking-widest text-stone-950 bg-white hover:bg-stone-200 px-6 py-3 rounded-full transition shadow-md shrink-0 self-start md:self-auto"
            >
              Explore All Drops ({collections.length} Collections) →
            </Link>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
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
                    className="relative rounded-2xl overflow-hidden aspect-[4/5] border border-stone-800 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group flex flex-col justify-between p-6 bg-stone-900"
                  >
                    <Image
                      src={colImage}
                      alt={col.name}
                      fill
                      unoptimized
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-75"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

                    <div className="relative z-10 flex items-center justify-between">
                      <span className="text-[9.5px] font-bold tracking-widest uppercase bg-white text-stone-950 px-3 py-1 rounded-full">
                        {col.marketing?.promoLabel || 'Featured'}
                      </span>
                      <span className="text-[10px] font-semibold bg-stone-950/80 backdrop-blur-md text-stone-300 px-3 py-1 rounded-full border border-white/10">
                        {col.productsCount || 12} Drops
                      </span>
                    </div>

                    <div className="relative z-10 space-y-1.5 mt-auto">
                      <h4 className="text-xl font-black text-white tracking-tight">
                        {col.name}
                      </h4>
                      <p className="text-xs text-stone-300 font-medium line-clamp-2">
                        {col.shortDescription || col.detailedDescription || 'Artisan handcrafted apparel drop.'}
                      </p>
                      <div className="pt-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white group-hover:text-amber-300 transition-colors">
                        <span>Explore Collection</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <>
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-[4/5] bg-stone-800 animate-pulse rounded-2xl" />
                ))}
              </>
            )}
          </div>
        </div>
      </section>

      {/* ===== SECTION 3: TRENDING GARMENT DROPS ===== */}
      <section className="max-w-7xl mx-auto px-6 pb-20 md:pb-24">
        {/* Header & Filter Tabs Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-stone-200 pb-6">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-400">
              Live Catalog
            </span>
            <h3 className="text-3xl font-black text-stone-950 tracking-tight mt-1">
              Trending Garment Drops
            </h3>
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar bg-stone-100 p-1.5 rounded-full border border-stone-200">
            {[
              { id: 'all', label: 'All Drops' },
              { id: 'men', label: "Men's" },
              { id: 'women', label: "Women's" },
              { id: 'unisex', label: 'Unisex' },
              { id: 'bestsellers', label: 'Best Sellers' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategoryFilter(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  activeCategoryFilter === tab.id
                    ? 'bg-stone-950 text-white shadow-sm'
                    : 'text-stone-600 hover:bg-white hover:text-stone-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <ProductGridSkeleton count={8} />
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.slice(0, 8).map((p) => {
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
                  className="group flex flex-col space-y-3"
                >
                  {/* Aspect 4:5 Image Container */}
                  <div className="relative aspect-[4/5] bg-stone-100 rounded-2xl overflow-hidden border border-stone-200/60">
                    <Image
                      src={imageSrc}
                      alt={p.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Discount Badge */}
                    {discount && (
                      <span className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md text-white text-[9.5px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {discount}% OFF
                      </span>
                    )}

                    {/* Heart Wishlist Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleFav(p, e)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md shadow-xs flex items-center justify-center transition active:scale-90 hover:bg-white text-stone-900"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFav ? 'fill-red-500 text-red-500' : 'text-stone-700'
                        }`}
                        strokeWidth={1.8}
                      />
                    </button>

                    {/* Hover Quick Add Overlay Button */}
                    <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                      <button
                        type="button"
                        onClick={(e) => handleCartClick(p, e)}
                        className={`w-full py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-all shadow-lg ${
                          isInCart
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-950 text-white hover:bg-stone-800'
                        }`}
                      >
                        {isInCart ? 'In Bag ✓' : '+ Add To Bag'}
                      </button>
                    </div>
                  </div>

                  {/* Clean Minimalist Details */}
                  <div className="space-y-1 px-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-extrabold text-stone-950 truncate group-hover:text-stone-600 transition-colors">
                        {p.title}
                      </h4>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-black text-stone-950">
                        ₹{p.price.toLocaleString('en-IN')}
                      </span>
                      {p.compareAtPrice && p.compareAtPrice > p.price && (
                        <span className="text-xs font-semibold text-stone-400 line-through">
                          ₹{p.compareAtPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 space-y-2">
            <p className="text-sm font-black text-stone-900">No products found in this filter</p>
            <button
              onClick={() => setActiveCategoryFilter('all')}
              className="text-xs font-bold text-stone-900 underline"
            >
              Reset to All Drops
            </button>
          </div>
        )}
      </section>

      {/* ===== SECTION 4: THE BATALABANDI CRAFT STORY (TELUGU HERITAGE) ===== */}
      <section className="bg-stone-950 text-white py-20 md:py-24 border-y border-stone-800 relative overflow-hidden">
        {/* Subtle Telugu Muggu Pattern Watermark */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 mix-blend-screen pointer-events-none"
          style={{ backgroundImage: "url('/muggu-pattern.jpg')" }}
        />

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400 bg-amber-950/80 px-3.5 py-1 rounded-full border border-amber-500/30">
                తెలుగు సంస్కృతి • మన నేత
              </span>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                Handcrafted Telugu Excellence
              </span>
            </div>

            <h2 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight">
              Crafted by Artisan Weavers. Designed for Modern Street Culture.
            </h2>
            <p className="text-xs lg:text-sm text-stone-300 leading-relaxed font-medium">
              At BatalaBandi (<strong className="text-amber-300 font-bold">బట్టల బండి</strong>), every drop weaves a story of authentic Telugu craftsmanship. From Machilipatnam Kalamkari block prints and Pochampally Ikat patterns to 240+ GSM bio-washed organic cotton, we honor classic Indian textile art with high-fashion streetwear fits.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-stone-900/90 p-5 rounded-2xl border border-stone-800/80 shadow-inner">
                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block mb-1">మగ్గం & ఇకత్ నేత</span>
                <h4 className="text-xl font-black font-mono text-white">Authentic Handloom</h4>
                <p className="text-xs text-stone-400 font-semibold mt-1">Kalamkari & Pochampally Motifs</p>
              </div>
              <div className="bg-stone-900/90 p-5 rounded-2xl border border-stone-800/80 shadow-inner">
                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest block mb-1">ఉత్తమ క్వాలిటీ</span>
                <h4 className="text-xl font-black font-mono text-white">240+ GSM Cotton</h4>
                <p className="text-xs text-stone-400 font-semibold mt-1">Heavyweight Bio-washed Fabric</p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-white hover:bg-stone-200 text-stone-950 px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest transition shadow-xl active:scale-95"
              >
                <span>Shop Handcrafted Apparel</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="relative h-72 rounded-3xl overflow-hidden border border-stone-800 shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=600&q=80"
                alt="Artisan Craftsmanship"
                fill
                unoptimized
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="relative h-72 rounded-3xl overflow-hidden border border-stone-800 shadow-2xl mt-8">
              <Image
                src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80"
                alt="Organic Apparel"
                fill
                unoptimized
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 5: CUSTOMER REVIEWS ===== */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-24">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-14">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-stone-400">
            Verified Community
          </span>
          <h3 className="text-3xl font-black text-stone-950 tracking-tight">Loved by Streetwear Fans</h3>
          <p className="text-xs text-stone-500 font-medium">
            Real feedback from verified buyers across India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div
              key={idx}
              className="bg-white p-7 rounded-3xl border border-stone-200/90 shadow-2xs space-y-4 flex flex-col justify-between hover:shadow-md transition"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-stone-700 font-medium leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-extrabold text-stone-950">{t.author}</h4>
                  <p className="text-[10px] text-stone-400 font-bold">{t.city}</p>
                </div>
                <span className="text-[10px] font-semibold text-stone-700 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
                  ✓ {t.verified}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Desktop Footer */}
      <DesktopFooter />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-8 right-8 z-50 bg-stone-950 text-white text-xs font-bold px-5 py-3 rounded-full shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          {toastMsg}
        </div>
      )}
      </div>
    </div>
  );
}
