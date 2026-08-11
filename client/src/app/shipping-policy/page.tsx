'use client';

import Link from 'next/link';
import { Truck, Clock, MapPin, ShieldCheck, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import DesktopHeader from '@/components/DesktopHeader';
import DesktopFooter from '@/components/DesktopFooter';

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-[#faf9f6] font-sans text-stone-900 selection:bg-amber-400 selection:text-stone-950">
      {/* ===== DESKTOP HEADER ===== */}
      <div className="hidden md:block">
        <DesktopHeader />
      </div>

      {/* ===== MOBILE HEADER ===== */}
      <div className="block md:hidden">
        <Header activeTab="all" />
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-14">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-stone-400 font-semibold mb-6">
          <Link href="/" className="hover:text-stone-950 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-stone-900 font-bold">Shipping Policy</span>
        </div>

        {/* Page Header Banner */}
        <div className="bg-stone-950 text-white rounded-3xl p-6 md:p-10 border border-stone-800 shadow-xl mb-10 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-400 bg-stone-900/80 border border-amber-400/20 px-3.5 py-1.5 rounded-full">
              <Truck className="w-4 h-4 text-amber-400" />
              Pan-India Logistics
            </div>
            <h1 className="text-2xl md:text-4xl font-black font-serif text-white">
              Shipping & Delivery Policy
            </h1>
            <p className="text-xs md:text-sm text-stone-300 max-w-2xl font-medium leading-relaxed">
              Fast, reliable express shipping across India for all BatalaBandi (బట్టల బండి) artisan streetwear and garment orders.
            </p>
            <p className="text-[11px] text-stone-400 font-mono pt-2">
              Last Updated: August 12, 2026
            </p>
          </div>
        </div>

        {/* Top Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-stone-200 p-4 rounded-2xl flex items-start gap-3 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-stone-950 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-stone-950">Free Express Shipping</h4>
              <p className="text-[11px] text-stone-600 font-medium leading-tight mt-0.5">
                On all orders above ₹999 across all cities & towns in India.
              </p>
            </div>
          </div>

          <div className="bg-white border border-stone-200 p-4 rounded-2xl flex items-start gap-3 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-stone-950 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-stone-950">24-48 Hr Dispatch</h4>
              <p className="text-[11px] text-stone-600 font-medium leading-tight mt-0.5">
                Quick processing from our Hyderabad fulfillment hub.
              </p>
            </div>
          </div>

          <div className="bg-white border border-stone-200 p-4 rounded-2xl flex items-start gap-3 shadow-2xs">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-stone-950 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-stone-950">Live SMS & WhatsApp Tracking</h4>
              <p className="text-[11px] text-stone-600 font-medium leading-tight mt-0.5">
                Real-time tracking link sent immediately upon dispatch.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Content */}
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-stone-200/90 shadow-2xs space-y-8 text-xs md:text-sm text-stone-700 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-base md:text-lg font-black text-stone-950 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-amber-400/20 text-stone-950 flex items-center justify-center text-xs font-extrabold font-mono">01</span>
              Shipping Rates & Free Shipping Thresholds
            </h2>
            <p>
              We strive to keep delivery affordable and fast for all our customers across India:
            </p>
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-stone-900 border-b border-stone-200 pb-2">
                <span>Order Total</span>
                <span>Standard Delivery Fee</span>
              </div>
              <div className="flex justify-between items-center text-xs text-stone-700 font-medium">
                <span>Orders ₹999 and above</span>
                <span className="text-emerald-700 font-extrabold uppercase">FREE SHIPPING</span>
              </div>
              <div className="flex justify-between items-center text-xs text-stone-700 font-medium">
                <span>Orders below ₹999</span>
                <span className="font-mono font-bold">₹79 Flat Rate</span>
              </div>
            </div>
          </section>

          <hr className="border-stone-100" />

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-base md:text-lg font-black text-stone-950 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-amber-400/20 text-stone-950 flex items-center justify-center text-xs font-extrabold font-mono">02</span>
              Dispatch & Estimated Delivery Timelines
            </h2>
            <p>
              Orders are dispatched within <strong>24 to 48 hours</strong> (excluding Sundays and national holidays) from our warehouse.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <h4 className="font-bold text-xs text-stone-900">Metro Cities (Hyderabad, Bengaluru, Mumbai, Delhi, Chennai, Kolkata):</h4>
                <p className="text-xs text-stone-600 font-mono font-bold text-amber-700">2 – 4 Business Days</p>
              </div>
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <h4 className="font-bold text-xs text-stone-900">Tier 2/3 Cities & Rest of India:</h4>
                <p className="text-xs text-stone-600 font-mono font-bold text-amber-700">4 – 7 Business Days</p>
              </div>
            </div>
          </section>

          <hr className="border-stone-100" />

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-base md:text-lg font-black text-stone-950 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-amber-400/20 text-stone-950 flex items-center justify-center text-xs font-extrabold font-mono">03</span>
              Courier Partners & Order Tracking
            </h2>
            <p>
              We partner with India&apos;s leading logistics networks (BlueDart, Delhivery, Expressbees, Xpressbees, and India Post) to ensure safe handling of your handcrafted garments.
            </p>
            <p>
              Once your shipment is picked up, you will receive an automated email, SMS, and WhatsApp message containing your AWB tracking number and direct live tracking portal link.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-base md:text-lg font-black text-stone-950 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-amber-400/20 text-stone-950 flex items-center justify-center text-xs font-extrabold font-mono">04</span>
              Delivery Delays & Address Verification
            </h2>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-950 font-bold text-xs">
                <AlertCircle className="w-4 h-4 text-amber-600" /> Important Delivery Guidelines:
              </div>
              <ul className="list-disc pl-5 space-y-1 text-xs text-amber-900 font-medium">
                <li>Please double-check your delivery phone number and pincode during checkout to avoid logistics re-routing delays.</li>
                <li>Weather disruptions, extreme events, or courier local strikes may cause minor delays beyond our estimated windows.</li>
              </ul>
            </div>
          </section>

          {/* Help Action */}
          <div className="mt-8 bg-stone-950 text-white rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-black text-white">Need help tracking an existing order?</h4>
              <p className="text-xs text-stone-400 font-medium">Check your Profile page or contact support with your Order ID.</p>
            </div>
            <Link
              href="/profile"
              className="px-5 py-2.5 bg-amber-400 text-stone-950 text-xs font-extrabold rounded-xl hover:bg-amber-300 transition"
            >
              Track Order in Profile
            </Link>
          </div>
        </div>
      </main>

      {/* Mobile Dock Navigation */}
      <div className="block md:hidden">
        <BottomNav />
      </div>

      {/* ===== DESKTOP FOOTER ===== */}
      <div className="hidden md:block">
        <DesktopFooter />
      </div>
    </div>
  );
}
