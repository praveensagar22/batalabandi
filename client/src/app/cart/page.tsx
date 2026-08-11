'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Tag,
  ChevronRight,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Sparkles,
  Server,
  Loader2,
  Lock,
} from 'lucide-react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import DesktopHeader from '@/components/DesktopHeader';
import DesktopFooter from '@/components/DesktopFooter';
import {
  getCart,
  getLocalCart,
  updateQuantity,
  removeFromCart,
  CartItem,
  calculateBackendCartAPI,
  BackendCartCalculation,
} from '@/lib/cart/store';
import { formatImageUrl } from '@/lib/api/client';
import { CartPageSkeleton } from '@/components/common/Skeletons';

export default function CartPage() {
  const router = useRouter();
  const [rawItems, setRawItems] = useState<CartItem[]>([]);
  const [couponInput, setCouponInput] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<string>('');
  const [backendData, setBackendData] = useState<BackendCartCalculation | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCalculating, setIsCalculating] = useState(false);

  const loadAndCalculate = async (items: CartItem[], coupon?: string) => {
    if (items.length === 0) {
      setBackendData(null);
      setIsLoading(false);
      setIsCalculating(false);
      return;
    }

    setIsCalculating(true);
    try {
      const result = await calculateBackendCartAPI(items, coupon);
      setBackendData(result);
    } catch (err) {
      console.error('Backend cart calculation failed:', err);
    } finally {
      setIsLoading(false);
      setIsCalculating(false);
    }
  };

  useEffect(() => {
    async function initCart() {
      const cart = await getCart();
      setRawItems(cart);
      await loadAndCalculate(cart, activeCoupon);
    }
    initCart();

    const handleStorage = async () => {
      const updatedCart = getLocalCart();
      setRawItems(updatedCart);
      await loadAndCalculate(updatedCart, activeCoupon);
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('cart-updated', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('cart-updated', handleStorage);
    };
  }, [activeCoupon]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleQuantityChange = async (id: string, qty: number) => {
    const updated = await updateQuantity(id, qty);
    setRawItems(updated);
    await loadAndCalculate(updated, activeCoupon);
  };

  const handleRemove = async (id: string, title: string) => {
    const updated = await removeFromCart(id);
    setRawItems(updated);
    showToast(`Removed "${title}" from Bag`);
    await loadAndCalculate(updated, activeCoupon);
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    setActiveCoupon(code);
    setIsCalculating(true);
    try {
      const res = await calculateBackendCartAPI(rawItems, code);
      setBackendData(res);

      if (res.coupon?.isValid) {
        showToast(res.coupon.message);
      } else {
        showToast(res.coupon?.message || 'Invalid coupon code');
      }
    } catch (err) {
      showToast('Failed to validate coupon on backend server');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleRemoveCoupon = async () => {
    setActiveCoupon('');
    setCouponInput('');
    await loadAndCalculate(rawItems, '');
    showToast('Coupon removed');
  };

  const summary = backendData?.summary;
  const items = backendData?.items || [];

  return (
    <div className="min-h-screen bg-[#faf9f6] font-sans text-stone-900 selection:bg-amber-400 selection:text-stone-950">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-stone-950 text-white text-xs font-bold px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 border border-amber-400 animate-bounce">
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
        {/* Desktop Breadcrumb & Header */}
        <div className="hidden md:flex items-center justify-between pb-6 border-b border-stone-200 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-400 font-semibold mb-2">
              <Link href="/" className="hover:text-stone-950 transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-stone-900 font-bold">Shopping Bag</span>
            </div>
            <h1 className="text-3xl font-black font-serif text-stone-950 flex items-center gap-2">
              <ShoppingBag className="w-7 h-7 text-amber-500" />
              Shopping Bag ({summary?.itemCount || rawItems.length})
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-2xl text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Server Calculated & SSL Encrypted</span>
          </div>
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
                <h1 className="text-lg font-black text-stone-950">Shopping Bag</h1>
                <p className="text-[10px] font-bold text-stone-500 flex items-center gap-1">
                  <Server className="w-3 h-3 text-amber-600" />
                  <span>Server Calculated • {summary?.itemCount || rawItems.length} Items</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified</span>
            </div>
          </div>
        </section>

        {isLoading ? (
          <CartPageSkeleton />
        ) : rawItems.length > 0 ? (
          <>
            {/* Free Shipping Progress Indicator */}
            {summary && (
              <div className="mb-6 bg-amber-50 border border-amber-200/90 rounded-2xl p-4 flex items-center gap-3 text-xs md:text-sm text-amber-950 font-bold shadow-2xs">
                <Truck className="w-5 h-5 text-amber-700 shrink-0" />
                <span>
                  {summary.isFreeShipping ? (
                    <strong className="text-emerald-700">🎉 Congratulations! You unlocked FREE Delivery across India!</strong>
                  ) : (
                    `Add ₹${summary.amountForFreeShipping.toLocaleString('en-IN')} more to unlock FREE Delivery!`
                  )}
                </span>
              </div>
            )}

            {/* 2-Column Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* ===== LEFT CART ITEMS LIST (8 COLS ON DESKTOP) ===== */}
              <div className="lg:col-span-8 space-y-4 relative">
                {isCalculating && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-2xs z-20 flex items-center justify-center rounded-3xl">
                    <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
                  </div>
                )}

                {(items.length > 0 ? items : rawItems).map((item) => {
                  const imageSrc = formatImageUrl(item.image);
                  const price = item.price;
                  const compareAtPrice = item.compareAtPrice;
                  const itemTotal = price * item.quantity;
                  const itemOriginalTotal = (compareAtPrice || price) * item.quantity;
                  const hasDiscount = compareAtPrice && compareAtPrice > price;
                  const targetId = item.productId || item.id;

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-3xl p-4 md:p-5 border border-stone-200/90 shadow-2xs flex gap-4 md:gap-6 relative hover:shadow-md transition"
                    >
                      {/* Item Image */}
                      <div className="relative w-24 h-28 md:w-32 md:h-36 rounded-2xl overflow-hidden bg-stone-100 shrink-0">
                        <Image
                          src={imageSrc}
                          alt={item.title}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>

                      {/* Item Content */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="text-sm md:text-base font-extrabold text-stone-950 line-clamp-1">
                                {item.title}
                              </h3>
                              {item.subtitle && (
                                <p className="text-xs text-stone-400 font-medium line-clamp-1 mt-0.5">
                                  {item.subtitle}
                                </p>
                              )}
                            </div>

                            <button
                              onClick={() => handleRemove(targetId, item.title)}
                              aria-label="Remove item"
                              className="text-stone-400 hover:text-red-500 p-2 rounded-xl hover:bg-stone-100 transition-colors"
                            >
                              <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                          </div>

                          {/* Size & Color Tags */}
                          <div className="flex items-center gap-2 mt-2.5">
                            {item.size && (
                              <span className="bg-stone-100 text-stone-800 text-xs font-bold px-2.5 py-1 rounded-lg border border-stone-200">
                                Size: {item.size}
                              </span>
                            )}
                            {item.color && (
                              <span className="bg-stone-100 text-stone-800 text-xs font-bold px-2.5 py-1 rounded-lg border border-stone-200">
                                Color: {item.color}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity & Price Row */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-stone-100">
                          <div className="flex items-baseline gap-2">
                            <span className="text-sm md:text-lg font-black text-stone-950 font-mono">
                              ₹{itemTotal.toLocaleString('en-IN')}
                            </span>
                            {hasDiscount && (
                              <span className="text-xs font-bold text-stone-400 line-through font-mono">
                                ₹{itemOriginalTotal.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 bg-stone-100 rounded-xl px-3 py-1.5 border border-stone-200">
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(targetId, item.quantity - 1)}
                              className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-stone-800 text-xs font-black shadow-2xs active:scale-90 hover:bg-stone-50"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs md:text-sm font-black text-stone-900 w-5 text-center">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQuantityChange(targetId, item.quantity + 1)}
                              className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-stone-800 text-xs font-black shadow-2xs active:scale-90 hover:bg-stone-50"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ===== RIGHT ORDER SUMMARY (4 COLS ON DESKTOP) ===== */}
              <div className="lg:col-span-4 space-y-4 sticky top-24">
                {/* Coupon Code Section */}
                <div className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-2xs">
                  <h4 className="text-xs font-black text-stone-950 uppercase tracking-wider mb-3">
                    Have a Coupon Code?
                  </h4>
                  <form onSubmit={handleApplyCoupon} className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-600" />
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="e.g. WELCOME10"
                        className="w-full pl-10 pr-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold uppercase placeholder:capitalize placeholder:text-stone-400 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isCalculating}
                      className="px-5 py-2.5 bg-stone-950 hover:bg-stone-800 text-white text-xs font-black rounded-xl shadow-xs transition-colors shrink-0 disabled:opacity-50"
                    >
                      {isCalculating ? 'Verifying...' : 'Apply'}
                    </button>
                  </form>

                  {backendData?.coupon?.isValid && (
                    <div className="mt-3 flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-xs text-emerald-900 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-600" /> {backendData.coupon.message}
                      </span>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-xs text-emerald-700 underline font-extrabold"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Server-Side Bill Details Breakdown Card */}
                {summary && (
                  <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                      <h3 className="text-sm font-black text-stone-950 uppercase tracking-wider">
                        Order Summary
                      </h3>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                        <Server className="w-3 h-3 text-amber-600" /> API Validated
                      </span>
                    </div>

                    <div className="space-y-3 text-xs text-stone-600 font-medium">
                      <div className="flex items-center justify-between">
                        <span>Total MRP (Original Price)</span>
                        <span className="font-mono font-bold text-stone-900">
                          ₹{summary.originalTotal.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {summary.productDiscount > 0 && (
                        <div className="flex items-center justify-between text-emerald-700 font-bold">
                          <span>Product Discount</span>
                          <span className="font-mono">-₹{summary.productDiscount.toLocaleString('en-IN')}</span>
                        </div>
                      )}

                      {summary.couponDiscount > 0 && (
                        <div className="flex items-center justify-between text-emerald-700 font-bold">
                          <span>Coupon Discount ({backendData?.coupon?.code})</span>
                          <span className="font-mono">-₹{summary.couponDiscount.toLocaleString('en-IN')}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span>Delivery Shipping Fee</span>
                        <span>
                          {summary.shippingFee === 0 ? (
                            <strong className="text-emerald-700 uppercase">FREE</strong>
                          ) : (
                            <span className="font-mono font-bold">₹{summary.shippingFee}</span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-base font-black text-stone-950 pt-4 border-t border-stone-200">
                      <span>Total Amount Payable</span>
                      <span className="text-amber-600 font-mono text-xl">
                        ₹{summary.finalTotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <Link
                      href="/checkout"
                      className="w-full py-4 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-xs md:text-sm font-black rounded-2xl transition flex items-center justify-center gap-1.5 shadow-md active:scale-98"
                    >
                      <span>Proceed to Checkout</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>

                    <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400 font-semibold pt-1">
                      <Lock className="w-3.5 h-3.5 text-stone-500" />
                      <span>Encrypted SSL 256-Bit Checkout</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Empty Bag State */
          <div className="py-20 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-4 shadow-2xs max-w-lg mx-auto">
            <ShoppingBag className="w-16 h-16 text-stone-300 mx-auto" />
            <h2 className="text-xl font-black text-stone-950">Your Shopping Bag is empty</h2>
            <p className="text-xs text-stone-500 max-w-xs mx-auto">
              Explore our handcrafted collections and add your favorite apparel to the bag!
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#facc15] text-stone-950 text-xs font-black rounded-xl shadow-xs hover:bg-[#eab308] active:scale-95 transition-all mt-2"
            >
              Start Shopping <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </main>

      {/* ===== MOBILE FIXED BOTTOM CHECKOUT BAR (< 768px) ===== */}
      {rawItems.length > 0 && summary && (
        <div className="block md:hidden fixed bottom-12 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 px-4 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] max-w-md mx-auto flex items-center justify-between gap-3">
          <div>
            <span className="text-[9.5px] text-stone-400 font-bold block uppercase tracking-wider">
              Total Payable (API)
            </span>
            <span className="text-lg font-black text-stone-950 font-mono">
              ₹{summary.finalTotal.toLocaleString('en-IN')}
            </span>
          </div>

          <Link
            href="/checkout"
            className="flex-1 py-3 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-xs font-black rounded-xl transition flex items-center justify-center gap-1 shadow-xs active:scale-95"
          >
            <span>Proceed to Checkout</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

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
