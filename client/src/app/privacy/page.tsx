'use client';

import Link from 'next/link';
import { ShieldCheck, Lock, Eye, ChevronRight, Server, Database } from 'lucide-react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import DesktopHeader from '@/components/DesktopHeader';
import DesktopFooter from '@/components/DesktopFooter';

export default function PrivacyPage() {
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
          <span className="text-stone-900 font-bold">Privacy Policy</span>
        </div>

        {/* Page Header Banner */}
        <div className="bg-stone-950 text-white rounded-3xl p-6 md:p-10 border border-stone-800 shadow-xl mb-10 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-400 bg-stone-900/80 border border-emerald-400/20 px-3.5 py-1.5 rounded-full">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Data Security & Privacy
            </div>
            <h1 className="text-2xl md:text-4xl font-black font-serif text-white">
              Privacy Policy
            </h1>
            <p className="text-xs md:text-sm text-stone-300 max-w-2xl font-medium leading-relaxed">
              At BatalaBandi (బట్టల బండి), protecting your personal information and online privacy is one of our highest priorities.
            </p>
            <p className="text-[11px] text-stone-400 font-mono pt-2">
              Effective Date: August 12, 2026
            </p>
          </div>
        </div>

        {/* Policy Content */}
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-stone-200/90 shadow-2xs space-y-8 text-xs md:text-sm text-stone-700 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-base md:text-lg font-black text-stone-950 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-400/20 text-emerald-950 flex items-center justify-center text-xs font-extrabold font-mono">01</span>
              Information We Collect
            </h2>
            <p>
              When you browse BatalaBandi, register an account, or complete an order, we collect information necessary to fulfill your purchases and enhance your shopping experience:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-1">
                <div className="font-extrabold text-stone-900 text-xs flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-amber-600" /> Personal Identity Details
                </div>
                <p className="text-xs text-stone-600">
                  Full name, mobile phone number, email address, shipping address, and pincode.
                </p>
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-1">
                <div className="font-extrabold text-stone-900 text-xs flex items-center gap-1.5">
                  <Server className="w-4 h-4 text-emerald-600" /> Technical Data & Cookies
                </div>
                <p className="text-xs text-stone-600">
                  IP address, browser type, device information, shopping bag items, and session preferences.
                </p>
              </div>
            </div>
          </section>

          <hr className="border-stone-100" />

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-base md:text-lg font-black text-stone-950 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-400/20 text-emerald-950 flex items-center justify-center text-xs font-extrabold font-mono">02</span>
              How We Use Your Information
            </h2>
            <p>We use your data solely for legitimate business operations:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600 font-medium">
              <li>Processing, fulfilling, and dispatching your garment orders via courier partners.</li>
              <li>Sending order confirmations, tracking links, and SMS/WhatsApp shipping updates.</li>
              <li>Providing customer support regarding order modifications or size exchanges.</li>
              <li>Preventing fraudulent orders and securing online transactions.</li>
              <li>Sending optional newsletter updates regarding new drop releases (only if subscribed).</li>
            </ul>
          </section>

          <hr className="border-stone-100" />

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-base md:text-lg font-black text-stone-950 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-400/20 text-emerald-950 flex items-center justify-center text-xs font-extrabold font-mono">03</span>
              Payment Gateway Safety & Encrypted Data
            </h2>
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-950 font-extrabold text-sm">
                <Lock className="w-4 h-4 text-emerald-600" /> 256-Bit SSL Encryption
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                All online payments on BatalaBandi are processed using PCI-DSS compliant payment gateways (Razorpay, UPI). We do not store, view, or transmit your credit card numbers, debit card PINs, or net banking passwords on our servers.
              </p>
            </div>
          </section>

          <hr className="border-stone-100" />

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-base md:text-lg font-black text-stone-950 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-400/20 text-emerald-950 flex items-center justify-center text-xs font-extrabold font-mono">04</span>
              Third-Party Data Sharing
            </h2>
            <p>
              We <strong>NEVER sell or rent</strong> your personal data to third-party advertisers. Data is shared exclusively with verified service partners necessary to complete your order:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600 font-medium">
              <li><strong>Logistics & Courier Partners:</strong> (e.g. BlueDart, Delhivery, India Post) to deliver packages.</li>
              <li><strong>Payment Partners:</strong> (Razorpay) to verify and process online payments securely.</li>
            </ul>
          </section>

          <hr className="border-stone-100" />

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-base md:text-lg font-black text-stone-950 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-emerald-400/20 text-emerald-950 flex items-center justify-center text-xs font-extrabold font-mono">05</span>
              Your Data Rights & Deletion Requests
            </h2>
            <p>
              You have full control over your personal data. You can inspect, update, or request the deletion of your account and personal history at any time by contacting our privacy officer at <a href="mailto:privacy@batalabandi.com" className="text-amber-600 font-bold underline">privacy@batalabandi.com</a>.
            </p>
          </section>

          {/* Contact Box */}
          <div className="mt-8 bg-stone-900 text-white rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-black text-white">Questions about data privacy?</h4>
              <p className="text-xs text-stone-400 font-medium">Our Data Security Officer is here to assist you.</p>
            </div>
            <a
              href="mailto:privacy@batalabandi.com"
              className="px-5 py-2.5 bg-amber-400 text-stone-950 text-xs font-extrabold rounded-xl hover:bg-amber-300 transition"
            >
              Email Privacy Team
            </a>
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
