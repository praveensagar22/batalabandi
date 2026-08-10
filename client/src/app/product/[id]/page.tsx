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
} from 'lucide-react';
import { fetchProductsAPI } from '@/lib/api/catalog';
import { ProductItem } from '@/lib/products/types';
import SizeGuideModal from '@/components/common/SizeGuideModal';
import BottomNav from '@/components/BottomNav';
import { formatImageUrl } from '@/lib/api/client';
import { addToCart } from '@/lib/cart/store';
import { ProductDetailSkeleton } from '@/components/common/Skeletons';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();

  const [product, setProduct] = useState<ProductItem | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isFav, setIsFav] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<'fabric' | 'fit' | 'shipping' | null>('fabric');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        const allProds = await fetchProductsAPI();
        const found = allProds.find((p) => p.id === id || p.slug === id);
        if (found) {
          setProduct(found);
          if (found.colors && found.colors.length > 0) setSelectedColor(found.colors[0]);
          if (found.sizes && found.sizes.length > 0) setSelectedSize(found.sizes[0]);
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

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center font-sans space-y-3">
        <h2 className="text-lg font-black text-stone-900">Garment Not Found</h2>
        <p className="text-xs text-stone-500">The product you are looking for may have been updated or removed.</p>
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
    <div className="min-h-screen bg-stone-50 text-stone-900 pb-28 font-sans selection:bg-yellow-400 selection:text-stone-950">
      {/* Toast Banner */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-stone-950 text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 border border-yellow-400 text-xs font-bold animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="w-4 h-4 text-yellow-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Mobile Bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200/80 px-4 py-2.5 flex items-center justify-between shadow-2xs">
        <button
          onClick={() => router.back()}
          className="p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 transition"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 bg-stone-900 text-yellow-400 rounded-full">
          {product.category || 'Collection'}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFav(!isFav)}
            className="p-1.5 rounded-full bg-stone-100 text-stone-800 transition"
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

      {/* Main Image Gallery Carousel */}
      <div className="relative w-full aspect-[4/5] bg-stone-900 overflow-hidden group">
        <Image
          src={currentImage}
          alt={product.title}
          fill
          unoptimized
          priority
          className="object-cover transition-all duration-300"
        />

        {/* Discount Badge */}
        {discount && (
          <span className="absolute top-3 left-3 bg-[#ff5722] text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-md z-10">
            {discount}% OFF
          </span>
        )}

        {/* Image Counter Badge e.g. 1/5 */}
        <span className="absolute top-3 right-3 bg-stone-950/70 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md z-10">
          {selectedImageIndex + 1} / {galleryImages.length}
        </span>

        {/* Previous Image Arrow */}
        {galleryImages.length > 1 && (
          <button
            onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md text-stone-900 flex items-center justify-center shadow-md active:scale-90 transition-transform z-10"
          >
            ‹
          </button>
        )}

        {/* Next Image Arrow */}
        {galleryImages.length > 1 && (
          <button
            onClick={() => setSelectedImageIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md text-stone-900 flex items-center justify-center shadow-md active:scale-90 transition-transform z-10"
          >
            ›
          </button>
        )}
      </div>

      {/* 5-Picture Thumbnail Strip */}
      {galleryImages.length > 1 && (
        <div className="flex items-center gap-2 px-3 py-2 bg-white border-b border-stone-200 overflow-x-auto no-scrollbar">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImageIndex(idx)}
              className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                selectedImageIndex === idx
                  ? 'border-amber-500 ring-2 ring-amber-400/40 scale-105'
                  : 'border-stone-200 opacity-60 hover:opacity-100'
              }`}
            >
              <Image src={img} alt={`Angle ${idx + 1}`} fill unoptimized className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Main Product Info Section */}
      <div className="p-4 sm:p-6 bg-white space-y-5 rounded-t-3xl -mt-4 relative z-10 shadow-sm border-t border-stone-100">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600 fill-amber-600" />
              {product.collectionName || product.themeName || 'Artisan Series'}
            </span>
            <div className="flex items-center gap-1 text-xs font-bold text-stone-800 bg-stone-100 px-2 py-0.5 rounded-md">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating || 4.9}</span>
              <span className="text-stone-400 text-[10px]">({product.salesCount || 128})</span>
            </div>
          </div>

          <h1 className="text-lg sm:text-xl font-black text-stone-950 tracking-tight leading-tight">
            {product.title}
          </h1>
          {product.subtitle && (
            <p className="text-xs text-stone-500 font-medium mt-1 leading-snug">{product.subtitle}</p>
          )}

          {/* Pricing Row */}
          <div className="flex items-baseline gap-2.5 mt-3">
            <span className="text-2xl font-black text-stone-950 font-mono">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-sm font-bold text-stone-400 line-through font-mono">
                ₹{product.compareAtPrice.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Inclusive of all taxes
            </span>
          </div>
        </div>

        {/* Color Options */}
        {product.colors && product.colors.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-800">Color: <strong className="text-stone-950">{selectedColor}</strong></span>
              <span className="text-[10px] text-stone-400">{product.colors.length} options</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => {
                const isSelected = selectedColor === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition border ${
                      isSelected
                        ? 'bg-stone-950 text-white border-stone-950 shadow-xs'
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
              <span className="font-bold text-stone-800">Select Size</span>
              <button
                type="button"
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-[11px] font-bold text-amber-700 flex items-center gap-1 hover:underline"
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
                    className={`w-11 h-11 rounded-xl text-xs font-black transition border flex items-center justify-center ${
                      isSelected
                        ? 'bg-yellow-400 text-stone-950 border-yellow-500 shadow-xs scale-105'
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

        {/* Description */}
        <div className="space-y-1.5 pt-2 border-t border-stone-100">
          <h3 className="text-xs font-extrabold text-stone-900 uppercase tracking-wider">Product Story</h3>
          <div
            className="text-xs text-stone-600 leading-relaxed font-medium"
            dangerouslySetInnerHTML={{ __html: product.description || '' }}
          />
        </div>

        {/* Garment Details Accordions */}
        <div className="space-y-2 pt-2 border-t border-stone-100">
          {/* Fabric & Material Accordion */}
          <div className="border border-stone-200/80 rounded-2xl overflow-hidden bg-stone-50/50">
            <button
              onClick={() => setOpenAccordion(openAccordion === 'fabric' ? null : 'fabric')}
              className="w-full p-3.5 flex items-center justify-between text-xs font-extrabold text-stone-900"
            >
              <span>Fabric & Specification</span>
              {openAccordion === 'fabric' ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
            </button>
            {openAccordion === 'fabric' && (
              <div className="px-3.5 pb-3.5 text-xs text-stone-600 space-y-1 border-t border-stone-200/60 pt-2 font-medium">
                <p>• <strong>Material:</strong> {product.material || '100% Super Combed Organic Cotton'}</p>
                <p>• <strong>Weight:</strong> 240 GSM Heavyweight Terry</p>
                <p>• <strong>Fit:</strong> {product.fitType || 'Oversized Drop Shoulder'}</p>
                <p>• <strong>Dyeing:</strong> Bio-washed pre-shrunk organic pigment</p>
              </div>
            )}
          </div>

          {/* Shipping & Delivery Accordion */}
          <div className="border border-stone-200/80 rounded-2xl overflow-hidden bg-stone-50/50">
            <button
              onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
              className="w-full p-3.5 flex items-center justify-between text-xs font-extrabold text-stone-900"
            >
              <span>Shipping & Return Policy</span>
              {openAccordion === 'shipping' ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
            </button>
            {openAccordion === 'shipping' && (
              <div className="px-3.5 pb-3.5 text-xs text-stone-600 space-y-1.5 border-t border-stone-200/60 pt-2 font-medium">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>Free Shipping across India on orders above ₹999</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>Easy 7-day hassle-free size exchange & return</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>100% Authentic quality guaranteed</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Mobile Purchase Bottom Bar */}
      <div className="fixed bottom-12 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/80 p-3 px-4 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-stone-400 font-bold block">Total Price</span>
          <span className="text-lg font-black text-stone-950 font-mono">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-[260px]">
          <button
            onClick={handleAddToCart}
            className="flex-1 py-2.5 bg-stone-950 hover:bg-stone-800 text-white text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-yellow-400" />
            <span>Add to Bag</span>
          </button>

          <button
            onClick={handleBuyNow}
            className="flex-1 py-2.5 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-xs font-black rounded-xl transition flex items-center justify-center gap-1 shadow-xs"
          >
            <Zap className="w-3.5 h-3.5 fill-stone-950" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>

      {/* Size Guide Bottom Sheet Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={product.category}
      />

      {/* Mobile Bottom Dock Navigation */}
      <BottomNav />
    </div>
  );
}
