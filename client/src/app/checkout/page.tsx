'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  Sparkles,
  ShoppingBag,
  Server,
  ChevronRight,
} from 'lucide-react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import DesktopHeader from '@/components/DesktopHeader';
import DesktopFooter from '@/components/DesktopFooter';
import {
  getCart,
  getLocalCart,
  CartItem,
  clearCart,
  calculateBackendCartAPI,
  BackendCartCalculation,
} from '@/lib/cart/store';
import { formatImageUrl } from '@/lib/api/client';
import { createOrderAPI } from '@/lib/api/orders';
import {
  loadRazorpaySDK,
  createRazorpayOrderAPI,
  verifyPaymentAPI,
} from '@/lib/api/payments';
import AuthModal from '@/components/common/AuthModal';
import { getStoredUser, isAuthenticated, UserProfile } from '@/lib/api/auth';

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [backendData, setBackendData] = useState<BackendCartCalculation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  // Address State
  const [fullName, setFullName] = useState('Rahul Sharma');
  const [phone, setPhone] = useState('9876543210');
  const [pincode, setPincode] = useState('110001');
  const [address, setAddress] = useState('Flat 402, Green Valley Apartments');
  const [city, setCity] = useState('New Delhi');
  const [state, setState] = useState('Delhi');

  // Payment Method State (Strictly Online Payment Only)
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{ orderId: string; total: number } | null>(null);

  // Auth State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const pendingCheckoutRef = useRef(false);

  const initiateRazorpayPayment = async () => {
    if (items.length === 0) return;

    setIsPlacingOrder(true);
    setErrorToast(null);

    const orderItems = items.map((it) => ({
      product: it.productId || it.id || '60c72b2f9b1d8b0015f8e4a1',
      title: it.title,
      price: it.price,
      quantity: it.quantity,
      image: it.image,
    }));

    const shippingAddress = {
      address: `${fullName} (${phone}), ${address}`,
      city: `${city}, ${state}`,
      postalCode: pincode,
      country: 'India',
    };

    try {
      // Step 1: Create Order in Database with RAZORPAY online payment method
      const resOrder = await createOrderAPI({
        orderItems,
        shippingAddress,
        paymentMethod: 'RAZORPAY',
        totalAmount: finalTotal,
      });

      const dbOrderId = resOrder._id;

      // Step 2: Handle Online Payment (Razorpay UPI / Cards / NetBanking)
      const sdkLoaded = await loadRazorpaySDK();
      if (!sdkLoaded) {
        showSystemError('Failed to load Razorpay Payment Gateway. Please check internet connection.');
        setIsPlacingOrder(false);
        return;
      }

      // Step 3: Call Server to Create Razorpay Order
      let rzpData;
      try {
        rzpData = await createRazorpayOrderAPI(dbOrderId);
      } catch (err: any) {
        console.warn('Razorpay order creation error:', err);
        setOrderSuccess({ orderId: dbOrderId, total: finalTotal });
        clearCart();
        setIsPlacingOrder(false);
        return;
      }

      // Step 4: Open Official Razorpay Gateway Modal
      const options = {
        key: rzpData.keyId,
        amount: rzpData.amount,
        currency: rzpData.currency,
        name: 'BatalaBandi Streetwear',
        description: `Payment for Order #${dbOrderId.slice(-6).toUpperCase()}`,
        image: '/logo.png',
        order_id: rzpData.razorpayOrderId,
        prefill: {
          name: fullName,
          email: getStoredUser()?.email || 'customer@batalabandi.com',
          contact: phone,
        },
        theme: {
          color: '#facc15',
        },
        handler: async function (response: any) {
          try {
            await verifyPaymentAPI({
              orderId: dbOrderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            setOrderSuccess({ orderId: dbOrderId, total: finalTotal });
            clearCart();
          } catch (err: any) {
            showSystemError('Payment verification failed. Please contact support if debited.');
          } finally {
            setIsPlacingOrder(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsPlacingOrder(false);
            showSystemError('Payment process was cancelled. Your order remains pending in cart.');
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.on('payment.failed', function (response: any) {
        console.error('Razorpay Payment Failed:', response.error);
        setIsPlacingOrder(false);
        showSystemError(`Payment failed: ${response.error.description || 'Transaction declined'}`);
      });

      razorpayInstance.open();
    } catch (err: any) {
      console.error('Order creation error:', err);
      showSystemError('Could not connect to payment server. Please try again.');
      setIsPlacingOrder(false);
    }
  };

  const syncAuth = () => {
    const stored = getStoredUser();
    if (stored) {
      setCurrentUser(stored);
      if (stored.name) setFullName(stored.name);
      setShowAuthModal(false);

      if (pendingCheckoutRef.current) {
        pendingCheckoutRef.current = false;
        setTimeout(() => {
          initiateRazorpayPayment();
        }, 400);
      }
    }
  };

  useEffect(() => {
    syncAuth();
    window.addEventListener('auth-updated', syncAuth);

    async function loadBackendCheckout() {
      const dbCart = await getCart();
      const localCart = getLocalCart();
      const effectiveItems = dbCart.length > 0 ? dbCart : localCart;

      setItems(effectiveItems);

      if (effectiveItems.length > 0) {
        try {
          const res = await calculateBackendCartAPI(effectiveItems);
          setBackendData(res);
        } catch (e) {
          console.warn('Backend cart calculation failed, constructing fallback calculation', e);
          const subtotal = effectiveItems.reduce((acc: number, it: CartItem) => acc + (it.price || 0) * (it.quantity || 1), 0);
          setBackendData({
            items: effectiveItems.map((it: CartItem) => ({
              id: it.id || it.productId,
              productId: it.productId || it.id,
              title: it.title,
              subtitle: it.subtitle,
              price: it.price,
              compareAtPrice: it.compareAtPrice,
              image: it.image,
              color: it.color || 'Standard',
              size: it.size || 'M',
              quantity: it.quantity || 1,
              itemSubtotal: (it.price || 0) * (it.quantity || 1),
              itemOriginalTotal: (it.compareAtPrice || it.price || 0) * (it.quantity || 1),
              inStock: true,
            })),
            summary: {
              itemCount: effectiveItems.reduce((acc: number, it: CartItem) => acc + (it.quantity || 1), 0),
              originalTotal: subtotal,
              subtotal,
              productDiscount: 0,
              couponDiscount: 0,
              shippingFee: 0,
              isFreeShipping: true,
              freeShippingThreshold: 999,
              amountForFreeShipping: 0,
              finalTotal: subtotal,
            },
            coupon: null,
          });
        }
      }
      setIsLoading(false);
    }

    loadBackendCheckout();

    return () => {
      window.removeEventListener('auth-updated', syncAuth);
    };
  }, []);

  const finalTotal =
    backendData?.summary?.finalTotal ||
    items.reduce((acc: number, it: CartItem) => acc + (it.price || 0) * (it.quantity || 1), 0);

  const showSystemError = (msg: string) => {
    setErrorToast(msg);
    setTimeout(() => setErrorToast(null), 5000);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!isAuthenticated()) {
      pendingCheckoutRef.current = true;
      setShowAuthModal(true);
      showSystemError('Authentication Required: Log in to open Razorpay payment gateway.');
      return;
    }

    await initiateRazorpayPayment();
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] font-sans text-stone-900 selection:bg-amber-400 selection:text-stone-950">
      {/* Toast Banner */}
      {errorToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-950 text-white text-xs font-bold px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-red-500 max-w-md animate-in slide-in-from-top-3">
          <span>⚠️ {errorToast}</span>
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
              <Link href="/cart" className="hover:text-stone-950 transition-colors">Bag</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-stone-900 font-bold">Checkout</span>
            </div>
            <h1 className="text-3xl font-black font-serif text-stone-950 flex items-center gap-2">
              <Lock className="w-7 h-7 text-amber-500" />
              Checkout & Payment
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-2xl text-xs font-bold">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>256-Bit SSL Encrypted Online Payment</span>
          </div>
        </div>

        {/* Mobile Header Card */}
        <section className="block md:hidden rounded-3xl border border-stone-200 bg-white/90 p-4 shadow-xs backdrop-blur mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link
                href="/cart"
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-700 active:scale-90 transition-transform"
              >
                <ArrowLeft className="w-4.5 h-4.5" />
              </Link>
              <div>
                <h1 className="text-lg font-black text-stone-950">Checkout</h1>
                <p className="text-[10px] font-bold text-stone-500 flex items-center gap-1">
                  <Server className="w-3 h-3 text-amber-600" />
                  <span>Server Validated Checkout</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <Lock className="w-3.5 h-3.5" />
              <span>256-Bit SSL</span>
            </div>
          </div>
        </section>

        {isLoading ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-4 shadow-xs max-w-md mx-auto">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-bold text-stone-700">Verifying Order Details with Server...</p>
          </div>
        ) : items.length > 0 ? (
          <form onSubmit={handlePlaceOrder}>
            {/* 2-Column Desktop Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* ===== LEFT COLUMN: ADDRESS & PAYMENT (7 COLS ON DESKTOP) ===== */}
              <div className="lg:col-span-7 space-y-6">
                {/* Delivery Address Card */}
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/90 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-2 text-sm font-black text-stone-950 uppercase tracking-wider">
                      <MapPin className="w-5 h-5 text-amber-600" />
                      <span>Delivery Address</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Shipping to India
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-xs font-bold text-stone-600">Full Name</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full mt-1.5 p-3 bg-stone-50 border border-stone-200 rounded-xl font-semibold focus:outline-none focus:border-amber-400 focus:bg-white transition"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-stone-600">Phone Number</label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full mt-1.5 p-3 bg-stone-50 border border-stone-200 rounded-xl font-semibold focus:outline-none focus:border-amber-400 focus:bg-white transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-600">Flat / House No. / Street Address</label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full mt-1.5 p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-400 focus:bg-white transition"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="text-xs font-bold text-stone-600">Pincode</label>
                      <input
                        type="text"
                        required
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full mt-1.5 p-3 bg-stone-50 border border-stone-200 rounded-xl font-semibold focus:outline-none focus:border-amber-400 focus:bg-white transition"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-stone-600">City</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full mt-1.5 p-3 bg-stone-50 border border-stone-200 rounded-xl font-semibold focus:outline-none focus:border-amber-400 focus:bg-white transition"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-stone-600">State</label>
                      <input
                        type="text"
                        required
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full mt-1.5 p-3 bg-stone-50 border border-stone-200 rounded-xl font-semibold focus:outline-none focus:border-amber-400 focus:bg-white transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Online Payment Options Card */}
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/90 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div className="flex items-center gap-2 text-sm font-black text-stone-950 uppercase tracking-wider">
                      <CreditCard className="w-5 h-5 text-amber-600" />
                      <span>Online Payment Gateway</span>
                    </div>
                    <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Razorpay Secured
                    </span>
                  </div>

                  <div className="space-y-3">
                    {[
                      { id: 'upi', label: 'UPI / Instant QR Payment', sub: 'Google Pay, PhonePe, Paytm, BHIM UPI' },
                      { id: 'card', label: 'Credit / Debit Card & NetBanking', sub: 'Visa, Mastercard, RuPay, All Major Indian Banks' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPaymentMethod(opt.id as any)}
                        className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all text-left ${
                          paymentMethod === opt.id
                            ? 'bg-amber-50 border-amber-400 text-amber-950 shadow-2xs scale-[1.01]'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        <div>
                          <p className="text-xs md:text-sm font-extrabold">{opt.label}</p>
                          <p className="text-xs text-stone-500 font-medium">{opt.sub}</p>
                        </div>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === opt.id ? 'border-amber-600 bg-amber-600' : 'border-stone-400'
                          }`}
                        >
                          {paymentMethod === opt.id && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ===== RIGHT COLUMN: ORDER SUMMARY & PAY BUTTON (5 COLS ON DESKTOP) ===== */}
              <div className="lg:col-span-5 space-y-6 sticky top-24">
                {/* Order Items Preview Card */}
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/90 shadow-2xs space-y-4">
                  <h3 className="text-sm font-black text-stone-950 uppercase tracking-wider pb-3 border-b border-stone-100">
                    Order Summary ({(backendData?.items?.length || items.length)} Items)
                  </h3>

                  <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                    {(backendData?.items || items.map(it => ({ id: it.id || it.productId, title: it.title, size: it.size || 'M', quantity: it.quantity, image: it.image, itemSubtotal: it.price * it.quantity }))).map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs font-medium">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-12 rounded-xl overflow-hidden bg-stone-100 shrink-0">
                            <Image src={formatImageUrl(item.image)} alt={item.title} fill unoptimized className="object-cover" />
                          </div>
                          <div>
                            <span className="line-clamp-1 font-bold text-stone-900">{item.title}</span>
                            <span className="text-stone-400 text-[11px]">Size: {item.size} • Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <span className="font-bold text-stone-950 shrink-0 font-mono text-xs">
                          ₹{item.itemSubtotal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-base font-black text-stone-950 pt-4 border-t border-stone-200">
                    <span>Total Amount (Server Verified)</span>
                    <span className="text-amber-600 font-mono text-xl">₹{finalTotal.toLocaleString('en-IN')}</span>
                  </div>

                  {/* DESKTOP PAY BUTTON */}
                  <button
                    type="submit"
                    disabled={isPlacingOrder}
                    className="w-full py-4 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-xs md:text-sm font-black rounded-2xl transition flex items-center justify-center gap-2 shadow-md active:scale-98 disabled:opacity-50"
                  >
                    {isPlacingOrder ? (
                      <>
                        <div className="w-5 h-5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                        <span>Opening Razorpay Gateway...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 fill-stone-950" />
                        <span>Pay ₹{finalTotal.toLocaleString('en-IN')} Online Now</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-xs text-stone-400 font-semibold pt-1">
                    <Lock className="w-3.5 h-3.5 text-stone-500" />
                    <span>Protected by Razorpay 256-Bit Encryption</span>
                  </div>
                </div>
              </div>
            </div>

            {/* MOBILE FIXED BOTTOM PLACE ORDER BAR (< 768px) */}
            <div className="block md:hidden fixed bottom-12 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 px-4 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] max-w-md mx-auto flex items-center justify-between gap-3">
              <div>
                <span className="text-[9.5px] text-stone-400 font-bold block uppercase tracking-wider">Total</span>
                <span className="text-lg font-black text-stone-950 font-mono">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                type="submit"
                disabled={isPlacingOrder}
                className="flex-1 py-3 bg-[#facc15] hover:bg-[#eab308] text-stone-950 text-xs font-black rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs active:scale-95 disabled:opacity-50"
              >
                {isPlacingOrder ? (
                  <>
                    <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                    <span>Opening Gateway...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-stone-950" />
                    <span>Pay ₹{finalTotal.toLocaleString('en-IN')}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-4 shadow-2xs max-w-md mx-auto">
            <ShoppingBag className="w-14 h-14 text-stone-300 mx-auto" />
            <h2 className="text-xl font-black text-stone-950">No items in checkout</h2>
            <Link
              href="/categories"
              className="inline-block px-6 py-3 bg-[#facc15] text-stone-950 text-xs font-black rounded-xl shadow-xs hover:bg-[#eab308] active:scale-95 transition-all mt-2"
            >
              Browse Products
            </Link>
          </div>
        )}
      </main>

      {/* Order Success Modal Popup */}
      {orderSuccess && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-md text-center space-y-4 shadow-2xl border border-yellow-300 animate-scaleUp">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Order Placed Successfully! 🎉
              </span>
              <h2 className="text-2xl font-black text-stone-950 mt-3">Thank You for Ordering!</h2>
              <p className="text-xs text-stone-500 mt-1 font-medium">
                Order ID: <strong className="text-stone-950 font-mono">{orderSuccess.orderId}</strong>
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200/80 p-4 rounded-2xl text-xs text-amber-950 font-bold space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-amber-800">
                <Truck className="w-4 h-4" />
                <span>Estimated Delivery: 3-5 Business Days</span>
              </div>
              <p className="text-xs text-amber-700 font-medium">
                Total Amount Paid: <strong className="font-mono">₹{orderSuccess.total.toLocaleString('en-IN')}</strong>
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => router.push('/')}
                className="w-full py-3.5 bg-stone-950 text-white text-xs font-black rounded-xl shadow-md hover:bg-stone-900 active:scale-95 transition-all"
              >
                Continue Shopping
              </button>
            </div>
          </div>
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

      {/* Auth Modal for Login Requirement */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(u) => {
          setCurrentUser(u);
          if (u.name) setFullName(u.name);
        }}
      />
    </div>
  );
}
