'use client';

import Link from 'next/link';
import { RotateCcw, AlertTriangle, ShieldCheck, CheckCircle2, ChevronRight, PackageCheck, HelpCircle } from 'lucide-react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import DesktopHeader from '@/components/DesktopHeader';
import DesktopFooter from '@/components/DesktopFooter';

export default function RefundPolicyPage() {
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
          <span className="text-stone-900 font-bold">Return & Refund Policy</span>
        </div>

        {/* Page Header Banner */}
        <div className="bg-stone-950 text-white rounded-3xl p-6 md:p-10 border border-stone-800 shadow-xl mb-10 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-400 bg-stone-900/80 border border-amber-400/20 px-3.5 py-1.5 rounded-full">
              <RotateCcw className="w-4 h-4 text-amber-400" />
              Customer Protection & Guarantee
            </div>
            <h1 className="text-2xl md:text-4xl font-black font-serif text-white">
              Return, Exchange & Refund Policy
            </h1>
            <p className="text-xs md:text-sm text-stone-300 max-w-2xl font-medium leading-relaxed">
              At BatalaBandi (బట్టల బండి), every garment is handcrafted with care. Learn about our transparent size exchange rules and quality defect replacement policy.
            </p>
            <p className="text-[11px] text-stone-400 font-mono pt-2">
              Last Updated: August 12, 2026
            </p>
          </div>
        </div>

        {/* Policy Highlights Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-stone-950 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-stone-950">7-Day Size Exchange</h4>
              <p className="text-[11px] text-stone-600 font-medium leading-tight mt-0.5">
                Garment doesn&apos;t fit? Exchange for a different size easily within 7 days.
              </p>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-400/20 text-emerald-950 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-stone-950">Defect Replacement</h4>
              <p className="text-[11px] text-stone-600 font-medium leading-tight mt-0.5">
                Damaged or wrong item delivered? Free replacement upon unboxing verification.
              </p>
            </div>
          </div>

          <div className="bg-stone-100 border border-stone-200 p-4 rounded-2xl flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-stone-200 text-stone-950 flex items-center justify-center shrink-0">
              <PackageCheck className="w-5 h-5 text-stone-700" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-stone-950">Handcrafted Drop Notice</h4>
              <p className="text-[11px] text-stone-600 font-medium leading-tight mt-0.5">
                No monetary refunds for change of mind on limited-edition drops.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-stone-200/90 shadow-2xs space-y-8 text-xs md:text-sm text-stone-700 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-base md:text-lg font-black text-stone-950 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-amber-400/20 text-stone-950 flex items-center justify-center text-xs font-extrabold font-mono">01</span>
              General Return & Refund Overview
            </h2>
            <p>
              Due to the limited-edition nature of our artisan streetwear drops and bio-washed hand-crafted apparel, <strong>we do not offer monetary refunds for change of mind or subjective preference once an order is delivered in good condition</strong>.
            </p>
            <p>
              However, we provide a <strong>Hassle-Free 7-Day Size Exchange</strong> and an <strong>Immediate Free Replacement Guarantee</strong> for damaged or mis-shipped garments.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-base md:text-lg font-black text-stone-950 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-amber-400/20 text-stone-950 flex items-center justify-center text-xs font-extrabold font-mono">02</span>
              7-Day Size Exchange Policy
            </h2>
            <p>
              If your garment does not fit as expected, you can request a size exchange within <strong>7 days of delivery</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600 font-medium">
              <li>The garment must be <strong>unworn, unwashed, undamaged</strong>, with all original tags and packaging intact.</li>
              <li>A nominal reverse-pickup and re-shipping shipping fee of ₹99 applies for size exchange logistics across India.</li>
              <li>If the requested exchange size is out of stock, we will issue a store credit gift code valid for 12 months on BatalaBandi.</li>
            </ul>
          </section>

          <hr className="border-stone-100" />

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-base md:text-lg font-black text-stone-950 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-amber-400/20 text-stone-950 flex items-center justify-center text-xs font-extrabold font-mono">03</span>
              Damaged, Defective, or Wrong Item Received
            </h2>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-950 font-extrabold text-sm">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" /> 100% Free Replacement & Quality Guarantee
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                If you receive a torn, misprinted, stained, or wrong product size compared to your invoice, we will arrange a <strong>100% free reverse pickup and re-shipment</strong> of a fresh piece.
              </p>
            </div>
            <p className="text-stone-600 font-medium">
              <strong>Reporting Procedure:</strong> Please notify us within <strong>48 hours of delivery</strong> by emailing <a href="mailto:support@batalabandi.com" className="text-amber-600 font-bold underline">support@batalabandi.com</a> or WhatsApping us with your Order ID and an unboxing photo/video showing the defect.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-base md:text-lg font-black text-stone-950 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-amber-400/20 text-stone-950 flex items-center justify-center text-xs font-extrabold font-mono">04</span>
              Non-Exchangeable & Non-Refundable Items
            </h2>
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600" /> Items Exempt From Exchange:
              </div>
              <ul className="list-disc pl-5 space-y-1 text-xs text-stone-600 font-medium">
                <li>Clearance Sale items or Flash Drop promotions marked as &ldquo;Final Sale&rdquo;.</li>
                <li>Garments that show visible signs of wear, perfume scent, wash marks, or removed price tags.</li>
                <li>Custom embroidered or personalized garments.</li>
              </ul>
            </div>
          </section>

          <hr className="border-stone-100" />

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-base md:text-lg font-black text-stone-950 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-amber-400/20 text-stone-950 flex items-center justify-center text-xs font-extrabold font-mono">05</span>
              Order Cancellations
            </h2>
            <p>
              You can cancel your order free of charge within <strong>4 hours of placing it</strong>, provided it has not yet been processed or dispatched by our warehouse.
            </p>
            <p className="text-stone-600">
              Once an order is handed over to our express courier partner (dispatched), it cannot be canceled in transit.
            </p>
          </section>

          {/* How to Initiate Box */}
          <div className="mt-8 bg-stone-950 text-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-black text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-400" /> Need to request an Exchange?
              </h4>
              <p className="text-xs text-stone-400 font-medium">
                Contact our customer support team with your Order ID to start your request.
              </p>
            </div>
            <Link
              href="/contact"
              className="px-5 py-2.5 bg-amber-400 text-stone-950 text-xs font-extrabold rounded-xl hover:bg-amber-300 transition shrink-0"
            >
              Initiate Exchange
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
