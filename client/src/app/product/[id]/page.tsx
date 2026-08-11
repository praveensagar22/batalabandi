'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Heart,
  Share2,
  Star,
  Ruler,
  ShoppingBag,
  Zap,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Truck,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  MapPin,
} from 'lucide-react';
import { fetchProductsAPI } from '@/lib/api/catalog';
import { ProductItem } from '@/lib/products/types';
import SizeGuideModal from '@/components/common/SizeGuideModal';
import BottomNav from '@/components/BottomNav';
import { formatImageUrl } from '@/lib/api/client';
import { addToCart } from '@/lib/cart/store';
import { toggleWishlist, isInWishlist } from '@/lib/wishlist/store';
import { ProductDetailSkeleton } from '@/components/common/Skeletons';
import DesktopHeader from '@/components/DesktopHeader';
import DesktopFooter from '@/components/DesktopFooter';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductItem[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isFav, setIsFav] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<'fabric' | 'fit' | 'shipping' | null>('fabric');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Delivery Pincode Checker State
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  useEffect(() => {
    async function loadProduct() {
      try {
        const allProds = await fetchProductsAPI();
        const found = allProds.find((p) => p.id === id || p.slug === id);
        if (found) {
          setProduct(found);
          setIsFav(isInWishlist(found.id));
          if (found.colors && found.colors.length > 0) setSelectedColor(found.colors[0]);
          if (found.sizes && found.sizes.length > 0) setSelectedSize(found.sizes[0]);

          const related = allProds.filter(
            (p) => p.id !== found.id && (p.category === found.category || p.collectionName === found.collectionName)
          );
          setRelatedProducts(related.slice(0, 4));
        }
      } catch (err) {
        console.log('Failed to fetch product detail');
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAddToCart = () => {
    if (!product) return;
    const img = galleryImages[0] || product.thumbnail || '';
    addToCart({
      productId: product.id,
      title: product.title,
      subtitle: product.subtitle,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      image: img,
      color: selectedColor || product.colors?.[0] || 'Standard',
      size: selectedSize || product.sizes?.[0] || 'M',
      quantity: 1,
    });
    showToast(`Added "${product.title}" (${selectedSize || 'M'}) to Bag! 🛍️`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/cart');
  };

  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim().length === 6) {
      setPincodeStatus(`Fast Delivery available to ${pincode}! (Est. 3-4 days) 🚚`);
    } else {
      setPincodeStatus('Please enter a valid 6-digit Pincode');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#faf9f6]">
        <div className="hidden md:block">
          <DesktopHeader />
        </div>
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center p-6 space-y-4">
        <h2 className="text-xl font-bold text-stone-900">Product Not Found</h2>
        <Link
          href="/"
          className="px-4 py-2 bg-[#facc15] text-stone-950 text-xs font-black rounded-xl shadow-xs"
        >
          Back to Storefront
        </Link>
      </div>
    );
  }

  const rawImages =
    product.images && product.images.length > 0
      ? product.images
      : [
          product.thumbnail ||
            'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
        ];

  const galleryImages = rawImages.map((img) => formatImageUrl(img));
  const currentImage = galleryImages[selectedImageIndex] || galleryImages[0];
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
      : null;

  return (
    <div className="min-h-screen bg-[#faf9f6] text-stone-900 font-sans selection:bg-amber-400 selection:text-stone-950 relative">
      {/* Visible Kalamkari Telugu Heritage Texture Watermark at z-0 */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat opacity-20 mix-blend-multiply pointer-events-none z-0"
        style={{ backgroundImage: "url('/kalamkari-pattern.jpg')" }}
      />
      <div className="relative z-10">
      {/* Toast Banner */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-stone-950 text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-amber-400 text-xs font-bold animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* ===== DESKTOP HEADER (>= 768px) ===== */}
      <div className="hidden md:block">
        <DesktopHeader />
      </div>

      {/* ===== MOBILE TOP HEADER (< 768px) ===== */}
      <header className="block md:hidden sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200/80 px-4 py-2 flex items-center justify-between shadow-2xs">
        <button
          onClick={() => router.back()}
          className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 transition"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-stone-900 text-amber-300 rounded-full">
          {product.category || 'Collection'}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (!product) return;
              const added = toggleWishlist({
                id: product.id,
                title: product.title,
                subtitle: product.subtitle,
                price: product.price,
                compareAtPrice: product.compareAtPrice,
                image: galleryImages[0] || product.thumbnail || '',
                category: product.category,
                collectionName: product.category,
                rating: product.rating,
              });
              setIsFav(added);
              showToast(
                added
                  ? `Saved "${product.title}" to Wishlist! ❤️`
                  : `Removed "${product.title}" from Wishlist`
              );
            }}
            className="p-1.5 rounded-full bg-stone-100 text-stone-800 transition active:scale-90"
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-stone-600'}`} />
          </button>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: product.title, url: window.location.href });
              } else {
                showToast('Product link copied!');
              }
            }}
            className="p-1.5 rounded-full bg-stone-100 text-stone-800 transition"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4 text-stone-600" />
          </button>
        </div>
      </header>

      {/* ===== DESKTOP BREADCRUMBS (>= 768px) ===== */}
      <div className="hidden md:block max-w-6xl mx-auto px-6 pt-5 pb-1">
        <div className="flex items-center gap-2 text-[11.5px] text-stone-400 font-medium">
          <Link href="/" className="hover:text-stone-950 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/products" className="hover:text-stone-950 transition-colors">Products</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-stone-600 font-semibold">{product.category || 'Collection'}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-stone-900 font-bold truncate max-w-xs">{product.title}</span>
        </div>
      </div>

      {/* ===== MAIN CONTENT AREA ===== */}
      <main className="max-w-6xl mx-auto px-0 md:px-6 py-0 md:py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* ===== LEFT GALLERY COLUMN (6 COLS ON DESKTOP - MEDIUM SIZE) ===== */}
          <div className="md:col-span-6 flex flex-col md:flex-row gap-3">
            {/* Vertical Thumbnail Strip on Desktop */}
            {galleryImages.length > 1 && (
              <div className="hidden md:flex flex-col gap-2.5 shrink-0">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-20 rounded-xl overflow-hidden border transition-all ${
                      selectedImageIndex === idx
                        ? 'border-stone-950 ring-2 ring-stone-950/20 scale-105 shadow-xs'
                        : 'border-stone-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`Angle ${idx + 1}`} fill unoptimized className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image Display Box (Medium Constrained Height & Width) */}
            <div className="relative w-full aspect-[4/5] max-h-[550px] bg-stone-100 md:rounded-2xl overflow-hidden group border border-stone-200/80 shadow-2xs">
              <Image
                src={currentImage}
                alt={product.title}
                fill
                unoptimized
                priority
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Discount Badge */}
              {discount && (
                <span className="absolute top-3 left-3 bg-stone-950/90 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-xs z-10 uppercase tracking-wider">
                  {discount}% OFF
                </span>
              )}

              {/* Image Counter Badge */}
              <span className="absolute top-3 right-3 bg-stone-950/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                {selectedImageIndex + 1} / {galleryImages.length}
              </span>

              {/* Slide Arrows */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md text-stone-900 flex items-center justify-center shadow-md hover:bg-white active:scale-90 transition-transform z-10 text-base font-bold"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-md text-stone-900 flex items-center justify-center shadow-md hover:bg-white active:scale-90 transition-transform z-10 text-base font-bold"
                  >
                    ›
                  </button>
                </>
              )}
            </div>

            {/* Mobile Image Horizontal Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex md:hidden items-center gap-2 px-3 py-2 bg-white border-b border-stone-200 overflow-x-auto no-scrollbar">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-12 h-14 rounded-lg overflow-hidden shrink-0 border transition-all ${
                      selectedImageIndex === idx
                        ? 'border-stone-950 ring-1 ring-stone-950 scale-105'
                        : 'border-stone-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`Angle ${idx + 1}`} fill unoptimized className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ===== RIGHT PRODUCT DETAILS COLUMN (6 COLS ON DESKTOP - MEDIUM TYPOGRAPHY) ===== */}
          <div className="md:col-span-6 px-4 md:px-0 space-y-5">
            <div className="bg-white p-6 md:p-7 rounded-2xl border border-stone-200/90 shadow-2xs space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-widest flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/70">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                    {product.collectionName || product.themeName || 'Artisan Series'}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-semibold text-stone-700 bg-stone-50 px-2.5 py-1 rounded-md border border-stone-200/60">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating || 4.9}</span>
                    <span className="text-stone-400 font-normal">({product.salesCount || 128})</span>
                  </div>
                </div>

                <h1 className="text-xl md:text-2xl font-black text-stone-950 tracking-tight leading-tight">
                  {product.title}
                </h1>
                {product.subtitle && (
                  <p className="text-xs md:text-sm text-stone-500 font-medium mt-1 leading-relaxed">
                    {product.subtitle}
                  </p>
                )}

                {/* Pricing Row */}
                <div className="flex items-baseline gap-3 mt-3 pt-3 border-t border-stone-100">
                  <span className="text-2xl md:text-3xl font-black text-stone-950 font-mono">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span className="text-sm font-semibold text-stone-400 line-through font-mono">
                      ₹{product.compareAtPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200/60">
                    Inclusive of all taxes
                  </span>
                </div>
              </div>

              {/* Color Options */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-700">
                      Color: <strong className="text-stone-950">{selectedColor}</strong>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => {
                      const isSelected = selectedColor === c;
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setSelectedColor(c)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                            isSelected
                              ? 'bg-stone-950 text-white border-stone-950 shadow-2xs'
                              : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Size Options & Size Guide */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-stone-700">
                      Select Size: <strong className="text-stone-950">{selectedSize}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-xs font-bold text-stone-800 flex items-center gap-1 hover:underline"
                    >
                      <Ruler className="w-3.5 h-3.5" /> Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => {
                      const isSelected = selectedSize === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSelectedSize(s)}
                          className={`w-10 h-10 rounded-xl text-xs font-bold transition border flex items-center justify-center ${
                            isSelected
                              ? 'bg-amber-400 text-stone-950 border-amber-500 font-extrabold shadow-2xs'
                              : 'bg-stone-50 text-stone-800 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* DESKTOP ACTION BUTTONS (ADD TO BAG & BUY NOW) */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shadow-2xs active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-300" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="flex-1 py-3 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-xs font-extrabold rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs active:scale-98"
                >
                  <Zap className="w-4 h-4 fill-stone-950" />
                  <span>Buy Now</span>
                </button>

                {/* Wishlist Heart Desktop */}
                <button
                  onClick={() => {
                    if (!product) return;
                    const added = toggleWishlist({
                      id: product.id,
                      title: product.title,
                      subtitle: product.subtitle,
                      price: product.price,
                      compareAtPrice: product.compareAtPrice,
                      image: galleryImages[0] || product.thumbnail || '',
                      category: product.category,
                      collectionName: product.category,
                      rating: product.rating,
                    });
                    setIsFav(added);
                    showToast(
                      added
                        ? `Saved "${product.title}" to Wishlist! ❤️`
                        : `Removed "${product.title}" from Wishlist`
                    );
                  }}
                  className="p-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 transition active:scale-90 border border-stone-200"
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-stone-600'}`} />
                </button>
              </div>

              {/* Pincode Delivery Estimator Form */}
              <div className="bg-stone-50/80 p-3.5 rounded-xl border border-stone-200 space-y-2">
                <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-stone-700" />
                  <span>Delivery Pincode Check</span>
                </label>
                <form onSubmit={handleCheckPincode} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit Pincode"
                    className="flex-1 px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-stone-950"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-lg transition"
                  >
                    Check
                  </button>
                </form>
                {pincodeStatus && (
                  <p className="text-[11px] font-semibold text-stone-700 pt-0.5">{pincodeStatus}</p>
                )}
              </div>

              {/* Product Story */}
              <div className="space-y-1.5 pt-2 border-t border-stone-100">
                <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">Product Story</h3>
                <div
                  className="text-xs text-stone-600 leading-relaxed font-normal"
                  dangerouslySetInnerHTML={{ __html: product.description || '' }}
                />
              </div>

              {/* Accordions */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                {/* Fabric Accordion */}
                <div className="border border-stone-200/80 rounded-xl overflow-hidden bg-stone-50/50">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'fabric' ? null : 'fabric')}
                    className="w-full p-3 flex items-center justify-between text-xs font-bold text-stone-900"
                  >
                    <span>Fabric & Specification</span>
                    {openAccordion === 'fabric' ? <ChevronUp className="w-3.5 h-3.5 text-stone-500" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-500" />}
                  </button>
                  {openAccordion === 'fabric' && (
                    <div className="px-3 pb-3 text-xs text-stone-600 space-y-1 border-t border-stone-200/60 pt-2 font-normal">
                      <p>• <strong>Material:</strong> {product.material || '100% Super Combed Organic Cotton'}</p>
                      <p>• <strong>Weight:</strong> 240 GSM Heavyweight Terry</p>
                      <p>• <strong>Fit:</strong> {product.fitType || 'Oversized Drop Shoulder'}</p>
                      <p>• <strong>Dyeing:</strong> Bio-washed pre-shrunk organic pigment</p>
                    </div>
                  )}
                </div>

                {/* Shipping Accordion */}
                <div className="border border-stone-200/80 rounded-xl overflow-hidden bg-stone-50/50">
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
                    className="w-full p-3 flex items-center justify-between text-xs font-bold text-stone-900"
                  >
                    <span>Shipping & Return Policy</span>
                    {openAccordion === 'shipping' ? <ChevronUp className="w-3.5 h-3.5 text-stone-500" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-500" />}
                  </button>
                  {openAccordion === 'shipping' && (
                    <div className="px-3 pb-3 text-xs text-stone-600 space-y-1.5 border-t border-stone-200/60 pt-2 font-normal">
                      <div className="flex items-center gap-2">
                        <Truck className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                        <span>Free Shipping across India on orders above ₹999</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <RotateCcw className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                        <span>Easy 7-day hassle-free size exchange & return</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-700 flex-shrink-0" />
                        <span>100% Authentic quality guaranteed</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Showcase (Minimalist 4:5 Cards) */}
        {relatedProducts.length > 0 && (
          <section className="mt-12 pb-12 border-t border-stone-200 pt-8">
            <h3 className="text-lg font-bold text-stone-950 mb-5 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
              You May Also Like
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.id}`}
                  className="group flex flex-col space-y-2"
                >
                  <div className="relative aspect-[4/5] bg-stone-100 rounded-2xl overflow-hidden border border-stone-200/80">
                    <Image
                      src={formatImageUrl(p.thumbnail || p.images?.[0] || '')}
                      alt={p.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="space-y-0.5 px-1">
                    <h4 className="text-xs font-bold text-stone-950 truncate group-hover:text-stone-600 transition-colors">{p.title}</h4>
                    <span className="text-xs font-black text-stone-950">
                      ₹{p.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Size Guide Bottom Sheet Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={product.category}
      />

      {/* ===== MOBILE FIXED BOTTOM ACTION BAR (< 768px) ===== */}
      <div className="block md:hidden fixed bottom-12 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/80 p-3 px-4 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-stone-400 font-bold block">Total Price</span>
          <span className="text-lg font-black text-stone-950 font-mono">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-[260px]">
          <button
            onClick={handleAddToCart}
            className="flex-1 py-2.5 bg-stone-950 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
            <span>Add to Bag</span>
          </button>

          <button
            onClick={handleBuyNow}
            className="flex-1 py-2.5 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-xs font-extrabold rounded-xl transition flex items-center justify-center gap-1 shadow-xs"
          >
            <Zap className="w-3.5 h-3.5 fill-stone-950" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Dock Navigation */}
      <div className="block md:hidden">
        <BottomNav />
      </div>

      {/* ===== DESKTOP FOOTER (>= 768px) ===== */}
      <div className="hidden md:block">
        <DesktopFooter />
      </div>
      </div>
    </div>
  );
}
