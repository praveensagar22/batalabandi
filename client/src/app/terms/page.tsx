'use client';

import Link from 'next/link';
import { FileText, Shield, Sparkles, ChevronRight, Lock, CheckCircle2 } from 'lucide-react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import DesktopHeader from '@/components/DesktopHeader';
import DesktopFooter from '@/components/DesktopFooter';

export default function TermsPage() {
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
          <span className="text-stone-900 font-bold">Terms & Conditions</span>
        </div>

        {/* Page Header Header Banner */}
        <div className="bg-stone-950 text-white rounded-3xl p-6 md:p-10 border border-stone-800 shadow-xl mb-10 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-3">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-amber-400 bg-stone-900/80 border border-amber-400/20 px-3.5 py-1.5 rounded-full">
              <FileText className="w-4 h-4 text-amber-400" />
              Legal & Agreements
            </div>
            <h1 className="text-2xl md:text-4xl font-black font-serif text-white">
              Terms & Conditions
            </h1>
            <p className="text-xs md:text-sm text-stone-300 max-w-2xl font-medium leading-relaxed">
              Welcome to BatalaBandi (బట్టల బండి). Please read these Terms of Service carefully before purchasing our artisan streetwear and apparel collections.
            </p>
            <p className="text-[11px] text-stone-400 font-mono pt-2">
              Last Revised: August 12, 2026
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-stone-200/90 shadow-2xs space-y-8 text-xs md:text-sm text-stone-700 leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-base md:text-lg font-black text-stone-950 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-amber-400/20 text-stone-950 flex items-center justify-center text-xs font-extrabold font-mono">01</span>
              General Overview & Platform Terms
            </h2>
            <p>
              This website is operated by <strong>BatalaBandi (బట్టల బండి)</strong>. Throughout the site, the terms &ldquo;we&rdquo;, &ldquo;us&rdquo;, and &ldquo;our&rdquo; refer to BatalaBandi. By visiting our website or purchasing handcrafted garments, bio-washed oversized tees, hoodies, or artisan wear, you engage in our &ldquo;Service&rdquo; and agree to be bound by the following terms and conditions.
            </p>
            <p>
              These Terms of Service apply to all users of the site, including browsers, customers, merchants, and content contributors.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-base md:text-lg font-black text-stone-950 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-amber-400/20 text-stone-950 flex items-center justify-center text-xs font-extrabold font-mono">02</span>
              Product Authenticity & Handcrafted Notice
            </h2>
            <p>
              Our apparel items feature artisan techniques such as Kantha stitching, screen printing, hand-painting, and bio-washed treatments.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-600 font-medium">
              <li>Minor variations in fabric dye, thread color, prints, or stitch pattern are natural characteristics of authentic handcrafted garments.</li>
              <li>We make every effort to display garment colors and prints accurately. However, actual colors may vary slightly depending on monitor color settings.</li>
              <li>Sizing measurements listed in our Size Charts are accurate within an industry standard tolerance of +/- 0.5 inches.</li>
            </ul>
          </section>

          <hr className="border-stone-100" />

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-base md:text-lg font-black text-stone-950 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-amber-400/20 text-stone-950 flex items-center justify-center text-xs font-extrabold font-mono">03</span>
              Orders, Pricing & Payment Processing
            </h2>
            <p>
              All prices listed on our platform are in Indian Rupees (INR ₹) and include applicable taxes unless otherwise noted.
            </p>
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-stone-900 font-extrabold">
                <Lock className="w-4 h-4 text-amber-600" /> Secure Online Transactions
              </div>
              <p className="text-xs text-stone-600">
                Online payments are securely processed through Razorpay and certified payment gateways supporting UPI, NetBanking, Credit/Debit cards, and Wallets. BatalaBandi does not store your raw credit/debit card credentials.
              </p>
            </div>
            <p>
              We reserve the right to refuse or cancel any order placed with incorrect pricing due to typographical or technical errors. In such cases, full refunds will be issued to the original payment source.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-base md:text-lg font-black text-stone-950 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-amber-400/20 text-stone-950 flex items-center justify-center text-xs font-extrabold font-mono">04</span>
              User Accounts & Security
            </h2>
            <p>
              When creating an account on BatalaBandi, you are responsible for maintaining the confidentiality of your credentials and restrict access to your account. You agree to accept responsibility for all activities that occur under your account.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-base md:text-lg font-black text-stone-950 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-amber-400/20 text-stone-950 flex items-center justify-center text-xs font-extrabold font-mono">05</span>
              Intellectual Property Rights
            </h2>
            <p>
              All artwork, prints, logo designs, photography, text, graphics, and brand assets displayed on BatalaBandi are the exclusive intellectual property of BatalaBandi. Unauthorized reproduction, resale, or distribution of our designs is strictly prohibited.
            </p>
          </section>

          <hr className="border-stone-100" />

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-base md:text-lg font-black text-stone-950 flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-amber-400/20 text-stone-950 flex items-center justify-center text-xs font-extrabold font-mono">06</span>
              Governing Law & Dispute Resolution
            </h2>
            <p>
              These Terms of Service and any separate agreements shall be governed by and construed in accordance with the laws of India. Any legal proceedings arising shall fall under the exclusive jurisdiction of the courts in Hyderabad, Telangana, India.
            </p>
          </section>

          {/* Assistance box */}
          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-black text-amber-950">Have questions about our Terms?</h4>
              <p className="text-xs text-amber-800 font-medium">Reach out to our dedicated support team anytime.</p>
            </div>
            <Link
              href="/contact"
              className="px-5 py-2.5 bg-stone-950 text-white text-xs font-extrabold rounded-xl hover:bg-stone-800 transition"
            >
              Contact Support
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
